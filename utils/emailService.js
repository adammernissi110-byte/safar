const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendEmail = async (options) => {
  const mailOptions = {
    from: `Morocco Travel <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${options.to}`);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

exports.sendBookingConfirmation = async (booking, user) => {
  const subject = 'Booking Confirmation - Morocco Travel';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c5f2d;">Booking Confirmation</h2>
      <p>Dear ${user.name},</p>
      <p>Your booking has been confirmed!</p>
      <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Booking Details</h3>
        <p><strong>Booking ID:</strong> ${booking._id}</p>
        <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
        <p><strong>Guests:</strong> ${booking.guests}</p>
        <p><strong>Total Price:</strong> $${booking.totalPrice}</p>
        <p><strong>Payment Method:</strong> ${booking.paymentMethod.toUpperCase()}</p>
        <p><strong>Status:</strong> ${booking.status}</p>
      </div>
      <p>Thank you for choosing Morocco Travel!</p>
      <p>Best regards,<br>Morocco Travel Team</p>
    </div>
  `;

  return await this.sendEmail({
    to: user.email,
    subject,
    html
  });
};

exports.sendBookingStatusUpdate = async (booking, user) => {
  const subject = `Booking Status Update - ${booking.status}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c5f2d;">Booking Status Update</h2>
      <p>Dear ${user.name},</p>
      <p>Your booking status has been updated.</p>
      <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Booking ID:</strong> ${booking._id}</p>
        <p><strong>New Status:</strong> <span style="color: #2c5f2d; font-weight: bold;">${booking.status}</span></p>
        ${booking.cancellationReason ? `<p><strong>Cancellation Reason:</strong> ${booking.cancellationReason}</p>` : ''}
      </div>
      <p>Best regards,<br>Morocco Travel Team</p>
    </div>
  `;

  return await this.sendEmail({
    to: user.email,
    subject,
    html
  });
};
