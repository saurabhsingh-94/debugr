import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPurchaseConfirmation = async (userEmail: string, promptTitle: string, orderId: string, amount: number) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Debugr Marketplace <notifications@debugr.platform>",
      to: [userEmail],
      subject: `[CONFIRMED] Intelligence Acquisition: ${promptTitle}`,
      html: `
        <div style="background-color: #050505; color: #ffffff; padding: 40px; font-family: sans-serif; border: 1px solid #111;">
          <h1 style="color: #8b5cf6; font-style: italic; text-transform: uppercase; tracking-tighter: -0.05em;">Acquisition Complete</h1>
          <p style="color: #71717a; text-transform: uppercase; font-size: 10px; letter-spacing: 0.2em;">ORDER_ID: ${orderId}</p>
          <div style="margin-top: 30px; border-top: 1px solid #111; padding-top: 30px;">
            <p style="font-size: 16px;">You have successfully decrypted <strong>${promptTitle}</strong>.</p>
            <p style="font-size: 14px; color: #a1a1aa;">The intelligence data is now available in your personal dashboard.</p>
          </div>
          <div style="margin-top: 30px; background: #0c0c18; padding: 20px; border-radius: 12px; border: 1px solid #1e1b4b;">
            <table style="width: 100%;">
              <tr>
                <td style="color: #71717a; font-size: 10px; text-transform: uppercase;">Amount Paid</td>
                <td style="text-align: right; font-weight: bold; color: #10b981;">₹${amount.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="color: #71717a; font-size: 10px; text-transform: uppercase;">Date</td>
                <td style="text-align: right; color: #ffffff;">${new Date().toLocaleDateString()}</td>
              </tr>
            </table>
          </div>
          <p style="margin-top: 40px; font-size: 10px; color: #3f3f46; text-transform: uppercase; text-align: center;">Secure Nexus Protocol Active</p>
        </div>
      `,
    });

    if (error) console.error("Resend Error:", error);
  } catch (err) {
    console.error("Resend Catch Error:", err);
  }
};

export const sendSaleNotification = async (creatorEmail: string, promptTitle: string, amount: number) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Debugr Marketplace <sales@debugr.platform>",
      to: [creatorEmail],
      subject: `🎉 Neural Sale Detected: ${promptTitle}`,
      html: `
        <div style="background-color: #050505; color: #ffffff; padding: 40px; font-family: sans-serif; border: 1px solid #111;">
          <h1 style="color: #10b981; font-style: italic; text-transform: uppercase;">Profit Generated</h1>
          <p style="font-size: 16px;">Your intelligence asset <strong>${promptTitle}</strong> was just acquired by another operator.</p>
          <div style="margin-top: 30px; border-top: 1px solid #111; padding-top: 30px;">
             <p style="font-size: 24px; font-weight: bold; font-style: italic;">Net Gain: ₹${amount.toLocaleString()}</p>
             <p style="color: #71717a; font-size: 12px;">(80% share after platform decryption fees)</p>
          </div>
          <p style="margin-top: 40px; font-size: 14px;">Funds have been added to your pending balance and will be released in 7 days.</p>
        </div>
      `,
    });

    if (error) console.error("Resend Error:", error);
  } catch (err) {
    console.error("Resend Catch Error:", err);
  }
};
