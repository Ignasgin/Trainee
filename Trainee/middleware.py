"""
Custom middleware to fix Azure App Service redirect loop
"""

class AzureProxyMiddleware:
    """
    Fix redirect loop caused by Azure Load Balancer
    Azure sends requests as HTTP internally, but sets X-Forwarded-Proto: https
    This middleware makes Django think the request is HTTPS
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Check if request came through Azure proxy
        if 'HTTP_X_FORWARDED_PROTO' in request.META:
            forwarded_proto = request.META['HTTP_X_FORWARDED_PROTO']
            if forwarded_proto == 'https':
                request.is_secure = lambda: True
                request.META['wsgi.url_scheme'] = 'https'
        
        response = self.get_response(request)
        return response
