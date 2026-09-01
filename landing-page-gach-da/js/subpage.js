// ==========================================================================
// TUAN CHAU ATELIER - SUBPAGE CONTROLLER
// Handles theme, menu, Supabase dynamic loading & filtering for category pages
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initSubpageTheme();
  initSubpageMobileMenu();
  initSubpageLightbox();
  initSubpageSwipeGesture();
  fetchSubpageProducts();
});

// 1. Dark/Light Theme Sync & Toggle
function initSubpageTheme() {
  const themeBtn = document.getElementById('themeToggleBtn');
  if (!themeBtn) return;

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.content = theme === 'dark' ? 'light dark' : 'light';
  };

  const currentTheme = localStorage.getItem('color-scheme') || 'light';
  applyTheme(currentTheme);

  themeBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('color-scheme', newTheme);
  });
}

// 2. Mobile Menu Navigation
function initSubpageMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navMenu.classList.toggle('active');
    toggleBtn.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && e.target !== toggleBtn) {
      navMenu.classList.remove('active');
      toggleBtn.classList.remove('active');
    }
  });
}

// 3. Category Fallback Products
const SUBPAGE_FALLBACKS = {
  'gach-art': [
    {
      id: 101,
      name: "Gạch Bông Florence Classic",
      stone_type: "bong",
      thumbnail_url: "assets/images/gach_art/tile_florence_vintage.jpg",
      price_range: "Hộp 12 viên | 200x200mm",
      description: "Họa tiết hoa văn nghệ thuật phong cách Phục Hưng Ý cổ kính, men mờ chống trơn cao cấp cho phòng tắm, bếp và hiên nhà."
    },
    {
      id: 102,
      name: "Gạch Men Rạn Emerald Handmade",
      stone_type: "men-ran",
      thumbnail_url: "assets/images/gach_art/tile_emerald_glaze.jpg",
      price_range: "Khổ 75x300mm | Dày 10mm",
      description: "Màu xanh ngọc lục bảo sâu thẳm với bề mặt men rạn gợn sóng bán thủ công độc đáo, phản chiếu ánh sáng dịu nhẹ quý phái."
    },
    {
      id: 103,
      name: "Gạch Zellige Ánh Ngọc Champagne",
      stone_type: "zellige",
      thumbnail_url: "assets/images/gach_art/tile_zellige_pearl.jpg",
      price_range: "Khổ 100x100mm | Dày 12mm",
      description: "Gốm Zellige thủ công truyền thống với độ bóng xà cừ óng ánh bắt sáng tự nhiên, kiến tạo không gian spa thư giãn đẳng cấp."
    },
    {
      id: 104,
      name: "Gạch Palladiana Terrazzo Nghệ Thuật",
      stone_type: "terrazzo",
      thumbnail_url: "assets/images/gach_art/tile_terrazzo_art.jpg",
      price_range: "Khổ 600x600mm | Dày 15mm | Honed",
      description: "Sự kết hợp các mảnh đá cẩm thạch Calacatta và Nero Marquina cỡ lớn đúc trên nền xi măng xám ấm, phong cách Venetian kinh điển."
    },
    {
      id: 105,
      name: "Gạch Terrazzo Ý Hạt Nhuyễn Modern",
      stone_type: "terrazzo",
      thumbnail_url: "assets/images/da_tu_nhien/stone_terrazzo.jpg",
      price_range: "Khổ 600x1200mm | Dày 12mm",
      description: "Hạt đá cẩm thạch trắng nhỏ li ti phân bố đồng đều, chống trầy xước và tạo cảm giác liền mạch thanh lịch cho không gian hiện đại."
    }
  ],
  'da-tu-nhien': [
    {
      id: 1,
      name: "Calacatta Gold Marble Ý",
      stone_type: "marble",
      thumbnail_url: "assets/images/da_tu_nhien/stone_calacatta_gold.jpg",
      price_range: "Khổ lớn nguyên tấm | Dày 20mm | Polished",
      description: "Đá cẩm thạch vương giả từ mỏ Carrara nước Ý với dải vân vàng đồng và xám khói sắc nét trên nền tuyết trắng tinh khiết."
    },
    {
      id: 2,
      name: "Verde Alpi & Emerald Granite",
      stone_type: "granite",
      thumbnail_url: "assets/images/da_tu_nhien/stone_verde_emerald.jpg",
      price_range: "Khổ lớn nguyên tấm | Dày 20mm | Polished",
      description: "Đá hoa cương xanh ngọc lục bảo nhập khẩu Brazil đan xen các tinh thể khoáng chất vàng lấp lánh như một bức tranh rừng nhiệt đới."
    },
    {
      id: 3,
      name: "Spanish Nero Marquina Natural",
      stone_type: "marble",
      thumbnail_url: "assets/images/da_tu_nhien/stone_nero_natural.jpg",
      price_range: "Khổ lớn nguyên tấm | Dày 18mm | Polished",
      description: "Nền đen huyền bí nguyên bản điểm xuyết các dải vân tia chớp trắng tinh anh và chỉ vàng đồng sắc sảo của xứ sở Tây Ban Nha."
    },
    {
      id: 4,
      name: "Royal Onyx Backlit Xuyên Sáng",
      stone_type: "onyx",
      thumbnail_url: "assets/images/da_tu_nhien/stone_royal_onyx_backlit.jpg",
      price_range: "Xuyên sáng 100% | Dày 20mm | Bookmatch",
      description: "Đá ngọc tự nhiên quý hiếm nhập khẩu Iran với khả năng phát sáng huyền ảo khi lắp đèn LED sau lưng, mang lại vượng khí cho gia chủ."
    },
    {
      id: 5,
      name: "Patagonia Quartzite Brazil",
      stone_type: "quartzite",
      thumbnail_url: "assets/images/da_tu_nhien/stone_patagonia.jpg",
      price_range: "Xuyên sáng | Dày 20mm | Polished",
      description: "Sự kết hợp kỳ vĩ giữa thạch anh xuyên sáng trắng kem và các vân khoáng chất granite đen huyền bí từ núi lửa Brazil."
    },
    {
      id: 6,
      name: "White Carrara Classic Marble",
      stone_type: "marble",
      thumbnail_url: "assets/images/da_tu_nhien/stone_carrara.jpg",
      price_range: "Khổ lớn | Dày 20mm | Polished",
      description: "Dòng đá cẩm thạch huyền thoại từ mỏ đá Carrara nước Ý. Vân mây xám nhẹ nhàng, tao nhã trên nền tuyết trắng trường tồn."
    }
  ],
  'da-nhan-tao': [
    {
      id: 201,
      name: "Calacatta Gold Engineered Quartz",
      stone_type: "calacatta",
      thumbnail_url: "assets/images/da_nhan_tao/quartz_calacatta_lux.jpg",
      price_range: "Khổ lớn 3200x1600mm | Dày 20mm | Polished",
      description: "Thạch anh nhân tạo cao cấp bề mặt bóng gương, chống ố chống trầy xước và chịu nhiệt siêu việt cho bàn bếp, đảo và vách tivi."
    },
    {
      id: 202,
      name: "Nero Storm Lightning Quartz",
      stone_type: "storm",
      thumbnail_url: "assets/images/da_nhan_tao/quartz_nero_storm.jpg",
      price_range: "Khổ lớn 3200x1600mm | Dày 20mm | Satin Honed",
      description: "Bề mặt đá đen nhám satin huyền bí với mạng lưới vân sấm sét trắng tương phản mạnh mẽ, không bám vân tay và dễ vệ sinh."
    },
    {
      id: 203,
      name: "Pure White Crystal Quartz",
      stone_type: "crystal",
      thumbnail_url: "assets/images/da_nhan_tao/quartz_pure_crystal.jpg",
      price_range: "Khổ lớn 3000x1400mm | Dày 20mm | Polished",
      description: "Trắng tinh khiết không ố màu kết hợp các hạt tinh thể vi kim cương lấp lánh phản chiếu ánh đèn sang trọng đẳng cấp."
    },
    {
      id: 204,
      name: "Travertine Fusion Quartz",
      stone_type: "travertine",
      thumbnail_url: "assets/images/da_nhan_tao/quartz_travertine_slab.jpg",
      price_range: "Khổ lớn 3200x1600mm | Dày 18mm | Honed",
      description: "Vân thớ gỗ travertine thẳng tắp màu be ấm áp kết cấu thạch anh siêu bền, ứng dụng hoàn hảo cho các mảng tường ốp trang trí biệt thự."
    },
    {
      id: 205,
      name: "Patagonia Fusion Quartz",
      stone_type: "calacatta",
      thumbnail_url: "assets/images/da_tu_nhien/stone_patagonia.jpg",
      price_range: "Khổ lớn 3200x1600mm | Dày 20mm | Polished",
      description: "Mô phỏng chân thực vân đá thạch anh tự nhiên Patagonia với độ cứng 7/10 Mohs, chống thấm nước tuyệt đối 100%."
    }
  ]
};

