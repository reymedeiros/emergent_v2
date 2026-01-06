const mongoose = require('mongoose');
const config = require('./dist/config').default;

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  apiKeys: {
    openai: String,
    anthropic: String,
    google: String,
  },
  preferences: {
    defaultModel: String,
    defaultProvider: { type: String, default: 'lmstudio' },
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function fixAdminUser() {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log('✅ Connected to MongoDB');

    // Find admin users without username
    const adminsWithoutUsername = await User.find({
      isAdmin: true,
      $or: [
        { username: { $exists: false } },
        { username: null },
        { username: '' }
      ]
    });

    if (adminsWithoutUsername.length === 0) {
      console.log('✅ No admin users need fixing');
      process.exit(0);
    }

    for (const user of adminsWithoutUsername) {
      console.log(`Fixing user: ${user.email}`);
      
      // Set username based on email
      let baseUsername = 'admin';
      let username = baseUsername;
      let counter = 1;
      
      // Ensure username is unique
      while (await User.findOne({ username, _id: { $ne: user._id } })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }
      
      user.username = username;
      
      // Ensure timestamps exist
      if (!user.createdAt) {
        user.createdAt = new Date();
      }
      if (!user.updatedAt) {
        user.updatedAt = new Date();
      }
      
      await user.save();
      console.log(`✅ Fixed user ${user.email} - username set to: ${username}`);
    }

    console.log('✅ All admin users fixed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixAdminUser();
