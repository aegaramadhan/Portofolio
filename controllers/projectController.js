const Project = require('../models/Project');

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getFeaturedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ featured: true }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Get featured projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProjectsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const projects = await Project.find({ category }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Get projects by category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createProject = async (req, res) => {
  try {
    const { title, description, category, technologies, projectUrl, githubUrl, featured } = req.body;
    
    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Title, description, and category are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Project image is required' });
    }

    const project = new Project({
      title,
      description,
      image: `/uploads/${req.file.filename}`,
      category,
      technologies: technologies ? technologies.split(',').map(tech => tech.trim()) : [],
      projectUrl: projectUrl || '',
      githubUrl: githubUrl || '',
      featured: featured === 'true' || featured === true
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProject = async (req, res) => {
  try {
    const { title, description, category, technologies, projectUrl, githubUrl, featured } = req.body;
    
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.title = title || project.title;
    project.description = description || project.description;
    project.category = category || project.category;
    project.technologies = technologies ? technologies.split(',').map(tech => tech.trim()) : project.technologies;
    project.projectUrl = projectUrl !== undefined ? projectUrl : project.projectUrl;
    project.githubUrl = githubUrl !== undefined ? githubUrl : project.githubUrl;
    project.featured = featured !== undefined ? (featured === 'true' || featured === true) : project.featured;

    if (req.file) {
      project.image = `/uploads/${req.file.filename}`;
    }

    await project.save();
    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllProjects,
  getFeaturedProjects,
  getProjectsByCategory,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};

