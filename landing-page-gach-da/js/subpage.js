// ==========================================================================
// TUAN CHAU ATELIER - SUBPAGE CONTROLLER
// Handles theme, menu, Supabase dynamic loading & filtering for category pages
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initSubpageTheme();
  initSubpageMobileMenu();
  initSubpageLightbox();
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
      stone_type: "terrazzo",
      thumbnail_url: "assets/images/stone_terrazzo.jpg",
      price_range: "Hộp 12 viên | 200x200mm",
      description: "Họa tiết hoa văn nghệ thuật phong cách Phục Hưng cổ kính của Ý. Thích hợp lót sàn phòng tắm, bếp và tạo điểm nhấn hành lang."
    },
    {
      id: 102,
      name: "Gạch Men Rạn Emerald Handmade",
      stone_type: "other",
      thumbnail_url: "assets/images/stone_carrara.jpg",
      price_range: "Mã: EM-HAND | Dày: 10mm",
      description: "Màu xanh ngọc lục bảo sâu thẳm với bề mặt gợn sóng bán thủ công độc đáo phản chiếu ánh sáng dịu nhẹ."
    },
    {
      id: 103,
      name: "Gạch Palladiana Terrazzo Nghệ Thuật",
      stone_type: "terrazzo",
      thumbnail_url: "assets/images/stone_terrazzo.jpg",
      price_range: "Dày: 15mm | Honed",
      description: "Sự hòa quyện tuyệt vời giữa xi măng trắng tinh khiết và các mảnh vụn đá cẩm thạch màu đen, kem sang trọng."
    }
  ],
  'da-tu-nhien': [
    {
      id: 1,
      name: "White Carrara Marble",
      stone_type: "marble",
      thumbnail_url: "assets/images/stone_carrara.jpg",
      price_range: "Khổ lớn | Dày 20mm | Polished",
      description: "Dòng đá cẩm thạch huyền thoại từ mỏ đá Carrara nước Ý. Vân mây xám nhẹ nhàng, tao nhã trên nền tuyết trắng."
    },
    {
      id: 2,
      name: "Nero Marquina Gold",
      stone_type: "granite",
      thumbnail_url: "assets/images/stone_nero.jpg",
      price_range: "Khổ lớn | Dày 18mm | Polished",
      description: "Nền đá đen Nero Marquina điểm xuyết bằng những tia chớp trắng tinh anh và đường vân vàng kim vương giả."
    },
    {
      id: 4,
      name: "Royal Onyx Backlit",
      stone_type: "onyx",
      thumbnail_url: "assets/images/stone_onyx.jpg",
      price_range: "Xuyên sáng | Dày 20mm | Bookmatch",
      description: "Dòng đá ngọc tự nhiên quý hiếm nhập khẩu từ Iran. Có khả năng xuyên sáng tuyệt hảo, mang lại vượng khí cho gia chủ."
    },
    {
      id: 5,
      name: "Patagonia Quartzite",
      stone_type: "onyx",
      thumbnail_url: "assets/images/stone_patagonia.jpg",
      price_range: "Xuyên sáng | Dày 20mm | Polished",
      description: "Tác phẩm kỳ vĩ kết hợp thạch anh xuyên sáng trắng kem và các vân khoáng chất granite đen huyền bí từ Brazil."
    }
  ],
  'da-nhan-tao': [
    {
      id: 201,
      name: "Calacatta Gold Quartz",
      stone_type: "quartz",
      thumbnail_url: "assets/images/stone_patagonia.jpg",
      price_range: "Khổ lớn | Dày 20mm | Polished",
      description: "Thạch anh nhân tạo gốc thạch anh tự nhiên siêu cứng. Vân sấm sét màu xám và vàng đồng sắc sảo trên nền trắng tuyết."
    },
    {
      id: 202,
      name: "Nero Thunder Quartz",
      stone_type: "quartz",
      thumbnail_url: "assets/images/stone_nero.jpg",
      price_range: "Khổ lớn | Dày 20mm | Polished",
      description: "Bề mặt đá đen tuyền huyền bí chịu lực chịu nhiệt tốt, nổi bật bởi các đường vân sấm sét màu trắng tương phản mạnh mẽ."
    },
    {
      id: 203,
      name: "Pure White Crystal Quartz",
      stone_type: "quartz",
      thumbnail_url: "assets/images/stone_carrara.jpg",
      price_range: "Khổ lớn | Dày 20mm | Polished",
      description: "Trắng tinh khiết không tì vết kết hợp các hạt tinh thể thạch anh li ti lấp lánh phản chiếu ánh đèn sang trọng."
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
        return p.stone_type === 'terrazzo' || p.stone_type === 'other';
      } else if (type === 'da-tu-nhien') {
        return p.stone_type === 'marble' || p.stone_type === 'granite' || p.stone_type === 'onyx';
      } else if (type === 'da-nhan-tao') {
        return p.stone_type === 'quartz';
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
  if (t.includes('quartz') || t.includes('thạch anh')) return 'quartz';
  if (t.includes('onyx') || t.includes('ngọc') || t.includes('xuyên sáng')) return 'onyx';
  if (t.includes('terrazzo')) return 'terrazzo';
  return 'other';
}

function renderSubpageCatalog(products) {
  const grid = document.getElementById('subpageProductsGrid');
  if (!grid) return;

  grid.innerHTML = '';

  if (products.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">Chưa có sản phẩm nào trong danh mục này.</div>`;
    return;
  }

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-category', product.stone_type);

    let categoryLabel = 'Sản phẩm cao cấp';
    if (product.stone_type === 'marble') categoryLabel = 'Đá Marble Tự Nhiên';
    else if (product.stone_type === 'granite') categoryLabel = 'Đá Granite Tự Nhiên';
    else if (product.stone_type === 'onyx') categoryLabel = 'Đá Onyx Xuyên Sáng';
    else if (product.stone_type === 'quartz') categoryLabel = 'Đá Thạch Anh Nhân Tạo';
    else if (product.stone_type === 'terrazzo') categoryLabel = 'Terrazzo Nghệ Thuật';

    card.innerHTML = `
      <div class="product-img-wrapper">
        <img src="${product.thumbnail_url || 'assets/images/stone_carrara.jpg'}" alt="${product.name}" class="product-img">
      </div>
      <div class="product-info">
        <span class="product-category">${categoryLabel}</span>
        <h3 class="product-title">${product.name}</h3>
        <p class="product-desc">${product.description || 'Sản phẩm chất lượng cao, thiết kế độc bản cho không gian sang trọng.'}</p>
        <div class="product-meta" style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px;">
          <span class="product-price" style="color: var(--accent-gold); font-size: 0.9rem; font-weight: 500;">${product.price_range || 'Liên hệ báo giá'}</span>
          <a href="https://zalo.me/0833301330" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-product-cta" style="padding: 6px 16px; font-size: 0.85rem;">Liên hệ</a>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  // Re-bind click image to open lightbox
  rebindSubpageLightboxEvents();
}

// 5. Filter Tab Handling
function initSubpageFilterTabs() {
  const filterBtns = document.querySelectorAll('.sub-filter-btn');
  if (filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');
      if (filterVal === 'all') {
        renderSubpageCatalog(currentFilteredProducts);
      } else {
        const filtered = currentFilteredProducts.filter(p => p.stone_type === filterVal);
        renderSubpageCatalog(filtered);
      }
    });
  });
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
