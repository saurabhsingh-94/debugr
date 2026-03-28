import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { CheckCircle2, XCircle, Clock, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import PaymentVerification from "@/components/PaymentVerification";

export default async function PaymentStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const orderId = params.order_id as string;

  if (!orderId) {
    redirect("/marketplace");
  }

  // Fetch transaction to check status
  const transaction = await prisma.transaction.findUnique({
    where: { orderId },
  });

  if (!transaction) {
    redirect("/marketplace");
  }

  const isSuccess = transaction.status === "SUCCESS";
  const isPending = transaction.status === "PENDING";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#05050a]">
       <div className="max-w-md w-full relative">
          {/* DECORATIVE_GLOW */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-violet-600/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-600/10 blur-[120px] rounded-full animate-pulse" />

          {/* STATUS_CARD */}
          <div className="relative z-10 p-1 bg-white/[0.03] border border-white/5 rounded-[48px] backdrop-blur-3xl overflow-hidden shadow-2xl">
              {isPending && <PaymentVerification orderId={orderId} />}
              <div className="bg-[#0c0c18] rounded-[44px] p-12 text-center space-y-8">
                
                {/* ICON_SECTION */}
                <div className="flex justify-center">
                   {isSuccess ? (
                      <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-full animate-in zoom-in duration-500">
                         <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                      </div>
                   ) : isPending ? (
                      <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-full animate-spin">
                         <Clock className="w-16 h-16 text-amber-500" />
                      </div>
                   ) : (
                      <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-full">
                         <XCircle className="w-16 h-16 text-rose-500" />
                      </div>
                   )}
                </div>

                {/* TEXT_SECTION */}
                <div className="space-y-4">
                   <div className="flex items-center justify-center gap-2">
                       <Zap className="w-3 h-3 text-zinc-700" />
                       <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">Transaction Synchronized</span>
                   </div>
                   <h1 className="text-4xl font-serif text-white tracking-tighter italic uppercase leading-none">
                      {isSuccess ? "Access Granted" : isPending ? "Validating Signal" : "Payment Failed"}
                   </h1>
                   <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
                      {isSuccess 
                        ? "The intelligence data has been decrypted and added to your matrix." 
                        : isPending 
                        ? "We're currently waiting for the secure gateway to authorize your purchase." 
                        : "There was an issue processing your transaction with the provider."}
                   </p>
                </div>

                {/* ACTION_SECTION */}
                <div className="pt-8 space-y-4">
                   {isSuccess ? (
                      <Link 
                        href="/marketplace"
                        className="w-full py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                      >
                         Return to Marketplace
                         <ArrowRight className="w-4 h-4" />
                      </Link>
                   ) : (
                      <Link 
                        href="/marketplace"
                        className="w-full py-5 bg-zinc-900 text-zinc-400 text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all active:scale-95 border border-white/5"
                      >
                         Back to Marketplace
                      </Link>
                   )}
                   
                   {isPending && (
                      <div className="flex items-center justify-center gap-2">
                         <div className="w-1 h-1 bg-amber-500/50 rounded-full animate-ping" />
                         <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest leading-[0]">Awaiting clearing...</span>
                      </div>
                   )}
                </div>

             </div>
          </div>
       </div>
    </div>
  );
}
