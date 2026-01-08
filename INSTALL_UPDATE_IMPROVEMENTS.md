# Install.sh Update Feature Improvements

## Summary

Enhanced the `install.sh` update feature with comprehensive backup restoration, service health verification, and detailed logging on update failures.

## Changes Made

### 1. New Rollback History Logging Function

**Function:** `log_rollback_history()`

**Purpose:** Tracks all update, rollback, and restore operations with detailed logging.

**Features:**
- Creates persistent log at `/opt/emergent-clone-backups/rollback_history.log`
- Logs timestamp, action type, backup path, status, and detailed information
- Provides audit trail for troubleshooting

**Usage Example:**
```bash
log_rollback_history "UPDATE_SUCCESS" "/backup/path" "SUCCESS" "Update completed successfully"
```

**Log Format:**
```
========================================
Timestamp: 2025-01-19 14:35:22
Action: UPDATE_SUCCESS
Backup Path: /opt/emergent-clone-backups/backup_20250119_143500
Status: SUCCESS
Details: Update completed successfully - All services healthy
========================================
```

---

### 2. Enhanced Health Check Function

**Function:** `check_health()`

**Before:**
- Only checked backend proxy (port 8001)
- Single attempt, no retries
- Basic pass/fail status
- 5-second wait time

**After:**
- Checks ALL service components:
  - Systemd service status (emergent-backend, emergent-frontend)
  - Backend Python proxy (port 8001) with retries
  - Node.js backend (port 4000) - optional full check
  - Frontend (port 3000) with retries
- Configurable retry logic (default 3 retries with 2s delay)
- Configurable wait time for service stabilization
- Two modes: "full" (comprehensive) and "quick" (basic)
- Detailed health report saved to `/tmp/health_check_report`
- Component-level status reporting

**Parameters:**
```bash
check_health [mode] [retry_count] [wait_time]
# mode: "full" or "quick" (default: full)
# retry_count: number of retries for HTTP checks (default: 3)
# wait_time: seconds to wait for service stabilization (default: 10)
```

**Example Output:**
```
Checking service health (mode: full)...
  Waiting 10s for services to stabilize...
  Checking systemd services...
    ✓ emergent-backend service is active
    ✓ emergent-frontend service is active
  Checking backend proxy (port 8001)...
    ✓ Backend proxy is healthy (HTTP 200)
  Checking Node.js backend (port 4000)...
    ✓ Node.js backend is healthy (HTTP 200)
  Checking frontend (port 3000)...
    ✓ Frontend is responding (HTTP 200)
  ✓ All services are healthy
```

---

### 3. Improved Restore from Backup Function

**Function:** `restore_from_backup()`

**Enhancements:**

1. **Additional Parameters:**
   - Added `reason` parameter to track why restore was triggered

2. **Graceful Service Handling:**
   - Stops services with proper wait time
   - Reloads systemd daemon after restore
   - Starts services sequentially with delays

3. **Post-Restore Verification:**
   - Performs comprehensive health check after restore
   - Waits 15 seconds for services to fully stabilize
   - Retries health checks 3 times
   - Verifies ALL components (backend, frontend, both ports)

4. **Detailed Logging:**
   - Logs to rollback history with reason and outcome
   - Shows service status on failure
   - Displays recent backend logs for troubleshooting

5. **Return Codes:**
   - Returns 0 on successful restore with healthy services
   - Returns 1 if restore completes but health checks fail

**Example Output:**
```
🔄 Rolling back from backup: /opt/emergent-clone-backups/backup_20250119_143500
   Reason: Automatic rollback due to update failure
  Stopping services...
  Restoring configuration files...
    ✓ Restored backend/.env
    ✓ Restored frontend/.env.local
  Restoring application files...
    ✓ Restored application files
  Reloading systemd configuration...
  Starting services...
  ✓ Services restarted

  Verifying system health after restore...
  [... health check output ...]

✓ Rollback completed successfully - All services are healthy
```

