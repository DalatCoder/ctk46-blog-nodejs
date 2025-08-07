# Tài Liệu Kỹ Thuật - Website Blog Cá Nhân

## 📋 Tổng Quan Dự Án

### Thông Tin Cơ Bản
- **Tên dự án**: MyBlog - Website Blog Cá Nhân
- **Loại**: Static Website
- **Ngôn ngữ**: Tiếng Việt
- **Phiên bản**: 2.0 (với Dark Mode)
- **Ngày cập nhật**: Tháng 7, 2024

### Mô Tả
Website blog cá nhân tĩnh được xây dựng với HTML5, Tailwind CSS và JavaScript. Hỗ trợ chế độ sáng/tối, responsive design và các tính năng tương tác hiện đại.

## 🏗️ Kiến Trúc Hệ Thống

### Cấu Trúc Thư Mục
```
static-web/
├── index.html                  # Trang chủ
├── about.html                  # Trang giới thiệu
├── contact.html                # Trang liên hệ
├── post.html                   # Trang chi tiết bài viết
├── css/
│   └── custom.css             # Custom CSS cho Tailwind
├── js/
│   └── script.js              # JavaScript functionality
├── README.md                  # Hướng dẫn sử dụng
└── TECHNICAL_DOCUMENTATION.md # Tài liệu kỹ thuật
```

### Mô Hình Kiến Trúc
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   HTML Pages    │    │   Tailwind CSS  │    │   JavaScript    │
│                 │    │                 │    │                 │
│ • index.html    │◄───┤ • CDN Import    │◄───┤ • script.js     │
│ • about.html    │    │ • Dark Mode     │    │ • DOM Events    │
│ • contact.html  │    │ • Responsive    │    │ • Interactivity │
│ • post.html     │    │ • Custom CSS    │    │ • Theme Toggle  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  External CDNs  │
                    │                 │
                    │ • Font Awesome  │
                    │ • Google Fonts  │
                    │ • Unsplash API  │
                    └─────────────────┘
```

## 🛠️ Công Nghệ Sử Dụng

### Frontend Technologies
| Công nghệ | Phiên bản | Mục đích | Nguồn |
|-----------|-----------|----------|-------|
| HTML5 | Latest | Markup cấu trúc | W3C Standard |
| Tailwind CSS | 3.x | Styling framework | CDN |
| JavaScript | ES6+ | Interactivity | Native |
| Font Awesome | 6.0.0 | Icon library | CDN |
| Google Fonts | Latest | Typography (Inter) | CDN |

### Development Tools
- **Editor**: VS Code
- **Browser Testing**: Chrome, Firefox, Safari, Edge
- **Responsive Testing**: DevTools
- **Performance**: Lighthouse

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
/* Base styles: 0px and up (mobile) */

/* Tablet: 768px and up */
@media (min-width: 768px) { ... }

/* Desktop: 1024px and up */
@media (min-width: 1024px) { ... }

/* Large Desktop: 1280px and up */
@media (min-width: 1280px) { ... }
```

### Grid System
- **Mobile**: 1 cột
- **Tablet**: 2 cột
- **Desktop**: 2-4 cột tùy section

### Layout Strategy
```
Mobile:     [====]
            [====]
            [====]

Tablet:     [===][===]
            [===][===]

Desktop:    [==][==][==][==]
```

## 🌙 Dark Mode Implementation

### Cấu Hình Tailwind
```javascript
tailwind.config = {
    darkMode: 'class',  // Class-based dark mode
    theme: {
        extend: {
            colors: {
                'primary': {
                    50: '#eff6ff',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                }
            }
        }
    }
}
```

### Color Scheme
| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | `bg-white` | `dark:bg-slate-900` |
| Text | `text-slate-800` | `dark:text-slate-200` |
| Cards | `bg-white` | `dark:bg-slate-700` |
| Header | `bg-white` | `dark:bg-slate-800` |
| Borders | `border-slate-200` | `dark:border-slate-700` |

### Toggle Implementation
```javascript
// Theme detection và persistence
const currentTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Auto theme setting
if (currentTheme === 'dark' || (!currentTheme && systemPrefersDark)) {
    document.documentElement.classList.add('dark');
}

// Manual toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    // Save to localStorage...
});
```

## 📄 Cấu Trúc Trang

### 1. Trang Chủ (`index.html`)

