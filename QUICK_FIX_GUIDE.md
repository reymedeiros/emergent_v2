# Quick Troubleshooting Guide - Provider Configuration 500 Error

## Problem
POST request to `/api/providers/configs` returns **500 Internal Server Error**

## Quick Fix Checklist

### 1. Check if services are running
```bash
sudo supervisorctl status
```

**Expected output:**
- ✅ backend: RUNNING
- ✅ frontend: RUNNING  
- ✅ mongodb: RUNNING

### 2. If backend is stopped, check logs
```bash
tail -n 50 /var/log/supervisor/backend.err.log
```

### 3. Common Issues & Solutions

#### Issue: "ModuleNotFoundError: No module named 'httpx'"
**Solution:**
```bash
pip install httpx starlette
sudo supervisorctl restart backend
```

#### Issue: "Cannot find module '/app/backend/dist/server.js'"
**Solution:**
```bash
cd /app/backend
yarn install
yarn build
sudo supervisorctl restart backend
```

#### Issue: "ProviderConfig validation failed: apiKey: Path `apiKey` is required."
**Solution:** Already fixed in `/app/backend/src/models/ProviderConfig.ts` - apiKey is now optional

#### Issue: Frontend won't start - "BUILD_ID not found"
**Solution:**
```bash
cd /app/frontend
yarn install
yarn build
sudo supervisorctl restart frontend
```

### 4. Verify the fix
```bash
# Test login
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Should return: {"token": "...", "user": {...}}

# Test provider creation (get token first)
TOKEN="<paste-token-here>"
curl -X POST http://localhost:8001/api/providers/configs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type": "lmstudio",
    "name": "Test",
    "apiKey": "",
    "baseUrl": "http://localhost:1234/v1",
    "defaultModel": "local-model"
  }'

# Should return: 201 Created with provider details
```

### 5. Full Service Restart (if needed)
```bash
sudo supervisorctl restart all
sleep 10
sudo supervisorctl status
```

## Prevention

Before deployment, always ensure:
1. ✅ Python dependencies are installed (`pip install -r requirements.txt` or manually)
2. ✅ Backend is built (`cd /app/backend && yarn build`)
3. ✅ Frontend is built (`cd /app/frontend && yarn build`)
4. ✅ All services start without errors
5. ✅ Test at least one API endpoint

## Monitoring Commands

```bash
# Watch backend logs in real-time
tail -f /var/log/supervisor/backend.err.log

# Watch frontend logs in real-time
tail -f /var/log/supervisor/frontend.err.log

# Check service status
watch -n 2 'sudo supervisorctl status'

# Test health endpoints
curl http://localhost:8001/health
curl http://localhost:4000/health
```

## Related Files
- Full fix details: `/app/PROVIDER_CONFIG_FIX_SUMMARY.md`
- CORS configuration: `/app/CORS_FIX_SUMMARY.md`
- General setup: `/app/README.md`
