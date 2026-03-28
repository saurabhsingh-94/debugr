import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { CheckCircle2, IndianRupee, Printer, ArrowLeft, ShieldCheck, Download } from "lucide-react";
import Link from "next/link";

export default async function ReceiptPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return notFound();

  const transaction = await prisma.transaction.findUnique({
    where: { orderId: params.id },
    include: {
      userId: true, // Wait, userId is a string. I need the user details.
    }
  });

  // Re-fetch with join manually because Prisma schema doesn't have the relation named nicely for direct string fields sometimes
  const txn = await prisma.transaction.findUnique({ where: { orderId: params.id } });
  if (!txn || txn.userId !== session.user.id) return notFound();

  const prompt = await prisma.prompt.findUnique({
    where: { id: txn.promptId },
    include: { author: { select: { name: true, username: true } } }
  });

  if (!prompt) return notFound();

  return (
    <div className="max-w-3xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="mb-12 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <button 
          onClick={() => window.print()} 
          className="p-3 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
        >
          <Printer className="w-4 h-4" />
        </button>
      </div>

      <div className="bento-card relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
           <ShieldCheck className="w-64 h-64 text-white" />
        </div>

        <div className="bento-inner p-12 space-y-12">
          {/* HEADER */}
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.5em]">Transaction_Verified</span>
              </div>
              <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Payment <span className="text-zinc-800">Receipt</span></h1>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Order_ID: {txn.orderId}</p>
            </div>
            <div className="text-right">
               <p className="text-[11px] font-black text-white uppercase tracking-widest mb-1">DEBUGR_PLATFORM</p>
               <p className="text-[9px] font-bold text-zinc-800 uppercase tracking-widest leading-loose">
                 Marketplace v1.0<br/>
                 Secure Intelligence Exchange
               </p>
            </div>
          </div>

          {/* DETAILS_SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-white/5">
            <div className="space-y-6">
               <h3 className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">Acquisition_Target</h3>
               <div>
                  <p className="text-xl font-black text-white uppercase tracking-tight italic">{prompt.title}</p>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Provider: {prompt.author.name || `@${prompt.author.username}`}</p>
               </div>
            </div>

            <div className="space-y-6">
               <h3 className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">Network_Log</h3>
               <div className="space-y-3">
                  <div className="flex items-center justify-between">
                     <span className="text-[9px] font-bold text-zinc-800 uppercase tracking-widest">Timestamp</span>
                     <span className="text-[10px] font-medium text-zinc-300">{txn.createdAt.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-[9px] font-bold text-zinc-800 uppercase tracking-widest">Status</span>
                     <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest italic">{txn.status}</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-[9px] font-bold text-zinc-800 uppercase tracking-widest">Ref_ID</span>
                     <span className="text-[10px] font-medium text-zinc-300 italic">{txn.paymentId || "N/A"}</span>
                  </div>
               </div>
            </div>
          </div>

          {/* TOTAL_BAR */}
          <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between mt-12 group hover:border-emerald-500/20 transition-all">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-2xl">
                   <IndianRupee className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-[11px] font-black text-white uppercase tracking-widest">Total Intelligence Fee</span>
             </div>
             <p className="text-4xl font-black italic tracking-tighter text-white">₹{txn.amount.toLocaleString()}</p>
          </div>

          <div className="pt-12 text-center">
             <p className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.5em] leading-relaxed">
               This is a computer-generated neural record. No physical signature required.<br/>
               Encrypted via Global Neural Network Architecture _ DEBUG101X
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
