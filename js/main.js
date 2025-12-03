// --- Product Color Mapping for Case Studies Tags ---
const productTagColors = {
    'Sora-2 文生视频': 'text-gray-700 bg-gray-100',
    'Gemini 多模态创作': 'text-gray-700 bg-gray-100',
    '多模型统一 API 接入': 'text-gray-700 bg-gray-100',
    'AI 编程算力拼车': 'text-gray-700 bg-gray-100',
    'AI 批量生图工具': 'text-gray-700 bg-gray-100',
    '自助交易与交付': 'text-gray-700 bg-gray-100',
};

// --- Case Study Data ---
const caseStudies = [
    {
        title: 'AI 视频内容自动化生成引擎',
        products: ['Sora-2 文生视频', '多模型统一 API 接入'],
        summary: '实现从概念到成片的极速工作流。通过 Sora-2 的高保真视频生成能力，所有调用均通过统一 API 网关进行高效管理与结算。',
        tagColor: 'red',
        link: 'https://www.sora2web.icu/'
    },
    {
        title: '代码智能检测与持续优化工作流',
        products: ['AI 编程算力拼车', '多模型统一 API 接入'],
        summary: '为研发团队构建无缝的 AI 辅助编程环境。在 AI 编程拼车服务中，通过统一 API 接入 Claude/Codex，实现代码实时智能审查，确保代码质量和迭代速度。',
        tagColor: 'teal',
        link: 'https://codecodex.ai'
    },
    {
        title: '电商独立站 AI 营销素材极速供应',
        products: ['多模型统一 API 接入', '自助交易与交付（敬请期待）'],
        summary: '赋能出海独立站。通过统一 API 接入多模型服务，创作高转化率的营销内容（文案/图片），实现 AI 算力额度的即时、自动化购买与分配。',
        tagColor: 'indigo',
        link: 'javascript:void(0)'
    }
];

// --- Core Functions ---

// Function to get translation helper
const getTranslation = (key) => {
    if (typeof window !== 'undefined' && window.i18n) {
        return window.i18n.t(key);
    }
    // Fallback to English translations if i18n not available
    const translations = {
        'cases.integrationScheme': '集成方案',
        'cases.learnMore': '了解更多'
    };
    return translations[key] || key;
};

