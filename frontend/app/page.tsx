import Link from "next/link";
import { ShieldCheck, UserCheck, ArrowRight, Activity, Cpu, AlertTriangle } from "lucide-react";

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto py-10 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
          <Activity className="w-3.5 h-3.5" /> Next-Gen Anti-Fraud & Risk Intelligence
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          Sentinel<span className="text-primary">X</span> Intelligence Engine
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
          Real-time transaction risk scoring, explainable SHAP factors, automated SAR generation,
          and behavioral biometrics protecting compliance officers and consumers.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Compliance Portal Card */}
        <div className="bg-surface border border-gray-700 hover:border-primary/50 transition-all rounded-xl p-6 shadow-xl flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Compliance Portal</h2>
              <p className="text-sm text-slate-400">
                Institutional risk console for AML & Fraud analysts. Simulate transactions, inspect mule ring graph topologies, review SHAP explainability, and export automated SAR drafts.
              </p>
            </div>
            <ul className="text-xs space-y-2 text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Live Mule-Ring Sankey Network Visualizer
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                SHAP Factor Contribution Breakdown
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                One-Click Suspicious Activity Report (SAR) Generation
              </li>
            </ul>
          </div>
          <Link
            href="/compliance"
            className="mt-6 inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition shadow-lg shadow-primary/20"
          >
            Launch Compliance Portal <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Consumer App Card */}
        <div className="bg-surface border border-gray-700 hover:border-accent/50 transition-all rounded-xl p-6 shadow-xl flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
              <UserCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Consumer App</h2>
              <p className="text-sm text-slate-400">
                End-user client experience featuring smart behavioral nudges, instant card freeze triggers upon suspicious activity, and spending velocity insights.
              </p>
            </div>
            <ul className="text-xs space-y-2 text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Real-Time Risk Alerts & Customer Nudges
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Instant Card Lockdown & Security Controls
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Behavioral Keystroke Dynamics Monitoring
              </li>
            </ul>
          </div>
          <Link
            href="/consumer"
            className="mt-6 inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition shadow-lg shadow-accent/20"
          >
            Launch Consumer App <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-800 text-slate-400 text-sm">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-surface/50">
          <Cpu className="w-5 h-5 text-primary flex-shrink-0" />
          <span>FastAPI backend powered by high-speed inference & SHAP explainability</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-surface/50">
          <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          <span>Biometric keystroke timing & deepfake anomaly detection</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-surface/50">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>Automated FinCEN compliant SAR draft orchestration</span>
        </div>
      </div>
    </div>
  );
}
