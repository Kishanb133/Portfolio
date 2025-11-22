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

// Back to Top Button
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

// Typing Effect for Hero Name
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

// Parallax Effect for Header
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

// ===== FORMSUBMIT INTEGRATION =====
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    
    // Create error message element if it doesn't exist
    let errorMessage = document.getElementById('errorMessage');
    if (!errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.id = 'errorMessage';
        errorMessage.className = 'form-error-message';
        errorMessage.style.display = 'none';
        errorMessage.innerHTML = '<h3>❌ Error Sending Message</h3><p id="errorText"></p>';
        contactForm.parentNode.insertBefore(errorMessage, contactForm.nextSibling);
    }
    const errorText = document.getElementById('errorText');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            successMessage.style.display = 'none';
            errorMessage.style.display = 'none';
            
            // Get form data
            const formData = new FormData(contactForm);
            
            // Simple validation
            const name = contactForm.querySelector('input[name="name"]').value.trim();
            const email = contactForm.querySelector('input[name="email"]').value.trim();
            const service = contactForm.querySelector('select[name="service"]').value;
            const message = contactForm.querySelector('textarea[name="message"]').value.trim();
            
            if (!name || !email || !service || !message) {
                showError('Please fill in all fields before sending.');
                resetButton();
                return;
            }

            // Submit form directly to FormSubmit
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    showSuccess();
                    contactForm.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showError('Failed to send message. Please try again or contact me directly at kbhanabhagwanwalapn@gmail.com');
            })
            .finally(() => {
                resetButton();
            });

            function resetButton() {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
            
            function showSuccess() {
                successMessage.style.display = 'block';
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            
            function showError(message) {
                errorText.textContent = message;
                errorMessage.style.display = 'block';
                errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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

console.log("🎯 Portfolio with FormSubmit integration ready!");
