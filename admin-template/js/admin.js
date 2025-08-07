// Admin Panel JavaScript Functions

document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initializeTheme();
    
    // Initialize sidebar
    initializeSidebar();
    
    // Initialize user menu
    initializeUserMenu();
    
    // Initialize charts if on dashboard
    if (document.getElementById('viewsChart')) {
        initializeCharts();
    }
    
    // Initialize select all checkbox for comments page
    if (document.getElementById('selectAll')) {
        initializeSelectAll();
    }
});

// Theme Management
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('admin-theme') || 'light';
    html.classList.toggle('dark', savedTheme === 'dark');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const isDark = html.classList.contains('dark');
            html.classList.toggle('dark', !isDark);
            localStorage.setItem('admin-theme', !isDark ? 'dark' : 'light');
        });
    }
}

// Sidebar Management
function initializeSidebar() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.remove('-translate-x-full');
            if (overlay) overlay.classList.remove('hidden');
        });
    }
    
    if (sidebarClose) {
        sidebarClose.addEventListener('click', function() {
            sidebar.classList.add('-translate-x-full');
            if (overlay) overlay.classList.add('hidden');
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', function() {
            sidebar.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
        });
    }
}

// User Menu Management
function initializeUserMenu() {
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenu = document.getElementById('user-menu');
    
    if (userMenuButton && userMenu) {
        userMenuButton.addEventListener('click', function() {
            userMenu.classList.toggle('hidden');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!userMenuButton.contains(e.target) && !userMenu.contains(e.target)) {
                userMenu.classList.add('hidden');
            }
        });
    }
}

// Charts Initialization
function initializeCharts() {
    // Views Chart
    const ctx = document.getElementById('viewsChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
                datasets: [{
                    label: 'Lượt xem',
                    data: [120, 190, 300, 500, 200, 300, 450],
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(148, 163, 184, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(148, 163, 184, 0.1)'
                        }
                    }
                }
            }
        });
    }
}

// Select All Functionality
function initializeSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const itemCheckboxes = document.querySelectorAll('input[type="checkbox"]:not(#selectAll)');
    
    selectAllCheckbox.addEventListener('change', function() {
        itemCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
    });
    
    itemCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedCount = document.querySelectorAll('input[type="checkbox"]:not(#selectAll):checked').length;
            selectAllCheckbox.checked = checkedCount === itemCheckboxes.length;
            selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < itemCheckboxes.length;
        });
    });
}

