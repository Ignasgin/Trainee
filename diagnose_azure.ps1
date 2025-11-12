# Quick Azure Diagnostics Script
# Checks common deployment issues

Write-Host "=" -NoNewline; Write-Host ("=" * 69)
Write-Host "AZURE APP SERVICE DIAGNOSTICS"
Write-Host "=" -NoNewline; Write-Host ("=" * 69)

# Test 1: Check if site is responding
Write-Host "`n[1] Testing basic connectivity..."
try {
    $response = Invoke-WebRequest -Uri "https://trainee-api.azurewebsites.net" -Method GET -TimeoutSec 10 -ErrorAction SilentlyContinue
    Write-Host "✓ Site is responding (Status: $($response.StatusCode))"
} catch {
    Write-Host "✗ Site not responding: $($_.Exception.Message)"
}

# Test 2: Check Swagger (static files)
Write-Host "`n[2] Testing Swagger UI (static content)..."
try {
    $response = Invoke-WebRequest -Uri "https://trainee-api.azurewebsites.net/api/docs/" -Method GET -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ Swagger UI is accessible"
    }
} catch {
    Write-Host "✗ Swagger UI failed: $($_.Exception.Message)"
}

# Test 3: Check API endpoint
Write-Host "`n[3] Testing API endpoint /api/sections/..."
try {
    $response = Invoke-WebRequest -Uri "https://trainee-api.azurewebsites.net/api/sections/" -Method GET -TimeoutSec 10
    Write-Host "✓ API responding (Status: $($response.StatusCode))"
    $data = $response.Content | ConvertFrom-Json
    Write-Host "  Response: $($data | ConvertTo-Json -Depth 1)"
} catch {
    Write-Host "✗ API endpoint failed: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "  Response body: $($responseBody.Substring(0, [Math]::Min(200, $responseBody.Length)))"
    }
}

Write-Host "`n" -NoNewline
Write-Host "=" -NoNewline; Write-Host ("=" * 69)
Write-Host "COMMON ISSUES:"
Write-Host "=" -NoNewline; Write-Host ("=" * 69)
Write-Host @"

If you see 500 errors but Swagger works:
├── ❌ DATABASE CONNECTION ISSUE (most common)
│   ├─ Check: Azure Portal → App Service → Configuration
│   ├─ Verify: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
│   └─ Solution: Add correct environment variables
│
├── ❌ MISSING MIGRATIONS
│   ├─ Check: Azure Portal → SSH or Log Stream
│   ├─ Run: python manage.py migrate
│   └─ Solution: Migrations run automatically on deploy
│
└── ❌ ALLOWED_HOSTS
    ├─ Check: Environment variable ALLOWED_HOSTS
    └─ Should be: trainee-api.azurewebsites.net,*.azurewebsites.net

NEXT STEPS:
1. Check Application Logs:
   az webapp log tail --name trainee-api --resource-group <your-rg>

2. Check Environment Variables:
   Azure Portal → App Service → Configuration → Application settings

3. Verify Database Connection:
   - MySQL firewall allows Azure services
   - Credentials are correct
   - SSL certificate exists

"@

Write-Host "`nWould you like to see the logs? Run:"
Write-Host "  az webapp log tail --name trainee-api --resource-group <your-resource-group>" -ForegroundColor Yellow
