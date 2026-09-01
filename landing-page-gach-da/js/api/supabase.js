// ==========================================================================
// TUAN CHAU ATELIER - SUPABASE API SERVICE
// Handles all database queries (select products, insert consultation requests)
// ==========================================================================

(() => {
  const SUPABASE_CONFIG = {
    url: window.APP_CONFIG?.SUPABASE_URL || 'YOUR_SUPABASE_URL',
    anonKey: window.APP_CONFIG?.SUPABASE_ANON_KEY || 'sb_publishable_yerpn5Zyx1PUBRggKUDWFQ_bEz8MF_F'
  };

  const sendToSupabase = async (data) => {
    if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey || SUPABASE_CONFIG.url.startsWith('YOUR_')) {
      console.log('Supabase chưa cấu hình. Fallback lưu dữ liệu vào LocalStorage:', data);
      
      const existing = JSON.parse(localStorage.getItem('consultation_requests') || '[]');
      existing.push({
        ...data,
        status: 'pending',
        created_at: new Date().toISOString()
      });
      localStorage.setItem('consultation_requests', JSON.stringify(existing));
      return true;
    }

    try {
      const response = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/consultation_requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_CONFIG.anonKey,
          'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          customer_name: data.customer_name,
          phone_number: data.phone_number,
          address: data.address,
          room_region: data.room_region,
          selected_stone_names: data.selected_stone_names,
          service_needed: data.service_needed,
          customer_note: data.customer_note,
          status: 'pending'
        })
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      return true;
    } catch (err) {
      console.warn('Lỗi kết nối Supabase, fallback lưu local:', err);
      const existing = JSON.parse(localStorage.getItem('consultation_requests') || '[]');
      existing.push({
        ...data,
        status: 'pending',
        created_at: new Date().toISOString()
      });
      localStorage.setItem('consultation_requests', JSON.stringify(existing));
      return true;
    }
  };

  const fetchProductsFromSupabase = async () => {
    if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey || SUPABASE_CONFIG.url.startsWith('YOUR_')) {
      throw new Error('Supabase URL/Key chưa được cấu hình.');
    }

    const response = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/product_images?select=*`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_CONFIG.anonKey,
        'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Supabase API response status: ${response.status}`);
    }

    return await response.json();
  };

  // Assign to window object for global access
  window.SupabaseAPI = {
    sendToSupabase,
    fetchProductsFromSupabase
  };
})();
