# Blog Cá Nhân - Website Tĩnh với Tailwind CSS

Một website blog cá nhân tĩnh được xây dựng với Tailwind CSS, thiết kế hiện đại, responsive và đầy đủ tính năng, bao gồm hỗ trợ chế độ sáng/tối hoàn chỉnh.

## 🌟 Tính năng

### Giao diện người dùng
- ✅ Thiết kế responsive hoàn toàn với Tailwind CSS
- ✅ **Dark/Light Mode** - Chế độ sáng/tối với toggle button
- ✅ Header với navigation sticky và theme switcher
- ✅ Hero section bắt mắt với gradient background
- ✅ Grid layout cho bài viết sử dụng Tailwind Grid
- ✅ Footer đầy đủ thông tin với dark mode support
- ✅ Trang về tôi với thông tin cá nhân
- ✅ Trang liên hệ với form và FAQ
- ✅ Trang chi tiết bài viết với bình luận

### Công nghệ sử dụng
- ✅ **Tailwind CSS** - Framework CSS utility-first với dark mode
- ✅ **Tailwind CDN** - Tích hợp nhanh chóng
- ✅ **Custom CSS** - Bổ sung cho các animation và component đặc biệt
- ✅ **Font Inter** - Typography hiện đại từ Google Fonts
- ✅ **Font Awesome** - Icon library

### Tính năng tương tác
- ✅ Mobile navigation menu với hamburger
- ✅ Smooth scrolling
- ✅ Form submission (newsletter, contact, comments)
- ✅ FAQ toggle với animation
- ✅ Social sharing buttons
- ✅ Copy link functionality
- ✅ Back to top button với dark mode support
- ✅ Reading progress indicator
- ✅ **Dark mode toggle** - Chuyển đổi chế độ sáng/tối với localStorage
- ✅ **System theme detection** - Tự động phát hiện tùy chọn hệ thống
- ✅ Notification system với dark mode

### Tối ưu hóa
- ✅ Tailwind utility classes cho performance cao
- ✅ Dark mode với smooth transitions
- ✅ Tailwind darkMode: 'class' configuration
- ✅ Lazy loading cho hình ảnh
- ✅ Debounced scroll events
- ✅ Accessibility support
- ✅ Print-friendly styles
- ✅ SEO-ready markup

## 📁 Cấu trúc thư mục

```
static-web/
├── index.html          # Trang chủ
├── about.html          # Trang về tôi
├── contact.html        # Trang liên hệ
├── post.html           # Trang chi tiết bài viết
├── css/
│   ├── custom.css      # CSS tùy chỉnh bổ sung cho Tailwind
│   └── style.css       # CSS cũ (có thể xóa)
├── js/
│   └── script.js       # File JavaScript chính
└── README.md           # Hướng dẫn sử dụng
```

## 🚀 Cách sử dụng

### 1. Chạy website
- Mở file `index.html` trong trình duyệt web
- Hoặc sử dụng Live Server trong VS Code để phát triển

### 2. Tùy chỉnh với Tailwind CSS

#### Sử dụng Tailwind Classes:
Website sử dụng Tailwind CSS qua CDN với cấu hình tùy chỉnh:
```html
<script>
    tailwind.config = {
        theme: {
            extend: {
                fontFamily: {
                    'inter': ['Inter', 'sans-serif'],
                },
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
</script>
```

#### Thay đổi màu sắc:
Sửa trong tailwind.config hoặc sử dụng các class có sẵn:
- `bg-blue-600` → `bg-green-600` (thay đổi màu background)
- `text-blue-600` → `text-purple-600` (thay đổi màu text)
- `border-blue-600` → `border-red-600` (thay đổi màu border)

### 3. Tùy chỉnh hình ảnh

Thay thế các URL hình ảnh từ Unsplash bằng hình ảnh của bạn:
- Ảnh hero section
- Ảnh bài viết
- Ảnh cá nhân
- Favicon

## 🎨 Thiết kế với Tailwind CSS

### Utility Classes được sử dụng
- **Layout**: `flex`, `grid`, `container`, `max-w-6xl`
- **Spacing**: `p-5`, `m-4`, `space-y-4`, `gap-8`
- **Typography**: `text-4xl`, `font-bold`, `leading-relaxed`
- **Colors**: `bg-blue-600`, `text-slate-800`, `border-gray-200`
- **Effects**: `shadow-lg`, `hover:shadow-xl`, `transition-all`
- **Responsive**: `md:text-6xl`, `lg:grid-cols-4`, `sm:flex-row`

### Responsive Design
- **Mobile-first**: Thiết kế từ mobile lên desktop
- **Breakpoints**: `sm:` (640px+), `md:` (768px+), `lg:` (1024px+)
- **Grid responsive**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`

### Color Palette
- **Primary**: `blue-600` (#2563eb)
- **Secondary**: `slate-600` (#475569)
- **Background**: `slate-50` (#f8fafc)
- **Text**: `slate-800` (#1e293b)
- **Accent**: Đa dạng theo danh mục (green, purple, orange)

## 📱 Responsive với Tailwind

### Breakpoints
```css
/* Mobile First Approach */
/* Default: < 640px (mobile) */
.class

/* Small devices: ≥ 640px */
sm:class

/* Medium devices: ≥ 768px */
md:class  

/* Large devices: ≥ 1024px */
lg:class

/* Extra large: ≥ 1280px */
xl:class
```

### Ví dụ responsive classes:
- `text-2xl md:text-4xl lg:text-6xl` - Text size responsive
- `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` - Grid responsive  
- `flex-col lg:flex-row` - Flex direction responsive
- `hidden md:block` - Hiện/ẩn theo device

## 🔧 Tính năng JavaScript

### Core Features (giữ nguyên)
- Mobile navigation toggle
- Smooth scrolling  
- Form handling
- FAQ accordion
- Dark mode
- Back to top
- Reading progress

### Tích hợp với Tailwind
- Dynamic class manipulation
- Responsive utilities
- Animation classes

## 🌐 Triển khai

### Hosting tĩnh
Website có thể được triển khai trên:
- **GitHub Pages**
- **Netlify**
- **Vercel**
- **Firebase Hosting**

### Chuẩn bị triển khai
1. Đảm bảo tất cả links là relative
2. Tối ưu hình ảnh
3. Minify CSS/JS (tùy chọn)
4. Thêm meta tags SEO
5. Tạo sitemap.xml
6. Thêm Google Analytics (tùy chọn)

## 📈 SEO & Performance

### SEO Ready
- Semantic HTML markup
- Meta tags đầy đủ
- Open Graph tags
- Schema markup ready
- Clean URL structure

### Performance
- Optimized CSS
- Minimal JavaScript
- Image lazy loading
- Efficient animations
- Fast loading times

## 🛠️ Mở rộng

### Thêm tính năng mới
- Search functionality
- Category filtering
- Tag system
- Related posts
- Comments system với backend
- Newsletter integration
- Analytics tracking

### Tích hợp CMS
- Headless CMS (Strapi, Contentful)
- Static site generators (Jekyll, Hugo)
- JAMstack solutions

## 📝 License

MIT License - Bạn có thể sử dụng tự do cho dự án cá nhân và thương mại.

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh! Hãy tạo issue hoặc pull request.

## 📞 Hỗ trợ

Nếu bạn gặp vấn đề hoặc có câu hỏi, hãy tạo issue trên GitHub hoặc liên hệ qua email.

---

**Chúc bạn có một website blog tuyệt vời! 🎉**
