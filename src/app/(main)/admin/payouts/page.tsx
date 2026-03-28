'use client';

import { useState, useEffect, useTransition } from 'react';
import { approvePayout, rejectPayout } from '@/app/actions/payout.actions';
import { 
  CheckCircle, XCircle, Clock, Search, 
  ArrowRight, CreditCard, ShieldCheck, AlertTriangle 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const fetchPayouts = async () => {
    setLoading(true);
    try {
      // In a real app, this would be a server action or API call
      // For Phase 1, we simulate fetching PENDING payouts
      const response = await fetch('/api/admin/payouts');
      const data = await response.json();
      setPayouts(data);
    } catch (error) {
      console.error('Failed to fetch payouts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const handleAction = async (groupId: string, action: 'approve' | 'reject') => {
    startTransition(async () => {
      try {
        if (action === 'approve') {
          await approvePayout(groupId);
          toast.success('Payout approved and processing');
        } else {
          await rejectPayout(groupId);
          toast.success('Payout rejected and funds reversed');
        }
        await fetchPayouts();
      } catch (error: any) {
        toast.error(error.message || 'Action failed');
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-violet-400" />
            Payout Command Center
          </h1>
          <p className="text-zinc-500 mt-1 italic font-mono text-sm tracking-tight uppercase">Phase 1: Zero-Loss Protocol Activated</p>
        </div>
        <div className="flex items-center gap-4">
           {/* Stats can go here */}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="h-64 flex items-center justify-center bg-white/[0.02] border border-white/5 rounded-3xl animate-pulse">
            <Clock className="w-8 h-8 text-zinc-800 animate-spin" />
          </div>
        ) : payouts.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center bg-white/[0.02] border border-white/5 rounded-3xl border-dashed">
             <CheckCircle className="w-12 h-12 text-zinc-800 mb-4" />
             <p className="text-zinc-600 font-medium">All payouts settled</p>
          </div>
        ) : (
          payouts.map((p) => (
            <div 
              key={p.id}
              className="group p-6 bg-white/[0.03] border border-white/5 rounded-3xl hover:bg-white/[0.05] transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                 <span className="px-3 py-1 bg-violet-500/10 text-violet-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-violet-500/20">
                   {p.status}
                 </span>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 space-y-2">
                   <div className="flex items-center gap-3 text-white font-bold text-lg">
                      <ArrowRight className="w-4 h-4 text-zinc-700" />
                      ₹{p.amount.toLocaleString()}
                   </div>
                   <div className="flex items-center gap-2 text-sm text-zinc-500">
                      <span className="font-mono text-xs text-zinc-700 bg-white/5 px-2 py-0.5 rounded">ID: {p.id.slice(-8)}</span>
                      <span>requested by {p.userName || 'Unknown User'}</span>
                   </div>
                   <p className="text-xs text-zinc-600 italic">Requested on {new Date(p.createdAt).toLocaleString()}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleAction(p.id, 'reject')}
                    disabled={isPending}
                    className="flex items-center gap-2 px-5 py-2.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-2xl transition-all border border-rose-500/20 group/btn"
                  >
                    <XCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">Reject</span>
                  </button>
                  <button 
                    onClick={() => handleAction(p.id, 'approve')}
                    disabled={isPending}
                    className="flex items-center gap-2 px-5 py-3 bg-violet-600 text-white hover:bg-violet-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] rounded-2xl transition-all group/btn"
                  >
                    <CheckCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">Approve Disbursement</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-6 bg-yellow-500/5 border border-yellow-500/10 rounded-3xl flex items-start gap-4">
        <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-yellow-200">Security Guard Active</p>
          <p className="text-xs text-yellow-500/70 leading-relaxed">
            Every approval triggers an immutable ledger entry. Once approved, the funds are moved to a Locked Escrow state. Reversals are only possible if the disbursement fails at the provider level.
          </p>
        </div>
      </div>
    </div>
  );
}
