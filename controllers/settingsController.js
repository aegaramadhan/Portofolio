const Settings = require('../models/Settings');

const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Error fetching settings' });
  }
};

const updateSettings = async (req, res) => {
  try {
    const {
      heroGreeting,
      name,
      title,
      heroDescription,
      primaryStack,
      favoriteTools,
      learning
    } = req.body;

    let settings = await Settings.findOne();
    
    // If no settings exist, create new one
    if (!settings) {
      settings = new Settings();
    }

    // Update fields
    if (heroGreeting !== undefined) settings.heroGreeting = heroGreeting;
    if (name !== undefined) settings.name = name;
    if (title !== undefined) settings.title = title;
    if (heroDescription !== undefined) settings.heroDescription = heroDescription;
    if (primaryStack !== undefined) settings.primaryStack = primaryStack;
    if (favoriteTools !== undefined) settings.favoriteTools = favoriteTools;
    if (learning !== undefined) settings.learning = learning;

    await settings.save();
    
    res.json({ 
      message: 'Settings updated successfully',
      settings 
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Error updating settings' });
  }
};

module.exports = {
  getSettings,
  updateSettings
};

