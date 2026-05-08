import os
import urllib.request

port = os.environ.get("PORT", "8000")
urllib.request.urlopen(f"http://127.0.0.1:{port}/health")
