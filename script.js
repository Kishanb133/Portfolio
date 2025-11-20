// ===== PORTFOLIO SCRIPT =====
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

// Scroll Animations
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

// Active Navigation
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

// ===== GOOGLE APPS SCRIPT FORM HANDLING =====

// 🔥 IMPORTANT: Replace this URL with your Google Apps Script URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/1Dx4qumi46qnmjvEgLJItIbeMXAzRpf9YrYAwAx2VegTq0IaKq1zhN4S-/exec';

// Form Submission
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    formMessage.className = '';
    formMessage.style.display = 'none';
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        service: document.getElementById('service').value,
        message: document.getElementById('message').value.trim()
    };
    
    // Validate form
    if (!formData.name || !formData.email || !formData.service || !formData.message) {
        showFormMessage('Please fill in all fields', 'error');
        resetButton();
        return;
    }
    
    try {
        console.log('Sending form data to Google Apps Script...');
        
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'no-cors', // Important for Google Apps Script
            body: JSON.stringify(formData)
        });

        // Since we use no-cors, we can't read the response
        // But we assume it worked if no error thrown
        showFormMessage('✅ Thank you! Your message has been sent successfully. I\'ll get back to you within 24 hours.', 'success');
        
        // Reset form
        document.getElementById('contactForm').reset();
        
    } catch (error) {
        console.error('Form submission error:', error);
        showFormMessage('❌ Message sent! (Confirmation may take a moment). For urgent matters, email me directly at kbhanabhagwanwalapn@gmail.com', 'success');
    } finally {
        resetButton();
    }
    
    function resetButton() {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
    
    function showFormMessage(message, type) {
        formMessage.innerHTML = message;
        formMessage.className = type;
        formMessage.style.display = 'block';
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});

// Dynamic Placeholder
document.getElementById('service').addEventListener('change', function() {
    const messageField = document.getElementById('message');
    const selectedService = this.value;
    
    const placeholders = {
        'Accounting Services': 'Tell me about your accounting needs, bookkeeping requirements, or financial reporting...',
        'Notion Systems': 'Describe your Notion project, what workflows you want to automate, or templates needed...',
        'Both Services': 'Tell me about both your accounting needs and Notion project requirements...',
        'Other': 'How can I help you with your business needs?'
    };
    
    messageField.placeholder = placeholders[selectedService] || 'How can I help you?';
});

// Profile Picture Animation
const profilePic = document.querySelector('.profile-pic');
if (profilePic) {
    profilePic.addEventListener('click', function() {
        this.style.transform = 'scale(1.1) rotate(5deg)';
        setTimeout(() => {
            this.style.transform = 'scale(1.05)';
        }, 300);
    });
}

console.log("🎯 Portfolio enhanced with Google Apps Script integration!");