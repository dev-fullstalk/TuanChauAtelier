/* ==========================================================================
   TUAN CHAU ATELIER - GLOBAL JAVASCRIPT
   Logic for Components Loader, Theme Switcher, Filter, Lightbox, Modals, Forms
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {


  // 1. Dynamic Component Loader
  const isLocalFile = window.location.protocol === 'file:';
  
  if (!isLocalFile) {
    // If running on a server (localhost/live), load components dynamically
    const loadComponents = async () => {
      try {
        const [headerRes, footerRes, appIntroRes] = await Promise.all([
          fetch('components/header.html'),
          fetch('components/footer.html'),
          fetch('components/app-intro.html')
        ]);

        if (headerRes.ok) {
          document.querySelector('header').innerHTML = await headerRes.text();
        }
        if (footerRes.ok) {
          document.querySelector('footer').innerHTML = await footerRes.text();
        }
        if (appIntroRes.ok) {
          document.getElementById('app-intro').innerHTML = await appIntroRes.text();
        }
      } catch (err) {
        console.warn('Component dynamic fetch failed. Falling back to inline static templates:', err);
      } finally {
        // Initialize all interactive events after HTML insertion
        initializeInteractions();
      }
    };
    loadComponents();
  } else {
    // If running via double-click file://, use inline template markup and initialize immediately
    initializeInteractions();
  }
});

function initializeInteractions() {
  // Bind all interactive elements
  initThemeToggle();
  initMobileMenu();
  initHeaderScroll();
  initProductFilter();
  initLightbox();
  initQuoteModal();
  initNewsletterForm();
  initScrollAnimations();
  initConsultationMultiStep(); // Initialize Multi-Step Consultation Form
  initVideoModal(); // Initialize interactive Video Modal
  initAccordionGallery(); // Khởi tạo Accordion Gallery cho Bộ sưu tập
  fetchProductsAndInit(); // Tải dữ liệu sản phẩm động từ Supabase
  
  // Custom Hook for App intro interactions since it's loaded
  if (window.initAppIntroSimulator) {
    window.initAppIntroSimulator();
  }
}

// 2. Dark/Light Theme Toggle
function initThemeToggle() {
  const themeBtn = document.getElementById('themeToggleBtn');
  if (!themeBtn) return;

  // Read saved theme from localStorage
  const currentTheme = localStorage.getItem('color-scheme') || 'light';
  
  // Apply initial theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateMetaColorScheme(currentTheme);

  // Toggle theme click event
  themeBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('color-scheme', newTheme);
    updateMetaColorScheme(newTheme);
  });
  
  // Track OS scheme change dynamically
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('color-scheme')) {
      const systemTheme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', systemTheme);
      updateMetaColorScheme(systemTheme);
    }
  });
}

function updateMetaColorScheme(theme) {
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (meta) {
    meta.content = theme === 'dark' ? 'dark' : 'light';
  }
}

// 3. Mobile Menu Toggle
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isActive = navMenu.classList.toggle('active');
    toggleBtn.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : '';
  });

  // Close menu when clicking nav links or buttons inside the menu
  navMenu.querySelectorAll('.nav-link, .btn').forEach(elem => {
    elem.addEventListener('click', () => {
      navMenu.classList.remove('active');
      toggleBtn.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
      navMenu.classList.remove('active');
      toggleBtn.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// 4. Header Scroll styling
function initHeaderScroll() {
  const header = document.querySelector('header.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger immediately to catch refreshed scroll offset
}

// 5. Product Filter System
function initProductFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  if (filterBtns.length === 0 || productCards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from other buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          // Smooth fade in
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// 6. Lightbox Preview Modal
function initLightbox() {
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
  const lightboxTitle = lightbox ? lightbox.querySelector('.lightbox-title') : null;
  const viewBtns = document.querySelectorAll('.btn-view-texture');
  const closeBtn = lightbox ? lightbox.querySelector('.lightbox-close') : null;

  if (!lightbox || !lightboxImg) return;

  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const img = card.querySelector('.product-img');
      const title = card.querySelector('.product-title');

      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || '';
      }
      if (title && lightboxTitle) {
        lightboxTitle.textContent = title.textContent;
      }

      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock background scroll
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    // Chỉ đóng khi click ngoài vùng hiển thị ảnh (lightbox-img-wrapper) hoặc click nút đóng
    if (!e.target.closest('.lightbox-img-wrapper') || e.target.closest('.lightbox-close')) {
      closeLightbox();
    }
  });

  // ESC Key listener to dismiss
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

// 7. Interactive Quote Request Modal
function initQuoteModal() {
  const modal = document.getElementById('quoteModal');
  const modalClose = modal ? modal.querySelector('.modal-close') : null;
  const quoteBtns = document.querySelectorAll('.btn-hero-cta');
  const quoteForm = document.getElementById('quoteRequestForm');
  const modalQuoteForm = document.getElementById('modalQuoteForm');

  if (!modal && quoteBtns.length === 0) return;

  // Prepopulate select element in quoteModal and open it when clicking "Báo giá / Nhận tư vấn"
  quoteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.classList.contains('btn-hero-cta')) {
        // Open Modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Prepopulate select option based on product card context if triggered from a card
        const card = btn.closest('.product-card');
        const selectElement = document.getElementById('modalQuoteStone'); // modal select
        
        if (card && selectElement) {
          const title = card.querySelector('.product-title').textContent.trim();
          // Find option matching title
          for (let option of selectElement.options) {
            if (title.toLowerCase().includes(option.text.toLowerCase()) || option.text.toLowerCase().includes(title.toLowerCase())) {
              selectElement.value = option.value;
              break;
            }
          }
        }
        e.preventDefault();
      }
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Handle Contact Section Form Submit (#quoteRequestForm)
  if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('quoteName').value.trim();
      const phone = document.getElementById('quotePhone').value.trim();
      const address = document.getElementById('quoteAddress').value.trim();
      const message = document.getElementById('quoteMessage').value.trim();
      const selectElement = document.getElementById('quoteStoneType');
      const selectedStoneText = selectElement ? selectElement.options[selectElement.selectedIndex].text : 'Tư vấn chất liệu khác...';

      if (!validatePhone(phone)) {
        showToast('Số điện thoại không hợp lệ. Cần gồm 10 chữ số (VD: 0941234567).');
        document.getElementById('quotePhone').focus();
        return;
      }

      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : 'Gửi yêu cầu';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang gửi yêu cầu...';
      }

      const payload = {
        customer_name: name,
        phone_number: phone,
        address: address,
        room_region: 'Chân trang (Liên hệ nhanh)',
        selected_stone_names: selectedStoneText,
        service_needed: 'Tư vấn báo giá trực tiếp',
        customer_note: message
      };

      const dbSuccess = await sendToSupabase(payload);
      if (dbSuccess) {
        await sendTelegramAlert(payload);
        showToast(`Cảm ơn anh/chị ${name}. Tuan Chau Atelier đã nhận được yêu cầu tư vấn. Chúng tôi sẽ gọi lại qua số ${phone} trong 15 phút.`);
        quoteForm.reset();
      } else {
        showToast('Có lỗi xảy ra khi gửi yêu cầu. Quý khách vui lòng thử lại sau.');
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  // Handle Quick Quote Modal Form Submit (#modalQuoteForm)
  if (modalQuoteForm) {
    modalQuoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('modalQuoteName').value.trim();
      const phone = document.getElementById('modalQuotePhone').value.trim();
      const address = document.getElementById('modalQuoteAddress').value.trim();
      const message = document.getElementById('modalQuoteMsg').value.trim();
      const selectElement = document.getElementById('modalQuoteStone');
      const selectedStoneText = selectElement ? selectElement.options[selectElement.selectedIndex].text : 'Tư vấn sản phẩm khác...';

      if (!validatePhone(phone)) {
        showToast('Số điện thoại không hợp lệ. Cần gồm 10 chữ số (VD: 0941234567).');
        document.getElementById('modalQuotePhone').focus();
        return;
      }

      const submitBtn = modalQuoteForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : 'Nhận báo giá ngay';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang gửi yêu cầu...';
      }

      const payload = {
        customer_name: name,
        phone_number: phone,
        address: address,
        room_region: 'Modal báo giá (Tư vấn nhanh)',
        selected_stone_names: selectedStoneText,
        service_needed: 'Tư vấn báo giá bản vẽ',
        customer_note: message
      };

      const dbSuccess = await sendToSupabase(payload);
      if (dbSuccess) {
        await sendTelegramAlert(payload);
        showToast(`Cảm ơn anh/chị ${name}. Yêu cầu tư vấn sản phẩm "${selectedStoneText}" đã được tiếp nhận.`);
        modalQuoteForm.reset();
        closeModal();
      } else {
        showToast('Có lỗi xảy ra khi gửi yêu cầu. Quý khách vui lòng thử lại sau.');
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
}

// 7.5. Video Intro Modal
function initVideoModal() {
  const modal = document.getElementById('videoModal');
  const btnWatchVideo = document.getElementById('btnWatchVideo');
  const modalClose = modal ? modal.querySelector('#closeVideoModal') : null;
  const videoPlayer = document.getElementById('mainVideoPlayer');

  if (!modal || !btnWatchVideo || !videoPlayer) return;

  btnWatchVideo.addEventListener('click', () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    videoPlayer.play().catch(err => {
      console.warn("Autoplay was prevented by browser policy:", err);
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    videoPlayer.pause();
    videoPlayer.currentTime = 0;
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// 8. Newsletter Form Submit
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = form.querySelector('.newsletter-input');
    showToast(`Đăng ký bản tin thành công! Chúng tôi đã gửi thông tin ưu đãi đến địa chỉ: ${emailInput.value}`);
    form.reset();
  });
}

// Toast notification helper
function showToast(message) {
  // Create toast container if not exists
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 380px;
    `;
    document.body.appendChild(toastContainer);
  }

  // Create individual toast
  const toast = document.createElement('div');
  toast.style.cssText = `
    background-color: var(--bg-secondary);
    color: var(--text-primary);
    border-left: 4px solid var(--accent-gold);
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    font-family: var(--font-sans);
    font-size: 0.9rem;
    line-height: 1.4;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    border: 1px solid var(--border-color);
  `;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  // Trigger entering transition
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 50);

  // Auto remove after 5s
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      toast.remove();
    }, 450);
  }, 5000);
}

// 9. IntersectionObserver Fallback for Scroll Reveal Animations
function initScrollAnimations() {
  // Check if standard CSS ViewTimeline is supported
  const hasCSSScrollTimeline = CSS.supports('(animation-timeline: view()) and (animation-range: entry)');
  
  const revealElements = document.querySelectorAll('.reveal-scroll');
  
  if (!hasCSSScrollTimeline) {
    // If browser doesn't support scroll-driven animations natively, use JS fallback
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible');
          // Optional: Stop observing once revealed
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => {
      el.classList.add('fade-in-ready');
      observer.observe(el);
    });
  } else {
    // Natively handled by CSS. Make sure we clean classes in case
    revealElements.forEach(el => {
      el.style.opacity = '';
      el.style.transform = '';
    });
  }
}

/* ==========================================================================
   10. MULTI-STEP CONSULTATION FORM LOGIC (Supabase & Telegram Integration)
   ========================================================================== */

