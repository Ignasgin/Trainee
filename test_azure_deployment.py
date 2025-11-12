import requests
import json

print("=" * 70)
print("TESTING AZURE DEPLOYED API")
print("=" * 70)

BASE_URL = "https://trainee-api.azurewebsites.net"

# Test 1: Sections (public endpoint)
print("\n[TEST 1] GET /api/sections/ (Public endpoint)")
print("-" * 70)
try:
    response = requests.get(f"{BASE_URL}/api/sections/", timeout=30)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("✅ SUCCESS - Server is running!")
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
    else:
        print(f"❌ FAILED - Status {response.status_code}")
        print(f"Response: {response.text[:500]}")
except requests.exceptions.RequestException as e:
    print(f"❌ CONNECTION ERROR: {e}")
    print("\nPossible reasons:")
    print("1. App Service still deploying (wait 2-5 minutes)")
    print("2. App Service stopped - check Azure Portal")
    print("3. Wrong URL - check App Service name")

# Test 2: JWT Login
print("\n[TEST 2] POST /api/auth/login/ (JWT Authentication)")
print("-" * 70)
try:
    response = requests.post(
        f"{BASE_URL}/api/auth/login/",
        json={"username": "john_fitness", "password": "testpass123"},
        headers={"Content-Type": "application/json"},
        timeout=30
    )
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("✅ SUCCESS - JWT Authentication working!")
        data = response.json()
        print(f"User: {data['user']['username']}")
        print(f"Role: {data['user']['role']}")
        print(f"Access Token: {data['access'][:50]}...")
        
        # Test 3: Authenticated request
        print("\n[TEST 3] GET /api/posts/ (With JWT Bearer token)")
        print("-" * 70)
        headers = {
            "Authorization": f"Bearer {data['access']}"
        }
        response = requests.get(f"{BASE_URL}/api/posts/", headers=headers, timeout=30)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            posts = response.json()
            print(f"✅ SUCCESS - Authenticated requests working!")
            print(f"Total posts: {posts.get('count', 0)}")
        else:
            print(f"⚠ Authenticated request failed: {response.status_code}")
    else:
        print(f"❌ Login failed - Status {response.status_code}")
        print(f"Response: {response.text[:500]}")
except requests.exceptions.RequestException as e:
    print(f"❌ CONNECTION ERROR: {e}")

# Test 4: API Documentation
print("\n[TEST 4] GET /api/docs/ (Swagger UI)")
print("-" * 70)
try:
    response = requests.get(f"{BASE_URL}/api/docs/", timeout=30)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print(f"✅ API Documentation available at: {BASE_URL}/api/docs/")
    else:
        print(f"⚠ Documentation not accessible: {response.status_code}")
except requests.exceptions.RequestException as e:
    print(f"❌ ERROR: {e}")

print("\n" + "=" * 70)
print("SUMMARY")
print("=" * 70)
print(f"API Base URL: {BASE_URL}")
print(f"Swagger Docs: {BASE_URL}/api/docs/")
print(f"Login: POST {BASE_URL}/api/auth/login/")
print(f"")
print("If all tests passed: ✅ Your API is LIVE on Azure!")
print("=" * 70)
