# Quick Reference: Install.sh Update Features

## Overview

The install.sh script now includes production-grade update features with automatic backup, rollback, and comprehensive health verification.

---

## Key Features

✅ **Automatic Backup** - Every update creates a timestamped backup  
✅ **Automatic Rollback** - Failed updates automatically restore previous state  
✅ **Health Verification** - Comprehensive checks of all services  
✅ **Rollback History** - Complete audit trail of all operations  
✅ **Frontend Checks** - Verifies frontend service (port 3000)  
✅ **Backend Checks** - Verifies backend proxy and Node.js backend  
✅ **Retry Logic** - Handles transient failures gracefully  
✅ **Clear Reporting** - Detailed status and troubleshooting info  

---

## Running an Update

```bash
# 1. Navigate to new code directory
cd /path/to/updated/code

# 2. Run installation script (auto-detects update mode)
sudo ./install.sh

# 3. Confirm when prompted
# Press 'y' to proceed

# 4. Wait for completion
# Script will automatically:
# - Create backup
# - Update code
# - Restart services
# - Verify health
```

---

## What Happens During Update

### 1. Backup Phase
```
Creating backup at /opt/emergent-clone-backups/backup_YYYYMMDD_HHMMSS...
  ✓ Backed up backend/.env
  ✓ Backed up frontend/.env.local
  ✓ Backed up application files
✓ Backup completed
```

### 2. Update Phase
```
Stopping services...
  ✓ Services stopped
Updating application...
  ✓ Application files synchronized
  ✓ Restored backend/.env
  ✓ Restored frontend/.env.local
Building backend...
  ✓ Backend built successfully
Building frontend...
  ✓ Frontend built successfully
```

### 3. Restart Phase
```
Restarting services...
  ✓ Services restarted
```

### 4. Verification Phase
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

## If Update Fails

### Automatic Rollback Process

When an error occurs, the script automatically:

1. **Detects the failure**
   ```
   =========================================
   ❌ ERROR DURING UPDATE
   =========================================
   Exit Code: 1
   Failed Command: [command that failed]
   Line Number: [line number]
   ```

2. **Initiates rollback**
   ```
   =========================================
   INITIATING AUTOMATIC ROLLBACK
   =========================================
   
   🔄 Rolling back from backup: /opt/emergent-clone-backups/backup_...
      Reason: Automatic rollback due to update failure
   ```

3. **Restores system**
   ```
   Stopping services...
   Restoring configuration files...
     ✓ Restored backend/.env
     ✓ Restored frontend/.env.local
   Restoring application files...
     ✓ Restored application files
   Starting services...
     ✓ Services restarted
   ```

4. **Verifies health**
   ```
   Verifying system health after restore...
   [health check output]
   ```

5. **Reports status**

   **Success:**
   ```
   =========================================
   ✓ ROLLBACK SUCCESSFUL
   =========================================
   
   System has been restored to previous working state.
   Your system is operational. Update was reverted.
   ```

   **Partial Success:**
   ```
   =========================================
   ❌ ROLLBACK FAILED
   =========================================
   
   Automatic rollback was attempted but health checks failed.
   The system may require manual intervention.
   
   [Manual recovery steps provided]
   ```

---

## Checking Update History

### View Rollback History
```bash
cat /opt/emergent-clone-backups/rollback_history.log
```

### Example History Entry
```
========================================
Timestamp: 2025-01-19 14:35:22
Action: UPDATE_SUCCESS
Backup Path: /opt/emergent-clone-backups/backup_20250119_143500
Status: SUCCESS
Details: Update completed successfully - All services healthy
========================================
```

### History Actions
- `UPDATE_SUCCESS` - Update completed successfully
- `UPDATE_FAILED` - Update failed, rollback triggered
- `RESTORE_SUCCESS` - Rollback completed, all services healthy
- `RESTORE_PARTIAL` - Rollback completed, some services unhealthy
- `RESTORE_FAILED` - Rollback failed, manual intervention needed

---

## Manual Recovery

If automatic rollback fails, follow these steps:

### 1. Check Service Status
```bash
sudo systemctl status emergent-backend
sudo systemctl status emergent-frontend
```

### 2. Check Service Logs
```bash
# Backend logs
sudo journalctl -u emergent-backend -n 50

# Frontend logs
sudo journalctl -u emergent-frontend -n 50
```

### 3. Try Restarting Services
```bash
sudo systemctl restart emergent-backend emergent-frontend

# Wait 10 seconds
sleep 10

# Check health
curl http://localhost:8001/health
curl http://localhost:3000
```

