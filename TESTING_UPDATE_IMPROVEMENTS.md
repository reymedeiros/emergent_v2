# Testing Guide for Install.sh Update Improvements

## Overview

This guide provides comprehensive testing procedures for the improved install.sh update feature with backup restoration, service health checks, and rollback history logging.

---

## Pre-Testing Requirements

### Test Environment
- Fresh Ubuntu 24.04 server (or VM)
- At least 4GB RAM
- 20GB disk space
- Root/sudo access

### Prerequisites
```bash
# Ensure you have a working installation
sudo systemctl status emergent-backend emergent-frontend
curl http://localhost:8001/health
```

---

## Test Scenarios

### Test 1: Successful Update

**Objective:** Verify normal update process with all improvements

**Steps:**
```bash
# 1. Note current state
sudo systemctl status emergent-backend emergent-frontend
curl http://localhost:8001/health
curl http://localhost:3000

# 2. Run update
cd /path/to/updated/code
sudo ./install.sh

# 3. Expected output should include:
# - "Creating backup at /opt/emergent-clone-backups/backup_TIMESTAMP..."
# - "✓ Backup completed"
# - "Step X: Updating application"
# - "Step X: Building backend"
# - "Step X: Building frontend"
# - "Checking service health..."
# - "  ✓ emergent-backend service is active"
# - "  ✓ emergent-frontend service is active"
# - "  ✓ Backend proxy is healthy (HTTP 200)"
# - "  ✓ Node.js backend is healthy (HTTP 200)"
# - "  ✓ Frontend is responding (HTTP 200)"
# - "✓ All health checks passed"
# - "✓ Application updated successfully"
```

**Verification:**
```bash
# Check rollback history
cat /opt/emergent-clone-backups/rollback_history.log

# Should contain:
# Action: UPDATE_SUCCESS
# Status: SUCCESS
# Details: Update completed successfully - All services healthy

# Verify services
sudo systemctl status emergent-backend emergent-frontend
curl http://localhost:8001/health
curl http://localhost:3000

# All should be healthy
```

**Expected Result:** ✅ Update completes successfully with full health verification

---

### Test 2: Update Failure with Automatic Rollback

**Objective:** Verify automatic rollback when update fails

**Method:** Introduce an intentional error in the update process

**Steps:**
```bash
# 1. Backup the install script
cp /app/install.sh /app/install.sh.backup

# 2. Introduce an error in the build step (around line 860)
# Edit install.sh and add this after "Step X: Building backend":
echo "simulating build failure"
exit 1  # This will trigger error handler

# 3. Run the modified update
sudo ./install.sh

# 4. Expected output should include:
# - "Creating backup at /opt/emergent-clone-backups/backup_TIMESTAMP..."
# - "✓ Backup completed"
# - "Step X: Building backend"
# - "=========================================
#    ❌ ERROR DURING UPDATE
#    ========================================="
# - "Exit Code: 1"
# - "Failed Command: exit 1"
# - "Line Number: [approximate line]"
# - "=========================================
#    INITIATING AUTOMATIC ROLLBACK
#    ========================================="
# - "🔄 Rolling back from backup..."
# - "  Stopping services..."
# - "  Restoring configuration files..."
# - "  Restoring application files..."
# - "  Starting services..."
# - "  Verifying system health after restore..."
# - "  Checking systemd services..."
# - "  Checking backend proxy (port 8001)..."
# - "  Checking frontend (port 3000)..."
# - "=========================================
#    ✓ ROLLBACK SUCCESSFUL
#    ========================================="
# - "System has been restored to previous working state."
# - "Your system is operational. Update was reverted."

# 5. Restore original install.sh
sudo cp /app/install.sh.backup /app/install.sh
```

**Verification:**
```bash
# Check rollback history
cat /opt/emergent-clone-backups/rollback_history.log

# Should contain multiple entries:
# 1. Action: UPDATE_FAILED
#    Status: TRIGGERED
#    Details: Update failed at line X...
#
# 2. Action: RESTORE_SUCCESS
#    Status: SUCCESS
#    Details: Automatic rollback due to update failure - All services verified healthy

# Verify services are running
sudo systemctl status emergent-backend emergent-frontend
curl http://localhost:8001/health
curl http://localhost:3000

# All should be healthy (restored state)
```

