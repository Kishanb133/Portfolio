// ===== PORTFOLIO LOADER & ANIMATIONS =====
console.log("🚀 Portfolio Loaded Successfully");

// Page Loader
window.addEventListener('load', function() {
    const loader = document.querySelector('.page-loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 800);
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate skill bars when skills section is visible
            if (entry.target.id === 'skills') {
                animateSkillBars();
            }
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// Active Navigation Highlighting
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('nav a');

function highlightNav() {
    let current = '';
    const scrollY = window.pageYOffset + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNav);

// Animate Skill Bars
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.bar-fill');
    skillBars.forEach(bar => {
        const width = bar.style.getPropertyValue('--width');
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 300);
    });
}

// Back to Top Button (if you had this)
const backToTopButton = document.createElement('button');
backToTopButton.innerHTML = '↑';
backToTopButton.className = 'back-to-top';
backToTopButton.setAttribute('aria-label', 'Back to top');
document.body.appendChild(backToTopButton);

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

// Typing Effect for Hero Name (if you had this)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect on hero name
const heroName = document.querySelector('.hero-name');
if (heroName) {
    const originalName = heroName.textContent;
    setTimeout(() => {
        typeWriter(heroName, originalName, 120);
    }, 1000);
}

// Parallax Effect for Header (if you had this)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const header = document.querySelector('header');
    if (header) {
        header.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Enhanced Hover Effects for Service Items
const serviceItems = document.querySelectorAll('.service-list li, .why-list li');
serviceItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(10px)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0)';
    });
});

// Click Animation for Profile Picture
const profilePic = document.querySelector('.profile-pic');
if (profilePic) {
    profilePic.addEventListener('click', function() {
        this.style.transform = 'scale(1.1) rotate(5deg)';
        setTimeout(() => {
            this.style.transform = 'scale(1.05)';
        }, 300);
    });
}

// Keyboard Navigation Support
document.addEventListener('keydown', function(e) {
    // Escape key closes modals or resets states
    if (e.key === 'Escape') {
        backToTopButton.focus();
    }
    
    // Home key scrolls to top
    if (e.key === 'Home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // End key scrolls to bottom
    if (e.key === 'End') {
        e.preventDefault();
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
});

// Performance Optimization: Lazy Load Images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== FORMSUBMIT INTEGRATION (NEW) =====

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('#contact form');
    const successMessage = document.getElementById('successMessage');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.classList.add('form-submit-loading');
            submitBtn.disabled = true;
            
            // Get form data for validation
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const service = formData.get('service');
            const message = formData.get('message');
            
            // Validate form
            if (!name || !email || !service || !message) {
                showMessage('Please fill in all fields before sending.', 'error');
                resetButton();
                return;
            }
            
            // Create a temporary iframe to handle form submission
            const tempIframe = document.createElement('iframe');
            tempIframe.name = 'formsubmit-target';
            tempIframe.style.display = 'none';
            document.body.appendChild(tempIframe);
            
            // Set form target to iframe
            contactForm.target = 'formsubmit-target';
            
            // Handle iframe load event
            tempIframe.onload = function() {
                setTimeout(() => {
                    // Show success message
                    showMessage('success');
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Reset button
                    resetButton();
                    
                    // Remove iframe
                    document.body.removeChild(tempIframe);
                    
                    // Reset form target
                    contactForm.target = '_self';
                }, 1000);
            };
            
            // Submit the form
            contactForm.submit();
            
            function resetButton() {
                submitBtn.textContent = originalText;
                submitBtn.classList.remove('form-submit-loading');
                submitBtn.disabled = false;
            }
            
            function showMessage(type, customMessage = '') {
                if (type === 'success') {
                    successMessage.style.display = 'block';
                    successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else {
                    // Create error message
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'form-error-message';
                    errorDiv.innerHTML = `❌ ${customMessage}`;
                    
                    // Insert after form
                    contactForm.parentNode.insertBefore(errorDiv, contactForm.nextSibling);
                    
                    // Remove error message after 5 seconds
                    setTimeout(() => {
                        errorDiv.remove();
                    }, 5000);
                }
            }
        });
        
        // Dynamic placeholder for service selection
        const serviceSelect = contactForm.querySelector('select[name="service"]');
        const messageField = contactForm.querySelector('textarea[name="message"]');
        
        if (serviceSelect && messageField) {
            serviceSelect.addEventListener('change', function() {
                const selectedService = this.value;
                
                const placeholders = {
                    'Accounting Services': 'Tell me about your accounting needs: bookkeeping, tax preparation, financial reporting, etc...',
                    'Notion Systems': 'Describe what you want to build: business dashboard, workflow automation, templates, etc...',
                    'Both Services': 'Tell me about both your accounting needs and Notion system requirements...',
                    'Consultation': 'What would you like to discuss in our consultation?'
                };
                
                messageField.placeholder = placeholders[selectedService] || 'Please describe your project or requirements...';
            });
        }
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

console.log("🎯 Portfolio with ALL animations + FormSubmit integration ready!");
