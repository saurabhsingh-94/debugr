"use client";

import { useState, useEffect, useTransition } from "react";
import {
  TrendingUp, Users, Eye, IndianRupee,
  ShieldCheck, Clock, CheckCircle2, AlertCircle,
  ArrowRight, Loader2, Landmark, Zap, Wallet,
  ArrowDownRight, RefreshCw
} from "lucide-react";
import { switchToProfessional, updateBankDetails } from "@/app/actions";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const CREATOR_SHARE_PCT = 80;

interface CreatorDashboardProps {
  user: any;
  stats: any;
}

export default function CreatorDashboard({ user, stats }: CreatorDashboardProps) {
  const [isPending, startTransition] = useTransition();
  const [walletData, setWalletData] = useState<any>(null);
  const [walletLoading, setWalletLoading] = useState(true);

  const fetchWallet = async () => {
    try {
      const res = await fetch("/api/wallet/balance");
      const data = await res.json();
      setWalletData(data);
    } catch (err) {
      console.error("Failed to fetch wallet:", err);
    } finally {
      setWalletLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
    const interval = setInterval(fetchWallet, 30000);
    return () => clearInterval(interval);
  }, []);

  const isVerified = user.professionalStatus === "VERIFIED";
  const hasBankSetup = user.professionalStatus !== "UNCONFIGURED";

  return (
    <div className="space-y-10 font-grotesk">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.6)] animate-pulse" />
            <h1 className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.5em]">Creator Hub</h1>
          </div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">
            Creator <span className="text-zinc-800">Dashboard</span>
          </h2>
        </div>

        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-3xl backdrop-blur-xl">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center",
            isVerified ? "bg-emerald-500/10" : "bg-amber-500/10"
          )}>
            {isVerified
              ? <ShieldCheck className="w-6 h-6 text-emerald-400" />
              : <Clock className="w-6 h-6 text-amber-400" />
            }
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Status</p>
            <p className={cn(
              "text-sm font-black uppercase italic",
              isVerified ? "text-emerald-400" : "text-amber-400"
            )}>
              {user.professionalStatus}
            </p>
          </div>
        </div>
      </div>

      {/* VERIFICATION BANNER */}
      {!isVerified && (
        <div className={cn(
          "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl border",
          !hasBankSetup ? "bg-amber-500/5 border-amber-500/20" : "bg-blue-500/5 border-blue-500/20"
        )}>
          <div className="flex items-start gap-4">
            <div className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0",
              !hasBankSetup ? "bg-amber-500/10" : "bg-blue-500/10"
            )}>
              {!hasBankSetup
                ? <AlertCircle className="w-5 h-5 text-amber-400" />
                : <Clock className="w-5 h-5 text-blue-400" />
              }
            </div>
            <div className="space-y-1">
              <p className={cn(
                "text-[11px] font-black uppercase tracking-widest",
                !hasBankSetup ? "text-amber-400" : "text-blue-400"
              )}>
                {!hasBankSetup ? "Add bank account to unlock withdrawals" : "Verification in progress"}
              </p>
              <p className="text-[10px] font-medium text-zinc-500 leading-relaxed">
                {!hasBankSetup
                  ? "Your earnings are safe and accumulating. Add your bank details below to withdraw."
                  : "Your bank details are under review. Earnings continue to accumulate."
                }
              </p>
            </div>
          </div>
          {!hasBankSetup && (
            <a href="#bank-setup" className="shrink-0 px-5 py-3 bg-amber-500 text-black text-[9px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-amber-400 transition-all whitespace-nowrap">
              Set Up Bank →
            </a>
          )}
        </div>
      )}

      {/* AUDIENCE STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          icon={<Users className="w-5 h-5 text-violet-400" />}
          label="Followers"
          value={stats?.followers || 0}
          sub="Your audience"
        />
        <StatCard
          icon={<Eye className="w-5 h-5 text-cyan-400" />}
          label="Profile Visits"
          value={stats?.profileVisits || 0}
          sub="Total views"
        />
      </div>

      {/* WALLET */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[11px] font-black text-zinc-700 uppercase tracking-[0.4em]">Earnings Wallet</h3>
          <button
            onClick={fetchWallet}
            className="flex items-center gap-2 text-[9px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors"
          >
            <RefreshCw className={cn("w-3 h-3", walletLoading && "animate-spin")} /> Refresh
          </button>
        </div>

        {walletLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="nn-card p-8 animate-pulse h-32 bg-white/[0.01]" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <WalletCard
              icon={<IndianRupee className="w-5 h-5 text-emerald-400" />}
              label="Available Balance"
              value={walletData?.availableBalance || 0}
              sub="Ready to withdraw"
              accent="emerald"
              action={
                (walletData?.availableBalance || 0) > 0 ? (
                  isVerified ? (
                    <button
                      onClick={() => toast.success("Payout request submitted. Processing within 2-3 business days.")}
                      className="mt-4 w-full py-3 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-emerald-400 transition-all active:scale-95"
                    >
                      Withdraw
                    </button>
                  ) : (
                    <button
                      onClick={() => toast.error("Verify your bank account to unlock withdrawals.")}
                      className="mt-4 w-full py-3 bg-white/5 border border-white/10 text-zinc-600 text-[9px] font-black uppercase tracking-[0.3em] rounded-2xl cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      🔒 Verify Bank to Withdraw
                    </button>
                  )
                ) : null
              }
            />
            <WalletCard
              icon={<Clock className="w-5 h-5 text-amber-400" />}
              label="Pending"
              value={walletData?.pendingBalance || 0}
              sub="Processing"
              accent="amber"
            />
            <WalletCard
              icon={<TrendingUp className="w-5 h-5 text-violet-400" />}
              label="Total Earned"
              value={walletData?.totalEarned || 0}
              sub={`Lifetime @ ${CREATOR_SHARE_PCT}% share`}
              accent="violet"
            />
          </div>
        )}
      </div>

      {/* TRANSACTION HISTORY */}
      {walletData?.transactions?.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-[11px] font-black text-zinc-700 uppercase tracking-[0.4em] px-2">Transaction History</h3>
          <div className="nn-card overflow-hidden">
            <div className="divide-y divide-white/5">
              {walletData.transactions.map((txn: any) => (
                <div key={txn.id} className="flex items-center justify-between p-6 hover:bg-white/[0.01] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                      <ArrowDownRight className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-white uppercase tracking-tight">Prompt Sale</p>
                      <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
                        {new Date(txn.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black italic text-emerald-400">+₹{Number(txn.amount).toFixed(2)}</p>
                    <span className={cn(
                      "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                      txn.status === "available" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                    )}>
                      {txn.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* BANK DETAILS */}
        <div className="space-y-6" id="bank-setup">
          <h3 className="text-[11px] font-black text-zinc-700 uppercase tracking-[0.4em] px-2">Bank Details</h3>

          {user.professionalStatus === "UNCONFIGURED" ? (
            <BankDetailsForm isPending={isPending} startTransition={startTransition} />
          ) : (
            <div className="nn-card p-10 space-y-8 bg-zinc-900/50">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[24px] bg-white/[0.03] border border-white/10 flex items-center justify-center">
                  <Landmark className="w-8 h-8 text-zinc-600" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-white uppercase tracking-widest">{user.bankName || "Bank Connected"}</p>
                  <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-[0.2em] mt-1">
                    XXXX-{user.accountNumber?.slice(-4) || "0000"}
                  </p>
                </div>
              </div>
              {user.professionalStatus === "PENDING" && (
                <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-4">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                  <p className="text-[11px] font-medium text-amber-200/60 leading-relaxed italic">
                    Verification pending. Allow 24-48 hours.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* TIPS */}
        <div className="space-y-6">
          <h3 className="text-[11px] font-black text-zinc-700 uppercase tracking-[0.4em] px-2">Creator Tips</h3>
          <div className="nn-card p-10 space-y-8">
            <div className="space-y-3">
              <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">
                You keep <span className="text-emerald-400">80%</span> of every sale
              </h4>
              <p className="text-sm text-zinc-500 font-medium leading-relaxed italic">
                Earnings appear as pending for 7 days before becoming withdrawable. Minimum payout: ₹500.
              </p>
            </div>
            <div className="space-y-5">
              <Tip icon={<TrendingUp className="w-4 h-4" />} text="Verified creators get 2x visibility in marketplace searches." />
              <Tip icon={<Zap className="w-4 h-4" />} text="Add social handles to build cross-platform authority." />
              <Tip icon={<Wallet className="w-4 h-4" />} text="Processing takes 2-3 business days after withdrawal request." />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WalletCard({ icon, label, value, sub, accent, action }: any) {
  const accentColors: Record<string, string> = {
    emerald: "from-emerald-500/5 to-transparent border-emerald-500/10",
    amber: "from-amber-500/5 to-transparent border-amber-500/10",
    violet: "from-violet-500/5 to-transparent border-violet-500/10",
  };
  return (
    <div className={cn("nn-card p-8 bg-gradient-to-br", accentColors[accent] || "")}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/[0.03] rounded-2xl">{icon}</div>
      </div>
      <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-4xl font-black italic tracking-tighter text-white">
        ₹{Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
      <p className="text-[9px] font-bold text-zinc-800 uppercase tracking-[0.2em] pt-3">{sub}</p>
      {action}
    </div>
  );
}

function StatCard({ icon, label, value, sub }: any) {
  return (
    <div className="nn-card p-8 group hover:border-violet-500/20 transition-all">
      <div className="flex items-center justify-between mb-6">
        <div className="p-3 bg-white/[0.03] rounded-2xl group-hover:bg-white/10 transition-colors">{icon}</div>
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">{label}</p>
        <p className="text-4xl font-black italic tracking-tighter text-white">{value}</p>
        <p className="text-[9px] font-bold text-zinc-800 uppercase tracking-[0.2em] pt-4">{sub}</p>
      </div>
    </div>
  );
}

function Tip({ icon, text }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 text-zinc-600">{icon}</div>
      <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest leading-relaxed">{text}</p>
    </div>
  );
}

function BankDetailsForm({ isPending, startTransition }: any) {
  const [step, setStep] = useState<"input" | "confirm">("input");
  const [formData, setFormData] = useState({ bankName: "", accountNumber: "", ifscCode: "", accountHolderName: "" });
  const [bankInfo, setBankInfo] = useState<string | null>(null);

  const handleIFSCBlur = async () => {
    if (formData.ifscCode.length >= 11) {
      try {
        const res = await fetch(`https://ifsc.razorpay.com/${formData.ifscCode.toUpperCase()}`);
        const data = await res.json();
        if (data.BANK) {
          setBankInfo(data.BANK);
          setFormData(prev => ({ ...prev, bankName: data.BANK }));
        }
      } catch { setBankInfo(null); }
    }
  };

  const handleConfirm = () => {
    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
    startTransition(async () => {
      const res = await updateBankDetails(fd);
      if (res.success) {
        toast.success((res as any).verified ? "✅ Bank verified instantly!" : "⏳ Details saved. Under review.");
      } else {
        toast.error((res as any).error || "Failed to save bank details.");
      }
    });
  };

  if (step === "confirm") {
    return (
      <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} className="nn-card p-10 bg-white/[0.01] space-y-8">
        <div>
          <p className="text-[9px] font-black text-amber-400 uppercase tracking-[0.4em] mb-2">⚠️ Review Required</p>
          <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Confirm Details</h4>
        </div>
        <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] font-bold text-amber-200/70 leading-relaxed italic">
            Double-check your bank details. Incorrect details may result in failed payouts.
          </p>
        </div>
        <div className="space-y-3 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
          <ConfirmRow label="Account Holder" value={formData.accountHolderName} />
          <ConfirmRow label="Account Number" value={`XXXX XXXX ${formData.accountNumber.slice(-4)}`} />
          <ConfirmRow label="IFSC Code" value={formData.ifscCode.toUpperCase()} />
          {bankInfo && <ConfirmRow label="Bank" value={bankInfo} accent />}
        </div>
        <div className="flex gap-4">
          <button onClick={() => setStep("input")} className="flex-1 py-4 bg-white/[0.02] border border-white/5 text-zinc-400 text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-white/5 transition-all">
            ← Edit
          </button>
          <button onClick={handleConfirm} disabled={isPending} className="flex-1 py-4 bg-violet-600 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-violet-500 transition-all active:scale-95 flex items-center justify-center gap-2 border-b-4 border-violet-800">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Confirm & Save</>}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} className="nn-card p-10 bg-white/[0.01]">
      <div className="mb-8">
        <h4 className="text-xl font-black text-white italic uppercase tracking-tighter mb-2">Payout Setup</h4>
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Enter your bank details to enable withdrawals.</p>
      </div>
      <div className="space-y-6">
        <BankInput label="Account Holder Name" placeholder="AS REGISTERED IN BANK" value={formData.accountHolderName} onChange={v => setFormData(p => ({ ...p, accountHolderName: v }))} />
        <div className="grid grid-cols-2 gap-6">
          <BankInput label="Account Number" placeholder="Enter account number" type="password" value={formData.accountNumber} onChange={v => setFormData(p => ({ ...p, accountNumber: v }))} />
          <BankInput label="IFSC Code" placeholder="e.g. HDFC0001234" value={formData.ifscCode} onChange={v => setFormData(p => ({ ...p, ifscCode: v }))} onBlur={handleIFSCBlur} />
        </div>
        {bankInfo && (
          <div className="flex items-center gap-3 px-4 py-3 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Bank: {bankInfo}</p>
          </div>
        )}
        <button
          onClick={() => {
            if (!formData.accountHolderName || !formData.accountNumber || !formData.ifscCode) {
              toast.error("Please fill all fields."); return;
            }
            setStep("confirm");
          }}
          className="w-full py-5 bg-violet-600 text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-[24px] hover:bg-violet-500 transition-all active:scale-[0.98] flex items-center justify-center gap-3 border-b-4 border-violet-800"
        >
          Review Details <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

function ConfirmRow({ label, value, accent }: any) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">{label}</p>
      <p className={cn("text-[11px] font-bold uppercase tracking-widest", accent ? "text-emerald-400" : "text-white")}>{value}</p>
    </div>
  );
}

function BankInput({ label, ...props }: any) {
  return (
    <div className="space-y-3">
      <label className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] px-2 italic">{label}</label>
      <input
        {...props}
        className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-[12px] font-bold text-white focus:outline-none focus:border-violet-500/30 transition-all placeholder:text-zinc-800"
      />
    </div>
  );
}