// 4. Load Products & Filter
let currentFilteredProducts = [];

async function fetchSubpageProducts() {
  const type = window.subpageType || 'da-tu-nhien';
  const grid = document.getElementById('subpageProductsGrid');
  if (!grid) return;

  let loadedProducts = [];

  try {
    if (window.SupabaseAPI && typeof window.SupabaseAPI.fetchProductsFromSupabase === 'function') {
      const dbData = await window.SupabaseAPI.fetchProductsFromSupabase();
      if (dbData && dbData.length > 0) {
        loadedProducts = dbData.map(item => {
          const typeNormalized = normalizeSubpageStoneType(item.category);
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
      }
    }
  } catch (err) {
    console.warn('Lỗi kết nối Supabase API, dùng dữ liệu fallback:', err);
  }

  // Filter loaded products or merge with fallback
  if (loadedProducts.length === 0) {
    loadedProducts = SUBPAGE_FALLBACKS[type] || [];
  } else {
    // Filter database items based on page type
    loadedProducts = loadedProducts.filter(p => {
      if (type === 'gach-art') {
        return p.stone_type === 'terrazzo' || p.stone_type === 'men-ran' || p.stone_type === 'bong' || p.stone_type === 'zellige' || p.stone_type === 'other';
      } else if (type === 'da-tu-nhien') {
        return p.stone_type === 'marble' || p.stone_type === 'granite' || p.stone_type === 'onyx' || p.stone_type === 'quartzite';
      } else if (type === 'da-nhan-tao') {
        return p.stone_type === 'calacatta' || p.stone_type === 'storm' || p.stone_type === 'crystal' || p.stone_type === 'travertine' || p.stone_type === 'quartz';
      }
      return true;
    });

    // If database returned no products matching this type, load fallback
    if (loadedProducts.length === 0) {
      loadedProducts = SUBPAGE_FALLBACKS[type] || [];
    }
  }

  currentFilteredProducts = loadedProducts;
  renderSubpageCatalog(currentFilteredProducts);
  initSubpageFilterTabs();
}

function normalizeSubpageStoneType(stoneType) {
  const t = (stoneType || '').toLowerCase();
  if (t.includes('marble') || t.includes('cẩm thạch')) return 'marble';
  if (t.includes('granite') || t.includes('hoa cương')) return 'granite';
  if (t.includes('onyx') || t.includes('ngọc') || t.includes('xuyên sáng')) return 'onyx';
  if (t.includes('quartzite')) return 'quartzite';
  if (t.includes('calacatta')) return 'calacatta';
  if (t.includes('storm') || t.includes('sấm')) return 'storm';
  if (t.includes('crystal') || t.includes('pha lê')) return 'crystal';
  if (t.includes('travertine')) return 'travertine';
  if (t.includes('quartz') || t.includes('thạch anh')) return 'calacatta';
  if (t.includes('men rạn') || t.includes('glaze')) return 'men-ran';
  if (t.includes('bông') || t.includes('florence')) return 'bong';
  if (t.includes('zellige')) return 'zellige';
  if (t.includes('terrazzo')) return 'terrazzo';
  return 'other';
}

function renderSubpageCatalog(products) {
  const grid = document.getElementById('subpageProductsGrid');
  if (!grid) return;

  grid.innerHTML = '';

  if (products.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">Chưa có sản phẩm nào trong phân loại này.</div>`;
    return;
  }

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-category', product.stone_type);

    let categoryLabel = 'Sản phẩm cao cấp';
    if (product.stone_type === 'marble') categoryLabel = 'Đá Marble Tự Nhiên (Italy)';
    else if (product.stone_type === 'granite') categoryLabel = 'Đá Granite Tự Nhiên (Brazil)';
    else if (product.stone_type === 'onyx') categoryLabel = 'Đá Onyx Xuyên Sáng (Iran)';
    else if (product.stone_type === 'quartzite') categoryLabel = 'Đá Quartzite Tự Nhiên (Brazil)';
    else if (product.stone_type === 'calacatta') categoryLabel = 'Đá Thạch Anh Calacatta Quartz';
    else if (product.stone_type === 'storm') categoryLabel = 'Đá Thạch Anh Nero Storm Quartz';
    else if (product.stone_type === 'crystal') categoryLabel = 'Đá Thạch Anh Pure Crystal';
    else if (product.stone_type === 'travertine') categoryLabel = 'Đá Travertine Quartz Nhân Tạo';
    else if (product.stone_type === 'bong') categoryLabel = 'Gạch Bông Nghệ Thuật Ý';
    else if (product.stone_type === 'men-ran') categoryLabel = 'Gạch Men Rạn Handmade';
    else if (product.stone_type === 'zellige') categoryLabel = 'Gạch Zellige Ánh Xà Cừ';
    else if (product.stone_type === 'terrazzo') categoryLabel = 'Gạch Terrazzo Nghệ Thuật';

    card.innerHTML = `
      <div class="product-img-wrapper">
        <img src="${product.thumbnail_url || 'assets/images/da_tu_nhien/stone_carrara.jpg'}" alt="${product.name}" class="product-img" loading="lazy">
        <div class="product-img-overlay">
          <span class="btn-zoom-action">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"/>
            </svg>
            <span>Xem Chi Tiết Vân</span>
          </span>
        </div>
        <div class="product-badge-origin">${categoryLabel}</div>
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-desc">${product.description || 'Sản phẩm chất lượng cao, thiết kế độc bản cho không gian sang trọng.'}</p>
        <div class="product-spec-row">
          <span class="product-spec-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/>
            </svg>
            ${product.price_range || 'Quy cách chuẩn Atelier'}
          </span>
        </div>
        <div class="product-card-footer">
          <div class="product-price-box">
            <span class="price-caption">Báo giá dự án</span>
            <span class="price-value">Liên hệ Atelier</span>
          </div>
          <a href="https://zalo.me/0833301330" target="_blank" rel="noopener noreferrer" class="btn-product-contact">
            <span>Tư vấn</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
            </svg>
          </a>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  // Re-bind click image to open lightbox
  rebindSubpageLightboxEvents();
}

// 5. Luxury Dock Filter with Moving Light Indicator
function initSubpageFilterTabs() {
  const dock = document.querySelector('.luxury-dock-filter');
  const indicator = document.getElementById('dockIndicator');
  const filterBtns = document.querySelectorAll('.sub-filter-btn');
  if (filterBtns.length === 0) return;

  function updateIndicator(targetBtn, isInitial = false) {
    if (!dock || !indicator || !targetBtn) return;

    const left = targetBtn.offsetLeft;
    const top = targetBtn.offsetTop;
    const width = targetBtn.offsetWidth;
    const height = targetBtn.offsetHeight;

    if (isInitial) {
      indicator.style.transition = 'none';
      indicator.style.transform = `translate3d(${left}px, ${top}px, 0)`;
      indicator.style.width = `${width}px`;
      indicator.style.height = `${height}px`;
      indicator.style.opacity = '1';
      requestAnimationFrame(() => {
        indicator.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease';
      });
    } else {
      indicator.style.transform = `translate3d(${left}px, ${top}px, 0)`;
      indicator.style.width = `${width}px`;
      indicator.style.height = `${height}px`;
      indicator.style.opacity = '1';
    }
  }

  // Initial indicator position
  const activeBtn = document.querySelector('.sub-filter-btn.active') || filterBtns[0];
  setTimeout(() => {
    updateIndicator(activeBtn, true);
  }, 100);

  window.addEventListener('resize', () => {
    const currentActive = document.querySelector('.sub-filter-btn.active') || filterBtns[0];
    updateIndicator(currentActive, true);
  });

  filterBtns.forEach(btn => {
    // Hover gliding light (desktop)
    btn.addEventListener('mouseenter', () => {
      updateIndicator(btn);
    });

    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      updateIndicator(btn);

      // Smooth scroll button into view on mobile
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

      const filterVal = btn.getAttribute('data-filter');
      if (filterVal === 'all') {
        renderSubpageCatalog(currentFilteredProducts);
      } else {
        const filtered = currentFilteredProducts.filter(p => p.stone_type === filterVal);
        renderSubpageCatalog(filtered);
      }
    });
  });

  if (dock) {
    dock.addEventListener('mouseleave', () => {
      const currentActive = document.querySelector('.sub-filter-btn.active') || filterBtns[0];
      updateIndicator(currentActive);
    });
  }
}

// 6. Lightbox Handler
function initSubpageLightbox() {
  const lightbox = document.getElementById('lightboxModal');
  if (!lightbox) return;

  const closeBtn = lightbox.querySelector('.lightbox-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });
}

function rebindSubpageLightboxEvents() {
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
  const lightboxTitle = lightbox ? lightbox.querySelector('.lightbox-title') : null;
  const productImgs = document.querySelectorAll('#subpageProductsGrid .product-img');

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
      });
    });
  }
}

// 7. Mobile Touch Swipe To Go Back Gesture
function initSubpageSwipeGesture() {
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  let touchStartedInFilter = false;
  let isSwiping = false;

  // Create Toast Element if not present
  let toast = document.querySelector('.swipe-back-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'swipe-back-toast';
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
      </svg>
      <span>Đang quay lại Trang chủ...</span>
    `;
    document.body.appendChild(toast);
  }

  const handleNavigateHome = () => {
    if (isSwiping) return;
    isSwiping = true;

    // Toast & haptic feedback
    toast.classList.add('active');
    if (navigator.vibrate) {
      navigator.vibrate([25, 20]);
    }

    document.body.classList.add('page-exit-left');

    setTimeout(() => {
      window.location.href = 'index.html#categories';
    }, 220);
  };

  window.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();

    // Check if the user is scrolling inside the filter dock menu
    touchStartedInFilter = !!(e.target && (
      e.target.closest('.luxury-dock-filter') ||
      e.target.closest('.filters-bar-wrapper') ||
      e.target.closest('.portfolio-filters')
    ));
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (e.changedTouches.length !== 1) return;

    // If user interacted with the filter dock, NEVER trigger swipe back to home
    const touchEndedInFilter = !!(e.target && (
      e.target.closest('.luxury-dock-filter') ||
      e.target.closest('.filters-bar-wrapper') ||
      e.target.closest('.portfolio-filters')
    ));

    if (touchStartedInFilter || touchEndedInFilter) {
      touchStartedInFilter = false;
      return;
    }
    
    // If lightbox is open, do not trigger page swipe navigation
    const lightbox = document.getElementById('lightboxModal');
    if (lightbox && lightbox.classList.contains('active')) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const deltaTime = Date.now() - touchStartTime;

    // Check if horizontal swipe on the general page canvas
    const isHorizontalSwipe = Math.abs(deltaX) > 75 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4 && deltaTime < 500;

    // Swipe Left (deltaX < -75) or Edge Swipe Right from left boundary (deltaX > 75 && touchStartX < 60)
    if (isHorizontalSwipe) {
      if (deltaX < -75 || (deltaX > 75 && touchStartX < 60)) {
        handleNavigateHome();
      }
    }
  }, { passive: true });
}
