# Update Guide for Emergent Clone

## Overview

The `install.sh` script now supports **both fresh installations and updates** to existing installations. It automatically detects the mode and handles all necessary steps including backup, restoration, and rollback on failure.

## Features

✅ **Auto-Detection**: Automatically detects if this is a fresh install or update  
✅ **Backup System**: Creates timestamped backups before updates  
✅ **Environment Preservation**: Backs up and restores both `.env` files  
✅ **Database Safety**: Never touches MongoDB data during updates  
✅ **Automatic Rollback**: Restores previous state if update fails  
✅ **Health Checks**: Verifies services after update  
✅ **Backup Rotation**: Keeps only the last 3 backups  
✅ **Migration Support**: Placeholder for future database migrations  

---

## Update Process

### Automatic Mode Detection

The script checks if `/opt/emergent-clone` exists:
- **Exists** → Update mode
- **Doesn't exist** → Fresh install mode

### What Gets Updated

✅ **Application Code**
- Backend TypeScript/Node.js code
- Frontend Next.js code
- Python ASGI proxy (server.py)
- Dependencies (yarn packages)

✅ **System Dependencies**
- Python packages (httpx, starlette, uvicorn, websockets)

### What Gets Preserved

🔒 **Environment Files**
- `/opt/emergent-clone/backend/.env`
- `/opt/emergent-clone/frontend/.env.local`

🔒 **Database**
- MongoDB data (unchanged)
- MongoDB users and credentials
- All project data, files, users

🔒 **Configuration**
- Nginx configuration
- Systemd services
- Firewall rules
- LAN IP settings

---

## Running an Update

### Prerequisites

1. SSH access to the server
2. Root/sudo privileges
3. Updated code in a directory (e.g., `/tmp/emergent-clone`)

### Steps

```bash
# 1. Copy new code to server
scp -r emergent-clone/ user@server:/tmp/

# 2. SSH to server
ssh user@server

# 3. Navigate to updated code
cd /tmp/emergent-clone

# 4. Run the update
sudo ./install.sh
```

### What Happens

1. **Detection**: Script detects existing installation
2. **Confirmation**: Asks for user confirmation
3. **Backup**: Creates timestamped backup of current state
4. **Cleanup**: Removes old backups (keeps last 3)
5. **Update**: 
   - Stops services
   - Syncs new code
   - Restores .env files
   - Rebuilds backend and frontend
6. **Restart**: Starts services
7. **Verify**: Runs health checks
8. **Report**: Shows update summary

### Example Output

```
🔄 Detected existing installation at /opt/emergent-clone
MODE: UPDATE

Update Confirmation
-------------------

This will:
  ✓ Backup your .env files
  ✓ Preserve your database
  ✓ Update application code
  ✓ Rebuild frontend and backend
  ✓ Restart services

Your database and configuration will NOT be modified.

Proceed with update? (y/n) y

Creating backup at /opt/emergent-clone-backups/backup_20250119_143522...
  ✓ Backed up backend/.env
  ✓ Backed up frontend/.env.local
  ✓ Backed up application files
✓ Backup completed: /opt/emergent-clone-backups/backup_20250119_143522

Cleaning up old backups (keeping last 3)...
✓ Backup cleanup completed

========================================
Step 1: Updating Python dependencies
========================================
Python dependencies updated

========================================
Step 2: Updating application
========================================
Stopping services...
  ✓ Services stopped
  ✓ Application files synchronized
  ✓ Restored backend/.env
  ✓ Restored frontend/.env.local

========================================
Step 3: Running database migrations
========================================
  ℹ No migrations to run
  ✓ Database schema is up to date

========================================
Step 4: Building backend
========================================
  ✓ Backend built successfully

========================================
Step 5: Building frontend
========================================
  ✓ Frontend built successfully

========================================
Step 6: Restarting services
========================================
  ✓ Services restarted

========================================
Verifying installation
========================================
Checking service health...
  ✓ Backend is healthy (HTTP 200)
  ✓ Services are running
  ✓ Health check passed

========================================
Update Complete!
========================================

Update Summary:
---------------
✓ Application updated successfully
✓ Environment files preserved
✓ Database unchanged
✓ Services restarted
✓ Health check passed

Web Interface:    http://192.168.1.100

Backup Location:
----------------
/opt/emergent-clone-backups/backup_20250119_143522

Update complete! Your application is ready to use.
```

---

## Backup System

### Backup Location

All backups are stored in: `/opt/emergent-clone-backups/`

### Backup Contents

Each backup includes:
- `backend.env` - Backend environment variables
- `frontend.env.local` - Frontend environment variables
- `app/` - Complete application directory (excluding node_modules)

### Backup Naming

Format: `backup_YYYYMMDD_HHMMSS`

Example: `backup_20250119_143522`

### Backup Rotation

- **Keeps**: Last 3 backups
- **Deletes**: Older backups automatically
- **Timing**: Cleanup happens before each new backup

### Manual Backup Management

