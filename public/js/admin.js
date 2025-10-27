// Admin Panel JavaScript
let currentProjectId = null;
let projects = [];
let currentSettings = {};

document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    setupEventListeners();
});

// Check authentication status
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        
        if (data.authenticated && data.user.role === 'admin') {
            showAdminPanel(data.user);
            loadProjects();
            loadSettings();
        } else {
            showLoginModal();
        }
    } catch (error) {
        console.error('Auth check error:', error);
        showLoginModal();
    }
}

// Show login modal
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
}

// Close login modal
function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

// Show admin panel
function showAdminPanel(user) {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    document.getElementById('adminUsername').textContent = `Welcome, ${user.username}`;
}

// Setup event listeners
function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Project form
    document.getElementById('projectForm').addEventListener('submit', handleProjectSubmit);
    
    // Image preview
    document.getElementById('projectImage').addEventListener('change', handleImagePreview);
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const loginData = {
        username: formData.get('username'),
        password: formData.get('password')
    };
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAdminPanel(data.user);
            loadProjects();
            loadSettings();
        } else {
            showError('loginError', data.message);
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('loginError', 'Login failed. Please try again.');
    }
}

// Handle logout
async function logout() {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST'
        });
        if (response.ok) {
            window.location.href = '/';
        } else {
            showLoginModal();
            clearProjectsTable();
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Load projects
async function loadProjects() {
    try {
        const response = await fetch('/api/projects');
        projects = await response.json();
        displayProjectsTable();
    } catch (error) {
        console.error('Error loading projects:', error);
        showError('projectsTableBody', 'Failed to load projects');
    }
}

// Display projects in table
function displayProjectsTable() {
    const tbody = document.getElementById('projectsTableBody');
    
    if (projects.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    <i class="fas fa-folder-open"></i>
                    <h3>No Projects</h3>
                    <p>Click "Add New Project" to get started.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = projects.map(project => `
        <tr>
            <td class="project-image-cell">
                <img src="${project.image}" alt="${project.title}" onerror="this.src='https://via.placeholder.com/60x60?text=No+Image'">
            </td>
            <td class="project-title-cell">${project.title}</td>
            <td>
                <span class="project-category-cell">${project.category}</span>
            </td>
            <td class="project-featured-cell">
                ${project.featured ? '<span class="featured-badge">Featured</span>' : '-'}
            </td>
            <td>
                <div class="project-actions">
                    <button class="action-btn edit-btn" onclick="editProject('${project._id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteProject('${project._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Open add project modal
function openAddProjectModal() {
    currentProjectId = null;
    document.getElementById('projectModalTitle').textContent = 'Add New Project';
    document.getElementById('projectForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('projectModal').style.display = 'block';
}

// Close project modal
function closeProjectModal() {
    document.getElementById('projectModal').style.display = 'none';
    currentProjectId = null;
}

// Edit project
function editProject(projectId) {
    const project = projects.find(p => p._id === projectId);
    if (!project) return;
    
    currentProjectId = projectId;
    document.getElementById('projectModalTitle').textContent = 'Edit Project';
    
    // Fill form with project data
    document.getElementById('projectTitle').value = project.title;
    document.getElementById('projectDescription').value = project.description;
    document.getElementById('projectCategory').value = project.category;
    document.getElementById('projectTechnologies').value = project.technologies.join(', ');
    document.getElementById('projectUrl').value = project.projectUrl || '';
    document.getElementById('githubUrl').value = project.githubUrl || '';
    document.getElementById('projectFeatured').checked = project.featured;
    
    // Show current image
    document.getElementById('imagePreview').innerHTML = `
        <img src="${project.image}" alt="Current image" style="max-width: 200px; max-height: 200px; border-radius: 8px;">
        <p style="margin-top: 0.5rem; color: #666; font-size: 0.9rem;">Current image (select new image to replace)</p>
    `;
    
    // Make image field optional for edit
    document.getElementById('projectImage').required = false;
    
    document.getElementById('projectModal').style.display = 'block';
}

// Handle image preview
function handleImagePreview(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('imagePreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `
                <img src="${e.target.result}" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 8px;">
            `;
        };
        reader.readAsDataURL(file);
    }
}

// Handle project form submission
async function handleProjectSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    // Fix checkbox: Convert 'on' to 'true' or set 'false' if unchecked
    const featuredCheckbox = document.getElementById('projectFeatured');
    formData.set('featured', featuredCheckbox.checked ? 'true' : 'false');
    
    try {
        let response;
        if (currentProjectId) {
            // Update existing project
            response = await fetch(`/api/projects/${currentProjectId}`, {
                method: 'PUT',
                body: formData
            });
        } else {
            // Create new project
            response = await fetch('/api/projects', {
                method: 'POST',
                body: formData
            });
        }
        
        const data = await response.json();
        
        if (response.ok) {
            closeProjectModal();
            loadProjects();
            showSuccess('Project saved successfully!');
        } else {
            showError('projectForm', data.message);
        }
    } catch (error) {
        console.error('Project save error:', error);
        showError('projectForm', 'Failed to save project. Please try again.');
    }
}

// Delete project
function deleteProject(projectId) {
    const project = projects.find(p => p._id === projectId);
    if (!project) return;
    
    currentProjectId = projectId;
    document.getElementById('deleteModal').style.display = 'block';
}

// Close delete modal
function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
    currentProjectId = null;
}

// Confirm delete
async function confirmDelete() {
    if (!currentProjectId) return;
    
    try {
        const response = await fetch(`/api/projects/${currentProjectId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            closeDeleteModal();
            loadProjects();
            showSuccess('Project deleted successfully!');
        } else {
            const data = await response.json();
            showError('deleteModal', data.message);
        }
    } catch (error) {
        console.error('Delete error:', error);
        showError('deleteModal', 'Failed to delete project. Please try again.');
    }
}

// Clear projects table
function clearProjectsTable() {
    document.getElementById('projectsTableBody').innerHTML = '';
}

// Show error message
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div class="error-message">${message}</div>`;
        setTimeout(() => {
            element.innerHTML = '';
        }, 5000);
    }
}

// Show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.position = 'fixed';
    successDiv.style.top = '20px';
    successDiv.style.right = '20px';
    successDiv.style.zIndex = '3000';
    successDiv.style.padding = '1rem 1.5rem';
    successDiv.style.borderRadius = '8px';
    successDiv.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Handle escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }
});

// Load settings
async function loadSettings() {
    try {
        const response = await fetch('/api/settings');
        currentSettings = await response.json();
        displaySettings();
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Display settings in form fields
function displaySettings() {
    document.getElementById('heroGreeting').value = currentSettings.heroGreeting || '';
    document.getElementById('name').value = currentSettings.name || '';
    document.getElementById('title').value = currentSettings.title || '';
    document.getElementById('heroDescription').value = currentSettings.heroDescription || '';
    document.getElementById('primaryStack').value = currentSettings.primaryStack || '';
    document.getElementById('favoriteTools').value = currentSettings.favoriteTools || '';
    document.getElementById('learning').value = currentSettings.learning || '';
}

// Save individual setting
async function saveSetting(fieldName) {
    const inputElement = document.getElementById(fieldName);
    const value = inputElement.value.trim();
    
    if (!value) {
        showError(fieldName, 'This field cannot be empty');
        return;
    }
    
    // Disable button during save
    const button = inputElement.parentElement.querySelector('button');
    const originalText = button.textContent;
    button.textContent = 'Saving...';
    button.disabled = true;
    
    try {
        const response = await fetch('/api/settings', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                [fieldName]: value
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentSettings = data.settings;
            showSuccess('Setting saved successfully!');
        } else {
            showError(fieldName, data.message);
        }
    } catch (error) {
        console.error('Error saving setting:', error);
        showError(fieldName, 'Failed to save setting. Please try again.');
    } finally {
        button.textContent = originalText;
        button.disabled = false;
    }
}
