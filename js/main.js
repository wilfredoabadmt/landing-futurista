/* ========================================
   AS Marketers - Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initParticles();
    initNavigation();
    initTechCarousel();
    initScrollAnimations();
    initCounters();
    initCalculator();
    initForms();
    initSmoothScroll();
});

/* ========================================
   TECH CAROUSEL - FUTURISTIC
   ======================================== */
function initTechCarousel() {
    const track = document.getElementById('tech-track');
    const prevBtn = document.getElementById('tech-prev');
    const nextBtn = document.getElementById('tech-next');
    const dotsContainer = document.getElementById('tech-dots');
    
    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;
    
    const cards = track.querySelectorAll('.tech-futuristic-card');
    const totalCards = cards.length;
    let currentIndex = 0;
    let cardsPerView = getCardsPerView();
    let autoPlayInterval;
    
    function getCardsPerView() {
        const viewport = document.querySelector('.tech-carousel-viewport');
        if (!viewport) return 4;
        const viewportWidth = viewport.offsetWidth;
        const cardWidth = 224; // 200px + 24px gap
        return Math.floor(viewportWidth / cardWidth);
    }
    
    function getMaxIndex() {
        return Math.max(0, totalCards - cardsPerView);
    }
    
    function createDots() {
        dotsContainer.innerHTML = '';
        const numDots = getMaxIndex() + 1;
        
        for (let i = 0; i < numDots; i++) {
            const dot = document.createElement('button');
            dot.className = 'tech-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Grupo ${i + 1}`);
            dot.addEventListener('click', () => {
                goToIndex(i);
                resetAutoPlay();
            });
            dotsContainer.appendChild(dot);
        }
    }
    
    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.tech-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }
    
    function updateCarousel() {
        const cardWidth = cards[0].offsetWidth + 24; // gap
        const offset = currentIndex * cardWidth;
        track.style.transform = `translateX(-${offset}px)`;
        updateDots();
    }
    
    function goToIndex(index) {
        const maxIdx = getMaxIndex();
        currentIndex = Math.max(0, Math.min(index, maxIdx));
        updateCarousel();
    }
    
    function next() {
        if (currentIndex < getMaxIndex()) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateCarousel();
    }
    
    function prev() {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = getMaxIndex();
        }
        updateCarousel();
    }
    
    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(next, 3000);
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }
    
    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }
    
    // Event listeners
    nextBtn.addEventListener('click', () => {
        next();
        resetAutoPlay();
    });
    
    prevBtn.addEventListener('click', () => {
        prev();
        resetAutoPlay();
    });
    
    // Pause on hover
    track.addEventListener('mouseenter', stopAutoPlay);
    track.addEventListener('mouseleave', startAutoPlay);
    
    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        isDragging = true;
        stopAutoPlay();
    }, { passive: true });
    
    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        touchEndX = e.touches[0].clientX;
    }, { passive: true });
    
    track.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) next();
            else prev();
        }
        startAutoPlay();
    }, { passive: true });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const rect = track.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            if (e.key === 'ArrowLeft') {
                prev();
                resetAutoPlay();
            } else if (e.key === 'ArrowRight') {
                next();
                resetAutoPlay();
            }
        }
    });
    
    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            cardsPerView = getCardsPerView();
            currentIndex = 0;
            createDots();
            updateCarousel();
        }, 250);
    });
    
    // Initialize
    createDots();
    updateCarousel();
    startAutoPlay();
}

/* ========================================
   NAVIGATION
   ======================================== */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.color = this.getColor();
        }
        
        getColor() {
            const colors = [
                'rgba(0, 245, 255,',   // cyan
                'rgba(184, 41, 221,',  // purple
                'rgba(79, 70, 229,',   // blue
                'rgba(236, 72, 153,'   // pink
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Wrap around edges
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `${this.color}${this.opacity})`;
            ctx.fill();
        }
    }
    
    // Create particles
    function createParticles() {
        const numParticles = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
        particles = [];
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }
    
    // Draw connections
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 0.3;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 245, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        drawConnections();
        animationId = requestAnimationFrame(animate);
    }
    
    createParticles();
    animate();
    
    // Recreate particles on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resizeCanvas();
            createParticles();
        }, 250);
    });
}

/* ========================================
   NAVIGATION
   ======================================== */