---

### 4. Enhanced Error Handler

**Function:** `error_handler()`

**Major Improvements:**

1. **Detailed Error Information:**
   - Captures failed command
   - Records line number where error occurred
   - Logs exit code and timestamp
   - Shows error context

2. **Automatic Rollback Process:**
   - Logs failure to rollback history
   - Attempts automatic restore
   - Performs comprehensive health check after restore
   - Shows health check report

3. **Two-Stage Reporting:**

   **Stage 1: Rollback Successful**
   ```
   =========================================
   ✓ ROLLBACK SUCCESSFUL
   =========================================
   
   System has been restored to previous working state.
   
   Health Check Summary:
     ✓ Backend service: active
     ✓ Frontend service: active
     ✓ Backend proxy (8001): HTTP 200
     ✓ Node.js backend (4000): HTTP 200
     ✓ Frontend (3000): HTTP 200
   
   Your system is operational. Update was reverted.
   ```

   **Stage 2: Rollback Failed**
   ```
   =========================================
   ❌ ROLLBACK FAILED
   =========================================
   
   Automatic rollback was attempted but health checks failed.
   The system may require manual intervention.
   
   [Detailed manual recovery steps provided]
   ```

4. **Comprehensive Recovery Instructions:**
   - Step-by-step manual recovery commands
   - Service status check commands
   - Log inspection commands
   - Manual restore procedure with exact commands

5. **History Logging:**
   - Logs trigger event
   - Logs restore success/failure
   - Creates audit trail

---

### 5. Updated Final Health Check Section

**Location:** Post-installation/update verification

**Improvements:**

1. **Uses Enhanced Health Check:**
   - Full comprehensive check with retries
   - 10-second stabilization wait
   - Checks all service components

2. **Success Logging:**
   - Logs successful updates to rollback history
   - Creates audit trail for successful operations

3. **Enhanced Failure Reporting:**
   - Shows complete health check report
   - Displays service status details (15 lines each)
   - Provides troubleshooting commands
   - Shows rollback options with exact commands (update mode only)

4. **Better User Guidance:**
   - Clear next steps on failure
   - Manual rollback commands if needed
   - Links to rollback history log

---

## New Features Summary

### ✅ Rollback History Logging
- **File:** `/opt/emergent-clone-backups/rollback_history.log`
- **Tracks:**
  - All update attempts (success/failure)
  - All rollback operations
  - All restore operations
  - Timestamps and reasons
  - Detailed outcomes

### ✅ Frontend Health Checks
- **Port 3000:** HTTP response check
- **Retries:** 3 attempts with 2-second delays
- **Timeout:** Configurable wait time

### ✅ Comprehensive Service Verification
- **Systemd Status:** Both backend and frontend services
- **Backend Proxy:** Port 8001 with retries
- **Node.js Backend:** Port 4000 direct check (full mode)
- **Frontend:** Port 3000 with retries

### ✅ Enhanced Error Recovery
- **Automatic:** Restore backup on update failure
- **Verification:** Health check after restore
- **Reporting:** Detailed success/failure status
- **Guidance:** Manual recovery steps if needed

### ✅ Improved User Experience
- **Clear Status:** Know exactly what passed/failed
- **Actionable Steps:** Specific commands to run
- **Audit Trail:** Complete history of operations
- **Debugging Info:** Service status and logs on failure

---

## Testing Scenarios

### Scenario 1: Successful Update
```
1. Backup created
2. Update applied
3. Services restarted
4. Health check: ALL PASS
5. Logged to history: UPDATE_SUCCESS
```

### Scenario 2: Update Fails, Rollback Succeeds
```
1. Backup created
2. Update starts
3. Error occurs at step X
4. Error handler triggered
5. Automatic rollback initiated
6. Backup restored
7. Services restarted
8. Health check: ALL PASS
9. Logged to history: UPDATE_FAILED → RESTORE_SUCCESS
10. User informed: System restored, operational
```

