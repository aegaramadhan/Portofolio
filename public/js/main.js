// Main JavaScript for Portfolio Website
document.addEventListener('DOMContentLoaded', function() {
    // Load settings first
    loadSettings();
    
    // Mobile navbar toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isOpen = navMenu.classList.toggle('open');
            navToggle.classList.toggle('active', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });

        // Close menu when clicking a link (for in-page and external)
        navMenu.querySelectorAll('a.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                if (navMenu.classList.contains('open')) {
                    navMenu.classList.remove('open');
                    navToggle.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Close when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                if (navMenu.classList.contains('open')) {
                    navMenu.classList.remove('open');
                    navToggle.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Project filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectsGrid = document.getElementById('projectsGrid');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const category = this.getAttribute('data-category');
            loadProjects(category);
        });
    });

    // Load projects on page load
    loadProjects('all');

    // Email subscription
    const subscribeBtn = document.querySelector('.subscribe-btn');
    const emailInput = document.querySelector('.email-input');

    subscribeBtn.addEventListener('click', function() {
        const email = emailInput.value.trim();
        if (email && isValidEmail(email)) {
            // Here you would typically send the email to your backend
            alert('Terima kasih! Email Anda telah berhasil didaftarkan.');
            emailInput.value = '';
        } else {
            alert('Masukkan alamat email yang valid.');
        }
    });

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});

// Enhanced smooth scroll function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 80; // Account for fixed navbar
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Alternative: Smooth scroll with easing (more control)
function smoothScrollTo(targetPosition, duration = 1000) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    // Easing function for smooth effect
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Function to load projects
async function loadProjects(category = 'all') {
    try {
        let url = '/api/projects';
        if (category !== 'all') {
            url = `/api/projects/category/${category}`;
        }

        const response = await fetch(url);
        let projects = await response.json();
        
        // Sort projects: featured projects first
        projects.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        displayProjects(projects);
    } catch (error) {
        console.error('Error loading projects:', error);
        displayProjects([]);
    }
}

