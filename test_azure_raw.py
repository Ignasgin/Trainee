#!/usr/bin/env python3
import requests

url = "https://trainee-api.azurewebsites.net/api/docs/"

print(f"Testing: {url}\n")

# Test with max 5 redirects to see the loop
session = requests.Session()
session.max_redirects = 5

try:
    response = session.get(url, allow_redirects=False, timeout=10)
    print(f"Status: {response.status_code}")
    print(f"Location: {response.headers.get('Location', 'None')}")
    print(f"\nHeaders:")
    for key, value in response.headers.items():
        if key.lower() in ['location', 'server', 'x-forwarded-proto', 'x-forwarded-host']:
            print(f"  {key}: {value}")
except Exception as e:
    print(f"Error: {e}")
