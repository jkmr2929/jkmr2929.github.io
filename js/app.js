// Omnex Tech - Complete Cart & Checkout System

class CartManager {
  constructor() {
    this.cart = this.loadCart();
    this.updateCartBadge();
  }

  loadCart() {
    const saved = localStorage.getItem('omnex-cart');
    return saved ? JSON.parse(saved) : [];
  }

  saveCart() {
    localStorage.setItem('omnex-cart', JSON.stringify(this.cart));
    this.updateCartBadge();
  }

  addItem(product, quantity = 1) {
    const existing = this.cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.cart.push({ ...product, quantity });
    }
    this.saveCart();
    this.showNotification(`${product.name} added to cart!`);
  }

  removeItem(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
  }

  updateQuantity(productId, quantity) {
    const item = this.cart.find(item => item.id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.saveCart();
    }
  }

  getCart() {
    return this.cart;
  }

  getTotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getItemCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  getShippingCost(country) {
    // ₹100 for India, ₹500 for everywhere else
    if (!country) return 100; // Default to India
    return country.toLowerCase() === 'india' ? 100 : 500;
  }

  getGrandTotal(country) {
    return this.getTotal() + this.getShippingCost(country);
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  updateCartBadge() {
    const count = this.getItemCount();
    const badge = document.getElementById('cart-badge');
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-block' : 'none';
    }
  }

  showNotification(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
}

class ProductManager {
  async loadProducts() {
    const response = await fetch('products.json');
    return response.json();
  }

  async getProduct(productId) {
    const data = await this.loadProducts();
    return data.products.find(p => p.id === productId);
  }
}

class CheckoutManager {
  saveAddress(address) {
    localStorage.setItem('omnex-shipping', JSON.stringify(address));
  }

  getAddress() {
    const saved = localStorage.getItem('omnex-shipping');
    return saved ? JSON.parse(saved) : null;
  }
}

class OrderManager {
  constructor() {
    // Replace this with your actual Pipedream webhook URL
    // Get it from: https://pipedream.com
    this.webhookUrl = 'https://eov3vu6el42x9h1.m.pipedream.net'; // REPLACE WITH YOUR WEBHOOK URL
  }

  prepareOrder(cart, address, transactionId) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = cartManager.getShippingCost(address.country);
    
    return {
      orderId: 'ORD-' + Date.now(),
      timestamp: new Date().toISOString(),
      items: cart.map(item => ({
        productId: item.id,
        productName: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      })),
      subtotal: subtotal,
      shippingCost: shippingCost,
      deliveryRegion: address.country === 'India' ? 'India' : 'International',
      total: subtotal + shippingCost,
      shipping: address,
      payment: {
        method: 'UPI/QR',
        transactionId: transactionId,
        status: 'pending'
      }
    };
  }

  async submitOrder(orderData) {
    try {
      console.log('Submitting order to:', this.webhookUrl);
      console.log('Order data:', orderData);
      
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        mode: 'cors',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      // Pipedream might return empty response, which is OK
      const responseText = await response.text();
      if (responseText) {
        return JSON.parse(responseText);
      }
      return { success: true };
      
    } catch (error) {
      console.error('Order submission error:', error);
      console.log('Webhook URL:', this.webhookUrl);
      console.log('Order data that failed:', orderData);
      throw error;
    }
  }
}

// Initialize global instances
const cartManager = new CartManager();
const productManager = new ProductManager();
const checkoutManager = new CheckoutManager();
const orderManager = new OrderManager();

// Update cart badge on page load
document.addEventListener('DOMContentLoaded', () => {
  cartManager.updateCartBadge();
});