// Đọc cấu hình từ file config.js (window.APP_CONFIG) hoặc fallback về mặc định
const APP_CONFIG = window.APP_CONFIG || {};

// References to modular API services loaded from js/api/ folder
const sendToSupabase = (data) => window.SupabaseAPI.sendToSupabase(data);
const sendTelegramAlert = (data) => window.TelegramAPI.sendTelegramAlert(data);

// Danh sách dữ liệu mẫu đá theo không gian (Step 1 -> Step 2)
const STONE_DATABASE = {
  "Kitchen": [
    { name: "Đá Quartz Trắng Vân Calacatta", code: "QZ-801", thumb: "assets/images/stone_carrara.jpg" },
    { name: "Đá Granite Nero Marquina Gold", code: "GR-202", thumb: "assets/images/stone_nero.jpg" },
    { name: "Đá Thạch Anh Nhân Tạo Xám Nhẹ", code: "QZ-105", thumb: "assets/images/stone_terrazzo.jpg" }
  ],
  "Bathroom": [
    { name: "Đá Marble Trắng Carrara Ý", code: "MB-101", thumb: "assets/images/stone_carrara.jpg" },
    { name: "Đá Granite Đen Nero Marquina", code: "GR-202", thumb: "assets/images/stone_nero.jpg" },
    { name: "Đá Marble Vân Mây Thượng Hạng", code: "MB-104", thumb: "assets/images/stone_terrazzo.jpg" }
  ],
  "Living Room & Translucent Stone": [
    { name: "Tranh đá Onyx Xuyên Sáng Gold", code: "OX-301", thumb: "assets/images/stone_terrazzo.jpg" },
    { name: "Tranh đá Onyx Ngọc Xanh Xuyên Sáng", code: "OX-302", thumb: "assets/images/stone_carrara.jpg" },
    { name: "Đá Marble Calacatta Gold Vương Giả", code: "MB-102", thumb: "assets/images/stone_nero.jpg" }
  ],
  "Stairs & Exterior": [
    { name: "Đá Granite Đen Kim Sa Trung", code: "GR-201", thumb: "assets/images/stone_nero.jpg" },
    { name: "Đá Granite Vàng Solarius Brazil", code: "GR-205", thumb: "assets/images/stone_terrazzo.jpg" },
    { name: "Đá Granite Đỏ Bình Định", code: "GR-207", thumb: "assets/images/stone_carrara.jpg" }
  ],
  "Full House": [
    { name: "Đá Marble Trắng Carrara Ý", code: "MB-101", thumb: "assets/images/stone_carrara.jpg" },
    { name: "Đá Granite Nero Marquina Gold", code: "GR-202", thumb: "assets/images/stone_nero.jpg" },
    { name: "Tranh đá Onyx Xuyên Sáng Gold", code: "OX-301", thumb: "assets/images/stone_terrazzo.jpg" },
    { name: "Đá Quartz Trắng Vân Calacatta", code: "QZ-801", thumb: "assets/images/stone_carrara.jpg" }
  ]
};

