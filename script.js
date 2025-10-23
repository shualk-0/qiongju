// 全局变量
let currentGalleryFilter = 'all';
let galleryImages = [];

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeLearningTabs();
    initializeGallery();
    initializeScrollAnimations();
    initializeImageUpload();
});

// 导航功能
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // 汉堡菜单切换
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // 点击导航链接后关闭移动菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 平滑滚动到对应区块
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // 考虑导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 滚动时高亮当前导航项
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    });
}

// 学习中心标签切换功能
function initializeLearningTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const categoryContents = document.querySelectorAll('.category-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');

            // 移除所有活动状态
            tabBtns.forEach(b => b.classList.remove('active'));
            categoryContents.forEach(content => content.classList.remove('active'));

            // 添加活动状态
            this.classList.add('active');
            document.getElementById(category).classList.add('active');
        });
    });
}

// 照片墙功能
let currentPhotoIndex = 0;
let photoWallImages = [];
let deletedImages = new Set(); // 存储已删除的图片路径

// 从localStorage加载已删除的图片列表
function loadDeletedImages() {
    const deleted = localStorage.getItem('deletedImages');
    if (deleted) {
        deletedImages = new Set(JSON.parse(deleted));
    }
}

// 保存已删除的图片列表到localStorage
function saveDeletedImages() {
    localStorage.setItem('deletedImages', JSON.stringify([...deletedImages]));
}

function initializeGallery() {
    // 加载已删除的图片列表
    loadDeletedImages();
    
    // 初始化整个网站的图片数据
    const allImages = [
        // 首页图片
        { src: '首页.jpg', title: '薪火琼传首页', description: '琼剧文化传承展示', path: '首页.jpg' },
        { src: '首页2.jpg', title: '琼剧文化展示', description: '琼剧文化传承展示', path: '首页2.jpg' },
        { src: '首页3.png', title: '琼剧艺术表演', description: '琼剧艺术表演', path: '首页3.png' },
        
        // 琼韵回响 - 琼艺洲图片
        { src: '琼艺洲4.png', title: '琼剧博物馆', description: '琼剧的起源和演变历程', path: '琼艺洲4.png' },
        { src: '琼艺洲5.jpg', title: '琼剧元宇宙', description: '预设元宇宙世界俯视图', path: '琼艺洲5.jpg' },
        { src: '琼艺洲6.png', title: '琼剧舞台布景', description: '传统舞台屋展现', path: '琼艺洲6.png' },
        
        // 多彩活动 - 琼剧商演图片
        { src: '商演1.jpg', title: '琼剧商演精彩瞬间', description: '琼剧商演活动展示', path: '商演1.jpg' },
        { src: '商演3.png', title: '商演活动现场', description: '琼剧商演精彩表演', path: '商演3.png' },
        { src: '商演5.png', title: '商演舞台表演', description: '专业琼剧商演展示', path: '商演5.png' },
        { src: '商演6.jpg', title: '商演艺术展示', description: '琼剧商演艺术魅力', path: '商演6.jpg' },
        
        // 多彩活动 - 琼剧惠演图片
        { src: '惠演1.jpg', title: '琼剧惠演活动', description: '琼剧惠演精彩瞬间', path: '惠演1.jpg' },
        { src: '惠演2.jpg', title: '惠演现场表演', description: '琼剧惠演艺术展示', path: '惠演2.jpg' },
        { src: '惠演3.png', title: '惠演舞台展示', description: '琼剧惠演舞台表演', path: '惠演3.png' },
        { src: '惠演4.png', title: '惠演艺术魅力', description: '琼剧惠演艺术魅力', path: '惠演4.png' },
        
        // 多彩活动 - 琼剧进校园图片
        { src: '进校园1.jpg', title: '琼剧进校园活动', description: '琼剧进校园精彩瞬间', path: '进校园1.jpg' },
        { src: '进校园3.jpg', title: '校园琼剧表演', description: '琼剧进校园艺术展示', path: '进校园3.jpg' },
        { src: '进校园5.png', title: '校园琼剧舞台', description: '琼剧进校园舞台表演', path: '进校园5.png' },
        { src: '进校园6.png', title: '校园琼剧艺术', description: '琼剧进校园艺术魅力', path: '进校园6.png' },
        
        // 文创产品图片
        { src: '折扇.jpg', title: '琼剧折扇', description: '琼剧文化创意产品', path: '折扇.jpg' },
        { src: '文创1.jpg', title: '琼剧书签', description: '琼剧文化创意书签', path: '文创1.jpg' },
        { src: '文创2.jpg', title: '琼剧冰箱贴', description: '琼剧文化创意冰箱贴', path: '文创2.jpg' },
        { src: '文创3.jpg', title: '琼剧明信片', description: '琼剧文化创意明信片', path: '文创3.jpg' },
        
       
    ];

    // 过滤掉已删除的图片
    photoWallImages = allImages.filter(image => !deletedImages.has(image.path));
    
    // 加载用户上传的图片
    loadUserImages();

    // 初始加载所有图片
    renderPhotoWallImages(photoWallImages);
}

