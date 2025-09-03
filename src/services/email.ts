import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export class EmailService {
  static async sendOrderConfirmation(to: string, orderData: any) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: `Order Confirmation #${orderData._id.slice(-8)}`,
      html: `
        <h2>Order Confirmed!</h2>
        <p>Thank you for your order. We'll process it shortly.</p>
        <p><strong>Order ID:</strong> #${orderData._id.slice(-8)}</p>
        <p><strong>Total:</strong> ${new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' }).format(orderData.totalAmount)}</p>
        <p><strong>Status:</strong> ${orderData.status}</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('✅ Order confirmation email sent');
    } catch (error) {
      console.error('❌ Email send failed:', error);
    }
  }

  static async sendStatusUpdate(to: string, orderData: any) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: `Order Update #${orderData._id.slice(-8)}`,
      html: `
        <h2>Order Status Updated</h2>
        <p><strong>Order ID:</strong> #${orderData._id.slice(-8)}</p>
        <p><strong>New Status:</strong> ${orderData.status}</p>
        ${orderData.trackingNumber ? `<p><strong>Tracking:</strong> ${orderData.trackingNumber}</p>` : ''}
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('✅ Status update email sent');
    } catch (error) {
      console.error('❌ Email send failed:', error);
    }
  }
}