"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function PaymentVerification({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [retries, setRetries] = useState(0);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`/api/checkout/verify?order_id=${orderId}`);
        const data = await res.json();

        if (data.status === "SUCCESS") {
          toast.success("Intelligence data decrypted and acquired.");
          // Refresh the page to show Success state
          router.refresh();
        } else if (retries < 5) {
          // Retry every 3 seconds if still pending
          setTimeout(() => setRetries(prev => prev + 1), 3000);
        }
      } catch (err) {
        console.error("Verification poll failed", err);
      }
    };

    verify();
  }, [orderId, retries, router]);

  return null; // Invisible component
}
