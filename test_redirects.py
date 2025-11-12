#!/usr/bin/env python3
"""
Test multiple URLs to find redirect pattern
"""

import requests

urls = [
    "https://trainee-api.azurewebsites.net/api/docs/",
    "https://trainee-api.azurewebsites.net/api/docs",
    "https://trainee-api.azurewebsites.net/api/schema/",
    "http://trainee-api.azurewebsites.net/api/docs/",  # HTTP instead of HTTPS
]

for url in urls:
    print(f"\nTesting: {url}")
    print("-" * 60)
    try:
        response = requests.get(url, allow_redirects=False, timeout=10)
        print(f"Status: {response.status_code}")
        if response.status_code in [301, 302, 303, 307, 308]:
            print(f"Redirects to: {response.headers.get('Location')}")
    except Exception as e:
        print(f"ERROR: {e}")