**Expected Result:** ✅ System automatically rolls back and all services are healthy

---

### Test 3: Simulated Service Failure After Restore

**Objective:** Test behavior when services don't start properly after restore

**Method:** Temporarily make a service fail to start

**Steps:**
```bash
# 1. Create a deliberate configuration error that will survive restore
# This is tricky - we'll simulate by manually stopping a service after restore

# 2. Run update with error (as in Test 2)
sudo ./install.sh  # (with intentional error)

# 3. During the "Verifying system health after restore..." phase
# In another terminal, quickly stop the frontend:
sudo systemctl stop emergent-frontend

# Note: This is difficult to time. Alternative approach:
# Modify systemd service file to fail intentionally before testing
```

**Alternative Approach:**
```bash
# 1. Create a test script that simulates partial restore failure
cat > /tmp/test_partial_restore.sh << 'EOF'
#!/bin/bash
source /app/install.sh

# Mock functions
systemctl() {
  if [[ "$1" == "is-active" ]] && [[ "$2" == "emergent-frontend" ]]; then
    return 1  # Frontend fails
  fi
  command systemctl "$@"
}

# Test restore with failing frontend
BACKUP_BASE_DIR="/opt/emergent-clone-backups"
APP_DIR="/opt/emergent-clone"
backup_path=$(ls -t $BACKUP_BASE_DIR/backup_* 2>/dev/null | head -1)

if [ -n "$backup_path" ]; then
  restore_from_backup "$backup_path" "Test partial restore"
fi
EOF

sudo bash /tmp/test_partial_restore.sh
```

**Expected Output:**
```
❌ Rollback completed but health check failed

Service status:
[Service status output]

Recent backend logs:
[Backend logs]
```

**Verification:**
```bash
# Check rollback history
cat /opt/emergent-clone-backups/rollback_history.log

# Should contain:
# Action: RESTORE_PARTIAL
# Status: PARTIAL
# Details: ... - Services restored but health check failed
```

**Expected Result:** ⚠️ System reports partial restoration with troubleshooting info

---

### Test 4: Frontend Health Check

**Objective:** Verify frontend health checking is working

**Steps:**
```bash
# 1. Stop frontend temporarily
sudo systemctl stop emergent-frontend

# 2. Run health check
sudo bash -c '
source /app/install.sh
check_health "full" 2 5
'

# Expected output:
# - "  ✓ emergent-backend service is active"
# - "  ❌ emergent-frontend service is not active"
# - "  ✓ Backend proxy is healthy (HTTP 200)"
# - "  ❌ Frontend health check failed (HTTP 000)"
# - "  ❌ Some services are unhealthy"
# - Return code: 1

# 3. Restart frontend
sudo systemctl start emergent-frontend

# 4. Run health check again
sudo bash -c '
source /app/install.sh
check_health "full" 2 5
'

# Expected output:
# - "  ✓ All services are healthy"
# - Return code: 0
```

**Expected Result:** ✅ Frontend health check correctly identifies service status

---

### Test 5: Rollback History Logging

**Objective:** Verify rollback history is properly logged

**Steps:**
```bash
# 1. Clear or backup existing history
sudo mv /opt/emergent-clone-backups/rollback_history.log \
       /opt/emergent-clone-backups/rollback_history.log.backup 2>/dev/null || true

# 2. Test logging function directly
sudo bash -c '
source /app/install.sh
log_rollback_history "TEST_ACTION" "/test/backup/path" "TEST_STATUS" "Test details message"
'

# 3. Verify log file was created
cat /opt/emergent-clone-backups/rollback_history.log

# Expected output:
# ========================================
# Timestamp: [current timestamp]
# Action: TEST_ACTION
# Backup Path: /test/backup/path
# Status: TEST_STATUS
# Details: Test details message
# ========================================

# 4. Add multiple entries
sudo bash -c '
source /app/install.sh
log_rollback_history "TEST_ACTION_2" "/test/backup/path2" "SUCCESS" "Second test"
log_rollback_history "TEST_ACTION_3" "/test/backup/path3" "FAILED" "Third test"
'

# 5. Verify all entries are logged
cat /opt/emergent-clone-backups/rollback_history.log | grep "Action:"

# Expected: Three Action lines

# 6. Restore original history if needed
sudo mv /opt/emergent-clone-backups/rollback_history.log.backup \
       /opt/emergent-clone-backups/rollback_history.log 2>/dev/null || true
```

