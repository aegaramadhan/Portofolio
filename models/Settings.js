const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Hero Section
  heroGreeting: {
    type: String,
    default: "Hello, I'm"
  },
  name: {
    type: String,
    default: 'Anjasyah Ega Ramadhan'
  },
  title: {
    type: String,
    default: 'Full-Stack Developer & UI/UX Designer'
  },
  heroDescription: {
    type: String,
    default: 'Saya mengembangkan pengalaman di dunia digital dengan menggabungkan tampilan yang indah dengan kinerja yang baik. Kompetensi di lingkup aplikasi web dan desain untuk pengguna.'
  },
  
  // Skills Summary
  primaryStack: {
    type: String,
    default: 'Express.js and HTML/CSS'
  },
  favoriteTools: {
    type: String,
    default: 'VS Code + Bootstrap + React'
  },
  learning: {
    type: String,
    default: 'Dart + Flutter'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
