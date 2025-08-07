const UserModel = require('./src/models/UserModel');
const bcrypt = require('bcryptjs');

async function testLogin() {
  try {
    console.log('🔍 Testing login...');
    
    // Find user
    const user = await UserModel.findByEmail('admin@example.com');
    console.log('👤 User found:', user ? {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status
    } : 'null');
    
    if (user) {
      // Test password
      const isValid = await UserModel.validatePassword('admin123456', user.password);
      console.log('🔑 Password valid:', isValid);
      
      // Also test direct bcrypt
      const directCheck = await bcrypt.compare('admin123456', user.password);
      console.log('🔐 Direct bcrypt check:', directCheck);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test error:', error);
    process.exit(1);
  }
}

testLogin();
