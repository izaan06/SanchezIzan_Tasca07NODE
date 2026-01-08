require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI;

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connectat correctament');

    await User.deleteOne({ email: 'admin@example.com' });

    const admin = new User({
      name: 'Administrador',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    await admin.save();
    console.log('Admin creat correctament:', admin);

    mongoose.connection.close();
  } catch (err) {
    console.error('Error creant admin:', err);
  }
}

createAdmin();
