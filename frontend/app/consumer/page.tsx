"use client";

import { useState } from "react";
import { api } from "../../utils/api";
import { ShieldCheck, Lock, Unlock, CreditCard, AlertTriangle, ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function ConsumerPage() {
  const [cardFrozen, setCardFrozen] = useState(false);
  const [amount, setAmount] = useState(120);
  const [merchant, setMerchant] = useState("Electronics Store");
  const [nudge, setNudge] = useState<string | null>(null);
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [txHistory, setTxHistory] = useState([
    { id: "tx_01", merchant: "Whole Foods Market", amount: 64.2, status: "Approved", time: "Today, 2:15 PM" },
    { id: "tx_02", merchant: "Spotify Subscription", amount: 11.99, status: "Approved", time: "Yesterday" },
  ]);

  const handleSimulatePayment = async () => {
    setLoading(true);
    setNudge(null);
    try {
      const res = await api.post("/api/v1/evaluate-transaction", {
        user_id: "consumer_user_88",
        amount: Number(amount),
        merchant_category: merchant,
        location_delta_km: amount > 3000 ? 2500 : 5,
        keystroke_flight_time_ms: amount > 5000 ? 55 : 220,
        is_deepfake_suspected: amount > 4000,
      });

      setRiskScore(res.data.risk_score);
      setNudge(res.data.customer_nudge);

      if (res.data.risk_score < 0.75) {
        setTxHistory((prev) => [
          {
            id: `tx_${Date.now().toString().slice(-4)}`,
            merchant,
            amount: Number(amount),
            status: "Approved",
            time: "Just now",
          },
          ...prev,
        ]);
      }
    } catch (err) {
      console.error(err);
      setNudge("Unable to evaluate transaction. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Consumer Security Dashboard</h1>
        <p className="text-slate-400 text-sm">Protected by SentinelX Real-Time Behavioral Shield</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Digital Card & Controls */}
        <div className="space-y-4">
          <div
            className={`p-6 rounded-2xl shadow-2xl transition-all duration-300 relative overflow-hidden text-white border ${
              cardFrozen
                ? "bg-gradient-to-br from-slate-800 to-slate-900 border-red-500/50"
                : "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/40"
            }`}
          >
            {cardFrozen && (
              <div className="absolute inset-0 bg-red-950/60 backdrop-blur-xs flex items-center justify-center gap-2 text-red-300 font-bold uppercase tracking-wider text-sm">
                <Lock className="w-5 h-5" /> Card Frozen
              </div>
            )}
            <div className="flex justify-between items-start mb-8">
              <span className="text-xs uppercase tracking-widest text-slate-300 font-semibold">SentinelX Platinum</span>
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <div className="text-xl tracking-widest font-mono mb-6">
              •••• •••• •••• 4892
            </div>
            <div className="flex justify-between items-end text-xs text-slate-300">
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Cardholder</p>
                <p className="font-medium text-white">ALEXANDER R.</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Expires</p>
                <p className="font-medium text-white">09/29</p>
              </div>
            </div>
          </div>

          {/* Quick Lock Card Action */}
          <div className="bg-surface p-4 rounded-xl border border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${cardFrozen ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                {cardFrozen ? <Lock className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Card Status</p>
                <p className="text-xs text-slate-400">{cardFrozen ? "Card is locked for all transactions" : "Card is active and protected"}</p>
              </div>
            </div>
            <button
              onClick={() => setCardFrozen(!cardFrozen)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                cardFrozen
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                  : "bg-red-600 hover:bg-red-500 text-white"
              }`}
            >
              {cardFrozen ? <><Unlock className="w-3.5 h-3.5" /> Unlock Card</> : <><Lock className="w-3.5 h-3.5" /> Freeze Card</>}
            </button>
          </div>
        </div>

        {/* Transaction Simulator & Nudge Feed */}
        <div className="space-y-4">
          <div className="bg-surface p-6 rounded-xl border border-gray-700 shadow">
            <h2 className="text-lg font-semibold text-white mb-4">Simulate Consumer Checkout</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Merchant Category</label>
                <select
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-gray-600 rounded text-sm text-white"
                >
                  <option value="Electronics Store">Electronics Store (High Value)</option>
                  <option value="Crypto Exchange">Crypto Exchange (High Risk Flag)</option>
                  <option value="Grocery Store">Grocery Store (Low Risk)</option>
                  <option value="Luxury Watches">Luxury Goods (Suspicious Velocity)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Transaction Amount ($)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-background border border-gray-600 rounded text-sm text-white"
                />
              </div>

              <button
                onClick={handleSimulatePayment}
                disabled={loading || cardFrozen}
                className="w-full py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition disabled:opacity-50 text-sm flex items-center justify-center gap-2"
              >
                {loading ? "Evaluating Anomaly Risk…" : "Attempt Transaction"}
                <ArrowUpRight className="w-4 h-4" />
              </button>
              {cardFrozen && (
                <p className="text-xs text-red-400 text-center">Cannot make transactions while card is frozen.</p>
              )}
            </div>
          </div>

          {/* Real-time Customer Nudge Display */}
          {nudge && (
            <div
              className={`p-4 rounded-xl border transition-all ${
                riskScore && riskScore > 0.7
                  ? "bg-red-950/40 border-red-500/50 text-red-200"
                  : riskScore && riskScore > 0.4
                  ? "bg-yellow-950/40 border-yellow-500/50 text-yellow-200"
                  : "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
              }`}
            >
              <div className="flex items-start gap-3">
                {riskScore && riskScore > 0.7 ? (
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="space-y-2 flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold uppercase tracking-wider">
                      SentinelX Behavioral Nudge
                    </p>
                    {riskScore !== null && (
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-black/40">
                        Score: {riskScore.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium">{nudge}</p>
                  {riskScore && riskScore > 0.7 && !cardFrozen && (
                    <button
                      onClick={() => setCardFrozen(true)}
                      className="mt-2 text-xs px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-semibold transition"
                    >
                      Instant Freeze Card Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity List */}
      <div className="bg-surface p-6 rounded-xl border border-gray-700 shadow">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Verified Transactions</h2>
        <div className="divide-y divide-gray-700/60">
          {txHistory.map((item) => (
            <div key={item.id} className="py-3 flex justify-between items-center text-sm">
              <div>
                <p className="font-medium text-white">{item.merchant}</p>
                <p className="text-xs text-slate-400">{item.time}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">${item.amount.toFixed(2)}</p>
                <span className="text-[11px] text-emerald-400 inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