**Expected Result:** ✅ All log entries are properly recorded with timestamps

---

### Test 6: Multiple Component Health Check

**Objective:** Verify all service components are checked

**Steps:**
```bash
# Test with all services running
sudo bash -c '
source /app/install.sh
check_health "full" 3 10
' 2>&1 | tee /tmp/health_check_output.txt

# Verify output contains checks for:
grep "emergent-backend service" /tmp/health_check_output.txt
grep "emergent-frontend service" /tmp/health_check_output.txt
grep "Backend proxy (port 8001)" /tmp/health_check_output.txt
grep "Node.js backend (port 4000)" /tmp/health_check_output.txt
grep "Frontend (port 3000)" /tmp/health_check_output.txt

# All should be found
```

**Expected Result:** ✅ All five components are checked and reported

---

### Test 7: Retry Logic

**Objective:** Verify retry logic works for transient failures

**Steps:**
```bash
# 1. Create a test script that simulates slow startup
cat > /tmp/test_retry.sh << 'EOF'
#!/bin/bash

# Start a temporary HTTP server that responds after a delay
python3 -c "
import http.server
import socketserver
import time

class DelayedHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        time.sleep(3)  # 3 second delay
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b'OK')

with socketserver.TCPServer(('', 9999), DelayedHandler) as httpd:
    httpd.serve_forever()
" &

SERVER_PID=$!
sleep 1

# Test with retries
time curl -s http://localhost:9999 || echo "First attempt may fail"

# Kill server
kill $SERVER_PID
EOF

# 2. Run test
sudo bash /tmp/test_retry.sh

# Observe that retries work for slow responses
```

**Expected Result:** ✅ Retries successfully wait for slow services

---

### Test 8: Health Report Generation

**Objective:** Verify health report is generated and contains correct information

**Steps:**
```bash
# 1. Run health check
sudo bash -c '
source /app/install.sh
check_health "full" 2 5
'

# 2. Check report file
cat /tmp/health_check_report

# Expected format:
#   ✓ Backend service: active
#   ✓ Frontend service: active
#   ✓ Backend proxy (8001): HTTP 200
#   ✓ Node.js backend (4000): HTTP 200
#   ✓ Frontend (3000): HTTP 200

# 3. Count lines
LINES=$(cat /tmp/health_check_report | grep -c "✓\|❌")
echo "Health report contains $LINES component checks"

# Expected: At least 5 lines
```

**Expected Result:** ✅ Health report is generated with all components

---

## Performance Testing

### Test 9: Health Check Timing

**Objective:** Verify health checks complete in reasonable time

**Steps:**
```bash
# Test with default settings
time sudo bash -c '
source /app/install.sh
check_health "full" 3 10
'

# Expected: ~15-20 seconds (10s wait + 5s checks + retries)

# Test with quick mode
time sudo bash -c '
source /app/install.sh
check_health "quick" 1 3
'

# Expected: ~5-8 seconds
```

**Expected Result:** ✅ Health checks complete within expected timeframes

---

## Integration Testing

### Test 10: Full Update Cycle

**Objective:** Complete end-to-end test of update process

**Steps:**
```bash
# 1. Document current state
echo "=== BEFORE UPDATE ===" > /tmp/update_test.log
sudo systemctl status emergent-backend emergent-frontend >> /tmp/update_test.log
curl http://localhost:8001/health >> /tmp/update_test.log 2>&1
curl http://localhost:3000 >> /tmp/update_test.log 2>&1

# 2. Create test update (with version bump or minor change)
cd /app
echo "# Test update $(date)" >> /app/README.md

# 3. Run update
sudo ./install.sh 2>&1 | tee -a /tmp/update_test.log

# 4. Document after state
echo "=== AFTER UPDATE ===" >> /tmp/update_test.log
sudo systemctl status emergent-backend emergent-frontend >> /tmp/update_test.log
curl http://localhost:8001/health >> /tmp/update_test.log 2>&1
curl http://localhost:3000 >> /tmp/update_test.log 2>&1

# 5. Check rollback history
echo "=== ROLLBACK HISTORY ===" >> /tmp/update_test.log
cat /opt/emergent-clone-backups/rollback_history.log >> /tmp/update_test.log

# 6. Review full log
less /tmp/update_test.log
```

