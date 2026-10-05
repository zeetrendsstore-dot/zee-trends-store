export const formatPKR = (amount: number): string => {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
};

export const STORE_PHONE = '+92 324 0548272';
export const STORE_PHONE_CLEAN = '923240548272';
export const STORE_EMAIL = 'zeetrendsstore@gmail.com';

export const generateWhatsAppUrl = (message: string): string => {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${STORE_PHONE_CLEAN}?text=${encoded}`;
};

export const createProductWhatsAppMessage = (
  productTitle: string,
  price: number,
  sku: string,
  selectedColor?: string
): string => {
  return `Salam Zee Trends Store! ✨
I would like to order:
🛍️ Product: ${productTitle}
🏷️ SKU: ${sku}
${selectedColor ? `🎨 Color/Variant: ${selectedColor}` : ''}
💰 Price: ${formatPKR(price)}

Please confirm order details and delivery timeline to my address. Thank you!`;
};

export const createCartWhatsAppMessage = (
  items: Array<{ product: { title: string; price: number }; quantity: number; selectedColor?: string }>,
  total: number,
  shippingFee: number,
  customerName?: string,
  city?: string
): string => {
  let text = `Salam Zee Trends Store! 🛍️✨\nI would like to place an order:\n\n`;
  items.forEach((item, idx) => {
    text += `${idx + 1}. ${item.product.title} (Qty: ${item.quantity}${item.selectedColor ? `, Color: ${item.selectedColor}` : ''}) - ${formatPKR(item.product.price * item.quantity)}\n`;
  });
  text += `\n📦 Delivery: ${shippingFee === 0 ? 'FREE DELIVERY' : formatPKR(shippingFee)}`;
  text += `\n💵 Total Amount: ${formatPKR(total)}`;
  if (customerName) text += `\n👤 Name: ${customerName}`;
  if (city) text += `\n📍 City: ${city}`;
  text += `\nPayment Method: Cash on Delivery (COD)\n\nPlease confirm my order.`;
  return text;
};
