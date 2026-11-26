"""Loopback-only OCR adapter. No document or credential persistence."""
import hmac
import io
import json
import os
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit

MAX_BYTES = 10 * 1024 * 1024
MAX_PIXELS = 16_000_000
LANGUAGES = {'eng': 'en', 'hin': 'hi', 'tel': 'te'}
PORT = 8765
LOCK = threading.Lock()
MODEL = None
MODEL_LANG = None


def decode_image(raw, mime):
    from PIL import Image, ImageOps
    import numpy as np
    with Image.open(io.BytesIO(raw)) as im:
        if (im.format, mime) not in [('PNG', 'image/png'), ('JPEG', 'image/jpeg')]:
            raise ValueError('Image format does not match the declared MIME type.')
        if im.width * im.height > MAX_PIXELS:
            raise ValueError('Image exceeds the 16 megapixel limit.')
        rgb = ImageOps.exif_transpose(im).convert('RGB')
        return np.asarray(rgb)[:, :, ::-1].copy()  # PaddleOCR expects BGR ndarray.


def normalize(result):
    # PaddleOCR 3.x OCRResult exposes rec_texts and rec_scores as mapping keys.
    lines = []
    for row in result:
        texts = row.get('rec_texts')
        if texts is None:
            raise RuntimeError('Unexpected PaddleOCR result format.')
        for text in texts:
            if isinstance(text, str) and text.strip():
                lines.append(text.strip())
    text = '\n'.join(lines)
    return {'text': text[:30000], 'truncated': len(text) > 30000, 'engine': 'paddleocr-3.3.2'}


def recognize(raw, mime, lang):
    global MODEL, MODEL_LANG
    img = decode_image(raw, mime)
    if MODEL_LANG != lang:
        from paddleocr import PaddleOCR  # Original upstream implementation.
        MODEL = None
        MODEL_LANG = None
        MODEL = PaddleOCR(lang=LANGUAGES[lang], ocr_version='PP-OCRv5', device='cpu',
                          use_doc_orientation_classify=False, use_doc_unwarping=False,
                          use_textline_orientation=True, enable_mkldnn=False)
        MODEL_LANG = lang
    return normalize(MODEL.predict(img))


def settings():
    token = os.environ.get('VP_OCR_TOKEN', '')
    origin = os.environ.get('VP_OCR_ORIGIN', 'http://localhost:5173')
    parsed = urlsplit(origin)
    if (len(token) < 32 or parsed.scheme != 'http' or parsed.hostname not in ('localhost', '127.0.0.1')
            or parsed.username or parsed.password or parsed.path or parsed.query or parsed.fragment):
        raise SystemExit('Set VP_OCR_TOKEN (at least 32 characters) and a loopback VP_OCR_ORIGIN with no trailing slash.')
    return token, origin


class Handler(BaseHTTPRequestHandler):
    server_version = 'VP-OCR/1'
    def setup(self):
        super().setup()
        self.connection.settimeout(30)

    def log_message(self, *_args):
        pass  # Never log document content, headers or request bodies.

    def allowed_origin(self):
        return (self.headers.get('Origin') == self.server.origin and
                self.headers.get('Host') == f'127.0.0.1:{PORT}')

    def authorized(self):
        return self.allowed_origin() and hmac.compare_digest(
            self.headers.get('X-VP-OCR-Token', '').encode(), self.server.token.encode())

    def respond(self, status, body=None):
        raw = json.dumps(body, ensure_ascii=False).encode() if body is not None else b''
        self.send_response(status)
        if self.allowed_origin():
            self.send_header('Access-Control-Allow-Origin', self.server.origin)
            self.send_header('Vary', 'Origin')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(raw)))
        self.end_headers()
        if raw:
            try:
                self.wfile.write(raw)
            except (BrokenPipeError, ConnectionResetError):
                pass

    def do_OPTIONS(self):
        if not self.allowed_origin() or self.path != '/ocr':
            return self.respond(403, {'error': 'Origin denied'})
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', self.server.origin)
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-VP-OCR-Token, X-VP-OCR-Language')
        self.send_header('Vary', 'Origin')
        self.send_header('Content-Length', '0')
        self.end_headers()

    def do_POST(self):
        if self.path != '/ocr' or not self.authorized():
            return self.respond(403, {'error': 'Local origin or token denied'})
        mime = self.headers.get('Content-Type', '')
        lang = self.headers.get('X-VP-OCR-Language', '')
        if mime not in ('image/png', 'image/jpeg') or lang not in LANGUAGES:
            return self.respond(400, {'error': 'Unsupported image MIME or language'})
        try:
            size = int(self.headers.get('Content-Length', '0'))
        except ValueError:
            size = 0
        if not 0 < size <= MAX_BYTES or self.headers.get('Transfer-Encoding'):
            return self.respond(413, {'error': 'Image size must be between 1 byte and 10 MB'})
        if not LOCK.acquire(blocking=False):
            return self.respond(429, {'error': 'OCR worker busy; retry after the current request finishes'})
        try:
            raw = self.rfile.read(size)
            if len(raw) != size:
                return self.respond(400, {'error': 'Incomplete upload'})
            result = recognize(raw, mime, lang)
            self.respond(200, result)
        except Exception:
            # Do not include customer text, file metadata or stack traces in responses/logs.
            self.respond(422, {'error': 'OCR failed. Check installation, model availability and image quality; retry or use Tesseract.'})
        finally:
            LOCK.release()


def main():
    token, origin = settings()
    server = ThreadingHTTPServer(('127.0.0.1', PORT), Handler)
    server.token, server.origin = token, origin
    print(f'ValuationPro OCR listening on http://127.0.0.1:{PORT}; origin {origin}. First OCR may download models.', flush=True)
    server.serve_forever()


if __name__ == '__main__':
    main()
