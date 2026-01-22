// DOM Elements
const projectsGrid = document.getElementById('projectsGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('projectModal');
const modalClose = document.querySelector('.modal-close');

let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderProjects('all');
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.category;
            renderProjects(currentFilter);
        });
    });

    // Modal close
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });
}

// Render Projects
function renderProjects(category) {
    projectsGrid.innerHTML = '';

    const filteredProjects = category === 'all' 
        ? projectsData 
        : projectsData.filter(p => p.category === category);

    if (filteredProjects.length === 0) {
        projectsGrid.innerHTML = '<p class="no-projects">No projects found in this category.</p>';
        return;
    }

    filteredProjects.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
    });
}

// Create Project Card
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    const techHtml = project.technologies
        .map(tech => `<span class="tech-tag">${tech}</span>`)
        .join('');

    card.innerHTML = `
        <div class="project-image-wrapper">
            <img src="${project.image}" alt="${project.title}" class="project-image">
        </div>
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <a href="${project.projectUrl}" target="_blank" class="project-link">Selengkapnya</a>
            <div class="project-tech">
                ${techHtml}
            </div>
        </div>
    `;

    card.addEventListener('click', () => openModal(project));
    return card;
}

// Open Modal
function openModal(project) {
    document.getElementById('modalImage').src = project.image;
    document.getElementById('modalCategory').textContent = project.category;
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalDescription').textContent = project.description;
    document.getElementById('modalProjectLink').href = project.projectUrl;

    const techHtml = project.technologies
        .map(tech => `<span class="tech-badge">${tech}</span>`)
        .join('');
    document.getElementById('modalTech').innerHTML = techHtml;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Smooth scrolling for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
