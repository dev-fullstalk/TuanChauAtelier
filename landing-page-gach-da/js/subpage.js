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
      name: "Gạch Bông Hoàng Gia Venice",
      stone_type: "bong",
      thumbnail_url: "assets/images/gach_art/tile_venice_royal.jpg",
      price_range: "Khổ 200x200mm | Dày 16mm | Men Satin",
      description: "Họa tiết đối xứng kinh điển Venice kết hợp xanh cobalt hoàng gia và vàng gold đất nung, tinh hoa gạch bông châu Âu thế kỷ 18."
    },
    {
      id: 102,
      name: "Gạch Men Rạn Sapphire Biển Sâu",
      stone_type: "men-ran",
      thumbnail_url: "assets/images/gach_art/tile_sapphire_crackle.jpg",
      price_range: "Khổ 75x300mm | Dày 10mm | Men Bóng Rạn",
      description: "Sắc xanh sapphire đại dương huyền bí với mạng lưới vi rạn thủy tinh tự nhiên bóng loáng, bắt sáng gợn sóng tuyệt mỹ."
    },
    {
      id: 103,
      name: "Gạch Zellige Xanh Rêu Olive Handmade",
      stone_type: "zellige",
      thumbnail_url: "assets/images/gach_art/tile_zellige_olive.jpg",
      price_range: "Khổ 100x100mm | Dày 12mm | Terracotta",
      description: "Gốm Morocco nung tay truyền thống với dải màu xanh olive đa tầng và ánh xà cừ ngọc bích óng ánh khi có ánh đèn chiếu rọi."
    },
    {
      id: 104,
      name: "Gạch Terrazzo Rose & Amber Marble",
      stone_type: "terrazzo",
      thumbnail_url: "assets/images/gach_art/tile_terrazzo_rose_amber.jpg",
      price_range: "Khổ 600x600mm | Dày 18mm | Polished",
      description: "Hạt cẩm thạch hồng Rose Ý và đá thạch anh hổ phách cỡ lớn đúc nguyên khối trên nền xi măng kem ấm phong cách Venetian."
    },
    {
      id: 105,
      name: "Gạch Vảy Cá Men Xà Cừ Ngọc Trai",
      stone_type: "men-ran",
      thumbnail_url: "assets/images/gach_art/tile_pearl_fishscale.jpg",
      price_range: "Vỉ mosaic 300x300mm | Dày 8mm",
      description: "Họa tiết nan quạt vảy cá gợn sóng men bóng xà cừ óng ả Oyster Pearl, tạo điểm nhấn nghệ thuật hút mắt cho mảng tường phòng tắm và bếp."
    },
    {
      id: 106,
      name: "Gạch Mosaic Lục Giác Marble Brass Inlay",
      stone_type: "zellige",
      thumbnail_url: "assets/images/gach_art/tile_hexagon_brass_mosaic.jpg",
      price_range: "Khổ vỉ 300x300mm | Dày 10mm | Honed",
      description: "Đá cẩm thạch trắng Carrara cắt lục giác viền chỉ đồng thau chải xước sang trọng, kiến tạo vẻ đẹp hiện đại thời thượng."
    },
    {
      id: 107,
      name: "Gạch Bông Cổ Điển Andalucia",
      stone_type: "bong",
      thumbnail_url: "assets/images/gach_art/tile_andalucia_vintage.jpg",
      price_range: "Khổ 200x200mm | Dày 16mm | Men Chalky",
      description: "Họa tiết hoa văn đất nung và xanh lá thảo mộc phong cách Tây Ban Nha mộc mạc hoài cổ, bề mặt êm chân chống trơn hoàn hảo."
    },
    {
      id: 108,
      name: "Gạch Bông Florence Classic",
      stone_type: "bong",
      thumbnail_url: "assets/images/gach_art/tile_florence_vintage.jpg",
      price_range: "Khổ 200x200mm | Dày 16mm | Men Mờ",
      description: "Họa tiết hoa văn nghệ thuật phong cách Phục Hưng Ý cổ kính, men mờ chống trơn cao cấp cho phòng tắm, bếp và hiên nhà."
    },
    {
      id: 109,
      name: "Gạch Men Rạn Emerald Handmade",
      stone_type: "men-ran",
      thumbnail_url: "assets/images/gach_art/tile_emerald_glaze.jpg",
      price_range: "Khổ 75x300mm | Dày 10mm | Men Bóng Rạn",
      description: "Màu xanh ngọc lục bảo sâu thẳm với bề mặt men rạn gợn sóng bán thủ công độc đáo, phản chiếu ánh sáng dịu nhẹ quý phái."
    },
    {
      id: 110,
      name: "Gạch Zellige Ánh Ngọc Champagne",
      stone_type: "zellige",
      thumbnail_url: "assets/images/gach_art/tile_zellige_pearl.jpg",
      price_range: "Khổ 100x100mm | Dày 12mm | Handmade",
      description: "Gốm Zellige thủ công truyền thống với độ bóng xà cừ óng ánh bắt sáng tự nhiên, kiến tạo không gian spa thư giãn đẳng cấp."
    },
    {
      id: 111,
      name: "Gạch Palladiana Terrazzo Nghệ Thuật",
      stone_type: "terrazzo",
      thumbnail_url: "assets/images/gach_art/tile_terrazzo_art.jpg",
      price_range: "Khổ 600x600mm | Dày 15mm | Honed",
      description: "Sự kết hợp các mảnh đá cẩm thạch Calacatta và Nero Marquina cỡ lớn đúc trên nền xi măng xám ấm, phong cách Venetian kinh điển."
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
    },
    {
      id: 7,
      name: "Nero Marquina Midnight Marble",
      stone_type: "marble",
      thumbnail_url: "assets/images/da_tu_nhien/stone_nero.jpg",
      price_range: "Khổ lớn nguyên tấm | Dày 20mm | Polished",
      description: "Đá cẩm thạch đen bóng gương Tây Ban Nha với dải vân chỉ trắng đối xứng tinh xảo, tôn vinh phong cách nội thất tối giản quyền quý."
    },
    {
      id: 8,
      name: "Honey Amber Onyx Xuyên Sáng",
      stone_type: "onyx",
      thumbnail_url: "assets/images/da_tu_nhien/stone_onyx.jpg",
      price_range: "Xuyên sáng 100% | Dày 20mm | Polished",
      description: "Sắc vàng mật ong hổ phách ấm áp với những đường lượn sóng tự nhiên bừng sáng lộng lẫy dưới ánh đèn xuyên sáng."
    },
    {
      id: 9,
      name: "Venetian Terrazzo Tự Nhiên",
      stone_type: "granite",
      thumbnail_url: "assets/images/da_tu_nhien/stone_terrazzo.jpg",
      price_range: "Khổ lớn 600x1200mm | Dày 20mm | Honed",
      description: "Cốt đá cẩm thạch tự nhiên hạt lớn phối màu trung tính Ý, độ bền vĩnh cửu và khả năng chịu lực tối ưu cho sàn đại sảnh và cầu thang."
    },
    {
      id: 10,
      name: "Blue Bahia Granite Hoàng Gia",
      stone_type: "granite",
      thumbnail_url: "assets/images/da_tu_nhien/stone_blue_bahia.jpg",
      price_range: "Khổ lớn nguyên tấm | Dày 20mm | Polished",
      description: "Đá hoa cương xanh hoàng gia Blue Bahia nhập khẩu Brazil, dải khoáng chất xanh lam quý hiếm xen lẫn vân vàng đồng quý tộc."
    },
    {
      id: 11,
      name: "Panda White Marble Thủy Mặc",
      stone_type: "marble",
      thumbnail_url: "assets/images/da_tu_nhien/stone_panda_white.jpg",
      price_range: "Khổ lớn nguyên tấm | Dày 20mm | Bookmatch",
      description: "Bức họa thủy mặc phương Đông với dải vân đen mun cuộn trào sắc nét trên nền tuyết trắng tinh khiết, điểm nhấn vách đại sảnh vương giả."
    },
    {
      id: 12,
      name: "Lemurian Blue Labradorite Ánh Xà Cừ",
      stone_type: "granite",
      thumbnail_url: "assets/images/da_tu_nhien/stone_labradorite_lemurian.jpg",
      price_range: "Khổ lớn nguyên tấm | Dày 20mm | Polished",
      description: "Đá hóa ngọc quý hiếm với các tinh thể khoáng chất xanh lông công phát quang óng ánh dưới ánh sáng, tuyệt tác kiến trúc độc bản."
    },
    {
      id: 13,
      name: "Calacatta Viola Marble Ý",
      stone_type: "marble",
      thumbnail_url: "assets/images/da_tu_nhien/stone_calacatta_viola.jpg",
      price_range: "Khổ lớn Bookmatch | Dày 20mm | Polished",
      description: "Tuyệt tác cẩm thạch Ý kinh điển với mạng vân breccia đỏ rượu vang Cabernet và tím khói ấn tượng trên nền kem trắng trang nhã."
    },
    {
      id: 14,
      name: "Green Onyx Ngọc Bích Xuyên Sáng",
      stone_type: "onyx",
      thumbnail_url: "assets/images/da_tu_nhien/stone_green_onyx.jpg",
      price_range: "Xuyên sáng 100% | Dày 20mm | LED Backlit",
      description: "Tranh đá ngọc bích tự nhiên xanh ngọc lam thanh khiết đan xen dải vân hổ phách ấm cúng, phát sáng huyền ảo dưới hệ đèn LED."
    },
    {
      id: 15,
      name: "Roman Travertino Navona La Mã",
      stone_type: "marble",
      thumbnail_url: "assets/images/da_tu_nhien/stone_travertino_navona.jpg",
      price_range: "Khổ lớn 600x1200mm | Dày 20mm | Vein-cut",
      description: "Đá vôi La Mã trầm tích tự nhiên với dải vân thớ gỗ màu kem be ấm áp, kiến tạo không gian sống phong cách Địa Trung Hải quý phái."
    },
    {
      id: 16,
      name: "Amazonite Turquoise Quartzite Brazil",
      stone_type: "quartzite",
      thumbnail_url: "assets/images/da_tu_nhien/stone_amazonite_turquoise.jpg",
      price_range: "Khổ lớn nguyên tấm | Dày 20mm | Polished",
      description: "Thạch anh tự nhiên xanh ngọc lam Amazonite nhập khẩu Brazil, dải màu ngọc bích phối tinh thể thạch anh trắng tạo nên chiều sâu mê hoặc."
    },
    {
      id: 17,
      name: "Statuario Venato Penthouse Marble",
      stone_type: "marble",
      thumbnail_url: "assets/images/da_tu_nhien/stone_statuario_venato.jpg",
      price_range: "Khổ lớn nguyên tấm | Dày 20mm | Polished",
      description: "Dòng đá cẩm thạch Ý thượng hạng với mạng lưới vân xám đậm sắc sảo nổi bật trên nền tuyết trắng, tôn vinh đẳng cấp không gian Penthouse."
    },
    {
      id: 18,
      name: "Black Fusion Granite Magma",
      stone_type: "granite",
      thumbnail_url: "assets/images/da_tu_nhien/stone_black_fusion.jpg",
      price_range: "Khổ lớn nguyên tấm | Dày 20mm | Polished",
      description: "Dòng dung nham vàng đồng rực lửa và chỉ bạc cuộn sóng dũng mãnh trên nền đá đen vũ trụ, biểu tượng của năng lượng và uy quyền."
    },
    {
      id: 19,
      name: "Rosa Portogallo Marble Hoàng Gia",
      stone_type: "marble",
      thumbnail_url: "assets/images/da_tu_nhien/stone_rosa_portogallo.jpg",
      price_range: "Khổ lớn nguyên tấm | Dày 20mm | Polished",
      description: "Sắc hồng phấn pastel và vân mây kem dịu dàng phong cách cung điện châu Âu, lý tưởng cho không gian phòng tắm master và phòng ngủ sang trọng."
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
      name: "Calacatta Monet Quartz Slab",
      stone_type: "calacatta",
      thumbnail_url: "assets/images/da_nhan_tao/quartz_calacatta_monet.jpg",
      price_range: "Khổ lớn 3200x1600mm | Dày 20mm | Polished",
      description: "Nền sứ trắng tinh khiết với các dải vân mây xám khói đan xen chỉ vàng mật ong ấm áp, kiến tạo không gian bếp biệt thự xa hoa."
    },
    {
      id: 203,
      name: "Statuario Elegance Engineered Quartz",
      stone_type: "calacatta",
      thumbnail_url: "assets/images/da_nhan_tao/quartz_statuario_slab.jpg",
      price_range: "Khổ lớn 3200x1600mm | Dày 20mm | Bookmatch",
      description: "Dải vân xám mây xéo mềm mại quý phái điểm xuyết chỉ vàng amber trên nền tuyết trắng tinh khiết, mô phỏng hoàn mỹ đá Statuario Ý."
    },
    {
      id: 204,
      name: "Marquina Gold Vein Quartz",
      stone_type: "storm",
      thumbnail_url: "assets/images/da_nhan_tao/quartz_marquina_gold_vein.jpg",
      price_range: "Khổ lớn 3200x1600mm | Dày 20mm | Polished Mirror",
      description: "Bề mặt đen tuyền bóng gương huyền bí với mạng lưới vân vàng đồng hoàng gia và chỉ trắng sắc sảo, tạo điểm nhấn quyền lực."
    },
    {
      id: 205,
      name: "Nero Storm Lightning Quartz",
      stone_type: "storm",
      thumbnail_url: "assets/images/da_nhan_tao/quartz_nero_storm.jpg",
      price_range: "Khổ lớn 3200x1600mm | Dày 20mm | Satin Honed",
      description: "Bề mặt đá đen nhám satin huyền bí với mạng lưới vân sấm sét trắng tương phản mạnh mẽ, không bám vân tay và dễ vệ sinh."
    },
    {
      id: 206,
      name: "Sahara Noir Gold Quartz",
      stone_type: "storm",
      thumbnail_url: "assets/images/da_nhan_tao/quartz_sahara_noir.jpg",
      price_range: "Khổ lớn 3200x1600mm | Dày 20mm | Polished",
      description: "Nền đen huyền bí sâu thẳm điểm các đường chỉ vàng đồng brass và tia chớp trắng sắc sảo cắt ngang, phong cách hiện đại quyền lực."
    },
    {
      id: 207,
      name: "Emerald Fusion Quartzite",
      stone_type: "crystal",
      thumbnail_url: "assets/images/da_nhan_tao/quartz_emerald_fusion.jpg",
      price_range: "Khổ lớn 3000x1400mm | Dày 20mm | Polished",
      description: "Sắc xanh ngọc lục bảo Amazonite kết hợp các tinh thể thạch anh trắng và vân khoáng chất vàng lấp lánh như bức tranh địa chất quý giá."
    },
    {
      id: 208,
      name: "Pure White Crystal Quartz",
      stone_type: "crystal",
      thumbnail_url: "assets/images/da_nhan_tao/quartz_pure_crystal.jpg",
      price_range: "Khổ lớn 3000x1400mm | Dày 20mm | Polished",
      description: "Trắng tinh khiết không ố màu kết hợp các hạt tinh thể vi kim cương lấp lánh phản chiếu ánh đèn sang trọng đẳng cấp."
    },
    {
      id: 209,
      name: "Taj Mahal Satin Quartz",
      stone_type: "travertine",
      thumbnail_url: "assets/images/da_nhan_tao/quartz_taj_mahal.jpg",
      price_range: "Khổ lớn 3200x1600mm | Dày 20mm | Satin Honed",
      description: "Gam màu kem ngà ivory ấm áp với những đường sóng vân thạch anh màu caramel uốn lượn êm dịu, kiến tạo không gian sống thư thái trang nhã."
    },
    {
      id: 210,
      name: "Travertine Fusion Quartz",
      stone_type: "travertine",
      thumbnail_url: "assets/images/da_nhan_tao/quartz_travertine_slab.jpg",
      price_range: "Khổ lớn 3200x1600mm | Dày 18mm | Honed",
      description: "Vân thớ gỗ travertine thẳng tắp màu be ấm áp kết cấu thạch anh siêu bền, ứng dụng hoàn hảo cho các mảng tường ốp trang trí biệt thự."
    },
    {
      id: 211,
      name: "Calacatta Borghini Gold Quartz",
      stone_type: "calacatta",
      thumbnail_url: "assets/images/da_nhan_tao/quartz_calacatta_borghini.jpg",
      price_range: "Khổ lớn 3200x1600mm | Dày 20mm | Polished",
      description: "Thạch anh nhân tạo cao cấp vân vàng hổ phách và xám khói bồng bềnh, hoàn hảo cho bàn đảo bếp thác nước (Waterfall Island) xa hoa."
    },
    {
      id: 212,
      name: "Porto Rose Quartz Luxury",
      stone_type: "crystal",
      thumbnail_url: "assets/images/da_nhan_tao/quartz_porto_rose.jpg",
      price_range: "Khổ lớn 3200x1600mm | Dày 20mm | Polished",
      description: "Mặt đá thạch anh gam màu kem ấm với dải vân hồng phấn và ánh đồng rose gold dịu nhẹ, chống trầy xước chống ố bẩn tối đa."
    },
    {
      id: 213,
      name: "Azul Macaubas Wave Quartz",
      stone_type: "crystal",
      thumbnail_url: "assets/images/da_nhan_tao/quartz_azul_macaubas.jpg",
      price_range: "Khổ lớn 3200x1600mm | Dày 20mm | Polished",
      description: "Thạch anh engineered tái hiện hoàn mỹ sắc xanh lam ngọc đại dương với vân sóng thẳng tắp bắt mắt cho mặt bếp và quầy bar."
    },
    {
      id: 214,
      name: "Midnight Calacatta Black Quartz",
      stone_type: "storm",
      thumbnail_url: "assets/images/da_nhan_tao/quartz_calacatta_black.jpg",
      price_range: "Khổ lớn 3200x1600mm | Dày 20mm | Satin Honed",
      description: "Nền đen tuyền huyền bí với những vệt tia chớp trắng sắc lẹm và chỉ vàng đồng, bề mặt Satin Honed mịn màng chống bám vân tay."
    },
    {
      id: 215,
      name: "Statuario Elegance Quartz Slab",
      stone_type: "calacatta",
      thumbnail_url: "assets/images/da_nhan_tao/quartz_statuario_elegance.jpg",
      price_range: "Khổ lớn 3200x1600mm | Dày 20mm | Polished",
      description: "Nền đá trắng tinh khiết phối dải vân xám mây tao nhã mô phỏng đá cẩm thạch Statuario Ý lừng danh, chịu lực và chịu nhiệt ưu việt."
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

  if (document.fonts) {
    document.fonts.ready.then(() => {
      const currentActive = document.querySelector('.sub-filter-btn.active') || filterBtns[0];
      updateIndicator(currentActive, true);
    });
  }

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

// 6. Luxury Zoomable Lightbox Handler
let subpageZoomLevel = 1;
let subpagePanX = 0;
let subpagePanY = 0;
let subpageIsDragging = false;
let subpageDragStartX = 0;
let subpageDragStartY = 0;

function initSubpageLightbox() {
  const lightbox = document.getElementById('lightboxModal');
  const backdrop = document.getElementById('lightboxBackdrop');
  const closeBtn = document.getElementById('lightboxCloseBtn');
  const zoomInBtn = document.getElementById('lightboxZoomIn');
  const zoomOutBtn = document.getElementById('lightboxZoomOut');
  const resetBtn = document.getElementById('lightboxResetZoom');
  const zoomLevelText = document.getElementById('lightboxZoomLevel');
  const viewport = document.getElementById('lightboxViewport');
  const imgLayer = document.getElementById('lightboxImgLayer');
  const mainImg = document.getElementById('lightboxMainImg');
  const hintBadge = document.getElementById('lightboxHintBadge');

  if (!lightbox || !viewport || !imgLayer) return;

  const applyTransform = (smooth = true) => {
    if (smooth) {
      imgLayer.classList.add('smooth-transition');
    } else {
      imgLayer.classList.remove('smooth-transition');
    }

    imgLayer.style.transform = `translate(${subpagePanX}px, ${subpagePanY}px) scale(${subpageZoomLevel})`;

    if (zoomLevelText) {
      zoomLevelText.textContent = `${Math.round(subpageZoomLevel * 100)}%`;
    }

    if (subpageZoomLevel > 1) {
      viewport.classList.add('is-zoomed');
    } else {
      viewport.classList.remove('is-zoomed');
      subpagePanX = 0;
      subpagePanY = 0;
      imgLayer.style.transform = `translate(0px, 0px) scale(${subpageZoomLevel})`;
    }
  };

  const setZoom = (level, smooth = true) => {
    subpageZoomLevel = Math.min(Math.max(level, 1), 4);
    if (subpageZoomLevel === 1) {
      subpagePanX = 0;
      subpagePanY = 0;
    }
    applyTransform(smooth);
  };

  const zoomIn = () => setZoom(subpageZoomLevel + 0.5);
  const zoomOut = () => setZoom(subpageZoomLevel - 0.5);
  const resetZoom = () => setZoom(1);

  // Button clicks
  if (zoomInBtn) zoomInBtn.addEventListener('click', (e) => { e.stopPropagation(); zoomIn(); });
  if (zoomOutBtn) zoomOutBtn.addEventListener('click', (e) => { e.stopPropagation(); zoomOut(); });
  if (resetBtn) resetBtn.addEventListener('click', (e) => { e.stopPropagation(); resetZoom(); });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      resetZoom();
    }, 300);
  };

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);

  // ESC and Keyboard controls
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === '+' || e.key === '=') zoomIn();
    else if (e.key === '-' || e.key === '_') zoomOut();
    else if (e.key === '0') resetZoom();
  });

  // Mouse Wheel Zoom
  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.25 : -0.25;
    setZoom(subpageZoomLevel + delta, true);
  }, { passive: false });

  // Double click to toggle zoom
  viewport.addEventListener('dblclick', (e) => {
    e.preventDefault();
    if (subpageZoomLevel > 1) {
      resetZoom();
    } else {
      setZoom(2.2, true);
    }
  });

  // Mouse Drag / Pan when zoomed
  viewport.addEventListener('mousedown', (e) => {
    if (subpageZoomLevel <= 1 || e.button !== 0) return;
    subpageIsDragging = true;
    viewport.classList.add('is-grabbing');
    subpageDragStartX = e.clientX - subpagePanX;
    subpageDragStartY = e.clientY - subpagePanY;
    imgLayer.classList.remove('smooth-transition');
  });

  window.addEventListener('mousemove', (e) => {
    if (!subpageIsDragging || !lightbox.classList.contains('active')) return;
    e.preventDefault();
    subpagePanX = e.clientX - subpageDragStartX;
    subpagePanY = e.clientY - subpageDragStartY;

    // Constrain pan boundaries
    const maxPan = (subpageZoomLevel - 1) * 350;
    subpagePanX = Math.max(-maxPan, Math.min(maxPan, subpagePanX));
    subpagePanY = Math.max(-maxPan, Math.min(maxPan, subpagePanY));

    applyTransform(false);
  });

  window.addEventListener('mouseup', () => {
    if (subpageIsDragging) {
      subpageIsDragging = false;
      viewport.classList.remove('is-grabbing');
      applyTransform(true);
    }
  });

  // Touch Drag on mobile
  let lastTouchX = 0;
  let lastTouchY = 0;
  let initialPinchDist = 0;
  let initialPinchZoom = 1;

  viewport.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1 && subpageZoomLevel > 1) {
      subpageIsDragging = true;
      lastTouchX = e.touches[0].clientX - subpagePanX;
      lastTouchY = e.touches[0].clientY - subpagePanY;
      imgLayer.classList.remove('smooth-transition');
    } else if (e.touches.length === 2) {
      initialPinchDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialPinchZoom = subpageZoomLevel;
    }
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1 && subpageIsDragging && subpageZoomLevel > 1) {
      subpagePanX = e.touches[0].clientX - lastTouchX;
      subpagePanY = e.touches[0].clientY - lastTouchY;
      applyTransform(false);
    } else if (e.touches.length === 2 && initialPinchDist > 0) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scaleFactor = currentDist / initialPinchDist;
      setZoom(initialPinchZoom * scaleFactor, false);
    }
  }, { passive: true });

  viewport.addEventListener('touchend', () => {
    subpageIsDragging = false;
    initialPinchDist = 0;
    applyTransform(true);
  });

  // Export open function for reuse
  window.openSubpageLightbox = (imgSrc, imgTitle) => {
    if (mainImg) {
      mainImg.src = imgSrc;
      mainImg.alt = imgTitle || '';
    }
    const titleElem = document.getElementById('lightboxTitle');
    if (titleElem && imgTitle) {
      titleElem.textContent = imgTitle;
    }

    resetZoom();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
}

function rebindSubpageLightboxEvents() {
  const productCards = document.querySelectorAll('#subpageProductsGrid .product-card');

  productCards.forEach(card => {
    const img = card.querySelector('.product-img');
    const title = card.querySelector('.product-title');
    const imgWrapper = card.querySelector('.product-img-wrapper');
    const zoomAction = card.querySelector('.btn-zoom-action');

    const triggerOpen = (e) => {
      if (e) e.stopPropagation();
      if (!img) return;
      const titleText = title ? title.textContent.trim() : 'Mẫu Đá Atelier';
      if (window.openSubpageLightbox) {
        window.openSubpageLightbox(img.src, titleText);
      }
    };

    if (imgWrapper) imgWrapper.addEventListener('click', triggerOpen);
    if (zoomAction) zoomAction.addEventListener('click', triggerOpen);
    if (img) img.addEventListener('click', triggerOpen);
  });
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
