// Enhanced Portfolio Script with modern features
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

// Active navigation highlighting
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

// Animate skill bars
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

// Enhanced Form Handling
const contactForm = document.querySelector('form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    const button = this.querySelector('button');
    const originalText = button.textContent;
    
    // Show loading state
    button.textContent = 'Sending...';
    button.disabled = true;
    
    // Simulate sending (in real implementation, this would be actual form submission)
    setTimeout(() => {
      button.textContent = 'Message Sent!';
      button.style.background = 'linear-gradient(135deg, #00c853, #64dd17)';
      
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        button.style.background = '';
      }, 3000);
    }, 2000);
  });
}

// Add typing effect to hero title
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

// Add parallax effect to header
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const header = document.querySelector('header');
  if (header) {
    header.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

// Enhanced hover effects for service items
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

// Add click animation to profile picture
const profilePic = document.querySelector('.profile-pic');
if (profilePic) {
  profilePic.addEventListener('click', function() {
    this.style.transform = 'scale(1.1) rotate(5deg)';
    setTimeout(() => {
      this.style.transform = 'scale(1.05)';
    }, 300);
  });
}

// Keyboard navigation support
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

// Performance optimization: Lazy load images
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

// Service type indicator in contact form
const serviceSelect = document.querySelector('select[name="service"]');
if (serviceSelect) {
  serviceSelect.addEventListener('change', function() {
    const selectedService = this.value;
    const messageField = document.querySelector('textarea[name="message"]');
    
    if (selectedService && messageField.value === '') {
      const placeholders = {
        'accounting': 'Tell me about your accounting needs, bookkeeping requirements, or financial reporting...',
        'notion': 'Describe your Notion project, what workflows you want to automate, or templates needed...',
        'both': 'Tell me about both your accounting needs and Notion project requirements...',
        'other': 'How can I help you with your business needs?'
      };
      messageField.placeholder = placeholders[selectedService] || 'How can I help you?';
    }
  });
}

console.log("🎯 Portfolio enhanced with accounting focus loaded successfully!");