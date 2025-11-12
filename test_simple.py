#!/usr/bin/env python3
"""
Simple test to see what Azure returns - check for redirect headers
"""

import requests

url = "https://trainee-api.azurewebsites.net/api/docs/"

print(f"Testing: {url}\n")
print("=" * 60)

try:
    # Don't follow redirects - see what Azure actually returns
    response = requests.get(url, allow_redirects=False, timeout=10)
    
    print(f"Status Code: {response.status_code}")
    print(f"\nResponse Headers:")
    for key, value in response.headers.items():
        print(f"  {key}: {value}")
    
    if response.status_code in [301, 302, 303, 307, 308]:
        print(f"\n🔴 REDIRECT DETECTED!")
        print(f"   Redirecting to: {response.headers.get('Location', 'N/A')}")
    
    print(f"\nResponse Body (first 500 chars):")
    print(response.text[:500])
    
except Exception as e:
    print(f"ERROR: {e}")
