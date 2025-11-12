import requests

url = "https://trainee-api.azurewebsites.net/api/auth/login/"
response = requests.post(url, json={}, timeout=10)
print(f"Status: {response.status_code}")
print(f"Response: {response.text[:500]}")
