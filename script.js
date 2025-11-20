// ===== SIMPLE PORTFOLIO SCRIPT =====
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

// ===== SIMPLE CONTACT FORM HANDLING =====

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Opening Email...';
    submitBtn.classList.add('btn-loading');
    submitBtn.disabled = true;
    
    // Get form data
    const formData = {
        name: document.querySelector('input[name="name"]').value.trim(),
        email: document.querySelector('input[name="email"]').value.trim(),
        service: document.querySelector('select[name="service"]').value,
        message: document.querySelector('textarea[name="message"]').value.trim()
    };
    
    // Validate form
    if (!formData.name || !formData.email || !formData.service || !formData.message) {
        alert('Please fill in all fields before sending.');
        resetButton();
        return;
    }
    
    // Create email content
    const subject = `Portfolio Contact: ${formData.name} - ${formData.service}`;
    const body = `
Name: ${formData.name}
Email: ${formData.email}
Service: ${formData.service}

Message:
${formData.message}

---
Sent from your portfolio website
    `.trim();
    
    // Create mailto link
    const mailtoLink = `mailto:kbhanabhagwanwalapn@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client
    setTimeout(() => {
        window.location.href = mailtoLink;
        
        // Show success message after a delay
        setTimeout(() => {
            showSuccessMessage();
            resetButton();
        }, 2000);
        
    }, 1000);
    
    function resetButton() {
        submitBtn.textContent = originalText;
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
    }
    
    function showSuccessMessage() {
        // Create success message
        const successDiv = document.createElement('div');
        successDiv.className = 'alternative-contact form-success';
        successDiv.innerHTML = `
            <h3>✅ Email Ready to Send!</h3>
            <p>Your email client should open with your message pre-filled.</p>
            <p><strong>Just click "Send" to complete!</strong></p>
            <p><small>If email doesn't open, please send manually to: kbhanabhagwanwalapn@gmail.com</small></p>
        `;
        
        // Insert after form
        const form = document.getElementById('contactForm');
        form.parentNode.insertBefore(successDiv, form.nextSibling);
        
        // Clear form
        form.reset();
        
        // Remove success message after 10 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 10000);
    }
});

// Dynamic Placeholder for Service Selection
document.querySelector('select[name="service"]').addEventListener('change', function() {
    const messageField = document.querySelector('textarea[name="message"]');
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

console.log("🎯 Portfolio ready! Simple contact form implemented.");
