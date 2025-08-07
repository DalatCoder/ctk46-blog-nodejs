// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    
    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            nav.classList.toggle('nav-open');
            hamburger.classList.toggle('active');
        });
    }

    // Initialize dark mode
    initializeDarkMode();
});

// Dark Mode Functionality
function initializeDarkMode() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }
    
    // Theme toggle event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            html.classList.toggle('dark');
            
            // Save theme preference
            if (html.classList.contains('dark')) {
                localStorage.setItem('theme', 'dark');
                showNotification('Đã chuyển sang chế độ tối', 'success');
            } else {
                localStorage.setItem('theme', 'light');
                showNotification('Đã chuyển sang chế độ sáng', 'success');
            }
            
            // Add smooth transition
            document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
            setTimeout(() => {
                document.body.style.transition = '';
            }, 300);
        });
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                html.classList.add('dark');
            } else {
                html.classList.remove('dark');
            }
        }
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Newsletter form submission
const newsletterForms = document.querySelectorAll('.newsletter-form, .newsletter-widget form');
newsletterForms.forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        
        if (email) {
            // Simulate API call
            showNotification('Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi thông báo về bài viết mới.', 'success');
            this.reset();
        }
    });
});

// Contact form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic form validation
        const name = this.querySelector('#name').value;
        const email = this.querySelector('#email').value;
        const message = this.querySelector('#message').value;
        
        if (name && email && message) {
            // Simulate form submission
            showNotification('Tin nhắn của bạn đã được gửi thành công! Chúng tôi sẽ phản hồi sớm.', 'success');
            this.reset();
        } else {
            showNotification('Vui lòng điền đầy đủ thông tin bắt buộc.', 'error');
        }
    });
}

// Comment form submission
const commentForm = document.querySelector('.comment-form');
if (commentForm) {
    commentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const comment = this.querySelector('textarea').value;
        
        if (name && email && comment) {
            // Create new comment element
            const newComment = createCommentElement(name, comment);
            const commentsContainer = document.querySelector('.comments-section');
            const existingComments = commentsContainer.querySelector('.comment');
            
            if (existingComments) {
                existingComments.parentNode.insertBefore(newComment, existingComments);
            } else {
                commentsContainer.insertBefore(newComment, commentForm);
            }
            
            showNotification('Bình luận của bạn đã được thêm!', 'success');
            this.reset();
        } else {
            showNotification('Vui lòng điền đầy đủ thông tin.', 'error');
        }
    });
}

// Create comment element
function createCommentElement(name, comment) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    commentDiv.innerHTML = `
        <div class="comment-avatar">
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face" alt="User">
        </div>
        <div class="comment-content">
            <div class="comment-header">
                <h4>${name}</h4>
                <span class="comment-date">Vừa xong</span>
            </div>
            <p>${comment}</p>
            <div class="comment-actions">
                <button class="like-btn"><i class="fas fa-thumbs-up"></i> 0</button>
                <button class="reply-btn">Trả lời</button>
            </div>
        </div>
    `;
    
    // Add event listeners to the new comment
    const likeBtn = commentDiv.querySelector('.like-btn');
    likeBtn.addEventListener('click', function() {
        const currentLikes = parseInt(this.textContent.split(' ')[1]);
        this.innerHTML = `<i class="fas fa-thumbs-up"></i> ${currentLikes + 1}`;
        this.style.color = 'var(--primary-color)';
    });
    
    return commentDiv;
}

// Like button functionality for existing comments
document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const currentLikes = parseInt(this.textContent.split(' ')[1]);
        this.innerHTML = `<i class="fas fa-thumbs-up"></i> ${currentLikes + 1}`;
        this.style.color = 'var(--primary-color)';
    });
});

// FAQ toggle functionality
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function() {
        const faqItem = this.parentElement;
        const answer = faqItem.querySelector('.faq-answer');
        const icon = this.querySelector('i');
        
        // Toggle answer visibility
        if (answer.style.display === 'block') {
            answer.style.display = 'none';
            icon.classList.remove('fa-minus');
            icon.classList.add('fa-plus');
        } else {
            // Close all other FAQ items
            document.querySelectorAll('.faq-answer').forEach(ans => {
                ans.style.display = 'none';
            });
            document.querySelectorAll('.faq-question i').forEach(ic => {
                ic.classList.remove('fa-minus');
                ic.classList.add('fa-plus');
            });
            
            // Open current item
            answer.style.display = 'block';
            icon.classList.remove('fa-plus');
            icon.classList.add('fa-minus');
        }
    });
});

// Copy link functionality
document.querySelectorAll('.share-btn.copy').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Copy current URL to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('Link đã được sao chép!', 'success');
        }).catch(() => {
            showNotification('Không thể sao chép link.', 'error');
        });
    });
});

// Search functionality (if search input exists)
const searchInput = document.querySelector('.search-input');
if (searchInput) {
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const articles = document.querySelectorAll('.article-card');
        
        articles.forEach(article => {
            const title = article.querySelector('.article-title').textContent.toLowerCase();
            const excerpt = article.querySelector('.article-excerpt').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
                article.style.display = 'block';
            } else {
                article.style.display = 'none';
            }
        });
    });
}

