"use client";

import { useState } from "react";
import { api } from "../../utils/api";
import { ResponsiveContainer, Sankey } from "recharts";
import { X, AlertCircle } from "lucide-react";

interface EvaluationResponse {
  risk_score: number;
  is_mule_ring: boolean;
  graph_cluster: string[];
  explainability_shap: { factor: string; impact: string }[];
  auto_sar_draft: string;
  customer_nudge: string;
}

export default function CompliancePage() {
  const [form, setForm] = useState({
    user_id: "user_123",
    amount: 1000,
    merchant_category: "Retail",
    location_delta_km: 0,
    keystroke_flight_time_ms: 200,
    is_deepfake_suspected: false,
  });
  const [result, setResult] = useState<EvaluationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSar, setShowSar] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number" || type === "range"
          ? Number(value)
          : value,
    }));
  };

  const runEvaluation = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<EvaluationResponse>("/api/v1/evaluate-transaction", form);
      setResult(res.data);
    } catch (err: unknown) {
      console.error(err);
      if (typeof err === "object" && err !== null && "response" in err) {
        const axErr = err as { response?: { data?: { detail?: string } } };
        setError(axErr.response?.data?.detail || "Evaluation failed. Ensure backend API is running.");
      } else {
        setError("Evaluation failed. Ensure backend API is running on port 8000.");
      }
    } finally {
      setLoading(false);
    }
  };

  const cluster = result?.graph_cluster || [];
  const sankeyData = {
    nodes: cluster.map((name) => ({ name })),
    links: cluster
      .map((_, idx) =>
        idx < cluster.length - 1
          ? { source: idx, target: idx + 1, value: 10 }
          : null
      )
      .filter(Boolean) as { source: number; target: number; value: number }[],
  };

  return (
    <div className="space-y-6">
      {/* Header Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-surface rounded shadow">
          <h2 className="text-sm font-medium text-text">Live Alerts</h2>
          <p className="text-2xl font-bold text-primary">{result?.is_mule_ring ? "🔴 High Risk" : "🟢 Normal"}</p>
        </div>
        <div className="p-4 bg-surface rounded shadow">
          <h2 className="text-sm font-medium text-text">Risk Score</h2>
          <p className="text-2xl font-bold text-primary">{result?.risk_score !== undefined ? result.risk_score.toFixed(2) : "0.00"}</p>
        </div>
        <div className="p-4 bg-surface rounded shadow">
          <h2 className="text-sm font-medium text-text">Flagged Volume</h2>
          <p className="text-2xl font-bold text-primary">{result?.risk_score && result.risk_score > 0.7 ? "1" : "0"}</p>
        </div>
        <div className="p-4 bg-surface rounded shadow">
          <h2 className="text-sm font-medium text-text">Mule Rings</h2>
          <p className="text-2xl font-bold text-primary">{result?.is_mule_ring ? "Detected" : "None"}</p>
        </div>
      </section>

      {/* Simulator Sidebar */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-surface p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4 text-primary">Transaction Simulator</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">User ID</label>
              <input
                type="text"
                name="user_id"
                value={form.user_id}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-gray-600 rounded text-text"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <label>Amount ($)</label>
                <span className="font-semibold text-primary">${form.amount}</span>
              </div>
              <input
                type="range"
                name="amount"
                min={0}
                max={10000}
                step={50}
                value={form.amount}
                onChange={handleChange}
                className="w-full accent-primary"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <label>Location Δ (km)</label>
                <span className="font-semibold text-primary">{form.location_delta_km} km</span>
              </div>
              <input
                type="range"
                name="location_delta_km"
                min={0}
                max={5000}
                step={10}
                value={form.location_delta_km}
                onChange={handleChange}
                className="w-full accent-primary"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <label>Keystroke Flight Time (ms)</label>
                <span className="font-semibold text-primary">{form.keystroke_flight_time_ms} ms</span>
              </div>
              <input
                type="range"
                name="keystroke_flight_time_ms"
                min={50}
                max={2000}
                step={10}
                value={form.keystroke_flight_time_ms}
                onChange={handleChange}
                className="w-full accent-primary"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="deepfake_checkbox"
                name="is_deepfake_suspected"
                checked={form.is_deepfake_suspected}
                onChange={handleChange}
                className="mr-2 h-4 w-4 rounded accent-primary cursor-pointer"
              />
              <label htmlFor="deepfake_checkbox" className="text-sm cursor-pointer select-none">
                Deepfake Suspected (Biometric flag)
              </label>
            </div>

            {error && (
              <div className="p-3 bg-red-900/40 border border-red-500 rounded text-sm text-red-200 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={runEvaluation}
              disabled={loading}
              className="mt-2 w-full bg-primary text-white py-2 rounded hover:bg-primary/80 transition font-medium disabled:opacity-50"
            >
              {loading ? "Evaluating…" : "Run Evaluation"}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="bg-surface p-6 rounded shadow space-y-6">
          {result ? (
            <>
              <div>
                <h3 className="text-lg font-semibold text-primary">Risk Score: {result.risk_score.toFixed(2)}</h3>
                <p className="text-sm mt-1 text-slate-300">{result.customer_nudge}</p>
              </div>

              {/* Graph Visualizer */}
              {result.is_mule_ring && sankeyData.nodes.length >= 2 && sankeyData.links.length > 0 && (
                <div className="h-64 border border-gray-700 rounded p-2 bg-background/50">
                  <h4 className="font-medium text-xs text-primary mb-2 uppercase tracking-wide">Mule Cluster Graph</h4>
                  <ResponsiveContainer width="100%" height="90%">
                    <Sankey
                      data={sankeyData}
                      nodePadding={15}
                      nodeWidth={15}
                      node={{ stroke: "#fff", fill: "#6366f1" }}
                      link={{ stroke: "#aaa", strokeOpacity: 0.5 }}
                    />
                  </ResponsiveContainer>
                </div>
              )}

              {/* SHAP Factor Breakdown */}
              <div>
                <h4 className="font-medium mb-2 text-primary">Decision Factors</h4>
                <div className="space-y-2">
                  {result.explainability_shap.length > 0 ? (
                    result.explainability_shap.map((item, idx) => {
                      const match = item.impact.match(/\d+/);
                      const pct = match ? Math.min(Math.max(parseInt(match[0], 10), 0), 100) : 0;
                      return (
                        <div key={idx} className="flex items-center">
                          <span className="w-32 text-sm">{item.factor}</span>
                          <div className="flex-1 h-4 bg-gray-700 rounded overflow-hidden">
                            <div
                              className="h-4 bg-accent rounded transition-all duration-300"
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm w-12 text-right">{item.impact}</span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-slate-400">No elevated risk factors detected.</p>
                  )}
                </div>
              </div>

              {/* SAR Drawer */}
              {result.auto_sar_draft && (
                <div>
                  <button
                    onClick={() => setShowSar(true)}
                    className="mt-2 px-4 py-2 bg-surface border border-primary text-primary rounded hover:bg-primary hover:text-white transition"
                  >
                    View Auto‑SAR Draft
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-slate-400 text-center">
              <p className="text-base mb-1">No transaction evaluated yet.</p>
              <p className="text-sm">Configure parameters on the left and click "Run Evaluation".</p>
            </div>
          )}
        </div>
      </section>

      {/* SAR Modal Dialog */}
      {showSar && result?.auto_sar_draft && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-gray-700 p-6 rounded-lg max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-primary">Auto‑Generated SAR</h3>
              <button
                onClick={() => setShowSar(false)}
                className="p-1 rounded hover:bg-background text-slate-400 hover:text-white"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm flex-1 overflow-y-auto bg-background p-4 rounded border border-gray-700 font-mono text-slate-200">
              {result.auto_sar_draft}
            </pre>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowSar(false)}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