const validatePhone = (phone) => {
  // VN Phone pattern: 10 digits starting with 03, 05, 07, 08, 09
  const pattern = /^(03|05|07|08|09)\d{8}$/;
  return pattern.test(phone.replace(/\s+/g, ''));
};

function initConsultationMultiStep() {
  const modal = document.getElementById('consultationModal');
  const closeBtn = document.getElementById('closeConsultationModal');
  const openBtns = document.querySelectorAll('.btn-open-consultation');
  const floatingBtn = document.getElementById('floatingCtaBtn');
  
  if (!modal) return;

  // Form State
  let currentStep = 1;
  const formData = {
    room_region: '',
    selected_stones: [],
    need_sample_visit: false,
    service_needed: 'Cử thợ đến đo đạc & khảo sát trực tiếp',
    customer_name: '',
    phone_number: '',
    address: '',
    customer_note: ''
  };

  // 1. Handle Floating Button Visibility on Scroll
  const handleScrollVisibility = () => {
    if (floatingBtn) {
      if (window.scrollY > 300) {
        floatingBtn.classList.add('visible');
      } else {
        floatingBtn.classList.remove('visible');
      }
    }
  };
  window.addEventListener('scroll', handleScrollVisibility);
  handleScrollVisibility(); // Check immediately

  // 2. Open Modal Events
  const openModal = () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    resetForm();
    goToStep(1);
  };

  openBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));
  


  // 3. Close Modal Events
  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // 4. Reset Form to initial state
  const resetForm = () => {
    currentStep = 1;
    formData.room_region = '';
    formData.selected_stones = [];
    formData.need_sample_visit = false;
    formData.service_needed = 'Cử thợ đến đo đạc & khảo sát trực tiếp';
    formData.customer_name = '';
    formData.phone_number = '';
    formData.address = '';
    formData.customer_note = '';

    // UI resets
    document.getElementById('multiStepConsultationForm').reset();
    document.getElementById('multiStepConsultationForm').style.display = 'block';
    document.getElementById('consultationSuccess').style.display = 'none';
    
    // Step cards reset
    document.querySelectorAll('.region-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('btnNext1').disabled = true;

    document.getElementById('stoneCustomOption').classList.remove('selected');
    
    // Service cards select first card by default
    document.querySelectorAll('.service-card').forEach((c, idx) => {
      if (idx === 0) c.classList.add('selected');
      else c.classList.remove('selected');
    });

    // Hide error
    document.getElementById('phoneError').style.display = 'none';
  };

  // 5. Navigate to specific Step
  const goToStep = (step) => {
    if (step < 1 || step > 4) return;
    currentStep = step;

    // Hide all step contents
    document.querySelectorAll('.step-content').forEach(content => {
      content.classList.remove('active');
    });

    // Show current step content
    document.getElementById(`step${step}`).classList.add('active');

    // Update Progress Bar
    const progressFill = document.getElementById('progressBarFill');
    if (progressFill) {
      progressFill.style.width = `${(step / 4) * 100}%`;
    }

    // Update Step Indicators
    document.querySelectorAll('.progress-step').forEach(indicator => {
      const stepNum = parseInt(indicator.getAttribute('data-step'));
      indicator.classList.remove('active', 'completed');
      
      if (stepNum === currentStep) {
        indicator.classList.add('active');
      } else if (stepNum < currentStep) {
        indicator.classList.add('completed');
      }
    });
  };

  // 6. Step Navigation Button Bindings
  document.querySelectorAll('.btn-prev').forEach(btn => {
    btn.addEventListener('click', () => {
      goToStep(currentStep - 1);
    });
  });

  // Step 1: Click Region Card
  const regionCards = document.querySelectorAll('.region-card');
  const btnNext1 = document.getElementById('btnNext1');

  regionCards.forEach(card => {
    card.addEventListener('click', () => {
      regionCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      
      formData.room_region = card.getAttribute('data-region');
      btnNext1.disabled = false;

      // Dynamic load stones for Step 2
      renderStonesForRegion(formData.room_region);

      // Auto advance to Step 2 for high engagement UX
      setTimeout(() => {
        if (currentStep === 1) goToStep(2);
      }, 400);
    });
  });

  if (btnNext1) {
    btnNext1.addEventListener('click', () => goToStep(2));
  }

  // Lọc mẫu đá thông minh từ database dựa trên không gian được chọn ở Step 1
  const getStonesForRegion = (region) => {
    const allProducts = window.allProducts || [];
    if (allProducts.length === 0) {
      return STONE_DATABASE[region] || [];
    }

    let filtered = [];
    const regLower = region.toLowerCase();
    
    if (regLower.includes('kitchen')) {
      // Bếp: Lấy đá granite, quartz, porcelain hoặc tên có chứa chữ bếp, đảo
      filtered = allProducts.filter(p => {
        const type = (p.stone_type || '').toLowerCase();
        const name = (p.name || '').toLowerCase();
        return type === 'granite' || type === 'quartz' || type === 'porcelain' || name.includes('bếp') || name.includes('đảo');
      });
    } else if (regLower.includes('bathroom')) {
      // Tắm: Lấy đá marble, granite, quartz hoặc tên có chứa tắm, lavabo
      filtered = allProducts.filter(p => {
        const type = (p.stone_type || '').toLowerCase();
        const name = (p.name || '').toLowerCase();
        return type === 'marble' || type === 'granite' || type === 'quartz' || name.includes('tắm') || name.includes('lavabo');
      });
    } else if (regLower.includes('living room')) {
      // Phòng khách/Tranh đá: Lấy đá xuyên sáng onyx (is_translucent === true) hoặc tên chứa tranh, onyx, xuyên sáng
      filtered = allProducts.filter(p => {
        const type = (p.stone_type || '').toLowerCase();
        const name = (p.name || '').toLowerCase();
        return p.is_translucent === true || type === 'onyx' || name.includes('onyx') || name.includes('tranh') || name.includes('xuyên sáng') || name.includes('vách') || name.includes('khách');
      });
    } else if (regLower.includes('stairs')) {
      // Cầu thang/Mặt tiền: Lấy đá có độ cứng cao như granite hoặc tên chứa cầu thang, mặt tiền, tam cấp
      filtered = allProducts.filter(p => {
        const type = (p.stone_type || '').toLowerCase();
        const name = (p.name || '').toLowerCase();
        return type === 'granite' || name.includes('cầu thang') || name.includes('mặt tiền') || name.includes('tam cấp') || name.includes('ngoại thất');
      });
    } else {
      // Toàn bộ căn nhà: Lấy toàn bộ sản phẩm
      filtered = allProducts;
    }

    // Ánh xạ sang cấu trúc hiển thị của mẫu đá
    const result = filtered.map(p => ({
      name: p.name,
      code: p.stone_type ? p.stone_type.toUpperCase() + '-' + p.id.toString().substring(0, 3).toUpperCase() : 'STONE-01',
      thumb: p.thumbnail_url || 'assets/images/stone_carrara.jpg'
    }));

    // Nếu lọc ra trống, fallback về danh sách tĩnh mặc định
    return result.length > 0 ? result : (STONE_DATABASE[region] || []);
  };

  // Step 2: Render & Handle Stone Choices
  const renderStonesForRegion = (region) => {
    const grid = document.getElementById('dynamicStoneGrid');
    if (!grid) return;

    grid.innerHTML = '';
    const stones = getStonesForRegion(region);

    stones.forEach(stone => {
      const card = document.createElement('div');
      card.className = 'stone-card';
      card.setAttribute('data-stone-name', stone.name);
      
      // Check if already selected
      const isSelected = formData.selected_stones.includes(stone.name);
      if (isSelected) card.classList.add('selected');

      card.innerHTML = `
        <div class="stone-thumb-wrapper">
          <img src="${stone.thumb}" alt="${stone.name}" class="stone-thumb">
        </div>
        <div class="stone-info">
          <h4 class="stone-name">${stone.name}</h4>
          <span class="stone-code">Mã: ${stone.code}</span>
        </div>
        <div class="stone-checkbox">✓</div>
      `;

      card.addEventListener('click', () => {
        card.classList.toggle('selected');
        const stoneName = stone.name;

        if (card.classList.contains('selected')) {
          if (!formData.selected_stones.includes(stoneName)) {
            formData.selected_stones.push(stoneName);
          }
        } else {
          formData.selected_stones = formData.selected_stones.filter(name => name !== stoneName);
        }
      });

      grid.appendChild(card);
    });
  };

  // Custom Step 2 option checkbox
  const customOption = document.getElementById('stoneCustomOption');
  if (customOption) {
    customOption.addEventListener('click', () => {
      customOption.classList.toggle('selected');
      formData.need_sample_visit = customOption.classList.contains('selected');
    });
  }

  const btnNext2 = document.getElementById('btnNext2');
  if (btnNext2) {
    btnNext2.addEventListener('click', () => {
      goToStep(3);
    });
  }

  // Step 3: Handle Service Select
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      serviceCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      formData.service_needed = card.getAttribute('data-service');
      
      // Auto advance to Step 4 after a short delay
      setTimeout(() => {
        if (currentStep === 3) goToStep(4);
      }, 400);
    });
  });

  const btnNext3 = document.querySelector('#step3 .btn-next');
  if (btnNext3) {
    btnNext3.addEventListener('click', () => {
      goToStep(4);
    });
  }

  // Step 4: Phone verification
  const phoneInput = document.getElementById('consultPhone');
  const phoneError = document.getElementById('phoneError');

  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      if (phoneError) phoneError.style.display = 'none';
    });
  }

  // Handle Form Submit (Step 4 Finalize)
  const form = document.getElementById('multiStepConsultationForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const phone = phoneInput.value;
      if (!validatePhone(phone)) {
        if (phoneError) phoneError.style.display = 'block';
        phoneInput.focus();
        return;
      }

      // Collect inputs
      formData.customer_name = document.getElementById('consultName').value;
      formData.phone_number = phone;
      formData.address = document.getElementById('consultAddress').value;
      formData.customer_note = document.getElementById('consultNote').value;

      // Disable submit button during fetch
      const submitBtn = document.getElementById('btnSubmitConsultation');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang gửi yêu cầu...';
      }

      // Format stones list
      let stonesString = formData.selected_stones.join(', ');
      if (formData.need_sample_visit) {
        stonesString += (stonesString ? ', ' : '') + 'Cần thợ mang mẫu đá thực tế qua tư vấn';
      }
      if (!stonesString) {
        stonesString = 'Chưa chọn mẫu đá cụ thể';
      }

      const payload = {
        customer_name: formData.customer_name,
        phone_number: formData.phone_number,
        address: formData.address,
        room_region: translateRegion(formData.room_region),
        selected_stone_names: stonesString,
        service_needed: formData.service_needed,
        customer_note: formData.customer_note
      };

      // 1. Submit to Supabase API
      const dbSuccess = await sendToSupabase(payload);

      // 2. Send Message notification to Telegram Bot
      if (dbSuccess) {
        await sendTelegramAlert(payload);
      }

      // 3. Show Success Screen
      form.style.display = 'none';
      const successScreen = document.getElementById('consultationSuccess');
      successScreen.style.display = 'flex';

      // 4. Handle countdown timer to close modal
      let countdown = 5;
      const timerSpan = document.getElementById('successTimer');
      if (timerSpan) timerSpan.textContent = countdown;

      const countdownInterval = setInterval(() => {
        countdown--;
        if (timerSpan) timerSpan.textContent = countdown;
        
        if (countdown <= 0) {
          clearInterval(countdownInterval);
          closeModal();
        }
      }, 1000);

      // Manual done button
      const doneBtn = document.getElementById('btnDoneConsultation');
      if (doneBtn) {
        doneBtn.onclick = () => {
          clearInterval(countdownInterval);
          closeModal();
        };
      }
    });
  }

  // Translators for better DB readable records
  const translateRegion = (region) => {
    switch (region) {
      case 'Kitchen': return 'Bàn bếp & Bàn đảo';
      case 'Bathroom': return 'Phòng tắm / Lavabo';
      case 'Living Room & Translucent Stone': return 'Vách TV / Tranh đá xuyên sáng';
      case 'Stairs & Exterior': return 'Cầu thang / Mặt tiền / Tam cấp';
      case 'Full House': return 'Toàn bộ căn nhà';
      default: return region;
    }
  };


}