#### Sections
1. **Header**: Navigation + Theme Toggle
2. **Hero**: Gradient background + CTA
3. **Articles**: Grid layout với 4 bài viết
4. **Newsletter**: Email subscription
5. **Footer**: Links + Contact info

#### Components
```html
<!-- Header Structure -->
<header class="bg-white dark:bg-slate-800 sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-5">
        <!-- Logo + Navigation + Theme Toggle -->
    </div>
</header>

<!-- Hero Structure -->
<section class="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800">
    <!-- Hero content -->
</section>
```

### 2. Trang Giới Thiệu (`about.html`)

#### Sections
1. **Header**: Consistent với trang chủ
2. **Hero**: Avatar + Intro text
3. **Content**: Story + Topics + Philosophy
4. **Sidebar**: Stats + Skills + Social links
5. **Footer**: Consistent

#### Key Features
- **Stats Cards**: Responsive grid
- **Skills Progress**: Animated bars
- **Social Integration**: Multiple platforms

### 3. Trang Liên Hệ (`contact.html`)

#### Sections
1. **Header**: Navigation
2. **Hero**: Contact intro
3. **Contact Info**: Methods grid
4. **Contact Form**: Validation + Styling
5. **FAQ**: Accordion functionality
6. **Footer**: Standard

#### Form Structure
```html
<form class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input type="text" class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg">
        <input type="email" class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg">
    </div>
    <!-- More fields -->
</form>
```

### 4. Trang Bài Viết (`post.html`)

#### Sections
1. **Header**: Navigation
2. **Post Hero**: Title + Meta + Breadcrumb
3. **Content**: Article body + Sidebar
4. **Comments**: Interactive section
5. **Footer**: Standard

## 🎨 Styling Architecture

### Tailwind Configuration
```javascript
// Custom colors
colors: {
    'primary': {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
    }
}

// Font family
fontFamily: {
    'inter': ['Inter', 'sans-serif'],
}
```

### Custom CSS (`custom.css`)
```css
/* Line clamp utility */
.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Smooth scrolling */
html {
    scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    @apply bg-slate-100 dark:bg-slate-800;
}

::-webkit-scrollbar-thumb {
    @apply bg-slate-300 dark:bg-slate-600 rounded-full;
}
```

### Animation Classes
```css
/* Fade in animation */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in-up {
    animation: fadeInUp 0.6s ease-out;
}
```

## ⚡ JavaScript Functionality

### Modules Overview
```javascript
// Main functions
1. initializeNavigation()    // Mobile menu toggle
2. initializeForms()         // Form validation & submission
3. initializeBackToTop()     // Smooth scroll to top
4. initializeFAQ()          // Accordion functionality
5. initializeDarkMode()     // Theme switching
```

### Navigation System
```javascript
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    
    hamburger.addEventListener('click', () => {
        nav.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}
```

### Form Handling
```javascript
function initializeForms() {
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        if (validateEmail(email)) {
            showNotification('Đăng ký thành công!', 'success');
        }
    });
    
    // Contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
}
```

### Theme Management
```javascript
// Theme persistence
function saveTheme(theme) {
    localStorage.setItem('theme', theme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return savedTheme || systemTheme;
}

// Theme application
function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    updateThemeToggle(theme);
}
```

### Notification System
```javascript
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
```

## 🔧 Performance Optimization

### Loading Strategy
1. **Critical CSS**: Inline Tailwind config
2. **Font Loading**: Google Fonts với `display=swap`
3. **Image Optimization**: Unsplash với size parameters
4. **Script Loading**: Defer non-critical JavaScript

### Best Practices
```html
<!-- Optimized font loading -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<!-- Optimized images -->
<img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=250&fit=crop&crop=center" 
     alt="Description" 
     loading="lazy">

<!-- Script optimization -->
<script src="js/script.js" defer></script>
```

### CSS Optimization
- **Utility-first**: Giảm CSS bundle size
- **Purge unused**: Production build sẽ remove unused classes
- **Critical path**: Inline critical styles

## 🚀 Deployment & Hosting

### Static Hosting Options
1. **GitHub Pages**: Miễn phí, CI/CD tự động
2. **Netlify**: Miễn phí, form handling
3. **Vercel**: Miễn phí, performance analytics
4. **Firebase Hosting**: Google infrastructure

### Build Process
```bash
# Development
python -m http.server 8000
# hoặc
npx serve .

# Production (nếu sử dụng Tailwind CLI)
npx tailwindcss -i ./src/input.css -o ./css/style.css --watch
```

