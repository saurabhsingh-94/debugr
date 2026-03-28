import nodemailer from "nodemailer";

// Using SMTP instead of Resend as a temporary measure
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPurchaseConfirmation({ 
  to, 
  orderId, 
  promptTitle, 
  amount, 
  currency 
}: { 
  to: string; 
  orderId: string; 
  promptTitle: string; 
  amount: number; 
  currency: string;
}) {
  const html = `
    <div style="font-family: sans-serif; background-color: #05050a; color: #ffffff; padding: 40px; border-radius: 20px;">
      <h1 style="color: #7c3aed; font-size: 24px;">Acquisition Complete</h1>
      <p style="color: #a1a1aa;">Your intelligence asset has been decrypted and added to your profile.</p>
      
      <div style="background-color: #111118; padding: 20px; border-radius: 12px; border: 1px solid #ffffff10; margin-top: 20px;">
        <p style="margin: 0; font-size: 14px; color: #71717a;">Order ID: <span style="color: #ffffff;">${orderId}</span></p>
        <p style="margin: 10px 0 0 0; font-size: 18px; font-weight: bold;">${promptTitle}</p>
        <p style="margin: 5px 0 0 0; font-size: 14px; color: #10b981;">Amount: ${currency} ${amount}</p>
      </div>

      <p style="margin-top: 30px; font-size: 12px; color: #3f3f46;">
        You can view your receipt at: <br/>
        <a href="https://debugr.platform/marketplace/receipt/${orderId}" style="color: #7c3aed;">https://debugr.platform/marketplace/receipt/${orderId}</a>
      </p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Debugr Marketplace" <${process.env.SMTP_USER}>`,
      to,
      subject: `Order Confirmed: ${promptTitle}`,
      html,
    });
    console.log("[SMTP] Purchase email sent:", info.messageId);
    return { data: info, error: null };
  } catch (error: any) {
    console.error("[SMTP Error] Purchase email failed:", error);
    return { data: null, error };
  }
}

export async function sendSaleNotification({ 
  to, 
  promptTitle, 
  amount, 
  currency 
}: { 
  to: string; 
  promptTitle: string; 
  amount: number; 
  currency: string;
}) {
  const html = `
    <div style="font-family: sans-serif; background-color: #05050a; color: #ffffff; padding: 40px; border-radius: 20px;">
      <h1 style="color: #10b981; font-size: 24px;">Neural Sale Detected</h1>
      <p style="color: #a1a1aa;">An agent has just acquired your intelligence asset.</p>
      
      <div style="background-color: #111118; padding: 20px; border-radius: 12px; border: 1px solid #ffffff10; margin-top: 20px;">
        <p style="margin: 0; font-size: 14px; color: #71717a;">Asset:</p>
        <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold;">${promptTitle}</p>
        <p style="margin: 15px 0 0 0; font-size: 12px; color: #71717a;">Your Share (80%):</p>
        <p style="margin: 2px 0 0 0; font-size: 20px; font-weight: bold; color: #10b981;">${currency} ${amount}</p>
      </div>

      <p style="margin-top: 30px; font-size: 12px; color: #3f3f46;">
        Earnings have been added to your dashboard balance.
      </p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Debugr Network" <${process.env.SMTP_USER}>`,
      to,
      subject: `Neural Sale: ${promptTitle}`,
      html,
    });
    console.log("[SMTP] Sale notification sent:", info.messageId);
    return { data: info, error: null };
  } catch (error: any) {
    console.error("[SMTP Error] Sale notification failed:", error);
    return { data: null, error };
  }
}
