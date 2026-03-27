import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPurchaseConfirmation = async (userEmail: string, promptTitle: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Debugr Marketplace <notifications@debugr.platform>",
      to: [userEmail],
      subject: `Your Purchase: ${promptTitle}`,
      html: `
        <h1>Purchase Confirmed!</h1>
        <p>You have successfully unlocked <strong>${promptTitle}</strong>.</p>
        <p>You can now access the full content in your dashboard.</p>
        <br />
        <p>Happy prompting!</p>
      `,
    });

    if (error) {
      console.error("Resend Error (Purchase Confirmation):", error);
    }
  } catch (err) {
    console.error("Resend Catch Error:", err);
  }
};

export const sendSaleNotification = async (creatorEmail: string, promptTitle: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Debugr Marketplace <sales@debugr.platform>",
      to: [creatorEmail],
      subject: `🎉 You just made a sale! ${promptTitle}`,
      html: `
        <h1>Congratulations!</h1>
        <p>Your prompt <strong>${promptTitle}</strong> was just purchased.</p>
        <p>Your 80% share has been added to your pending earnings.</p>
        <p>Payouts are processed on the 1st of every month.</p>
      `,
    });

    if (error) {
      console.error("Resend Error (Sale Notification):", error);
    }
  } catch (err) {
    console.error("Resend Catch Error:", err);
  }
};
