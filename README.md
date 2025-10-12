# 🚀 Quick Start Guide

## Immediate Setup (5 minutes)

### 1. Configure Pipedream Webhook

```bash
# Open js/app.js and find line 105
# Replace this:
this.webhookUrl = 'YOUR_PIPEDREAM_WEBHOOK_URL';

# With your actual webhook (get from pipedream.com):
this.webhookUrl = 'https://eo123abc456def.m.pipedream.net';
```

### 2. Add QR Code Image

```bash
# Place your UPI QR code image in the root folder as:
qr-code.png

# Then edit payment.html (line ~60):
# Replace:
<img src="YOUR_QR_CODE_URL_HERE" alt="Payment QR Code">

# With:
<img src="qr-code.png" alt="Payment QR Code">
```

### 3. Test Your Site

```bash
# Option 1: Open directly
# Double-click index.html

# Option 2: Run local server
python -m http.server 8000
# Then visit: http://localhost:8000

# Option 3: Use Node.js
npx serve
```

## Testing Checklist

- [ ] Homepage loads with hero section
- [ ] Shop page shows 2 products
- [ ] Click product → Detail page works
- [ ] Add to cart → Cart badge updates
- [ ] Cart page shows items
- [ ] Proceed to checkout → Address form
- [ ] Fill shipping info → Payment page
- [ ] QR code displays correctly
- [ ] Enter transaction ID → Submit
- [ ] Thank-you page shows order ID
- [ ] Webhook receives order data (check Pipedream)

## File Structure

```
omnex-tech/
├── index.html              # Homepage
├── shop.html               # Product listing
├── product.html            # Product details
├── cart.html               # Shopping cart
├── address.html            # Shipping form
├── payment.html            # QR payment
├── thank-you.html          # Order confirmation ⭐ NEW
├── projects.html           # NOTEBRO project
├── contact.html            # Contact form
├── terms.html              # Terms & conditions
├── products.json           # Product database
├── WEBHOOK_SETUP.md        # Integration guide ⭐ NEW
├── ENHANCEMENTS.md         # What was changed ⭐ NEW
├── css/
│   ├── bootstrap.min.css   # Framework
│   └── custom.css          # Futuristic theme ⭐ UPDATED
├── js/
│   ├── bootstrap.bundle.min.js
│   └── app.js              # Cart & checkout logic
└── Images:
    ├── logo-icon.png
    ├── hero-bg.jpg
    ├── parallax-bg.jpg
    ├── product1.jpg
    ├── product2.jpg
    └── project-notebro.png
```

## Quick Webhook Test

```bash
# Test your webhook with curl:
curl -X POST https://YOUR_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{"orderId":"TEST-123","total":249,"shipping":{"email":"test@test.com"}}'

# Check Pipedream dashboard - you should see this request!
```

## Common Issues

### Images not loading?
- Check file names match exactly (case-sensitive)
- Ensure images are in the root folder

### Webhook not working?
- Verify URL in `js/app.js` is correct
- Check browser console (F12) for errors
- Test webhook URL directly with curl

### Styles look broken?
- Clear browser cache (Ctrl+F5)
- Check `css/custom.css` exists
- Open browser dev tools and check CSS loaded

## Production Deployment

### Option 1: Netlify (Free)
```bash
# Drag and drop your folder to netlify.com/drop
# Done! You get a URL like: yoursite.netlify.app
```

### Option 2: GitHub Pages (Free)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO
git push -u origin main
# Enable GitHub Pages in repo settings
```

### Option 3: Traditional Hosting
- Upload all files via FTP
- Ensure folder structure is maintained
- No server-side requirements needed!

## What's Next?

1. ✅ Set up Pipedream webhook
2. ✅ Add your QR code
3. ✅ Test complete checkout flow
4. 📧 Configure email notifications (see WEBHOOK_SETUP.md)
5. 🎨 Customize colors/text as needed
6. 🚀 Deploy to production
7. 📊 Set up HubSpot integration (optional)

## Support Resources

- **Webhook Setup**: Read `WEBHOOK_SETUP.md`
- **What Changed**: Read `ENHANCEMENTS.md`
- **Pipedream Docs**: https://docs.pipedream.com
- **Bootstrap Docs**: https://getbootstrap.com/docs/5.3

## Ready to Launch? 🎉

Once you've:
- ✅ Added QR code
- ✅ Configured webhook
- ✅ Tested checkout
- ✅ Set up email notifications

You're ready to go live! 🚀

---

**Need help?** Check the contact form at `/contact.html`
