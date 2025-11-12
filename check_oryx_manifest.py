import requests

# Download oryx-manifest.toml from Azure
url = "https://trainee-api.azurewebsites.net/oryx-manifest.toml"

try:
    response = requests.get(url, timeout=10)
    if response.status_code == 200:
        print("=== oryx-manifest.toml ===")
        print(response.text)
    else:
        print(f"Error: {response.status_code}")
except Exception as e:
    print(f"Error: {e}")
