#!/usr/bin/env python3
"""
Azure Deployment Health Check
Tests the deployed API to identify what's working and what's not
"""

import requests
import json
from datetime import datetime

BASE_URL = "https://trainee-api.azurewebsites.net"

def print_header(text):
    print(f"\n{'=' * 60}")
    print(f"  {text}")
    print(f"{'=' * 60}\n")

def test_endpoint(name, url, method='GET', data=None, headers=None, expected_status=200):
    """Test a single endpoint and report results"""
    print(f"Testing: {name}")
    print(f"  URL: {url}")
    print(f"  Method: {method}")
    
    try:
        if method == 'GET':
            response = requests.get(url, headers=headers, timeout=10)
        elif method == 'POST':
            response = requests.post(url, json=data, headers=headers, timeout=10)
        
        print(f"  Status: {response.status_code}")
        print(f"  Content-Type: {response.headers.get('Content-Type', 'N/A')}")
        
        # Try to parse JSON
        try:
            json_data = response.json()
            print(f"  Response: {json.dumps(json_data, indent=2)[:200]}")
        except:
            # Show HTML preview
            text = response.text[:500]
            if '<html' in text.lower():
                print(f"  Response: HTML page (not JSON!)")
                if '500' in text or 'error' in text.lower():
                    print(f"  ERROR DETECTED in HTML response")
            else:
                print(f"  Response: {text}")
        
        success = response.status_code == expected_status
        print(f"  Result: {'✓ PASS' if success else '✗ FAIL'}")
        return success
    
    except Exception as e:
        print(f"  Result: ✗ EXCEPTION - {str(e)}")
        return False
    finally:
        print()

def main():
    print_header("AZURE DEPLOYMENT HEALTH CHECK")
    print(f"Testing: {BASE_URL}")
    print(f"Time: {datetime.now().isoformat()}")
    
    results = {}
    
    # Test 1: Root endpoint
    print_header("1. BASIC CONNECTIVITY")
    results['root'] = test_endpoint(
        "Root endpoint",
        f"{BASE_URL}/",
        expected_status=404  # Django typically returns 404 for root
    )
    
    # Test 2: Swagger UI (static page)
    print_header("2. STATIC CONTENT (Swagger UI)")
    results['swagger'] = test_endpoint(
        "Swagger UI",
        f"{BASE_URL}/api/docs/",
        expected_status=200
    )
    
    # Test 3: API Schema (uses database)
    print_header("3. API SCHEMA (requires Django to work)")
    results['schema'] = test_endpoint(
        "OpenAPI Schema",
        f"{BASE_URL}/api/schema/",
        expected_status=200
    )
    
    # Test 4: Sections list (database query)
    print_header("4. DATABASE ENDPOINT (GET /api/sections/)")
    results['sections'] = test_endpoint(
        "List Sections",
        f"{BASE_URL}/api/sections/",
        expected_status=200
    )
    
    # Test 5: Posts list (database query)
    print_header("5. DATABASE ENDPOINT (GET /api/posts/)")
    results['posts'] = test_endpoint(
        "List Posts",
        f"{BASE_URL}/api/posts/",
        expected_status=200
    )
    
    # Test 6: JWT Login endpoint
    print_header("6. JWT AUTHENTICATION")
    results['jwt_login'] = test_endpoint(
        "JWT Login (without credentials)",
        f"{BASE_URL}/api/token/",
        method='POST',
        data={},
        expected_status=400  # Bad request without credentials
    )
    
    # Summary
    print_header("SUMMARY")
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    print(f"Tests Passed: {passed}/{total}\n")
    
    for test, result in results.items():
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"  {status} - {test}")
    
    print("\n" + "=" * 60)
    print("\nDIAGNOSIS:")
    
    if results.get('swagger') and not results.get('sections'):
        print("""
❌ PROBLEM: Swagger works but API endpoints fail

This means:
- Azure App Service is running
- Django is starting
- Static files work
- BUT database queries are failing

LIKELY CAUSES:
1. Database credentials not set in Azure App Service
2. MySQL firewall blocking Azure connections  
3. Database migrations not run on production

NEXT STEPS:
1. Go to Azure Portal → App Service → Configuration → Application settings
2. Verify these environment variables are set:
   - DB_NAME (your MySQL database name)
   - DB_USER (MySQL username)
   - DB_PASSWORD (MySQL password)
   - DB_HOST (MySQL server hostname, e.g., trainee-db.mysql.database.azure.com)
   - SECRET_KEY (Django secret key)
   
3. Go to Azure Portal → MySQL → Networking → Firewall rules
   - Add rule: "Allow Azure Services" = ON
   
4. Run migrations on production database:
   - In Azure Portal → App Service → SSH or Console
   - Run: python manage.py migrate
""")
    elif not results.get('swagger'):
        print("""
❌ PROBLEM: Application not starting at all

LIKELY CAUSES:
1. Missing dependencies in requirements.txt
2. Python version mismatch
3. Startup command incorrect

NEXT STEPS:
1. Check Azure logs: Portal → App Service → Log stream
2. Verify Startup command: "startup.sh" or "gunicorn ..."
""")
    else:
        print("""
✅ ALL TESTS PASSED!
Your Azure deployment is working correctly.
""")

if __name__ == "__main__":
    main()