// Modal Management
function openCreateModal() {
    const modal = document.getElementById('createModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeCreateModal() {
    const modal = document.getElementById('createModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// Posts Management Functions
function viewPost(id) {
    console.log('Viewing post:', id);
    // Implement view post functionality
    window.open('../post.html', '_blank');
}

function editPost(id) {
    console.log('Editing post:', id);
    // Implement edit post functionality
    showNotification('Chức năng sửa bài viết đang được phát triển', 'info');
}

function deletePost(id) {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
        console.log('Deleting post:', id);
        // Implement delete post functionality
        showNotification('Bài viết đã được xóa', 'success');
    }
}

function publishPost(id) {
    if (confirm('Bạn có chắc chắn muốn xuất bản bài viết này?')) {
        console.log('Publishing post:', id);
        // Implement publish post functionality
        showNotification('Bài viết đã được xuất bản', 'success');
    }
}

// Comments Management Functions
function approveComment(id) {
    console.log('Approving comment:', id);
    // Implement approve comment functionality
    showNotification('Bình luận đã được duyệt', 'success');
}

function rejectComment(id) {
    console.log('Rejecting comment:', id);
    // Implement reject comment functionality
    showNotification('Bình luận đã bị từ chối', 'warning');
}

function markAsSpam(id) {
    console.log('Marking comment as spam:', id);
    // Implement mark as spam functionality
    showNotification('Bình luận đã được đánh dấu là spam', 'error');
}

function editComment(id) {
    console.log('Editing comment:', id);
    // Implement edit comment functionality
    showNotification('Chức năng sửa bình luận đang được phát triển', 'info');
}

function deleteComment(id) {
    if (confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
        console.log('Deleting comment:', id);
        // Implement delete comment functionality
        showNotification('Bình luận đã được xóa', 'success');
    }
}

function approveSelected() {
    const selected = getSelectedItems();
    if (selected.length === 0) {
        showNotification('Vui lòng chọn ít nhất một bình luận', 'warning');
        return;
    }
    
    if (confirm(`Bạn có chắc chắn muốn duyệt ${selected.length} bình luận đã chọn?`)) {
        console.log('Approving selected comments:', selected);
        showNotification(`Đã duyệt ${selected.length} bình luận`, 'success');
    }
}

function deleteSelected() {
    const selected = getSelectedItems();
    if (selected.length === 0) {
        showNotification('Vui lòng chọn ít nhất một bình luận', 'warning');
        return;
    }
    
    if (confirm(`Bạn có chắc chắn muốn xóa ${selected.length} bình luận đã chọn?`)) {
        console.log('Deleting selected comments:', selected);
        showNotification(`Đã xóa ${selected.length} bình luận`, 'success');
    }
}

function getSelectedItems() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:not(#selectAll):checked');
    return Array.from(checkboxes).map((checkbox, index) => index + 1);
}

// Categories Management Functions
function createCategory() {
    console.log('Creating new category');
    showNotification('Chức năng tạo danh mục đang được phát triển', 'info');
}

function editCategory(id) {
    console.log('Editing category:', id);
    showNotification('Chức năng sửa danh mục đang được phát triển', 'info');
}

function deleteCategory(id) {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
        console.log('Deleting category:', id);
        showNotification('Danh mục đã được xóa', 'success');
    }
}

// Tags Management Functions
function createTag() {
    console.log('Creating new tag');
    showNotification('Chức năng tạo thẻ đang được phát triển', 'info');
}

function editTag(id) {
    console.log('Editing tag:', id);
    showNotification('Chức năng sửa thẻ đang được phát triển', 'info');
}

function deleteTag(id) {
    if (confirm('Bạn có chắc chắn muốn xóa thẻ này?')) {
        console.log('Deleting tag:', id);
        showNotification('Thẻ đã được xóa', 'success');
    }
}

// Users Management Functions
function createUser() {
    console.log('Creating new user');
    showNotification('Chức năng tạo người dùng đang được phát triển', 'info');
}

function editUser(id) {
    console.log('Editing user:', id);
    showNotification('Chức năng sửa người dùng đang được phát triển', 'info');
}

function deleteUser(id) {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
        console.log('Deleting user:', id);
        showNotification('Người dùng đã được xóa', 'success');
    }
}

function changeUserRole(id, role) {
    console.log('Changing user role:', id, role);
    showNotification(`Quyền người dùng đã được thay đổi thành ${role}`, 'success');
}

// Newsletter Management Functions
function exportSubscribers() {
    console.log('Exporting newsletter subscribers');
    showNotification('Đang xuất danh sách đăng ký...', 'info');
}

function sendNewsletter() {
    console.log('Sending newsletter');
    showNotification('Chức năng gửi newsletter đang được phát triển', 'info');
}

function deleteSubscriber(id) {
    if (confirm('Bạn có chắc chắn muốn xóa người đăng ký này?')) {
        console.log('Deleting subscriber:', id);
        showNotification('Người đăng ký đã được xóa', 'success');
    }
}

// Settings Management Functions
function saveSettings() {
    console.log('Saving settings');
    showNotification('Cài đặt đã được lưu', 'success');
}

function resetSettings() {
    if (confirm('Bạn có chắc chắn muốn khôi phục cài đặt mặc định?')) {
        console.log('Resetting settings');
        showNotification('Cài đặt đã được khôi phục về mặc định', 'success');
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white max-w-sm transform transition-all duration-300 translate-x-full`;
    
    // Set notification style based on type
    switch (type) {
        case 'success':
            notification.classList.add('bg-green-600');
            break;
        case 'error':
            notification.classList.add('bg-red-600');
            break;
        case 'warning':
            notification.classList.add('bg-yellow-600');
            break;
        default:
            notification.classList.add('bg-blue-600');
    }
    
    notification.innerHTML = `
        <div class="flex items-center">
            <span class="flex-1">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Utility Functions
function formatDate(date) {
    return new Date(date).toLocaleDateString('vi-VN');
}

function formatNumber(num) {
    return num.toLocaleString('vi-VN');
}

function truncateText(text, length = 100) {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

// Form Validation
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('border-red-500');
            isValid = false;
        } else {
            input.classList.remove('border-red-500');
        }
    });
    
    return isValid;
}