**Expected Result:** ✅ Complete update cycle with all verifications passing

---

## Cleanup After Testing

```bash
# Remove test logs
rm -f /tmp/health_check_output.txt /tmp/update_test.log /tmp/test_*.sh

# Optional: Clear rollback history
sudo rm -f /opt/emergent-clone-backups/rollback_history.log

# Optional: Remove test backups
sudo rm -rf /opt/emergent-clone-backups/backup_*
```

---

## Automated Test Script

Create a comprehensive test script:

```bash
cat > /tmp/test_all_improvements.sh << 'TESTEOF'
#!/bin/bash

echo "======================================"
echo "Install.sh Improvements Test Suite"
echo "======================================"
echo ""

# Test 1: Syntax Check
echo "Test 1: Syntax Check..."
if bash -n /app/install.sh; then
  echo "✅ PASS: Syntax is valid"
else
  echo "❌ FAIL: Syntax errors found"
  exit 1
fi
echo ""

# Test 2: Function Existence
echo "Test 2: Function Existence..."
FUNCTIONS=("log_rollback_history" "check_health" "restore_from_backup" "error_handler")
for func in "${FUNCTIONS[@]}"; do
  if grep -q "^${func}()" /app/install.sh; then
    echo "✅ PASS: Function $func exists"
  else
    echo "❌ FAIL: Function $func not found"
    exit 1
  fi
done
echo ""

# Test 3: Health Check Components
echo "Test 3: Health Check Components..."
COMPONENTS=("emergent-backend" "emergent-frontend" "port 8001" "port 4000" "port 3000")
for comp in "${COMPONENTS[@]}"; do
  if grep -q "$comp" /app/install.sh; then
    echo "✅ PASS: Health check includes $comp"
  else
    echo "❌ FAIL: Health check missing $comp"
    exit 1
  fi
done
echo ""

# Test 4: Rollback History File Path
echo "Test 4: Rollback History Configuration..."
if grep -q "rollback_history.log" /app/install.sh; then
  echo "✅ PASS: Rollback history logging configured"
else
  echo "❌ FAIL: Rollback history logging not found"
  exit 1
fi
echo ""

# Test 5: Error Handler Enhancement
echo "Test 5: Error Handler Enhancement..."
if grep -q "ROLLBACK SUCCESSFUL\|ROLLBACK FAILED" /app/install.sh; then
  echo "✅ PASS: Enhanced error handler messages found"
else
  echo "❌ FAIL: Enhanced error handler not properly implemented"
  exit 1
fi
echo ""

echo "======================================"
echo "All Tests Passed! ✅"
echo "======================================"
TESTEOF

sudo bash /tmp/test_all_improvements.sh
```

---

## Test Checklist

Use this checklist when testing:

- [ ] Syntax check passes
- [ ] All functions are present
- [ ] Health check includes all 5 components
- [ ] Rollback history logging works
- [ ] Successful update logged correctly
- [ ] Failed update triggers rollback
- [ ] Rollback restores services
- [ ] Health check verifies all services
- [ ] Frontend health check works
- [ ] Backend health check works
- [ ] Node.js backend check works
- [ ] Retry logic works for transient failures
- [ ] Health report is generated
- [ ] Error handler provides clear messages
- [ ] Manual recovery steps are provided
- [ ] Rollback history is readable
- [ ] Temp files are cleaned up

---

## Troubleshooting Tests

### If a test fails:

1. **Check Syntax:**
   ```bash
   bash -n /app/install.sh
   ```

2. **Check Function Definition:**
   ```bash
   grep -A 5 "^function_name()" /app/install.sh
   ```

3. **Test Function Individually:**
   ```bash
   sudo bash -c 'source /app/install.sh; function_name args'
   ```

4. **Check Logs:**
   ```bash
   sudo journalctl -u emergent-backend -n 50
   cat /opt/emergent-clone-backups/rollback_history.log
   ```

---

## Success Criteria

All tests should:
- ✅ Complete without errors
- ✅ Produce expected output
- ✅ Leave system in operational state
- ✅ Generate proper logs
- ✅ Provide clear user feedback

---

**Version:** 1.0  
**Last Updated:** 2025-01-19  
**Status:** Ready for Testing ✅