// 删除照片
function deletePhoto(photoIndex) {
    if (confirm('确定要删除这张照片吗？')) {
        const deletedImage = photoWallImages[photoIndex];
        
        // 如果是原始图片，添加到已删除列表
        if (deletedImage && !deletedImage.isNew) {
            deletedImages.add(deletedImage.path);
            saveDeletedImages();
        } else if (deletedImage && deletedImage.isNew) {
            // 如果是用户上传的图片，从localStorage中移除
            saveUserImages();
        }
        
        // 从当前显示列表中移除
        photoWallImages.splice(photoIndex, 1);
        renderPhotoWallImages(photoWallImages);
        showNotification('照片已删除', 'success');
    }
}

// 渲染照片墙图片
function renderPhotoWallImages(images) {
    const photoWallGrid = document.getElementById('photo-wall-grid');
    if (!photoWallGrid) return;

    photoWallGrid.innerHTML = '';

    images.forEach((image, index) => {
        const photoItem = createPhotoItem(image, index);
        photoWallGrid.appendChild(photoItem);
    });
}

// 创建照片墙项目
function createPhotoItem(image, index) {
    const item = document.createElement('div');
    item.className = 'photo-item';
    item.setAttribute('data-index', index);

    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.title;
    img.onerror = function() {
        this.style.display = 'none';
        // 如果图片加载失败，显示占位符
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
            width: 100%;
            height: 200px;
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666;
            font-size: 0.9rem;
        `;
        placeholder.textContent = '图片加载中...';
        this.parentNode.replaceChild(placeholder, this);
    };

    const overlay = document.createElement('div');
    overlay.className = 'photo-overlay';
    
    const title = document.createElement('div');
    title.className = 'photo-title';
    title.textContent = image.title;
    
    // 删除按钮
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'photo-delete-btn';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.title = '删除照片';
    deleteBtn.onclick = function(e) {
        e.stopPropagation();
        deletePhoto(index);
    };

    overlay.appendChild(title);
    overlay.appendChild(deleteBtn);

    item.appendChild(img);
    item.appendChild(overlay);

    // 点击照片打开轮播
    item.addEventListener('click', function() {
        openPhotoModal(index);
    });

    return item;
}

// 打开照片轮播模态框
function openPhotoModal(photoIndex) {
    const modal = document.getElementById('photoModal');
    const slidesContainer = document.getElementById('photo-slides');
    const indicatorsContainer = document.getElementById('photo-indicators');
    
    if (!modal || !slidesContainer || !indicatorsContainer) return;
    
    // 清空轮播内容
    slidesContainer.innerHTML = '';
    indicatorsContainer.innerHTML = '';
    
    // 创建轮播图片
    photoWallImages.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = `photo-slide ${index === photoIndex ? 'active' : ''}`;
        
        const img = document.createElement('img');
        img.src = image.src;
        img.alt = image.title;
        
        slide.appendChild(img);
        slidesContainer.appendChild(slide);
        
        // 创建指示器
        const indicator = document.createElement('div');
        indicator.className = `photo-indicator ${index === photoIndex ? 'active' : ''}`;
        indicator.onclick = () => changePhotoTo(index);
        indicatorsContainer.appendChild(indicator);
    });
    
    currentPhotoIndex = photoIndex;
    updatePhotoInfo(photoWallImages[photoIndex]);
    
    // 显示模态框
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 关闭照片模态框
function closePhotoModal() {
    const modal = document.getElementById('photoModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// 切换照片
function changePhoto(direction) {
    const slides = document.querySelectorAll('.photo-slide');
    const indicators = document.querySelectorAll('.photo-indicator');
    
    if (slides.length === 0) return;
    
    // 移除当前活动状态
    slides[currentPhotoIndex].classList.remove('active');
    indicators[currentPhotoIndex].classList.remove('active');
    
    // 计算新索引
    currentPhotoIndex += direction;
    
    // 循环处理
    if (currentPhotoIndex >= slides.length) {
        currentPhotoIndex = 0;
    } else if (currentPhotoIndex < 0) {
        currentPhotoIndex = slides.length - 1;
    }
    
    // 添加新的活动状态
    slides[currentPhotoIndex].classList.add('active');
    indicators[currentPhotoIndex].classList.add('active');
    
    // 更新照片信息
    updatePhotoInfo(photoWallImages[currentPhotoIndex]);
}

// 直接跳转到指定照片
function changePhotoTo(index) {
    const slides = document.querySelectorAll('.photo-slide');
    const indicators = document.querySelectorAll('.photo-indicator');
    
    if (slides.length === 0) return;
    
    // 移除当前活动状态
    slides[currentPhotoIndex].classList.remove('active');
    indicators[currentPhotoIndex].classList.remove('active');
    
    // 设置新的活动状态
    currentPhotoIndex = index;
    slides[currentPhotoIndex].classList.add('active');
    indicators[currentPhotoIndex].classList.add('active');
    
    // 更新照片信息
    updatePhotoInfo(photoWallImages[currentPhotoIndex]);
}

// 更新照片信息
function updatePhotoInfo(image) {
    document.getElementById('photo-title').textContent = image.title;
    document.getElementById('photo-description').textContent = image.description;
}


// 渲染图片库图片
function renderGalleryImages(images) {
    const galleryGrid = document.getElementById('gallery-grid');
    if (!galleryGrid) return;

    galleryGrid.innerHTML = '';

    images.forEach((image, index) => {
        const galleryItem = createGalleryItem(image, index);
        galleryGrid.appendChild(galleryItem);
    });
}

// 创建图片库项目
function createGalleryItem(image, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.setAttribute('data-category', image.category);

    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.title;
    img.onerror = function() {
        this.style.display = 'none';
        // 如果图片加载失败，显示占位符
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
            width: 100%;
            height: 250px;
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666;
            font-size: 0.9rem;
        `;
        placeholder.textContent = '图片加载中...';
        this.parentNode.replaceChild(placeholder, this);
    };

    const overlay = document.createElement('div');
    overlay.className = 'gallery-overlay';
    const title = document.createElement('span');
    title.textContent = image.title;
    overlay.appendChild(title);

    item.appendChild(img);
    item.appendChild(overlay);

    // 点击图片放大查看
    item.addEventListener('click', function() {
        showImageModal(image);
    });

    return item;
}

