const jwt = require('jsonwebtoken');

const secret = 'your-jwt-secret-change-this';
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NWQ2ZDQyNGJjOWVjYmYwZDgyODhlNiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE3Njc3MzA1Mzl9.o0s5Y7J-291wCDOTMTiX9YOIv3DPiG630gjy2TuLOms";

try {
  const decoded = jwt.verify(token, secret);
  console.log('✅ Token is VALID');
  console.log('Decoded:', JSON.stringify(decoded, null, 2));
} catch (error) {
  console.log('❌ Token verification FAILED:', error.message);
}
