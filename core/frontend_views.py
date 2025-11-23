from django.shortcuts import render
from django.http import FileResponse, Http404
from django.conf import settings
import os
import mimetypes

def index(request):
    return render(request, 'index.html')

def serve_static(request, path):
    """Serve static files from frontend/dist/assets with proper MIME types"""
    file_path = os.path.join(settings.BASE_DIR, 'frontend', 'dist', 'assets', path)
    
    if not os.path.exists(file_path):
        raise Http404("File not found")
    
    # Determine MIME type
    mime_type, _ = mimetypes.guess_type(file_path)
    if mime_type is None:
        if path.endswith('.js'):
            mime_type = 'application/javascript'
        elif path.endswith('.css'):
            mime_type = 'text/css'
        elif path.endswith('.svg'):
            mime_type = 'image/svg+xml'
        else:
            mime_type = 'application/octet-stream'
    
    response = FileResponse(open(file_path, 'rb'), content_type=mime_type)
    return response