// Function to dynamically render case studies
const renderCaseStudies = () => {
    try {
        const container = document.getElementById('case-studies-container');
        if (!container) return;

        // Generate HTML for each case study
        const htmlContent = caseStudies.map(study => {
            const productHtml = study.products.map(product => {
                const colors = productTagColors[product] || 'text-gray-700 bg-gray-100';
                let linkText = product;
                
                // Add "敬请期待" hint for products not yet available
                if (product.includes('敬请期待')) {
                    linkText = product; // Already has the hint
                } else if (product === 'Lioncc AI Lab') {
                    linkText += ' (敬请期待)';
                }

                return `<span class="text-xs font-medium ${colors} px-3 py-1 rounded-full border border-gray-300">${linkText}</span>`;
            }).join('');

            const isExternal = study.link.startsWith('http');
            const linkTarget = isExternal ? '_blank' : '_self';

            return `
                <div class="bg-white rounded-xl p-5 sm:p-6 md:p-6 border border-gray-200 hover:border-gray-400 transition-colors shadow-sm flex flex-col h-full">
                    <a href="${study.link}" target="${linkTarget}" rel="noopener noreferrer" class="block flex-grow">
                        <h3 class="text-lg sm:text-xl font-bold text-gray-900 mt-2 mb-2 sm:mb-3 leading-tight">${study.title}</h3>
                        <div class="flex flex-wrap gap-2 mb-3 sm:mb-4">${productHtml}</div>
                        <p class="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">${study.summary}</p>
                    </a>
                    <div class="flex justify-between items-center text-gray-500 text-xs sm:text-sm border-t border-gray-200 pt-3 mt-auto">
                        <span class="text-gray-600 font-semibold">集成方案</span>
                        <a href="${study.link}" target="${linkTarget}" rel="noopener noreferrer" class="accent-color hover:text-gray-800 transition-colors inline-flex items-center group font-semibold">
                            了解更多 <span class="ml-1 text-xl transition-transform group-hover:translate-x-1">&rarr;</span>
                        </a>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = htmlContent;
    } catch (error) {
        console.error('Error rendering case studies:', error);
    }
};

// Mobile Menu Toggle with Overlay
const initMobileMenu = () => {
    try {
        const menuButton = document.getElementById('menu-button');
        const closeMenuButton = document.getElementById('close-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuOverlay = document.getElementById('mobile-menu-overlay');

        if (menuButton) {
            menuButton.addEventListener('click', () => {
                mobileMenu.classList.add('open');
                menuOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

        if (closeMenuButton) {
            closeMenuButton.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                menuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Close menu when clicking on overlay
        if (menuOverlay) {
            menuOverlay.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                menuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Close menu when clicking on nav links
        const navLinks = mobileMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                menuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    } catch (error) {
        console.error('Error initializing mobile menu:', error);
    }
};

// Product Filtering (Tab Logic and Fade-In Animation)
const initProductFilter = () => {
    try {
        const productTabs = document.querySelectorAll('.product-tab');
        const productCards = document.querySelectorAll('.product-card');

        // Filter and animate function (from original LIONCC.AI.html)
        const filterAndAnimate = (category) => {
            productCards.forEach(product => {
                const productCategory = product.getAttribute('data-category');
                
                if (category === 'all' || productCategory === category) {
                    // Show and add fade-in effect
                    product.style.display = 'block';
                    product.classList.remove('fade-in'); 
                    // Use requestAnimationFrame to ensure animation replays
                    requestAnimationFrame(() => {
                       product.classList.add('fade-in');
                    });
                } else {
                    // Hide
                    product.style.display = 'none';
                    product.classList.remove('fade-in');
                }
            });
        };

        productTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const category = tab.getAttribute('data-category');

                // Update active tab style
                productTabs.forEach(t => t.classList.remove('tab-active'));
                tab.classList.add('tab-active');

                // Run filter and animation logic
                filterAndAnimate(category);
            });
        });

        // Initial filter: show 'all'
        document.querySelector('.product-tab[data-category="all"]').click();
    } catch (error) {
        console.error('Error initializing product filter:', error);
    }
};

// Scroll Spy for Navigation
const initScrollSpy = () => {
    try {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    } catch (error) {
        console.error('Error initializing scroll spy:', error);
    }
};

// Copy Function for WeChat Number
const initCopyFunction = () => {
    try {
        const wechatNumber = document.getElementById('wechat-number');
        
        if (wechatNumber) {
            wechatNumber.addEventListener('click', async () => {
                const number = 'HSQBJ088888888';
                try {
                    await navigator.clipboard.writeText(number);
                    
                    // Show toast notification
                    const toast = document.createElement('div');
                    toast.textContent = 'WeChat Number Copied!';
                    toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeIn';
                    document.body.appendChild(toast);
                    
                    // Haptic feedback on mobile
                    if (navigator.vibrate) {
                        navigator.vibrate(100);
                    }
                    
                    // Remove toast after 2 seconds
                    setTimeout(() => {
                        toast.remove();
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
            });
        }
    } catch (error) {
        console.error('Error initializing copy function:', error);
    }
};

// Placeholder Links Handler
const initPlaceholderLinks = () => {
    try {
        const placeholderLinks = document.querySelectorAll('a[href="javascript:void(0)"]');
        
        placeholderLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Show toast notification
                const toast = document.createElement('div');
                toast.textContent = 'Coming Soon!';
                toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeIn';
                document.body.appendChild(toast);
                
                // Haptic feedback on mobile
                if (navigator.vibrate) {
                    navigator.vibrate(100);
                }
                
                // Remove toast after 2 seconds
                setTimeout(() => {
                    toast.remove();
                }, 2000);
            });
        });
    } catch (error) {
        console.error('Error initializing placeholder links:', error);
    }
};

// Initialize everything on DOM load
document.addEventListener('DOMContentLoaded', () => {
    renderCaseStudies();
    initMobileMenu();
    initProductFilter();
    initScrollSpy();
    initCopyFunction();
    initPlaceholderLinks();
});
