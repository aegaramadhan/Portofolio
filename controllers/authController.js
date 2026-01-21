const User = require('../models/User');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt with username:', username);

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.session.userId = user._id;
    req.session.role = user.role;
    req.session.username = user.username;

    res.json({ 
      message: 'Login successful', 
      user: { 
        id: user._id, 
        username: user.username, 
        role: user.role 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out' });
    }
    res.json({ message: 'Logout successful' });
  });
};

const getStatus = (req, res) => {
  if (req.session && req.session.userId) {
    res.json({ 
      authenticated: true, 
      user: { 
        id: req.session.userId, 
        username: req.session.username, 
        role: req.session.role 
      } 
    });
  } else {
    res.json({ authenticated: false });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin user already exists' });
    }

    const admin = new User({
      username,
      password,
      role: 'admin'
    });

    await admin.save();

    res.status(201).json({ message: 'Admin user created successfully' });
  } catch (error) {
    console.error('Create admin error:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Username already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = {
  login,
  logout,
  getStatus,
  createAdmin
};

