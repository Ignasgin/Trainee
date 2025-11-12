#!/usr/bin/env python3
import requests

# Test both HTTP and HTTPS
urls = [
    "http://trainee-api.azurewebsites.net/api/docs/",
    "https://trainee-api.azurewebsites.net/api/docs/",
]

for url in urls:
    print(f"\nTesting: {url}")
    print("-" * 60)
    try:
        response = requests.get(url, allow_redirects=False, timeout=10)
        print(f"Status: {response.status_code}")
        print(f"Location: {response.headers.get('Location', 'None')}")
        
        if response.status_code == 200:
            print(f"✅ SUCCESS! Content length: {len(response.text)}")
    except Exception as e:
        print(f"❌ Error: {e}")