// Lazy loading for images
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// Reading progress indicator
if (document.querySelector('.post-article')) {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--primary-color);
        z-index: 9999;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const article = document.querySelector('.post-article');
        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        const progress = Math.min(
            Math.max((scrollTop - articleTop + windowHeight) / articleHeight, 0),
            1
        );
        
        progressBar.style.width = (progress * 100) + '%';
    });
}

// Back to top button
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopBtn.className = 'back-to-top fixed bottom-6 right-6 w-12 h-12 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 invisible z-50';
backToTopBtn.setAttribute('aria-label', 'Lên đầu trang');

document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.remove('opacity-0', 'invisible');
        backToTopBtn.classList.add('opacity-100', 'visible');
    } else {
        backToTopBtn.classList.add('opacity-0', 'invisible');
        backToTopBtn.classList.remove('opacity-100', 'visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Dark mode toggle (optional feature)
const darkModeToggle = document.createElement('button');
darkModeToggle.innerHTML = '<i class="fas fa-adjust"></i>';
darkModeToggle.className = 'dark-mode-toggle fixed top-1/2 right-6 w-12 h-12 bg-slate-800 dark:bg-slate-600 hover:bg-slate-700 dark:hover:bg-slate-500 text-white rounded-full shadow-lg transition-all duration-300 z-50 transform -translate-y-1/2 lg:block hidden';
darkModeToggle.setAttribute('aria-label', 'Chuyển đổi chế độ sáng/tối');

// Check for saved theme preference
const currentTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (currentTheme === 'dark' || (!currentTheme && systemPrefersDark)) {
    document.documentElement.classList.add('dark');
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
} else {
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
}

darkModeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    
    if (document.documentElement.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        showNotification('Đã chuyển sang chế độ tối', 'success');
    } else {
        localStorage.setItem('theme', 'light');
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        showNotification('Đã chuyển sang chế độ sáng', 'success');
    }
});

document.body.appendChild(darkModeToggle);

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize tooltips (if any)
document.querySelectorAll('[data-tooltip]').forEach(element => {
    element.addEventListener('mouseenter', function() {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = this.dataset.tooltip;
        tooltip.style.cssText = `
            position: absolute;
            background: var(--text-primary);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 0.875rem;
            white-space: nowrap;
            z-index: 1000;
            pointer-events: none;
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = this.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    });
    
    element.addEventListener('mouseleave', function() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            document.body.removeChild(tooltip);
        }
    });
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll events
const debouncedScrollHandler = debounce(() => {
    // Any scroll-related logic here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Service Worker registration (for offline support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Analytics tracking (placeholder)
function trackEvent(eventName, eventData) {
    // Google Analytics or other tracking service
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
}

// Track article reads
if (document.querySelector('.post-article')) {
    let hasTrackedRead = false;
    
    window.addEventListener('scroll', () => {
        if (!hasTrackedRead && window.pageYOffset > 1000) {
            trackEvent('article_read', {
                'article_title': document.querySelector('.post-title').textContent
            });
            hasTrackedRead = true;
        }
    });
}

// FAQ functionality
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('i');
            
            // Toggle answer visibility
            if (answer.classList.contains('hidden')) {
                answer.classList.remove('hidden');
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
                icon.style.transform = 'rotate(180deg)';
            } else {
                answer.classList.add('hidden');
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key to close modals or navigate up
    if (e.key === 'Escape') {
        // Close any open modals or dropdowns
        document.querySelectorAll('.modal, .dropdown').forEach(el => {
            el.style.display = 'none';
        });
    }
    
    // Arrow keys for navigation in galleries
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const activeImage = document.querySelector('.gallery-image.active');
        if (activeImage) {
            e.preventDefault();
            // Navigate through gallery images
        }
    }
});

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeForms();
    initializeBackToTop();
    initializeFAQ();
    
    // Check for saved theme preference or default to system preference
    const currentTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const themeToggle = document.getElementById('theme-toggle');
    
    if (currentTheme === 'dark' || (!currentTheme && systemPrefersDark)) {
        document.documentElement.classList.add('dark');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun text-slate-600 dark:text-slate-300"></i>';
        }
    }
    
    // Theme toggle functionality
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            
            if (document.documentElement.classList.contains('dark')) {
                localStorage.setItem('theme', 'dark');
                themeToggle.innerHTML = '<i class="fas fa-sun text-slate-600 dark:text-slate-300"></i>';
                showNotification('Đã chuyển sang chế độ tối', 'success');
            } else {
                localStorage.setItem('theme', 'light');
                themeToggle.innerHTML = '<i class="fas fa-moon text-slate-600 dark:text-slate-300"></i>';
                showNotification('Đã chuyển sang chế độ sáng', 'success');
            }
        });
    }
});

console.log('Blog JavaScript loaded successfully!');