### 4. Manual Restore from Backup

If services still don't work:

```bash
# 1. Find latest backup
ls -lt /opt/emergent-clone-backups/

# 2. Stop services
sudo systemctl stop emergent-backend emergent-frontend

# 3. Restore files (replace BACKUP_DIR with actual path)
BACKUP_DIR="/opt/emergent-clone-backups/backup_YYYYMMDD_HHMMSS"
sudo rsync -a --delete "$BACKUP_DIR/app/" /opt/emergent-clone/

# 4. Restore .env files
sudo cp "$BACKUP_DIR/backend.env" /opt/emergent-clone/backend/.env
sudo cp "$BACKUP_DIR/frontend.env.local" /opt/emergent-clone/frontend/.env.local

# 5. Reload and restart
sudo systemctl daemon-reload
sudo systemctl start emergent-backend
sleep 5
sudo systemctl start emergent-frontend

# 6. Verify
curl http://localhost:8001/health
curl http://localhost:3000
```

---

## Health Check Details

### Components Checked

1. **Backend Service (systemd)**
   - Checks if emergent-backend.service is active
   - Status: active/inactive

2. **Frontend Service (systemd)**
   - Checks if emergent-frontend.service is active
   - Status: active/inactive

3. **Backend Proxy (Port 8001)**
   - Python ASGI proxy that forwards to Node.js
   - Endpoint: http://localhost:8001/health
   - Retries: 3 attempts with 2s delay

4. **Node.js Backend (Port 4000)**
   - Fastify backend service
   - Endpoint: http://localhost:4000/health
   - Checked in full mode only

5. **Frontend (Port 3000)**
   - Next.js frontend service
   - Endpoint: http://localhost:3000
   - Retries: 3 attempts with 2s delay

### Health Check Modes

**Full Mode** (default):
- Checks all 5 components
- 10-15 second stabilization wait
- 3 retries per HTTP check
- Used after updates and restores

**Quick Mode**:
- Checks systemd services and main ports
- 3 second stabilization wait
- 1 retry per HTTP check
- Used for quick verification

---

## Useful Commands

### Check Current Status
```bash
# Service status
sudo systemctl status emergent-backend emergent-frontend

# Health endpoints
curl http://localhost:8001/health
curl http://localhost:4000/health  # Node.js direct
curl http://localhost:3000          # Frontend

# Process check
ps aux | grep -E "uvicorn|node"
```

### View Logs
```bash
# Real-time logs
sudo journalctl -u emergent-backend -f
sudo journalctl -u emergent-frontend -f

# Last 50 lines
sudo journalctl -u emergent-backend -n 50
sudo journalctl -u emergent-frontend -n 50

# Since specific time
sudo journalctl -u emergent-backend --since "1 hour ago"
```

### Manage Backups
```bash
# List all backups
ls -lht /opt/emergent-clone-backups/

# View backup contents
ls -la /opt/emergent-clone-backups/backup_20250119_143500/

# Check backup size
du -sh /opt/emergent-clone-backups/backup_*/

# Remove old backups (manually)
sudo rm -rf /opt/emergent-clone-backups/backup_YYYYMMDD_HHMMSS
```

### Manage Rollback History
```bash
# View full history
cat /opt/emergent-clone-backups/rollback_history.log

# View last 10 entries
tail -n 50 /opt/emergent-clone-backups/rollback_history.log

# Search for failures
grep "FAILED" /opt/emergent-clone-backups/rollback_history.log

# Count operations by type
grep "Action:" /opt/emergent-clone-backups/rollback_history.log | sort | uniq -c
```

---

## Troubleshooting

### Update Stuck or Hanging

**Problem:** Update process appears frozen

**Solution:**
```bash
# Check if processes are running
ps aux | grep -E "install.sh|yarn|npm"

# Check system load
top

# Check disk space
df -h

# If truly stuck, cancel with Ctrl+C
# Then check services:
sudo systemctl status emergent-backend emergent-frontend
```

### Services Won't Start After Update

**Problem:** Services fail to start after update/rollback

**Common Causes:**
1. Port already in use
2. Configuration error
3. Missing dependencies
4. Permission issues

**Diagnosis:**
```bash
# Check what's using the ports
sudo lsof -i :8001
sudo lsof -i :4000
sudo lsof -i :3000

# Check configuration
cat /opt/emergent-clone/backend/.env
cat /opt/emergent-clone/frontend/.env.local

# Check permissions
ls -la /opt/emergent-clone/backend/
ls -la /opt/emergent-clone/frontend/

# Check dependencies
cd /opt/emergent-clone/backend && yarn install
cd /opt/emergent-clone/frontend && yarn install
```

