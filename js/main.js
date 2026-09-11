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
    initMobileMenu();
    initProductFilter();
    initScrollSpy();
    initCopyFunction();
    initPlaceholderLinks();
});