/* ==========================================================================
   11. DYNAMIC CATALOG PRODUCTS LOADER (Supabase API GET)
   ========================================================================== */

// Danh sách sản phẩm dự phòng (Fallback) khi database Supabase trống hoặc lỗi kết nối
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    name: "White Carrara",
    stone_type: "marble",
    thumbnail_url: "assets/images/stone_carrara.jpg",
    price_range: "Dày: 20mm | Polished",
    is_translucent: false,
    description: "Nhập khẩu trực tiếp từ vùng Tuscany, Italy. Vân xám nhẹ trên nền tuyết trắng tinh tế."
  },
  {
    id: 2,
    name: "Nero Marquina Gold",
    stone_type: "granite",
    thumbnail_url: "assets/images/stone_nero.jpg",
    price_range: "Dày: 18mm | Polished",
    is_translucent: false,
    description: "Nền đen huyền bí điểm xuyết các đường chỉ trắng mảnh và vân vàng đồng vương giả."
  },
  {
    id: 3,
    name: "Palladiana Terrazzo",
    stone_type: "terrazzo",
    thumbnail_url: "assets/images/stone_terrazzo.jpg",
    price_range: "Dày: 20mm | Honed",
    is_translucent: false,
    description: "Kết tụ các mảnh vụn đá cẩm thạch trắng, quartz thô tạo nên bề mặt đá độc đáo, sáng tạo."
  }
];