// Search and Filter Functions
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

// Auto-save functionality for forms
function enableAutoSave(formElement, saveFunction) {
    const inputs = formElement.querySelectorAll('input, select, textarea');
    const debouncedSave = debounce(saveFunction, 2000);
    
    inputs.forEach(input => {
        input.addEventListener('input', debouncedSave);
        input.addEventListener('change', debouncedSave);
    });
}

// Settings functionality
function saveSettings() {
    showNotification('Đã lưu cài đặt thành công!', 'success');
    // TODO: Implement real API call to save settings
}

function resetSettings() {
    if (confirm('Bạn có chắc muốn khôi phục cài đặt về mặc định?')) {
        showNotification('Đã khôi phục cài đặt mặc định!', 'info');
        // TODO: Reset form to default values
    }
}

// Newsletter functionality
function exportSubscribers() {
    showNotification('Đang xuất danh sách người đăng ký...', 'info');
    // TODO: Implement export functionality
}

function importSubscribers() {
    showNotification('Đang nhập danh sách người đăng ký...', 'info');
    // TODO: Implement import functionality
}

function toggleSubscriber(id) {
    const checkbox = document.querySelector(`input[data-id="${id}"]`);
    const status = checkbox.checked ? 'active' : 'inactive';
    showNotification(`Đã ${status === 'active' ? 'kích hoạt' : 'vô hiệu hóa'} người đăng ký!`, 'success');
    // TODO: Update status via API
}

function deleteSubscriber(id) {
    if (confirm('Bạn có chắc muốn xóa người đăng ký này?')) {
        showNotification('Đã xóa người đăng ký!', 'success');
        // TODO: Delete via API and remove from DOM
    }
}

function sendNewsletter() {
    if (confirm('Bạn có chắc muốn gửi newsletter đến tất cả người đăng ký?')) {
        showNotification('Đang gửi newsletter...', 'info');
        // TODO: Implement send newsletter functionality
        setTimeout(() => {
            showNotification('Đã gửi newsletter thành công!', 'success');
        }, 2000);
    }
}

// Users functionality
function editUser(id) {
    showNotification(`Đang mở form chỉnh sửa người dùng ID: ${id}`, 'info');
    // TODO: Open edit user modal
}

function deleteUser(id) {
    if (confirm('Bạn có chắc muốn xóa người dùng này?')) {
        showNotification('Đã xóa người dùng!', 'success');
        // TODO: Delete via API and remove from DOM
    }
}

function toggleUserStatus(id) {
    const user = document.querySelector(`[data-user-id="${id}"]`);
    const currentStatus = user.querySelector('.status').textContent.trim();
    const newStatus = currentStatus === 'Hoạt động' ? 'Đã khóa' : 'Hoạt động';
    showNotification(`Đã ${newStatus === 'Hoạt động' ? 'mở khóa' : 'khóa'} người dùng!`, 'success');
    // TODO: Update status via API
}

function createUser() {
    showNotification('Đang mở form tạo người dùng mới...', 'info');
    // TODO: Open create user modal
}

// Tags functionality
function editTag(id) {
    showNotification(`Đang mở form chỉnh sửa thẻ ID: ${id}`, 'info');
    // TODO: Open edit tag modal
}

function deleteTag(id) {
    if (confirm('Bạn có chắc muốn xóa thẻ này?')) {
        showNotification('Đã xóa thẻ!', 'success');
        // TODO: Delete via API and remove from DOM
    }
}

function createTag() {
    showNotification('Đang mở form tạo thẻ mới...', 'info');
    // TODO: Open create tag modal
}
