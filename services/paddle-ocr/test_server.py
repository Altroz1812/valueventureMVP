import io
import json
import os
import threading
import unittest
from http.client import HTTPConnection
from unittest.mock import patch
from PIL import Image
import server

class ServiceTests(unittest.TestCase):
    def setUp(self):
        self.origin='http://localhost:5173'
        self.token='test-token-'+'x'*40
        self.httpd=server.ThreadingHTTPServer(('127.0.0.1',0), server.Handler)
        self.httpd.origin=self.origin
        self.httpd.token=self.token
        self.port=self.httpd.server_port
        self.port_patch=patch.object(server,'PORT',self.port)
        self.port_patch.start()
        self.thread=threading.Thread(target=self.httpd.serve_forever,daemon=True)
        self.thread.start()
        self.headers={'Origin':self.origin,'Content-Type':'image/png','X-VP-OCR-Language':'eng','X-VP-OCR-Token':self.token}
    def tearDown(self):
        self.httpd.shutdown();self.httpd.server_close();self.thread.join();self.port_patch.stop()
    def req(self,headers=None,body=b'test',method='POST'):
        c=HTTPConnection('127.0.0.1',self.port,timeout=3)
        c.request(method,'/ocr',body=body,headers=self.headers if headers is None else headers)
        r=c.getresponse();data=r.read();status=r.status;c.close();return status,data
    def test_origin_denied(self):
        self.assertEqual(self.req({**self.headers,'Origin':'https://other.example'})[0],403)
    def test_token_denied(self):
        self.assertEqual(self.req({**self.headers,'X-VP-OCR-Token':'wrong'})[0],403)
    def test_language_denied(self):
        self.assertEqual(self.req({**self.headers,'X-VP-OCR-Language':'bad'})[0],400)
    def test_empty_body(self):
        self.assertEqual(self.req(body=b'')[0],413)
    def test_preflight(self):
        self.assertEqual(self.req(method='OPTIONS',body=b'')[0],204)
    def test_busy(self):
        server.LOCK.acquire()
        try:self.assertEqual(self.req()[0],429)
        finally:server.LOCK.release()
    def test_success_mocked_engine(self):
        with patch.object(server,'recognize',return_value={'text':'District: Hyderabad','engine':'paddleocr-3.3.2','truncated':False}) as fn:
            status,body=self.req();self.assertEqual(status,200);self.assertEqual(json.loads(body)['text'],'District: Hyderabad');fn.assert_called_once_with(b'test','image/png','eng')
    def test_failure_no_secret(self):
        with patch.object(server,'recognize',side_effect=RuntimeError('private data')):
            status,body=self.req();self.assertEqual(status,422);self.assertNotIn(b'private data',body)

class ImageTests(unittest.TestCase):
    def test_actual_decode(self):
        buf=io.BytesIO();Image.new('RGB',(2,3),(255,0,0)).save(buf,format='PNG')
        a=server.decode_image(buf.getvalue(),'image/png');self.assertEqual(a.shape,(3,2,3));self.assertEqual(a[0,0].tolist(),[0,0,255])
    def test_mime_mismatch(self):
        buf=io.BytesIO();Image.new('RGB',(2,3)).save(buf,format='PNG')
        with self.assertRaises(ValueError):server.decode_image(buf.getvalue(),'image/jpeg')
    def test_result_limit(self):
        result=server.normalize([{'rec_texts':['abc','x'*30001]}]);self.assertTrue(result['truncated']);self.assertEqual(len(result['text']),30000)
    def test_result_lines(self):
        self.assertEqual(server.normalize([{'rec_texts':[' District: Hyderabad ','','గ్రామం: ఉదాహరణ']}])['text'],'District: Hyderabad\nగ్రామం: ఉదాహరణ')
    def test_bad_output(self):
        with self.assertRaises(RuntimeError):server.normalize([{}])
    def test_secret_required(self):
        with patch.dict(os.environ,{'VP_OCR_TOKEN':'short','VP_OCR_ORIGIN':'http://localhost:5173'}):
            with self.assertRaises(SystemExit):server.settings()

if __name__=='__main__':unittest.main()
