# Pipedream Webhook Integration Guide

## Overview
This guide explains how to set up a Pipedream webhook to receive order data from your Ømnex Tech website and optionally integrate with HubSpot or other services.

## Order Data Structure

When a customer completes payment, the website sends the following JSON payload to your Pipedream webhook:

```json
{
  "orderId": "ORD-1728567890123",
  "timestamp": "2025-10-11T10:30:45.123Z",
  "items": [
    {
      "productId": "multi-purpose-cable-adapter",
      "productName": "Multi-purpose cable adapter set box",
      "price": 249,
      "quantity": 2,
      "subtotal": 498
    },
    {
      "productId": "modular-power-hub",
      "productName": "Modular Power Hub 9000mAh",
      "price": 1299,
      "quantity": 1,
      "subtotal": 1299
    }
  ],
  "total": 1797,
  "shipping": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 9876543210",
    "address1": "123 Main Street",
    "address2": "Apartment 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pin": "400001",
    "country": "India"
  },
  "payment": {
    "method": "UPI/QR",
    "transactionId": "UPI1234567890",
    "status": "pending"
  }
}
```

## Setup Instructions

### Step 1: Create Pipedream Workflow

1. Go to [https://pipedream.com](https://pipedream.com) and sign up/login
2. Click **"New Workflow"**
3. Search for **"HTTP / Webhook"** trigger
4. Select **"New Requests"**
5. Copy your unique webhook URL (looks like: `https://eo123abc456def.m.pipedream.net`)

### Step 2: Update Website Configuration

1. Open `js/app.js` in your website folder
2. Find line ~105: `this.webhookUrl = 'YOUR_PIPEDREAM_WEBHOOK_URL';`
3. Replace with your actual webhook URL:
   ```javascript
   this.webhookUrl = 'https://eo123abc456def.m.pipedream.net';
   ```
4. Save the file

### Step 3: Test the Webhook

1. Place a test order on your website
2. Go to your Pipedream workflow dashboard
3. You should see the order data appear in the "Test Event" section
4. Click on the event to inspect the complete JSON payload

## Optional: HubSpot Integration

To automatically create contacts and deals in HubSpot:

### Step 1: Add HubSpot Action

1. In your Pipedream workflow, click **"+ Add step"**
2. Search for **"HubSpot"**
3. Select **"Create or Update Contact"**
4. Connect your HubSpot account
5. Map the fields:
   - Email: `{{steps.trigger.event.body.shipping.email}}`
   - First Name: Extract from `{{steps.trigger.event.body.shipping.name}}`
   - Phone: `{{steps.trigger.event.body.shipping.phone}}`

### Step 2: Create Deal

1. Add another HubSpot step: **"Create Deal"**
2. Map the fields:
   - Deal Name: `Order {{steps.trigger.event.body.orderId}}`
   - Amount: `{{steps.trigger.event.body.total}}`
   - Deal Stage: "New Order"
   - Contact: Use the contact ID from previous step

### Step 3: Add Custom Properties

In HubSpot, create custom properties:
- `order_id` (Single-line text)
- `transaction_id` (Single-line text)
- `order_items` (Multi-line text)
- `shipping_address` (Multi-line text)

Then map these in your Pipedream workflow.

## Advanced: Email Notifications

### Send Order Confirmation Email

1. Add step: **"Email by Pipedream"**
2. Configure:
   - **To**: `{{steps.trigger.event.body.shipping.email}}`
   - **Subject**: `Order Confirmation - {{steps.trigger.event.body.orderId}}`
   - **Body**: Create HTML email template with order details

Example email template:
```html
<h1>Thank you for your order!</h1>
<p>Order ID: {{steps.trigger.event.body.orderId}}</p>
<h2>Order Summary</h2>
<ul>
  {{#each steps.trigger.event.body.items}}
    <li>{{productName}} × {{quantity}} = ₹{{subtotal}}</li>
  {{/each}}
</ul>
<p><strong>Total: ₹{{steps.trigger.event.body.total}}</strong></p>
```

### Send Admin Notification

1. Add another Email step
2. **To**: `admin@omnex-tech.com`
3. **Subject**: `🔔 New Order: {{steps.trigger.event.body.orderId}}`
4. Include full order details for processing

## Testing

### Test Payload

Use this curl command to test your webhook:

```bash
curl -X POST https://YOUR_WEBHOOK_URL_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORD-TEST-123",
    "timestamp": "2025-10-11T10:30:45.123Z",
    "items": [
      {
        "productId": "multi-purpose-cable-adapter",
        "productName": "Multi-purpose cable adapter set box",
        "price": 249,
        "quantity": 1,
        "subtotal": 249
      }
    ],
    "total": 249,
    "shipping": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "+91 9876543210",
      "address1": "123 Test St",
      "address2": "",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pin": "400001",
      "country": "India"
    },
    "payment": {
      "method": "UPI/QR",
      "transactionId": "TEST123456",
      "status": "pending"
    }
  }'
```

Replace `YOUR_WEBHOOK_URL_HERE` with your actual Pipedream webhook URL.

## Workflow Example

Here's a complete Pipedream workflow structure:

```
1. HTTP Webhook Trigger (receives order data)
   ↓
2. Node.js Code (parse and validate data)
   ↓
3. HubSpot - Create/Update Contact
   ↓
4. HubSpot - Create Deal
   ↓
5. Email - Send confirmation to customer
   ↓
6. Email - Notify admin
   ↓
7. Google Sheets - Log order (optional)
   ↓
8. Slack - Post notification (optional)
```

## Security Considerations

1. **Validate Transaction IDs**: Verify UPI transaction IDs with your payment gateway
2. **Rate Limiting**: Add rate limiting in Pipedream to prevent spam
3. **IP Whitelisting**: Restrict webhook to your domain (optional)
4. **SSL/HTTPS**: Ensure your website uses HTTPS before going live

## Troubleshooting

### Webhook Not Receiving Data
- Check browser console for errors
- Verify webhook URL is correct in `js/app.js`
- Check CORS settings in Pipedream (usually automatic)

### HubSpot Connection Failing
- Verify HubSpot API key is valid
- Check account permissions for creating contacts/deals
- Ensure custom properties exist in HubSpot

### Email Not Sending
- Verify email addresses are valid
- Check Pipedream email quota (free tier has limits)
- Review email step logs in Pipedream dashboard

## Support

For issues with:
- **Website code**: Check browser console and `js/app.js`
- **Pipedream**: Visit [docs.pipedream.com](https://docs.pipedream.com)
- **HubSpot**: Visit [developers.hubspot.com](https://developers.hubspot.com)

## Next Steps

After setting up the webhook:

1. ✅ Test with a real order
2. ✅ Set up email notifications
3. ✅ Configure HubSpot integration (if using)
4. ✅ Add order tracking system
5. ✅ Set up backup/logging for all orders

---

**Last Updated**: October 11, 2025  
**Version**: 1.0
