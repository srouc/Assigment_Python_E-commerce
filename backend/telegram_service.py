import os
import json
import urllib.request
import urllib.parse
import threading
from datetime import datetime, timezone

CONFIG_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'telegram_config.json')

def load_telegram_config():
    """Load Telegram bot token & chat id from environment or saved config file."""
    config = {
        'bot_token': os.environ.get('TELEGRAM_BOT_TOKEN', '').strip(),
        'chat_id': os.environ.get('TELEGRAM_CHAT_ID', '').strip(),
        'enabled': True
    }
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                saved = json.load(f)
                if not config['bot_token'] and saved.get('bot_token'):
                    config['bot_token'] = str(saved['bot_token']).strip()
                if not config['chat_id'] and saved.get('chat_id'):
                    config['chat_id'] = str(saved['chat_id']).strip()
                if 'enabled' in saved:
                    config['enabled'] = bool(saved['enabled'])
        except Exception as e:
            print(f"[Telegram] Warning: Could not read {CONFIG_FILE}: {e}")
    return config

def save_telegram_config(bot_token, chat_id, enabled=True):
    """Save Telegram bot settings permanently to telegram_config.json."""
    config = {
        'bot_token': (bot_token or '').strip(),
        'chat_id': (chat_id or '').strip(),
        'enabled': bool(enabled),
        'updated_at': datetime.now(timezone.utc).isoformat()
    }
    try:
        with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
            json.dump(config, f, indent=2, ensure_ascii=False)
        return True, "Telegram Bot configuration saved successfully."
    except Exception as e:
        return False, f"Failed to save configuration: {str(e)}"

def send_telegram_message_raw(bot_token, chat_id, text, parse_mode='HTML'):
    """Synchronous send message using standard urllib (no third-party dependencies required)."""
    if not bot_token or not chat_id:
        return False, "Bot token or Chat ID is not configured."

    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        'chat_id': chat_id,
        'text': text,
        'parse_mode': parse_mode,
        'disable_web_page_preview': True
    }

    try:
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(
            url,
            data=data,
            headers={
                'Content-Type': 'application/json',
                'User-Agent': 'ShopEase-TelegramBot/1.0'
            }
        )
        with urllib.request.urlopen(req, timeout=12) as response:
            resp_body = json.loads(response.read().decode('utf-8'))
            if resp_body.get('ok'):
                return True, "Message sent successfully to Telegram."
            else:
                return False, resp_body.get('description', 'Telegram API returned an error.')
    except urllib.error.HTTPError as e:
        try:
            err_json = json.loads(e.read().decode('utf-8'))
            desc = err_json.get('description', str(e))
            return False, f"Telegram API HTTP {e.code}: {desc}"
        except Exception:
            return False, f"Telegram API HTTP {e.code}: {str(e)}"
    except Exception as e:
        return False, f"Network error sending to Telegram: {str(e)}"

def send_async(text, parse_mode='HTML'):
    """Fire-and-forget background thread execution so order flow remains lightning fast."""
    def _run():
        cfg = load_telegram_config()
        if not cfg.get('enabled'):
            return
        token = cfg.get('bot_token')
        chat_id = cfg.get('chat_id')
        if not token or not chat_id:
            return
        success, msg = send_telegram_message_raw(token, chat_id, text, parse_mode)
        if not success:
            print(f"[Telegram Bot Alert Error] {msg}")

    thread = threading.Thread(target=_run, daemon=True)
    thread.start()

