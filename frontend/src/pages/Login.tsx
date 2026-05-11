import { useState } from "react";
import { loginRequest, setToken } from "../api/auth";
import { Logo } from "../components/layout/Logo";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { access_token } = await loginRequest(username, password);
      setToken(access_token);
      window.location.href = "/";
    } catch {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#f6f9fc" }}>
      <div className="w-full max-w-sm">

        {/* Logo — dark version inline */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2.5">
            <svg width="26" height="32" viewBox="0 0 28 34" fill="none">
              <path d="M14 3 Q12 1.5 14 0 Q16 1.5 14 3" stroke="#635bff" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7"/>
              <rect x="8" y="5" width="12" height="26" rx="4" fill="#0a2540"/>
              <rect x="10" y="7.5" width="8" height="10" rx="1.5" fill="#1a3a5c"/>
              <rect x="11" y="9.5" width="6" height="1" rx="0.5" fill="#635bff" opacity="0.9"/>
              <rect x="12" y="22.5" width="4" height="4" rx="1" fill="#635bff" opacity="0.8"/>
              <circle cx="14" cy="29.5" r="0.8" fill="#635bff" opacity="0.7"/>
            </svg>
            <div className="leading-none">
              <p className="text-[15px] font-black tracking-tight" style={{ color: "#0a2540" }}>SALO</p>
              <p className="text-[9px] font-semibold tracking-[0.18em] uppercase mt-0.5" style={{ color: "#635bff" }}>Vapeshop</p>
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl px-8 py-8"
          style={{ background: "#fff", border: "1px solid #e3e8ef", boxShadow: "0 4px 24px rgba(10,37,64,0.08)" }}
        >
          <h1 className="text-lg font-bold mb-1" style={{ color: "#1a1f36" }}>Sign in</h1>
          <p className="text-sm mb-6" style={{ color: "#a3acb9" }}>Access your vapeshop dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold" style={{ color: "#697386" }}>Username</label>
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="admin"
                className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] transition-all"
                style={{ border: "1px solid #e3e8ef", color: "#1a1f36" }}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold" style={{ color: "#697386" }}>Password</label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] transition-all"
                style={{ border: "1px solid #e3e8ef", color: "#1a1f36" }}
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 py-2 px-3 rounded-lg" style={{ background: "#fff5f5" }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 mt-2"
              style={{ background: "#635bff", color: "#fff", boxShadow: "0 1px 3px rgba(99,91,255,0.3)" }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