// Function to display projects
function displayProjects(projects) {
    const projectsGrid = document.getElementById('projectsGrid');
    
    if (projects.length === 0) {
        projectsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <h3>No Projects Found</h3>
                <p>No projects available in this category.</p>
            </div>
        `;
        return;
    }

    projectsGrid.innerHTML = projects.map(project => {
        const fullDesc = project.description || '';
        const shortDesc = truncateText(fullDesc, 70);
        const fullEnc = encodeURIComponent(fullDesc);
        const shortEnc = encodeURIComponent(shortDesc);
        const featuredBadge = project.featured ? '<span class="featured-badge"><i class="fas fa-star"></i> Featured</span>' : '';
        const projectUrl = project.projectUrl || '';
        return `
        <div class="project-card ${project.featured ? 'featured-project' : ''}" onclick="viewProject('${projectUrl}')">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" onerror="this.src='https://via.placeholder.com/400x200?text=No+Image'">
                ${featuredBadge}
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description" data-full="${fullEnc}" data-short="${shortEnc}" data-expanded="false">${shortDesc}</p>
                <button class="btn-moreless" onclick="toggleDescription(event, this)">Selengkapnya</button>
                <div class="project-tags">
                    ${project.technologies.map(tech => `<span class="project-tag">${tech}</span>`).join('')}
                </div>
            </div>
        </div>
    `;}).join('');
}

// Function to view project details
function viewProject(projectUrl) {
    // Open project URL in new tab if URL exists
    if (projectUrl && projectUrl.trim() !== '') {
        window.open(projectUrl, '_blank', 'noopener,noreferrer');
    } else {
        alert('Project URL tidak tersedia');
    }
}

// Function to view all projects
function viewAllProjects() {
    // Reset filter to "All"
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        if (btn.getAttribute('data-category') === 'all') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Load all projects
    loadProjects('all');
    
    // Scroll to projects section
    scrollToSection('projects');
}

// Smooth Parallax Effect for Hero Section
let ticking = false;
const hero = document.querySelector('.hero');
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function updateParallax() {
    if (!hero) return;
    
    const scrolled = window.pageYOffset;
    const heroHeight = hero.offsetHeight;
    
    // Only apply parallax if hero is in viewport
    if (scrolled < heroHeight) {
        // Smooth parallax movement (slower than scroll)
        const parallaxSpeed = 0.3; // Reduced speed for smoother effect
        const yPos = scrolled * parallaxSpeed;
        
        // Apply background position for smooth parallax
        // Using positive value so background moves down as you scroll
        hero.style.backgroundPosition = `center calc(50% + ${yPos}px)`;
        
        // Optional: Subtle fade effect as you scroll
        const opacity = 1 - (scrolled / heroHeight) * 0.2;
        hero.style.opacity = Math.max(opacity, 0.85);
    }
    
    ticking = false;
}

function requestParallaxUpdate() {
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

// Only enable parallax on desktop for better performance
if (!isMobile && window.innerWidth > 768) {
    window.addEventListener('scroll', requestParallaxUpdate);
    // Initial call
    updateParallax();
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.skill-item, .project-card, .stat-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Helper: truncate plain text without cutting words harshly
function truncateText(text, limit) {
    if (!text || text.length <= limit) return text;
    const clipped = text.slice(0, limit);
    const lastSpace = clipped.lastIndexOf(' ');
    return (lastSpace > 0 ? clipped.slice(0, lastSpace) : clipped).trim() + '…';
}

// Toggle description expand/collapse per card
function toggleDescription(event, button) {
    // Prevent triggering card click (viewProject)
    if (event) event.stopPropagation();
    const descriptionEl = button.previousElementSibling;
    if (!descriptionEl) return;

    const isExpanded = descriptionEl.getAttribute('data-expanded') === 'true';
    if (isExpanded) {
        descriptionEl.textContent = decodeURIComponent(descriptionEl.getAttribute('data-short') || '');
        descriptionEl.setAttribute('data-expanded', 'false');
        button.textContent = 'Selengkapnya';
    } else {
        descriptionEl.textContent = decodeURIComponent(descriptionEl.getAttribute('data-full') || '');
        descriptionEl.setAttribute('data-expanded', 'true');
        button.textContent = 'Lebih sedikit';
    }
}

// Load settings from API
async function loadSettings() {
    try {
        const response = await fetch('/api/settings');
        const settings = await response.json();
        applySettings(settings);
    } catch (error) {
        console.error('Error loading settings:', error);
        // If settings fail to load, page will use default HTML values
    }
}

// Apply settings to page elements
function applySettings(settings) {
    // Update hero section
    const heroGreeting = document.querySelector('.hero-greeting');
    if (heroGreeting && settings.heroGreeting) {
        heroGreeting.textContent = settings.heroGreeting;
    }
    
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && settings.name) {
        heroTitle.textContent = settings.name;
    }
    
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle && settings.title) {
        heroSubtitle.textContent = settings.title;
    }
    
    const heroDescription = document.querySelector('.hero-description');
    if (heroDescription && settings.heroDescription) {
        heroDescription.textContent = settings.heroDescription;
    }
    
    // Update skills summary
    const skillsSummary = document.querySelectorAll('.summary-item p');
    if (skillsSummary.length >= 3) {
        if (settings.primaryStack) {
            skillsSummary[0].textContent = settings.primaryStack;
        }
        if (settings.favoriteTools) {
            skillsSummary[1].textContent = settings.favoriteTools;
        }
        if (settings.learning) {
            skillsSummary[2].textContent = settings.learning;
        }
    }
    
    // Update page title
    if (settings.name && settings.title) {
        document.title = `${settings.name} - ${settings.title}`;
    }
    
    // Update navbar brand
    const navBrand = document.querySelector('.nav-brand h2');
    if (navBrand && settings.name) {
        navBrand.textContent = settings.name;
    }
    
    // Update footer
    const footerHeading = document.querySelector('.footer-left h3');
    if (footerHeading && settings.name) {
        footerHeading.textContent = settings.name;
    }
    
    const footerSubtitle = document.querySelector('.footer-left p');
    if (footerSubtitle && settings.title) {
        footerSubtitle.textContent = settings.title;
    }
    
    // Update contact section
    const contactHeader = document.querySelector('.contact-header h2');
    if (contactHeader && settings.name) {
        contactHeader.textContent = settings.name;
    }
}
