from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from django.core.exceptions import ValidationError

def custom_exception_handler(exc, context):
    """
    Custom exception handler that returns appropriate HTTP status codes
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    if response is not None:
        custom_response_data = {
            'error': True,
            'message': 'An error occurred',
            'details': response.data
        }

        # Handle specific error types
        if response.status_code == 404:
            custom_response_data['message'] = 'Resource not found'
        elif response.status_code == 400:
            custom_response_data['message'] = 'Bad request - invalid data provided'
        elif response.status_code == 401:
            custom_response_data['message'] = 'Authentication required'
        elif response.status_code == 403:
            custom_response_data['message'] = 'Permission denied'
        elif response.status_code == 422:
            custom_response_data['message'] = 'Validation error'
        elif response.status_code == 500:
            custom_response_data['message'] = 'Internal server error'

        response.data = custom_response_data

    return response