### Scenario 3: Update Fails, Rollback Partial
```
1. Backup created
2. Update starts
3. Error occurs at step X
4. Error handler triggered
5. Automatic rollback initiated
6. Backup restored
7. Services restarted
8. Health check: SOME FAIL
9. Logged to history: UPDATE_FAILED → RESTORE_PARTIAL
10. User informed: Manual intervention needed
11. Manual recovery steps provided
```

### Scenario 4: Update Fails, Rollback Fails
```
1. Backup created
2. Update starts
3. Error occurs at step X
4. Error handler triggered
5. Automatic rollback initiated
6. Restore fails (backup missing/corrupted)
7. Logged to history: UPDATE_FAILED → RESTORE_FAILED
8. User informed: Critical failure
9. Detailed manual recovery steps provided
```

---

## Configuration

### Constants
- `BACKUP_BASE_DIR`: `/opt/emergent-clone-backups`
- `ROLLBACK_HISTORY_LOG`: `$BACKUP_BASE_DIR/rollback_history.log`
- `TEMP_HEALTH_REPORT`: `/tmp/health_check_report`
- `TEMP_BACKUP_PATH`: `/tmp/latest_backup_path`

### Health Check Defaults
- **Retry Count:** 3 attempts
- **Retry Delay:** 2 seconds between attempts
- **Wait Time:** 10-15 seconds for service stabilization
- **Timeout:** Built-in curl timeouts for HTTP checks

### Service Ports
- **Backend Proxy:** 8001 (Python ASGI)
- **Node.js Backend:** 4000 (Fastify)
- **Frontend:** 3000 (Next.js)

---

## Usage Examples

### View Rollback History
```bash
cat /opt/emergent-clone-backups/rollback_history.log
```

### Manual Health Check
```bash
# Quick check
check_health "quick" 1 3

# Full check with 5 retries and 20s wait
check_health "full" 5 20
```

### Manual Restore
```bash
restore_from_backup "/opt/emergent-clone-backups/backup_20250119_143500" "Manual restore"
```

### View Health Report
```bash
cat /tmp/health_check_report
```

---

## Benefits

1. **Reliability:** Automatic recovery from failed updates
2. **Visibility:** Know exactly what's working and what's not
3. **Auditability:** Complete history of all operations
4. **Confidence:** Safe to update with automatic rollback
5. **Debugging:** Detailed logs and status for troubleshooting
6. **User-Friendly:** Clear messages and actionable steps

---

## Backward Compatibility

- All existing functionality preserved
- Fresh installs work unchanged
- Updates with no errors behave as before
- Only activates enhanced features on update failures
- No breaking changes to existing scripts or workflows

---

## Files Modified

- `/app/install.sh` - Main installation script

## New Files Created

- `/opt/emergent-clone-backups/rollback_history.log` (created on first operation)

---

## Maintenance

### Log Rotation
The rollback history log will grow over time. Consider implementing log rotation:

```bash
# Add to crontab for monthly rotation
0 0 1 * * cd /opt/emergent-clone-backups && mv rollback_history.log rollback_history.log.$(date +\%Y\%m) && touch rollback_history.log
```

### Cleanup Old History
```bash
# Keep only last 6 months of history
find /opt/emergent-clone-backups -name "rollback_history.log.*" -mtime +180 -delete
```

---

## Version

**Version:** 2.1.0  
**Date:** January 2025  
**Status:** Production Ready ✅

---

## Support

For issues or questions:
1. Check rollback history: `cat /opt/emergent-clone-backups/rollback_history.log`
2. Check service logs: `sudo journalctl -u emergent-backend -n 100`
3. Check health manually: Run health check functions
4. Review this documentation

---

**Last Updated:** 2025-01-19  
**Author:** E1 Development Team  
**License:** MIT