function initNavigation() {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('active');
            navToggle.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/* ========================================
   SCROLL ANIMATIONS
   ======================================== */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

/* ========================================
   COUNTER ANIMATION
   ======================================== */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

/* ========================================
   CALCULATOR
   ======================================== */
function initCalculator() {
    const calcOptions = document.querySelectorAll('.calc-option');
    const calcCheckboxes = document.querySelectorAll('.calc-checkbox input');
    const calcSlider = document.getElementById('complexity');
    const calcAmount = document.getElementById('calc-amount');
    
    // Base prices (Mercado Latino - Precios Accesibles)
    const basePrices = {
        'landing': 79,
        'web': 149,
        'ecommerce': 249,
        'custom': 399
    };
    
    // Additional service prices (Mercado Latino)
    const additionalPrices = {
        'seo': 49,
        'ia': 99,
        'crm': 79,
        'ads': 89
    };
    
    let selectedProject = 'landing';
    let selectedServices = [];
    let complexity = 3;
    
    // Project type selection
    calcOptions.forEach(option => {
        option.addEventListener('click', () => {
            calcOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            selectedProject = option.getAttribute('data-value');
            updatePrice();
        });
    });
    
    // Additional services selection
    calcCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                selectedServices.push(checkbox.value);
            } else {
                selectedServices = selectedServices.filter(s => s !== checkbox.value);
            }
            updatePrice();
        });
    });
    
    // Complexity slider
    if (calcSlider) {
        calcSlider.addEventListener('input', (e) => {
            complexity = parseInt(e.target.value);
            updatePrice();
        });
    }
    
    // Update price calculation
    function updatePrice() {
        let total = basePrices[selectedProject] || 499;
        
        // Add additional services
        selectedServices.forEach(service => {
            total += additionalPrices[service] || 0;
        });
        
        // Apply complexity multiplier
        const multiplier = 0.8 + (complexity * 0.1);
        total = Math.round(total * multiplier);
        
        // Animate price change
        animatePrice(calcAmount, total);
    }
    
    function animatePrice(element, targetPrice) {
        const startPrice = parseInt(element.textContent) || 0;
        const duration = 500;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentPrice = Math.round(startPrice + (targetPrice - startPrice) * progress);
            element.textContent = currentPrice;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
}

/* ========================================
   FORMS
   ======================================== */
function initForms() {
    // Ebook form
    const ebookForm = document.getElementById('ebook-form');
    if (ebookForm) {
        ebookForm.addEventListener('submit', handleEbookSubmit);
    }
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

function handleEbookSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Descargando...</span>';
    submitBtn.disabled = true;
    
    // Simulate download (replace with actual endpoint)
    setTimeout(() => {
        // Reset form
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showNotification('¡Ebook descargado correctamente! Revisa tu email.', 'success');
    }, 1500);
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Enviando...</span>';
    submitBtn.disabled = true;
    
    // Simulate submission (replace with actual endpoint)
    setTimeout(() => {
        // Reset form
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showNotification('¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.', 'success');
    }, 1500);
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : '!'}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        padding: 16px 24px;
        background: ${type === 'success' ? 'rgba(0, 245, 255, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
        border: 1px solid ${type === 'success' ? 'rgba(0, 245, 255, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
        border-radius: 12px;
        color: ${type === 'success' ? '#00f5ff' : '#ef4444'};
        font-family: 'Inter', sans-serif;
        font-size: 0.95rem;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

/* ========================================
   SMOOTH SCROLL
   ======================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

// Debounce function
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add animation styles dynamically
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .notification-icon {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: currentColor;
        color: #0a0a0f;
        border-radius: 50%;
        font-weight: bold;
        font-size: 0.8rem;
    }
`;
document.head.appendChild(animationStyles);

/* ========================================
   PERFORMANCE OPTIMIZATIONS
   ======================================== */

// Lazy load images (if any)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Preload critical resources
function preloadResource(url, type) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = type;
    document.head.appendChild(link);
}

// Console branding
console.log('%c AS Marketers ', 'background: linear-gradient(135deg, #00f5ff, #b829dd); color: #0a0a0f; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 5px;');
console.log('%c Ingeniería de Sistemas & Marketing Digital con IA ', 'color: #00f5ff; font-size: 12px;');