def format_order_notification(order, event_type='created'):
    """Format an order dictionary into a clean, professional HTML message for Telegram."""
    order_number = order.get('order_number') or order.get('id', 'N/A')
    customer_name = order.get('customer_name') or order.get('guest_name') or order.get('shipping_name') or 'Customer'
    customer_phone = order.get('shipping_phone') or order.get('customer_phone') or 'N/A'
    customer_email = order.get('guest_email') or order.get('customer_email') or ''

    # Shipping address
    addr_val = order.get('shipping_address') or ''
    city = order.get('shipping_city') or 'Phnom Penh'
    country = order.get('shipping_country') or 'Cambodia'
    if isinstance(addr_val, dict):
        street = addr_val.get('address') or addr_val.get('street_address', '')
        city = addr_val.get('city', city)
        country = addr_val.get('country', country)
        full_address = f"{street}, {city}, {country}".strip(', ')
    else:
        full_address = f"{addr_val}, {city}, {country}".strip(', ')

    # Payment details
    payment_method = order.get('payment_method_display') or order.get('payment_method', 'N/A')
    payment_status = (order.get('payment_status') or 'unpaid').lower()
    total_amount = float(order.get('total_amount') or order.get('total') or 0.0)
    subtotal = float(order.get('subtotal') or 0.0)
    shipping_fee = float(order.get('shipping_fee') or order.get('shipping') or 0.0)
    discount = float(order.get('discount_amount') or order.get('discount') or 0.0)

    is_paid = payment_status == 'paid' or event_type == 'paid'
    
    if is_paid:
        header_emoji = "🎉"
        header_title = "ORDER PAID & CONFIRMED"
        khmer_status = "បានទូទាត់ប្រាក់រួច (PAID)"
        status_line = f"💰 <b>Status:</b> ✅ <b>{khmer_status}</b>"
    else:
        header_emoji = "📦"
        header_title = "NEW ORDER PLACED"
        khmer_status = "មិនទាន់ទូទាត់ (COD / PENDING)"
        status_line = f"💰 <b>Status:</b> ⏳ <b>{khmer_status}</b>"

    # Items
    items = order.get('items', [])
    items_rows = []
    if isinstance(items, list):
        for itm in items:
            name = itm.get('product_name') or itm.get('name') or 'Product'
            qty = itm.get('quantity', 1)
            price = float(itm.get('price', 0.0))
            items_rows.append(f"  • <b>{qty}x</b> {name} — <code>${price * qty:.2f}</code>")
    items_block = "\n".join(items_rows) if items_rows else "  • 1x Order items"

    now_str = datetime.now(timezone.utc).strftime('%b %d, %Y • %I:%M %p (UTC)')

    message = (
        f"{header_emoji} <b>{header_title} — ShopEase</b> 🇰🇭\n"
        f"━━━━━━━━━━━━━━━━━━━━━\n"
        f"🧾 <b>Order:</b> <code>#{order_number}</code>\n"
        f"👤 <b>Customer:</b> {customer_name}\n"
        f"📞 <b>Phone:</b> <code>{customer_phone}</code>\n"
        f"📍 <b>Delivery:</b> {full_address}\n"
        f"{f'✉️ <b>Email:</b> {customer_email}\n' if customer_email else ''}"
        f"━━━━━━━━━━━━━━━━━━━━━\n"
        f"💳 <b>Payment:</b> {payment_method}\n"
        f"{status_line}\n"
        f"━━━━━━━━━━━━━━━━━━━━━\n"
        f"🛍️ <b>Items ({len(items_rows)}):</b>\n"
        f"{items_block}\n\n"
        f"💵 <b>Subtotal:</b> ${subtotal:.2f}\n"
        f"🚚 <b>Shipping:</b> {'FREE' if shipping_fee == 0 else f'${shipping_fee:.2f}'}\n"
        f"{f'🎟️ <b>Discount:</b> -${discount:.2f}\n' if discount > 0 else ''}"
        f"💎 <b>TOTAL:</b> <b>${total_amount:.2f}</b>\n"
        f"━━━━━━━━━━━━━━━━━━━━━\n"
        f"🕒 <i>{now_str}</i>"
    )
    return message

def send_order_telegram_notification(order_dict, event_type='created'):
    """Generate message and dispatch asynchronously."""
    text = format_order_notification(order_dict, event_type=event_type)
    send_async(text, parse_mode='HTML')

def send_test_telegram_message(bot_token=None, chat_id=None):
    """Send an immediate test verification notification."""
    cfg = load_telegram_config()
    token = bot_token or cfg.get('bot_token')
    chat = chat_id or cfg.get('chat_id')

    if not token or not chat:
        return False, "Please enter both Bot Token and Chat ID to test."

    test_msg = (
        f"🔔 <b>ShopEase Telegram Bot Alert Connected!</b> 🇰🇭\n"
        f"━━━━━━━━━━━━━━━━━━━━━\n"
        f"✅ <b>Status:</b> Verification Successful\n"
        f"🤖 <b>Bot Name:</b> ShopEase Order Bot\n"
        f"⚡ <b>Mode:</b> Real-time Order &amp; KHQR Payment Notifications\n"
        f"━━━━━━━━━━━━━━━━━━━━━\n"
        f"Your Telegram Bot is now connected to ShopEase e-commerce! Whenever a customer submits an order or pays via KHQR, an instant notification will arrive right here.\n"
        f"━━━━━━━━━━━━━━━━━━━━━\n"
        f"🕒 <i>{datetime.now(timezone.utc).strftime('%b %d, %Y • %I:%M %p (UTC)')}</i>"
    )
    return send_telegram_message_raw(token, chat, test_msg, parse_mode='HTML')
