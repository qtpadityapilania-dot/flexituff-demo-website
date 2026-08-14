/* ==========================================================================
   FLEXITUFF TECHNOLOGY INTERNATIONAL - CORE ENGINE (VANILLA JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 1. Header Behaviour
    // =========================================================
    const siteHeader = document.querySelector('.site-header');
    const pathname = window.location.pathname.split('/').pop();
    const isHomePage = pathname === 'index.html' || pathname === '' || window.location.pathname.endsWith('/');

    if (siteHeader) {
        if (isHomePage) {
            const checkHomeHeader = () => {
                if (window.scrollY > 60) {
                    siteHeader.classList.add('scrolled');
                } else {
                    siteHeader.classList.remove('scrolled');
                }
            };
            checkHomeHeader();
            window.addEventListener('scroll', checkHomeHeader, { passive: true });
        } else {
            siteHeader.classList.add('scrolled', 'subpage-header');
        }
    }

    // =========================================================
    // 2. Animated Stat Counters
    // =========================================================
    const statElements = document.querySelectorAll('.stat-number');
    statElements.forEach((el) => {
        const targetVal = parseInt(el.getAttribute('data-target'), 10);
        if (isNaN(targetVal)) return;
        let current = 0;
        const increment = Math.ceil(targetVal / 40);
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetVal) {
                current = targetVal;
                clearInterval(timer);
            }
            el.innerText = current.toLocaleString('en-US');
        }, 30);
    });

    // =========================================================
    // 3. Hero Split Slider Engine
    // =========================================================
    const bgSlides = document.querySelectorAll('.innox-bg-slide');
    const dotBtns = document.querySelectorAll('.dot-btn');
    const prevBtn = document.getElementById('hero-slider-prev');
    const nextBtn = document.getElementById('hero-slider-next');
    const currentSlideNum = document.getElementById('current-slide-num');
    const totalSlideNum = document.getElementById('total-slide-num');
    const labelTop = document.getElementById('changing-label-top');
    const labelBot = document.getElementById('changing-label-bot');
    const rightPanel = document.getElementById('innox-right-panel');
    const subLabel = document.getElementById('innox-sub-label');

    const slideLabels = [
        ['BULK', 'BAGS'],
        ['HEAVY', 'DUTY'],
        ['FOOD', 'GRADE'],
        ['ECO', 'FRIENDLY']
    ];

    let currentSlide = 0;
    const totalSlides = bgSlides.length;
    let isTransitioning = false;
    let autoSlideTimer = null;
    const AUTO_SLIDE_INTERVAL = 5000; // 5 seconds per slide

    function startAutoSlide() {
        stopAutoSlide();
        if (totalSlides > 1) {
            autoSlideTimer = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, AUTO_SLIDE_INTERVAL);
        }
    }

    function stopAutoSlide() {
        if (autoSlideTimer) {
            clearInterval(autoSlideTimer);
            autoSlideTimer = null;
        }
    }

    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    function goToSlide(index) {
        if (isTransitioning || totalSlides === 0) return;
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        if (index === currentSlide) return;

        isTransitioning = true;
        const nextIdx = index;

        if (rightPanel) rightPanel.classList.add('panel-out');
        if (subLabel) subLabel.classList.add('typo-out');

        setTimeout(() => {
            bgSlides.forEach((s, i) => s.classList.toggle('active', i === nextIdx));
            dotBtns.forEach((d, i) => d.classList.toggle('active', i === nextIdx));

            if (labelTop && slideLabels[nextIdx]) labelTop.innerText = slideLabels[nextIdx][0];
            if (labelBot && slideLabels[nextIdx]) labelBot.innerText = slideLabels[nextIdx][1];
            if (currentSlideNum) currentSlideNum.innerText = String(nextIdx + 1).padStart(2, '0');

            currentSlide = nextIdx;

            setTimeout(() => {
                if (rightPanel) rightPanel.classList.remove('panel-out');
                if (subLabel) subLabel.classList.remove('typo-out');
                setTimeout(() => { isTransitioning = false; }, 750);
            }, 100);
        }, 550);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            goToSlide(currentSlide - 1);
            resetAutoSlide();
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            goToSlide(currentSlide + 1);
            resetAutoSlide();
        });
    }

    dotBtns.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            goToSlide(parseInt(dot.getAttribute('data-slide-target'), 10));
            resetAutoSlide();
        });
    });

    if (totalSlideNum) totalSlideNum.innerText = String(totalSlides).padStart(2, '0');

    // Tap / Click anywhere on Hero section to switch to next slide
    const heroSectionEl = document.getElementById('hero');
    if (heroSectionEl) {
        heroSectionEl.addEventListener('click', (e) => {
            if (e.target.closest('.hero-slider-arrow') || e.target.closest('.dot-btn') || e.target.closest('a')) {
                return; // ignore clicks on control buttons
            }
            goToSlide(currentSlide + 1);
            resetAutoSlide();
        });
    }

    // Start auto slide timer on load
    startAutoSlide();

    // =========================================================
    // 4. Metrics Strip — Native CSS Auto-Scroll Marquee Ticker
    // =========================================================
    // (Handled smoothly via CSS @keyframes metricsMarquee with pause-on-hover)

    // =========================================================
    // 5. Product Live Search (FIBCs + Custom Designs grids)
    // =========================================================
    const productCards = document.querySelectorAll('.product-card');
    const productSearchInput = document.getElementById('productSearchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');

    function filterProductCatalog() {
        const searchQuery = productSearchInput ? productSearchInput.value.toLowerCase().trim() : '';

        if (clearSearchBtn) {
            clearSearchBtn.style.display = searchQuery.length > 0 ? 'flex' : 'none';
        }

        productCards.forEach(card => {
            const cardText = (card.innerText + ' ' + (card.getAttribute('data-search') || '')).toLowerCase();
            const matchesSearch = !searchQuery || cardText.includes(searchQuery);
            card.style.display = matchesSearch ? 'flex' : 'none';
        });
    }

    if (productSearchInput) {
        productSearchInput.addEventListener('input', filterProductCatalog);
    }

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            if (productSearchInput) {
                productSearchInput.value = '';
                filterProductCatalog();
                productSearchInput.focus();
            }
        });
    }

    // =========================================================
    // 6. RFQ Modal Engine
    // =========================================================
    const rfqModal = document.getElementById('rfqModal');
    const btnOpenRfq = document.getElementById('btn-open-rfq');
    const btnFooterRfq = document.getElementById('btn-footer-rfq');
    const modalClose = document.getElementById('modalClose');
    const bagTypeSelect = document.getElementById('bagType');
    const cardRfqBtns = document.querySelectorAll('.card-rfq-btn');

    function openModal(preselectedProduct = null) {
        if (preselectedProduct && bagTypeSelect) {
            for (let option of bagTypeSelect.options) {
                if (option.value.toLowerCase().includes(preselectedProduct.toLowerCase())) {
                    option.selected = true;
                    break;
                }
            }
        }
        if (rfqModal) {
            rfqModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (rfqModal) {
            rfqModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    const btnMobileRfq = document.getElementById('btn-mobile-rfq');
    if (btnOpenRfq) btnOpenRfq.addEventListener('click', () => openModal());
    if (btnFooterRfq) btnFooterRfq.addEventListener('click', () => openModal());
    if (btnMobileRfq) btnMobileRfq.addEventListener('click', () => { closeMobileMenu(); openModal(); });
    if (modalClose) modalClose.addEventListener('click', closeModal);

    cardRfqBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const product = e.currentTarget.getAttribute('data-product');
            openModal(product);
        });
    });

    if (rfqModal) {
        rfqModal.addEventListener('click', (e) => {
            if (e.target === rfqModal) closeModal();
        });
    }

    // =========================================================
    // 7. Form Submission Feedback
    // =========================================================
    window.handleRFQSubmit = function () {
        const form = document.getElementById('rfqForm');
        const successMsg = document.getElementById('rfqSuccessMsg');
        if (form && successMsg) {
            form.style.display = 'none';
            successMsg.style.display = 'block';
            setTimeout(() => {
                closeModal();
                setTimeout(() => {
                    form.style.display = 'block';
                    successMsg.style.display = 'none';
                    form.reset();
                }, 500);
            }, 3000);
        }
    };

    // =========================================================
    // 8. Mobile Nav Drawer
    // =========================================================
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileNavDrawer = document.getElementById('mobileNavDrawer');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    function openMobileMenu() {
        if (mobileNavDrawer && mobileNavOverlay) {
            mobileNavDrawer.classList.add('active');
            mobileNavOverlay.classList.add('active');
            if (mobileToggle) mobileToggle.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeMobileMenu() {
        if (mobileNavDrawer && mobileNavOverlay) {
            mobileNavDrawer.classList.remove('active');
            mobileNavOverlay.classList.remove('active');
            if (mobileToggle) mobileToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
    if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileMenu);
    if (mobileNavOverlay) mobileNavOverlay.addEventListener('click', closeMobileMenu);
    mobileNavLinks.forEach(link => link.addEventListener('click', () => closeMobileMenu()));

    // Mobile Products Accordion Toggle
    const mobileProductsTrigger = document.getElementById('mobileProductsTrigger');
    const mobileProductsAccordion = document.getElementById('mobileProductsAccordion');
    if (mobileProductsTrigger && mobileProductsAccordion) {
        mobileProductsTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpen = mobileProductsAccordion.classList.toggle('open');
            mobileProductsTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }

    const mobileAccLinks = document.querySelectorAll('.mobile-acc-link');
    mobileAccLinks.forEach(link => link.addEventListener('click', () => closeMobileMenu()));

    // =========================================================
    // 9. Smooth Anchor Links
    // =========================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId.startsWith('#')) return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
