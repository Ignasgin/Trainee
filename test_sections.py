import requests

url = "https://trainee-api.azurewebsites.net/api/sections/"
try:
    response = requests.get(url, timeout=30)
    print(f"Status: {response.status_code}")
    if response.status_code == 500:
        print(f"\n500 Error response:")
        print(response.text[:2000])  # First 2000 chars
    else:
        print(f"Response: {response.text[:500]}")
except Exception as e:
    print(f"Error: {e}")
