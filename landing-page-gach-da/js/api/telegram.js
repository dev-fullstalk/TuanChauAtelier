// ==========================================================================
// TUAN CHAU ATELIER - TELEGRAM API SERVICE
// Handles sending realtime notification alerts to Telegram Group Bot API
// ==========================================================================

(() => {
  const TELEGRAM_CONFIG = {
    botToken: window.APP_CONFIG?.TELEGRAM_BOT_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN',
    chatId: window.APP_CONFIG?.TELEGRAM_CHAT_ID || 'YOUR_TELEGRAM_CHAT_ID'
  };

  const sendTelegramAlert = async (data) => {
    if (!TELEGRAM_CONFIG.botToken || !TELEGRAM_CONFIG.chatId || TELEGRAM_CONFIG.botToken.startsWith('YOUR_')) {
      console.log('Telegram chưa cấu hình. Tin nhắn gửi đi sẽ có cấu trúc như sau:\n', 
        `🔔 CÓ YÊU CẦU ĐO ĐẠC / THIẾT KẾ MỚI!\n` +
        `- Khách hàng: ${data.customer_name} - ${data.phone_number}\n` +
        `- Địa chỉ: ${data.address}\n` +
        `- Hạng mục: ${data.room_region}\n` +
        `- Mẫu đá chọn: ${data.selected_stone_names}\n` +
        `- Dịch vụ: ${data.service_needed}\n` +
        `- Ghi chú: ${data.customer_note || 'Không có ghi chú'}`
      );
      return;
    }

    const text = `🔔 *CÓ YÊU CẦU ĐO ĐẠC / THIẾT KẾ MỚI!*\n\n` +
                 `👤 *Khách hàng:* ${data.customer_name}\n` +
                 `📞 *SĐT/Zalo:* ${data.phone_number}\n` +
                 `📍 *Địa chỉ:* ${data.address}\n` +
                 `🏗️ *Hạng mục:* ${data.room_region}\n` +
                 `💎 *Mẫu đá chọn:* ${data.selected_stone_names}\n` +
                 `🛠️ *Dịch vụ:* ${data.service_needed}\n` +
                 `📝 *Ghi chú:* ${data.customer_note || 'Không có ghi chú'}`;

    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CONFIG.chatId,
          text: text,
          parse_mode: 'Markdown'
        })
      });
    } catch (err) {
      console.error('Lỗi khi gửi thông báo Telegram:', err);
    }
  };

  // Assign to window object for global access
  window.TelegramAPI = {
    sendTelegramAlert
  };
})();
