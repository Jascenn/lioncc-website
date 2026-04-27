// --- Case Study Data (i18n-driven) ---
// 文案走 i18n 字典；产品名引用 productNames.* 让翻译统一。
// comingSoon=true 时会在产品名后追加翻译后的"敬请期待"后缀。
const caseStudies = [
    {
        titleKey: 'caseStudies.video.title',
        summaryKey: 'caseStudies.video.summary',
        products: [
            { key: 'productNames.sora' },
            { key: 'productNames.api' }
        ],
        link: 'https://www.sora2web.icu/'
    },
    {
        titleKey: 'caseStudies.code.title',
        summaryKey: 'caseStudies.code.summary',
        products: [
            { key: 'productNames.codeCarPool' },
            { key: 'productNames.api' }
        ],
        link: 'https://codecodex.ai'
    },
    {
        titleKey: 'caseStudies.commerce.title',
        summaryKey: 'caseStudies.commerce.summary',
        products: [
            { key: 'productNames.api' },
            { key: 'productNames.selfService', comingSoon: true }
        ],
        link: 'javascript:void(0)'
    }
];

// --- Core Functions ---

// 简单 HTML 转义，避免 i18n 字典里的特殊字符破坏模板。
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

// Function to get translation helper
const getTranslation = (key) => {
    if (typeof window !== 'undefined' && window.i18n) {
        return window.i18n.t(key);
    }
    return key;
};

// Function to dynamically render case studies
const renderCaseStudies = () => {
    try {
        const container = document.getElementById('case-studies-container');
        if (!container) return;

        const comingSoonText = getTranslation('actions.comingSoon');
        const integrationLabel = getTranslation('cases.integrationScheme');
        const learnMoreLabel = getTranslation('cases.learnMore');

        const htmlContent = caseStudies.map(study => {
            const productHtml = study.products.map(product => {
                let name = getTranslation(product.key);
                if (product.comingSoon) name += ' (' + comingSoonText + ')';
                return `<span class="text-xs font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full border border-gray-300">${escapeHtml(name)}</span>`;
            }).join('');

            const isExternal = study.link.startsWith('http');
            const linkTarget = isExternal ? '_blank' : '_self';
            const title = escapeHtml(getTranslation(study.titleKey));
            const summary = escapeHtml(getTranslation(study.summaryKey));

            return `
                <div class="bg-white rounded-xl p-5 sm:p-6 md:p-6 border border-gray-200 hover:border-gray-400 transition-colors shadow-sm flex flex-col h-full">
                    <a href="${study.link}" target="${linkTarget}" rel="noopener noreferrer" class="block flex-grow">
                        <h3 class="text-lg sm:text-xl font-bold text-gray-900 mt-2 mb-2 sm:mb-3 leading-tight">${title}</h3>
                        <div class="flex flex-wrap gap-2 mb-3 sm:mb-4">${productHtml}</div>
                        <p class="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">${summary}</p>
                    </a>
                    <div class="flex justify-between items-center text-gray-500 text-xs sm:text-sm border-t border-gray-200 pt-3 mt-auto">
                        <span class="text-gray-600 font-semibold">${escapeHtml(integrationLabel)}</span>
                        <a href="${study.link}" target="${linkTarget}" rel="noopener noreferrer" class="accent-color hover:text-gray-800 transition-colors inline-flex items-center group font-semibold">
                            ${escapeHtml(learnMoreLabel)} <span class="ml-1 text-xl transition-transform group-hover:translate-x-1">&rarr;</span>
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

// 案例区文案靠 i18n 字典；首屏在 i18n 就绪后再渲染，切语言时重渲染。
function renderCaseStudiesWhenReady() {
    if (window.i18n && window.i18n.ready) {
        renderCaseStudies();
    } else {
        document.addEventListener('i18n:ready', renderCaseStudies, { once: true });
    }
}

// Initialize everything on DOM load
document.addEventListener('DOMContentLoaded', () => {
    renderCaseStudiesWhenReady();
    document.addEventListener('i18n:changed', renderCaseStudies);
    initMobileMenu();
    initProductFilter();
    initScrollSpy();
    initCopyFunction();
    initPlaceholderLinks();
});