```bash
# List all backups
ls -lht /opt/emergent-clone-backups/

# View backup contents
ls -la /opt/emergent-clone-backups/backup_20250119_143522/

# Manually delete old backup
sudo rm -rf /opt/emergent-clone-backups/backup_20250119_120000/
```

---

## Rollback

### Automatic Rollback

If the update fails, the script **automatically rolls back** to the previous state:

1. Restores `.env` files from backup
2. Restores application files from backup
3. Restarts services
4. Reports rollback status

### Manual Rollback

If you need to rollback manually:

```bash
# 1. Stop services
sudo systemctl stop emergent-backend emergent-frontend

# 2. Restore .env files
sudo cp /opt/emergent-clone-backups/backup_20250119_143522/backend.env \
        /opt/emergent-clone/backend/.env

sudo cp /opt/emergent-clone-backups/backup_20250119_143522/frontend.env.local \
        /opt/emergent-clone/frontend/.env.local

# 3. Restore application files
sudo rsync -a --delete \
     /opt/emergent-clone-backups/backup_20250119_143522/app/ \
     /opt/emergent-clone/

# 4. Restart services
sudo systemctl start emergent-backend emergent-frontend

# 5. Verify
curl http://localhost:8001/health
```

---

## Health Checks

### Automatic Health Check

After each update, the script checks:

1. **Service Status**: Both backend and frontend are running
2. **Backend Health**: HTTP 200 response from `/health` endpoint
3. **Response Time**: Services respond within timeout

### Manual Health Checks

```bash
# Check service status
sudo systemctl status emergent-backend
sudo systemctl status emergent-frontend

# Check backend health endpoint
curl http://localhost:8001/health

# Expected response:
# {"status":"ok","timestamp":"2025-01-19T14:35:22.000Z"}

# Check frontend
curl -I http://localhost:3000

# Check via Nginx
curl http://YOUR_LAN_IP
```

---

## Database Migrations

### Current Status

The update script includes a **placeholder** for database migrations.

### Future Migrations

When database schema changes are needed:

1. Create migration script: `backend/scripts/migrate.js`
2. Uncomment migration section in `install.sh`:

```bash
# In install.sh, find Step 3 and uncomment:
cd "$APP_DIR/backend"
node scripts/migrate.js
```

### Migration Best Practices

- Always test migrations on staging first
- Create rollback migrations
- Backup database before running migrations
- Log migration results
- Use transactions for atomic operations

---

## Troubleshooting

### Update Fails Immediately

**Symptom**: Script exits before starting update

**Causes**:
- Not running as root
- Wrong directory
- Missing files

**Solution**:
```bash
# Ensure you're root
sudo -i

# Check you're in the right directory
ls -la install.sh

# Make script executable
chmod +x install.sh

# Run update
./install.sh
```

### Services Don't Start After Update

**Symptom**: Service status shows "failed"

**Check Logs**:
```bash
# Backend logs
sudo journalctl -u emergent-backend -n 50

# Frontend logs
sudo journalctl -u emergent-frontend -n 50
```

**Common Issues**:

1. **Missing dependencies**
   ```bash
   cd /opt/emergent-clone/backend
   yarn install
   yarn build
   sudo systemctl restart emergent-backend
   ```

2. **Port already in use**
   ```bash
   # Check what's using port 8001
   sudo lsof -i :8001
   
   # Kill process if needed
   sudo kill -9 <PID>
   
   # Restart service
   sudo systemctl start emergent-backend
   ```

3. **Permission issues**
   ```bash
   sudo chown -R root:root /opt/emergent-clone
   sudo systemctl restart emergent-backend emergent-frontend
   ```

### Health Check Fails

**Symptom**: "Health check failed" message

**Diagnosis**:
```bash
# Check if backend is responding
curl -v http://localhost:8001/health

# Check backend logs
sudo journalctl -u emergent-backend -n 100

# Check if Node.js backend is running
ps aux | grep node

# Check Python proxy
ps aux | grep uvicorn
```

**Fix**:
```bash
# Restart backend
sudo systemctl restart emergent-backend

# Wait and check
sleep 10
curl http://localhost:8001/health
```

### Automatic Rollback Fails

**Symptom**: Rollback reported but services still broken

**Manual Recovery**:
```bash
# 1. Find latest backup
ls -lht /opt/emergent-clone-backups/

# 2. Follow manual rollback steps above

# 3. If still broken, check logs
sudo journalctl -u emergent-backend -n 100
sudo journalctl -u emergent-frontend -n 100
```

### Frontend Shows Old Version

**Symptom**: Browser shows old UI after update

**Cause**: Browser cache

**Solution**:
```bash
# Hard refresh browser
# Chrome/Firefox: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

# Or clear browser cache
# Chrome: Settings > Privacy > Clear browsing data > Cached images and files

# Verify frontend version
curl http://YOUR_LAN_IP
```

### Database Connection Fails

**Symptom**: "MongoDB connection error" in logs

**This shouldn't happen** as update preserves .env, but if it does:

```bash
# Check .env file exists
cat /opt/emergent-clone/backend/.env | grep MONGODB_URI

# If missing, restore from backup
sudo cp /opt/emergent-clone-backups/backup_LATEST/backend.env \
        /opt/emergent-clone/backend/.env

# Restart backend
sudo systemctl restart emergent-backend
```

---

## Testing the Update Process

### Test Environment

Before running updates on production, test on a staging server:

1. Clone production database to staging
2. Copy production .env files
3. Run update on staging
4. Verify all functionality
5. Document any issues
6. Then update production

### Update Test Checklist

```bash
# Before update
✓ Access web interface
✓ Test login
✓ Create test project
✓ Generate test code
✓ Note current version/date

# During update
✓ Backup created successfully
✓ Services stopped gracefully
✓ Code synchronized
✓ .env files restored
✓ Build completed without errors
✓ Services restarted
✓ Health check passed

# After update
✓ Access web interface
✓ Test login with existing user
✓ View existing projects
✓ Create new project
✓ Generate new code
✓ Check all features work
✓ No errors in logs
```

---

## Best Practices

### Before Updating

1. **Announce Maintenance**: Notify users
2. **Backup Database**: Extra MongoDB backup
3. **Test on Staging**: Run update on test server first
4. **Check Disk Space**: Ensure enough space for backup
5. **Note Current State**: Document working configuration

```bash
# Check disk space
df -h /opt

# Manual MongoDB backup (extra safety)
mongodump --uri="mongodb://emergent_user:PASSWORD@localhost:27017/emergent_clone?authSource=emergent_clone" \
          --out=/backup/mongodb_$(date +%Y%m%d_%H%M%S)
```

### During Update

1. **Monitor Logs**: Watch for errors
2. **Don't Interrupt**: Let script complete
3. **Document Issues**: Note any warnings
4. **Save Output**: Capture script output

```bash
# Run with output capture
sudo ./install.sh 2>&1 | tee update_$(date +%Y%m%d_%H%M%S).log
```

### After Update

1. **Verify Health**: Run all health checks
2. **Test Features**: Check critical functionality
3. **Monitor Logs**: Watch for errors over 24 hours
4. **Document Changes**: Note what was updated
5. **Keep Backup**: Don't delete backup immediately

```bash
# Monitor logs in real-time
sudo journalctl -u emergent-backend -u emergent-frontend -f
```

---

## Maintenance Commands

### View Service Status

```bash
# All services
sudo systemctl status emergent-*

# Individual services
sudo systemctl status emergent-backend
sudo systemctl status emergent-frontend
```

### View Logs

```bash
# Live logs (tail)
sudo journalctl -u emergent-backend -f
sudo journalctl -u emergent-frontend -f

# Last 100 lines
sudo journalctl -u emergent-backend -n 100
sudo journalctl -u emergent-frontend -n 100

# Since timestamp
sudo journalctl -u emergent-backend --since "1 hour ago"
```

### Restart Services

```bash
# Both services
sudo systemctl restart emergent-backend emergent-frontend

# Individual service
sudo systemctl restart emergent-backend
```

### Rebuild Without Update

```bash
# If you need to rebuild without running full update
cd /opt/emergent-clone/backend
yarn install
yarn build
sudo systemctl restart emergent-backend

cd /opt/emergent-clone/frontend
yarn install
yarn build
sudo systemctl restart emergent-frontend
```

---

## Version History

### v2.0.0 - Update Support (2025-01-19)

**New Features**:
- ✅ Auto-detect fresh install vs update
- ✅ Backup and restore .env files
- ✅ Database preservation during updates
- ✅ Automatic rollback on failure
- ✅ Health checks after update
- ✅ Backup rotation (keep last 3)
- ✅ Database migration placeholder
- ✅ Enhanced error handling

**What Changed**:
- Complete rewrite of install.sh
- Added backup/restore functions
- Added health check functions
- Added rollback mechanism
- Added update-specific flow
- Preserved fresh install functionality

### v1.0.0 - Initial Release

**Features**:
- Fresh installation on Ubuntu 24.04
- Node.js, Docker, MongoDB, Redis setup
- Nginx reverse proxy
- Systemd services
- Firewall configuration
- Initial admin user creation

---

## Support

### Getting Help

If you encounter issues:

1. **Check Logs**: Most issues are logged
   ```bash
   sudo journalctl -u emergent-backend -n 100
   sudo journalctl -u emergent-frontend -n 100
   ```

2. **Health Check**: Verify services
   ```bash
   curl http://localhost:8001/health
   sudo systemctl status emergent-*
   ```

3. **Rollback**: Restore previous version
   ```bash
   # Use manual rollback steps above
   ```

4. **Report Issue**: Include:
   - Update log output
   - Service logs
   - Health check results
   - Backup directory listing
   - Error messages

---

## Additional Resources

- **Installation Guide**: `/app/README.md`
- **Deployment Guide**: `/app/DEPLOYMENT.md`
- **Quick Start**: `/app/QUICKSTART.md`
- **Architecture**: `/app/PROJECT_SUMMARY.md`

---

**Last Updated**: 2025-01-19  
**Script Version**: 2.0.0  
**Status**: Production Ready ✅