// 图片模态框
function showImageModal(image) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: pointer;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        position: relative;
    `;

    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.title;
    img.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    `;

    const title = document.createElement('div');
    title.textContent = image.title;
    title.style.cssText = `
        color: white;
        text-align: center;
        margin-top: 20px;
        font-size: 1.2rem;
    `;

    const closeBtn = document.createElement('div');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        background: rgba(0, 0, 0, 0.5);
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
    `;

    modalContent.appendChild(img);
    modalContent.appendChild(title);
    modalContent.appendChild(closeBtn);
    modal.appendChild(modalContent);

    document.body.appendChild(modal);

    // 关闭模态框
    const closeModal = function() {
        document.body.removeChild(modal);
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });

    // ESC键关闭
    const handleKeyPress = function(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleKeyPress);
        }
    };
    document.addEventListener('keydown', handleKeyPress);
}

// 图片上传功能
function initializeImageUpload() {
    const fileInput = document.getElementById('image-upload');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            files.forEach(file => {
                if (file.type.startsWith('image/')) {
                    uploadPhotoToWall(file);
                }
            });
        });
    }
}

// 加载用户上传的图片
function loadUserImages() {
    const userImages = localStorage.getItem('userImages');
    if (userImages) {
        const images = JSON.parse(userImages);
        photoWallImages = photoWallImages.concat(images);
    }
}

// 保存用户上传的图片
function saveUserImages() {
    const userImages = photoWallImages.filter(img => img.isNew);
    localStorage.setItem('userImages', JSON.stringify(userImages));
}

// 重置图片库（恢复所有图片）
function resetPhotoWall() {
    if (confirm('确定要重置图片库吗？这将恢复所有被删除的图片，但会保留您上传的图片。')) {
        // 清空已删除列表
        deletedImages.clear();
        localStorage.removeItem('deletedImages');
        
        // 重新初始化图片库
        initializeGallery();
        
        showNotification('图片库已重置', 'success');
    }
}

// 上传照片到照片墙
function uploadPhotoToWall(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const newPhoto = {
            src: e.target.result,
            title: file.name.replace(/\.[^/.]+$/, ""), // 移除文件扩展名
            description: `新上传的照片：${file.name}`,
            path: file.name,
            isNew: true
        };

        // 添加到照片墙
        photoWallImages.push(newPhoto);
        
        // 保存到localStorage
        saveUserImages();
        
        // 重新渲染照片墙
        renderPhotoWallImages(photoWallImages);

        // 显示成功消息
        showNotification('照片上传成功！', 'success');
    };
    reader.readAsDataURL(file);
}

// 上传图片按钮点击事件
function uploadImages() {
    const fileInput = document.getElementById('image-upload');
    if (fileInput) {
        fileInput.click();
    }
}

// 滚动动画
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

        // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.news-card, .activity-card, .product-card, .video-card, .character-card, .gallery-item');
    animatedElements.forEach(el => observer.observe(el));
}

// 通知系统
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

        // 动画显示
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

        // 自动隐藏
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 搜索功能（可选）
function initializeSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
        searchInput.placeholder = '搜索内容...';
    searchInput.className = 'search-input';
    searchInput.style.cssText = `
        padding: 10px 15px;
        border: 2px solid #e9ecef;
        border-radius: 25px;
        width: 300px;
        max-width: 100%;
        margin: 20px auto;
        display: block;
        font-size: 1rem;
    `;

    // 可以将搜索框添加到导航栏或其他位置
    // document.querySelector('.nav-container').appendChild(searchInput);
}

// 图片预加载
function preloadImages() {
    const imageUrls = [
        'images/hero-bg.jpg',
        'images/news1.jpg',
        'images/news2.jpg',
        'images/news3.jpg'
    ];

    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// 性能优化：懒加载图片
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// 响应式图片处理
function handleResponsiveImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        img.addEventListener('error', function() {
            this.style.display = 'none';
        });
    });
}

// 初始化所有功能
window.addEventListener('load', function() {
    preloadImages();
    handleResponsiveImages();
    initializeLazyLoading();
});


// 视频播放功能
function playVideo(videoId) {
    const videoUrls = {
        'video1': 'videos/qiongju_basic_singing.mp4',
        'video2': 'videos/qiongju_performance_skills.mp4',
        'video3': 'videos/qiongju_costume_guide.mp4'
    };
    
    const videoTitle = {
        'video1': '琼剧基础唱腔教学',
        'video2': '琼剧表演技巧解析',
        'video3': '琼剧服装穿戴指南'
    };
    
    const videoUrl = videoUrls[videoId];
    const title = videoTitle[videoId];
    
    if (videoUrl) {
        showVideoModal(videoUrl, title);
    } else {
        showNotification('视频文件不存在，请稍后再试', 'error');
    }
}

function showVideoModal(videoUrl, title) {
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: pointer;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        position: relative;
        cursor: default;
    `;

    modalContent.innerHTML = `
        <div class="close-btn" style="position: absolute; top: -40px; right: 0; color: white; font-size: 2rem; cursor: pointer; background: rgba(0, 0, 0, 0.5); width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">×</div>
        <video controls style="max-width: 100%; max-height: 100%;">
            <source src="${videoUrl}" type="video/mp4">
            您的浏览器不支持视频播放。
        </video>
        <div style="color: white; text-align: center; margin-top: 20px; font-size: 1.2rem;">${title}</div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // 关闭模态框
    const closeModal = function() {
        document.body.removeChild(modal);
    };

    modal.querySelector('.close-btn').addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });

    // ESC键关闭
    const handleKeyPress = function(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleKeyPress);
        }
    };
    document.addEventListener('keydown', handleKeyPress);
}

function downloadVideo(videoId) {
    showNotification('正在准备下载...', 'info');
    // 这里可以实现真实的视频下载功能
    setTimeout(() => {
        showNotification('下载功能正在开发中，敬请期待！', 'success');
    }, 1000);
}

// 剧本查看功能
function viewScript(scriptId) {
    const scriptUrls = {
        'script1': 'scripts/liangshanbo_zhuyingtai.pdf',
        'script2': 'scripts/baishezhuan.pdf',
        'script3': 'scripts/mengjiangnv.pdf'
    };
    
    const scriptTitle = {
        'script1': '《梁山伯与祝英台》剧本分析',
        'script2': '《白蛇传》人物塑造技巧',
        'script3': '《孟姜女》情感表达分析'
    };
    
    const scriptUrl = scriptUrls[scriptId];
    const title = scriptTitle[scriptId];
    
    if (scriptUrl) {
        // 在新窗口中打开PDF
        window.open(scriptUrl, '_blank');
        showNotification(`${title} 正在新窗口中打开`, 'info');
    } else {
        showNotification('剧本文件不存在，请稍后再试', 'error');
    }
}

function downloadScript(scriptId) {
    showNotification('正在准备下载剧本PDF...', 'info');
    // 这里可以实现真实的PDF下载功能
    setTimeout(() => {
        showNotification('下载功能正在开发中，敬请期待！', 'success');
    }, 1000);
}

// 角色解读功能
function viewCharacter(characterId) {
    const characterDetails = {
        'character1': {
            title: '生角（男性角色）',
            content: '生角是琼剧中的男性角色，通常扮演正面人物。生角的表演特点包括：唱腔清亮、动作优雅、表情丰富。生角要求演员具备扎实的唱功和表演功底，能够准确传达角色的内心世界。'
        },
        'character2': {
            title: '旦角（女性角色）',
            content: '旦角是琼剧中的女性角色，扮演各种女性人物。旦角的表演风格细腻柔美，注重情感表达。旦角演员需要掌握丰富的表情技巧和身段表演，能够通过细腻的表演展现女性的柔美与坚强。'
        },
        'character3': {
            title: '净角（花脸角色）',
            content: '净角是琼剧中的特殊角色类型，通常扮演性格鲜明的人物。净角的特点是通过夸张的化妆和表演来突出角色性格。净角演员需要具备强烈的表现力和独特的表演风格。'
        }
    };
    
    const character = characterDetails[characterId];
    if (character) {
        showCharacterModal(character);
    }
}

function showCharacterModal(character) {
    const modal = document.createElement('div');
    modal.className = 'character-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: pointer;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        max-width: 600px;
        max-height: 80%;
        background: white;
        border-radius: 15px;
        padding: 30px;
        position: relative;
        overflow-y: auto;
        cursor: default;
    `;

    modalContent.innerHTML = `
        <div class="close-btn" style="position: absolute; top: 15px; right: 20px; font-size: 2rem; cursor: pointer; color: #666;">×</div>
        <h2 style="color: #8b4513; margin-bottom: 20px;">${character.title}</h2>
        <p style="color: #666; line-height: 1.8; font-size: 1.1rem;">${character.content}</p>
        <div style="margin-top: 30px; text-align: center;">
            <button onclick="downloadGuide('${character.title}')" style="background: #8b4513; color: white; border: none; padding: 12px 24px; border-radius: 25px; cursor: pointer; font-size: 1rem;">下载详细指南</button>
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // 关闭模态框
    const closeModal = function() {
        document.body.removeChild(modal);
    };

    modal.querySelector('.close-btn').addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });

    // ESC键关闭
    const handleKeyPress = function(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleKeyPress);
        }
    };
    document.addEventListener('keydown', handleKeyPress);
}

function downloadGuide(characterTitle) {
    showNotification(`正在下载${characterTitle}详细指南...`, 'info');
    // 这里可以实现真实的指南下载功能
    setTimeout(() => {
        showNotification('下载功能正在开发中，敬请期待！', 'success');
    }, 1000);
}

// 购买页面功能
let currentProduct = null;

function showProductDetails(productId) {
    const productDetails = {
        'product1': {
            name: '琼剧折扇',
            description: '传统琼剧元素折扇，精美工艺，展现琼剧文化魅力。采用优质竹材制作，扇面绘制精美琼剧人物图案，是收藏和使用的佳品。',
            price: 25,
            image: '折扇.jpg',
            originalPrice: null
        },
      
        'product2': {
            name: '琼剧书签',
            description: '琼剧人物书签，精美设计，读书伴侣。采用厚卡纸制作，表面覆膜，防水耐用，是书友们的理想选择。',
            price: 8,
            image: '文创1.jpg',
            originalPrice: null
        },
        'product3': {
            name: '琼剧冰箱贴',
            description: '琼剧元素冰箱贴套装，实用美观，家居装饰。一套4个，不同图案设计，采用环保材料制作，安全无毒。',
            price: 20,
            image: '文创2.jpg',
            originalPrice: null
        },
        'product4': {
            name: '琼剧明信片',
            description: '琼剧主题明信片套装，实用美观，精美工艺。一套4个，不同图案设计，采用环保材料制作，安全无毒。',
            price: 10,
            image: '文创3.jpg',
            originalPrice: null
        }
    };
    
    const product = productDetails[productId];
    if (product) {
        currentProduct = product;
        showPurchaseModal(product);
    }
}

function showPurchaseModal(product) {
    const modal = document.getElementById('purchaseModal');
    if (!modal) return;
    
    // 更新模态框内容
    document.getElementById('modalProductImage').src = product.image;
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductDescription').textContent = product.description;
    document.getElementById('modalProductPrice').textContent = product.price;
    
    // 重置数量
    document.getElementById('quantity').value = 1;
    updateTotalPrice();
    
    // 显示模态框
    modal.style.display = 'block';
}

function closePurchaseModal() {
    const modal = document.getElementById('purchaseModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function increaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    const currentValue = parseInt(quantityInput.value);
    if (currentValue < 99) {
        quantityInput.value = currentValue + 1;
        updateTotalPrice();
    }
}

function decreaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    const currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
        updateTotalPrice();
    }
}

function updateTotalPrice() {
    if (!currentProduct) return;
    
    const quantity = parseInt(document.getElementById('quantity').value);
    const totalPrice = currentProduct.price * quantity;
    document.getElementById('totalPrice').textContent = totalPrice;
}

function addToCart() {
    if (!currentProduct) return;
    
    const quantity = parseInt(document.getElementById('quantity').value);
    const totalPrice = currentProduct.price * quantity;
    
    showNotification(`${currentProduct.name} x${quantity} 已添加到购物车！总计：¥${totalPrice}`, 'success');
    closePurchaseModal();
}

function buyNow() {
    if (!currentProduct) return;
    
    const quantity = parseInt(document.getElementById('quantity').value);
    const totalPrice = currentProduct.price * quantity;
    
    showNotification(`正在跳转到支付页面... 商品：${currentProduct.name} x${quantity}，总计：¥${totalPrice}`, 'info');
    
    // 模拟跳转到支付页面
    setTimeout(() => {
        showNotification('支付功能正在开发中，敬请期待！', 'success');
        closePurchaseModal();
    }, 1500);
}

// 轮播功能
let currentSlideIndex = {
    'huihui': 0
};

function changeSlide(carouselId, direction) {
    const slides = document.querySelectorAll(`#${carouselId} .carousel-slide`);
    const indicators = document.querySelectorAll(`#${carouselId} .indicator`);
    
    if (!slides.length) return;
    
    // 移除当前活动状态
    slides[currentSlideIndex[carouselId]].classList.remove('active');
    indicators[currentSlideIndex[carouselId]].classList.remove('active');
    
    // 计算新索引
    currentSlideIndex[carouselId] += direction;
    
    // 循环处理
    if (currentSlideIndex[carouselId] >= slides.length) {
        currentSlideIndex[carouselId] = 0;
    } else if (currentSlideIndex[carouselId] < 0) {
        currentSlideIndex[carouselId] = slides.length - 1;
    }
    
    // 添加新的活动状态
    slides[currentSlideIndex[carouselId]].classList.add('active');
    indicators[currentSlideIndex[carouselId]].classList.add('active');
}

