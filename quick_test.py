import requests
import time

url = "https://trainee-api.azurewebsites.net/api/sections/"

print("Testing Azure deployment...")
print(f"URL: {url}\n")

try:
    start = time.time()
    response = requests.get(url, timeout=30)
    elapsed = time.time() - start
    
    print(f"Status Code: {response.status_code}")
    print(f"Response Time: {elapsed:.2f}s")
    print(f"Content-Type: {response.headers.get('Content-Type', 'N/A')}")
    print(f"\nResponse Length: {len(response.text)} characters")
    
    if response.status_code == 200:
        print("\n✅ SUCCESS! API is working!")
        try:
            data = response.json()
            print(f"Sections count: {len(data)}")
            if data:
                print(f"First section: {data[0]}")
        except:
            print("Response is not JSON")
            print(f"First 500 chars:\n{response.text[:500]}")
    else:
        print(f"\n❌ Error {response.status_code}")
        print(f"Response:\n{response.text[:1000]}")
        
except requests.Timeout:
    print("❌ Request timed out (>30s)")
except requests.ConnectionError as e:
    print(f"❌ Connection error: {e}")
except Exception as e:
    print(f"❌ Error: {e}")