### Deployment Checklist
- [ ] Kiểm tra responsive trên tất cả devices
- [ ] Test dark mode functionality
- [ ] Validate HTML/CSS
- [ ] Check performance với Lighthouse
- [ ] Test form submissions
- [ ] Verify SEO meta tags

## 🔍 SEO & Accessibility

### Meta Tags
```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog Cá Nhân - Trang Chủ</title>
    <meta name="description" content="Blog cá nhân chia sẻ kiến thức về công nghệ, du lịch và phát triển bản thân">
    <meta name="keywords" content="blog, công nghệ, du lịch, phát triển bản thân">
</head>
```

### Accessibility Features
- **Semantic HTML**: Proper heading hierarchy
- **Alt text**: Tất cả images có alt text
- **Color contrast**: WCAG AA compliant
- **Keyboard navigation**: Tab index support
- **Screen reader**: ARIA labels

### Structure Example
```html
<article>
    <header>
        <h1>Article Title</h1>
        <time datetime="2024-07-25">25 Tháng 7, 2024</time>
    </header>
    <main>
        <p>Article content...</p>
    </main>
</article>
```

## 🧪 Testing Strategy

### Browser Compatibility
| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Full support |
| Firefox | 88+ | ✅ Full support |
| Safari | 14+ | ✅ Full support |
| Edge | 90+ | ✅ Full support |

### Testing Checklist
- [ ] **Responsive**: Mobile, tablet, desktop
- [ ] **Dark mode**: Toggle functionality
- [ ] **Forms**: Validation and submission
- [ ] **Navigation**: All links work
- [ ] **Performance**: Page load speed
- [ ] **Accessibility**: Screen reader compatibility

### Manual Test Cases
1. **Theme Toggle**:
   - Click toggle button
   - Verify theme changes
   - Check localStorage persistence
   - Test system theme detection

2. **Responsive Navigation**:
   - Mobile hamburger menu
   - Touch interactions
   - Menu collapse/expand

3. **Form Validation**:
   - Required field validation
   - Email format validation
   - Success/error notifications

## 🔒 Security Considerations

### Input Validation
```javascript
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function sanitizeInput(input) {
    return input.replace(/[<>]/g, '');
}
```

### Content Security
- **XSS Prevention**: Input sanitization
- **HTTPS**: Secure connections
- **External Resources**: Trusted CDNs only

## 📊 Analytics & Monitoring

### Potential Integrations
```html
<!-- Google Analytics (nếu cần) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>

<!-- Performance monitoring -->
<script>
    window.addEventListener('load', () => {
        console.log('Page loaded in:', performance.now(), 'ms');
    });
</script>
```

## 🔧 Maintenance & Updates

### Regular Tasks
1. **Dependency Updates**: CDN versions
2. **Content Updates**: Blog posts, images
3. **Performance Monitoring**: Speed tests
4. **Security Checks**: Vulnerability scans

### Version Control
```bash
# Git workflow
git add .
git commit -m "feat: add dark mode functionality"
git push origin main
```

### Backup Strategy
- **Code**: Git repository
- **Content**: Regular exports
- **Assets**: Cloud storage backup

## 📚 API Documentation

### LocalStorage API Usage
```javascript
// Theme preference
localStorage.setItem('theme', 'dark');
localStorage.getItem('theme');

// User preferences
localStorage.setItem('newsletter-subscribed', 'true');
```

### External APIs
1. **Unsplash**: Image hosting
2. **Google Fonts**: Web fonts
3. **Font Awesome**: Icons

## 🚀 Future Enhancements

### Planned Features
1. **Search Functionality**: Client-side search
2. **Categories Filter**: Dynamic filtering
3. **Reading Progress**: Article progress bar
4. **Social Sharing**: Native share API
5. **Offline Support**: Service worker
6. **PWA Features**: App-like experience

### Technical Debt
1. **CSS Optimization**: Custom Tailwind build
2. **JavaScript Modules**: ES6 imports
3. **Image Optimization**: WebP format
4. **CDN Migration**: Self-hosted assets

## 📞 Support & Contact

### Technical Support
- **Email**: contact@myblog.com
- **GitHub**: Repository issues
- **Documentation**: This file

### Contributing
1. Fork repository
2. Create feature branch
3. Submit pull request
4. Follow coding standards

---

**Tài liệu này được cập nhật thường xuyên. Phiên bản mới nhất luôn có sẵn trong repository.**

*Ngày cập nhật: 30 Tháng 7, 2024*