// Chuẩn hóa loại đá từ Database tiếng Việt sang từ khóa tiếng Anh phục vụ lọc và phân loại
function normalizeStoneType(stoneType) {
  const t = (stoneType || '').toLowerCase();
  if (t.includes('marble') || t.includes('cẩm thạch')) return 'marble';
  if (t.includes('granite') || t.includes('hoa cương')) return 'granite';
  if (t.includes('quartz') || t.includes('thạch anh')) return 'quartz';
  if (t.includes('onyx') || t.includes('ngọc') || t.includes('xuyên sáng')) return 'onyx';
  if (t.includes('terrazzo')) return 'terrazzo';
  return 'other';
}

// Tải sản phẩm từ Supabase
async function fetchProductsAndInit() {
  window.allProducts = [];

  try {
    const data = await window.SupabaseAPI.fetchProductsFromSupabase();
    if (data && data.length > 0) {
      // Ánh xạ dữ liệu từ bảng product_images sang định dạng của giao diện Catalog
      window.allProducts = data.map(item => {
        const typeNormalized = normalizeStoneType(item.category);
        return {
          id: item.id,
          name: item.name,
          stone_type: typeNormalized,
          thumbnail_url: item.image_url,
          price_range: `Dày: ${item.thickness || '20mm'} | ${item.finish || 'Polished'}`,
          description: item.description,
          is_translucent: (item.category || '').toLowerCase().includes('xuyên sáng')
        };
      });
      console.log('Đã tải thành công danh sách sản phẩm từ Supabase (product_images):', window.allProducts);
    } else {
      console.log('Bảng product_images trên Supabase trống hoặc bị chặn RLS. Tải sản phẩm fallback.');
      window.allProducts = FALLBACK_PRODUCTS;
    }
  } catch (err) {
    console.warn('Lỗi kết nối database Supabase product_images. Tự động chuyển sang sản phẩm dự phòng:', err);
    window.allProducts = FALLBACK_PRODUCTS;
  } finally {
    renderCatalog(window.allProducts);
  }
}

