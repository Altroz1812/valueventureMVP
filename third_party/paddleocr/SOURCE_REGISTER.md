# P21 original upstream package integration
- Repository: https://github.com/PaddlePaddle/PaddleOCR
- Pinned package: `paddleocr==3.3.2`, tag `v3.3.2`, commit `95dc316a8490a350c1d1fcf3bc80bf83d4e52450` (2025-11-13).
- License: Apache-2.0. Standard license text included; package distributions retain their own applicable notices. No upstream files copied into application other than standard license text.
- Verified upstream `paddleocr/_pipelines/ocr.py` blob `03f24899448486cb6c7b2bea0d9d1f2d6d2081ac`: PaddleOCR constructor, `predict`, PP-OCRv5 language mapping (`en`, `hi`, `te`). `pyproject.toml` blob `ca40a87f8b9d8953ccb732d14fabcc66b2cbc2c2`: dependencies and Apache license. Upstream LICENSE blob `430edfa0cfcb59f15b7aa5457427d0faf2e40dac` inspected; included license is standard text, not claimed byte-identical.
- Actual package call: `services/paddle-ocr/server.py` imports `PaddleOCR`, creates a CPU PP-OCRv5 model and calls `predict` on decoded BGR image. No imitation inference engine or generated customer text. Models are not vendored. Package installation and actual inference pending.
- PaddlePaddle CPU framework 3.2.0 follows the official installation guide https://www.paddleocr.ai/v3.3.2/en/version3.x/paddlepaddle_installation.html. Version pin is an integration choice, not a claim of latest or security certification.
- Upstream API guide: https://www.paddleocr.ai/v3.3.2/en/version3.x/pipeline_usage/OCR.html.
- Custom code: loopback HTTP service, explicit token/origin checks, browser adapter, PDF page rendering reuse, bounded field mapping, P6 save/history authorization enhancement and P16 property correction RPC. P3/P4 PDF.js and Tesseract paths retained.
- Original upstream tests not executed. Local tests cover HTTP and response handling with mocked inference, real image decoding and labelled candidate mapping; actual model tests and full application integration remain pending.