### Health Check Always Fails

**Problem:** Health checks fail even though services appear running

**Diagnosis:**
```bash
# Test each component manually
curl -v http://localhost:8001/health
curl -v http://localhost:4000/health
curl -v http://localhost:3000

# Check if services are listening
sudo netstat -tlnp | grep -E "8001|4000|3000"

# Check firewall
sudo ufw status

# Check for errors in logs
sudo journalctl -u emergent-backend -n 100 | grep -i error
```

### Backup Directory Full

**Problem:** Not enough disk space for backups

**Solution:**
```bash
# Check disk usage
df -h /opt

# Remove old backups (script keeps last 3)
sudo rm -rf /opt/emergent-clone-backups/backup_202501*

# Compress old backups
cd /opt/emergent-clone-backups
sudo tar -czf backup_202501_archive.tar.gz backup_202501*
sudo rm -rf backup_202501*
```

---

## Best Practices

### Before Updating

1. **Check Current Status**
   ```bash
   sudo systemctl status emergent-backend emergent-frontend
   curl http://localhost:8001/health
   ```

2. **Review Changes**
   - Read changelog or release notes
   - Understand what's being updated

3. **Plan Downtime**
   - Updates take 5-10 minutes
   - Services will restart

4. **Notify Users** (if applicable)
   - System will be briefly unavailable

### During Update

1. **Don't Interrupt**
   - Let the script complete
   - Don't close terminal

2. **Monitor Output**
   - Watch for errors
   - Note any warnings

3. **Be Patient**
   - Build steps can take time
   - Health checks wait for stability

### After Update

1. **Verify Functionality**
   ```bash
   # Check health
   curl http://localhost:8001/health
   
   # Test UI
   curl http://YOUR_LAN_IP
   
   # Check logs
   sudo journalctl -u emergent-backend -n 20
   ```

2. **Test Critical Features**
   - Login works
   - Projects load
   - AI functions work

3. **Monitor for Issues**
   - Watch logs for 24 hours
   - Check for errors

4. **Keep Backup**
   - Don't delete immediately
   - Keep for at least a week

---

## Support

### Get Help

1. **Check Rollback History**
   ```bash
   cat /opt/emergent-clone-backups/rollback_history.log
   ```

2. **Check Logs**
   ```bash
   sudo journalctl -u emergent-backend -n 100
   sudo journalctl -u emergent-frontend -n 100
   ```

3. **Review Documentation**
   - `/app/INSTALL_UPDATE_IMPROVEMENTS.md` - Detailed technical docs
   - `/app/TESTING_UPDATE_IMPROVEMENTS.md` - Testing guide
   - `/app/UPDATE_GUIDE.md` - Original update guide

4. **Contact Support**
   - Include rollback history
   - Include relevant logs
   - Describe what was attempted

---

## FAQ

**Q: How long does an update take?**  
A: Typically 5-10 minutes, depending on system speed.

**Q: Will I lose data during update?**  
A: No. Database is never touched. All data is preserved.

**Q: What if update fails?**  
A: Automatic rollback restores previous working state.

**Q: Can I rollback manually later?**  
A: Yes, backups are kept (last 3 by default).

**Q: How do I know if update was successful?**  
A: Check rollback history log for UPDATE_SUCCESS entry.

**Q: Are backups automatic?**  
A: Yes, created automatically before every update.

**Q: How much disk space do backups use?**  
A: ~100-500MB per backup (excludes node_modules).

**Q: Can I test update on staging first?**  
A: Yes, recommended. Clone production to staging and test there.

**Q: What happens if server loses power during update?**  
A: Restart and run install.sh again. May need manual cleanup.

**Q: Can I schedule updates?**  
A: Not recommended. Updates need confirmation. Run manually.

---

## Quick Troubleshooting Checklist

- [ ] Services running? `systemctl status emergent-*`
- [ ] Health endpoints responding? `curl localhost:8001/health`
- [ ] Logs show errors? `journalctl -u emergent-backend -n 50`
- [ ] Ports available? `lsof -i :8001 :4000 :3000`
- [ ] Disk space? `df -h /opt`
- [ ] Recent rollback? `cat rollback_history.log`
- [ ] Tried restart? `systemctl restart emergent-*`
- [ ] Backup available? `ls -la backups/`

---

**Version:** 1.0  
**Last Updated:** 2025-01-19  
**Status:** Production Ready ✅