// Vẽ sản phẩm động ra giao diện Catalog
function renderCatalog(products) {
  const grid = document.getElementById('catalogProductsGrid');
  if (!grid) return;

  grid.innerHTML = '';

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-category', (product.stone_type || 'other').toLowerCase());

    // Label loại đá
    let categoryLabel = 'Đá Tự Nhiên';
    const type = (product.stone_type || '').toLowerCase();
    if (type === 'marble') categoryLabel = 'Đá Marble Tự Nhiên';
    else if (type === 'granite') categoryLabel = 'Đá Granite Cao Cấp';
    else if (type === 'terrazzo') categoryLabel = 'Đá Terrazzo Ý';
    else if (type === 'quartz') categoryLabel = 'Đá Thạch Anh Nhân Tạo';
    else if (type === 'onyx') categoryLabel = 'Đá Onyx Xuyên Sáng';

    card.innerHTML = `
      <div class="product-img-wrapper">
        <img src="${product.thumbnail_url || 'assets/images/stone_carrara.jpg'}" alt="${product.name}" class="product-img">
      </div>
      <div class="product-info">
        <span class="product-category">${categoryLabel}</span>
        <h3 class="product-title">${product.name}</h3>
        <p class="product-desc">${product.description || 'Sản phẩm gạch đá ốp lát nghệ thuật chất lượng cao, nhập khẩu nguyên khối.'}</p>
        <div class="product-footer">
          <span class="product-spec">${product.price_range || 'Liên hệ báo giá'}</span>
          <a href="https://zalo.me/0833301330" target="_blank" rel="noopener noreferrer" class="btn-quote" style="text-decoration: none;">Báo giá &rarr;</a>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  // Tái kích hoạt bộ lọc và Lightbox cho các phần tử chèn động
  rebindDynamicCatalogEvents();
}

// Re-bind các sự kiện Lightbox và sự kiện click Báo Giá cho các thẻ HTML được render động
function rebindDynamicCatalogEvents() {
  // 1. Re-bind Lightbox
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
  const lightboxTitle = lightbox ? lightbox.querySelector('.lightbox-title') : null;
  const productImgs = document.querySelectorAll('#catalogProductsGrid .product-img');

  if (lightbox && lightboxImg && productImgs.length > 0) {
    productImgs.forEach(img => {
      img.addEventListener('click', () => {
        const card = img.closest('.product-card');
        const title = card ? card.querySelector('.product-title') : null;

        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || '';
        if (title && lightboxTitle) {
          lightboxTitle.textContent = title.textContent;
        }

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
  }

  // 2. Re-bind Báo Giá (Bypass, card link points to Zalo)
}

// 14. Horizontal Expanding Accordion Gallery
function initAccordionGallery() {
  const cards = document.querySelectorAll('.accordion-card');
  if (cards.length === 0) return;

  cards.forEach(card => {
    // Hover event for desktop
    card.addEventListener('mouseenter', () => {
      if (window.innerWidth > 768) {
        setActiveCard(card);
      }
    });

    // Click/Touch event for mobile and fallback
    card.addEventListener('click', () => {
      setActiveCard(card);
    });
  });

  function setActiveCard(activeCard) {
    cards.forEach(c => {
      if (c === activeCard) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });
  }
}


