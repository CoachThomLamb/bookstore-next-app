'use server'

import nodemailer from 'nodemailer';

interface OrderedBook {
  code: string;
  title: string;
  price: string;
  quantity: number;
  itemTotal: number;
}

interface OrderData {
  groupName: string;
  contactPerson: string;
  email: string;
  phone: string;
  shippingAddress: string;
  notes: string;
  orderedBooks: OrderedBook[];
  orderTotal: number;
}

export async function submitOrder(orderData: OrderData) {
  try {
    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Generate HTML email body
    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
            h2 { color: #1e40af; margin-top: 25px; border-bottom: 1px solid #ddd; padding-bottom: 8px; }
            .info-section { background: #f9fafb; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .info-row { margin: 8px 0; }
            .label { font-weight: bold; color: #4b5563; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th { background: #2563eb; color: white; padding: 10px; text-align: left; }
            td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
            tr:nth-child(even) { background: #f9fafb; }
            .total { font-size: 1.2em; font-weight: bold; color: #2563eb; text-align: right; margin-top: 20px; padding: 15px; background: #eff6ff; border-radius: 5px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; font-size: 0.9em; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>📚 New Literature Order</h1>
            
            <h2>Customer Information</h2>
            <div class="info-section">
              <div class="info-row">
                <span class="label">Group Name:</span> ${orderData.groupName}
              </div>
              <div class="info-row">
                <span class="label">Contact Person:</span> ${orderData.contactPerson}
              </div>
              <div class="info-row">
                <span class="label">Email:</span> <a href="mailto:${orderData.email}">${orderData.email}</a>
              </div>
              <div class="info-row">
                <span class="label">Phone:</span> ${orderData.phone}
              </div>
              <div class="info-row">
                <span class="label">Shipping Address:</span><br>
                ${orderData.shippingAddress.replace(/\n/g, '<br>')}
              </div>
              ${orderData.notes ? `
              <div class="info-row">
                <span class="label">Special Instructions:</span><br>
                ${orderData.notes.replace(/\n/g, '<br>')}
              </div>
              ` : ''}
            </div>

            <h2>Ordered Items</h2>
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${orderData.orderedBooks.map(book => `
                  <tr>
                    <td>${book.code}</td>
                    <td>${book.title}</td>
                    <td>${book.price}</td>
                    <td>${book.quantity}</td>
                    <td>$${book.itemTotal.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="total">
              Order Total: $${orderData.orderTotal.toFixed(2)}
            </div>

            <div class="footer">
              <p>This order was submitted through the AA Toronto Bookstore website.</p>
              <p><em>Order received: ${new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' })}</em></p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Plain text version for email clients that don't support HTML
    const textBody = `
NEW LITERATURE ORDER

Customer Information:
- Group Name: ${orderData.groupName}
- Contact Person: ${orderData.contactPerson}
- Email: ${orderData.email}
- Phone: ${orderData.phone}
- Shipping Address: ${orderData.shippingAddress}
${orderData.notes ? `- Special Instructions: ${orderData.notes}` : ''}

Ordered Items:
${orderData.orderedBooks.map(book => 
  `${book.code} - ${book.title} - ${book.price} x ${book.quantity} = $${book.itemTotal.toFixed(2)}`
).join('\n')}

Order Total: $${orderData.orderTotal.toFixed(2)}

Order received: ${new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' })}
    `.trim();

    // Send email
    const info = await transporter.sendMail({
      from: `"AA Toronto Bookstore" <${process.env.FROM_EMAIL}>`,
      to: process.env.TO_EMAIL,
      subject: `New Literature Order from ${orderData.groupName}`,
      text: textBody,
      html: htmlBody,
    });

    console.log('Order email sent:', info.messageId);

    return { 
      success: true, 
      message: 'Order submitted successfully! You will receive a confirmation email shortly.',
      messageId: info.messageId 
    };

  } catch (error) {
    console.error('Error sending order email:', error);
    return { 
      success: false, 
      message: 'Failed to submit order. Please try again or contact us directly.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