function currentSlide(carouselId, slideNumber) {
    const slides = document.querySelectorAll(`#${carouselId} .carousel-slide`);
    const indicators = document.querySelectorAll(`#${carouselId} .indicator`);
    
    if (!slides.length) return;
    
    // 移除当前活动状态
    slides[currentSlideIndex[carouselId]].classList.remove('active');
    indicators[currentSlideIndex[carouselId]].classList.remove('active');
    
    // 设置新的活动状态
    currentSlideIndex[carouselId] = slideNumber - 1;
    slides[currentSlideIndex[carouselId]].classList.add('active');
    indicators[currentSlideIndex[carouselId]].classList.add('active');
}

// 自动轮播
function startAutoSlide(carouselId) {
    setInterval(() => {
        changeSlide(carouselId, 1);
    }, 4000); // 每4秒切换一次
}

// 监听数量输入框变化
document.addEventListener('DOMContentLoaded', function() {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.addEventListener('input', updateTotalPrice);
    }
    
    // 点击模态框外部关闭
    const modal = document.getElementById('purchaseModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closePurchaseModal();
            }
        });
    }
    
    // ESC键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePurchaseModal();
        }
    });
    
    // 启动自动轮播
    startAutoSlide('huihui');
    
    // 照片墙键盘事件
    document.addEventListener('keydown', function(e) {
        const photoModal = document.getElementById('photoModal');
        if (photoModal && photoModal.style.display === 'block') {
            if (e.key === 'Escape') {
                closePhotoModal();
            } else if (e.key === 'ArrowLeft') {
                changePhoto(-1);
            } else if (e.key === 'ArrowRight') {
                changePhoto(1);
            }
        }
    });
    
    // 点击模态框外部关闭
    const photoModal = document.getElementById('photoModal');
    if (photoModal) {
        photoModal.addEventListener('click', function(e) {
            if (e.target === photoModal) {
                closePhotoModal();
            }
        });
    }
});

// 导出功能供外部使用
window.QiongJuWebsite = {
    uploadImages,
    showNotification,
    filterGalleryImages,
    showProductDetails,
    purchaseProduct,
    playVideo,
    downloadVideo,
    viewScript,
    downloadScript,
    viewCharacter,
    downloadGuide,
    showPurchaseModal,
    closePurchaseModal,
    increaseQuantity,
    decreaseQuantity,
    updateTotalPrice,
    addToCart,
    buyNow
};
