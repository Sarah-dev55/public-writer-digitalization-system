import React, { useState } from "react";
import { Card, CardContent } from "./card";
import { Button } from "./button";
import { getErrorMessage } from "../../utils/errorUtils";

export const LoginModal = ({ open, onClose, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await onLogin({ email, password });
      if (!res || res.success === false) {
        setError(res?.message || 'Login failed');
      } else {
        // Clear form on success
        setEmail('');
        setPassword('');
        if (onClose) onClose();
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md mx-4 bg-white rounded-lg shadow-lg">
        <CardContent className="p-6">
          <header className="mb-4">
            <h3 className="text-lg font-semibold text-app-primary">Sign in to continue</h3>
            <p className="text-sm text-app-primary/70">You need an account to access this feature.</p>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <div className="p-2 bg-red-100 text-red-700 rounded">{error}</div>}
            <label className="flex flex-col text-sm text-app-primary">
              Email
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 p-2 border rounded focus:ring-1 focus:ring-app-primary focus:border-app-primary outline-none"
                placeholder="you@example.com"
                required
                aria-label="Email"
                type="email"
              />
            </label>

            <label className="flex flex-col text-sm text-app-primary">
              Password
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 p-2 border rounded focus:ring-1 focus:ring-app-primary focus:border-app-primary outline-none"
                placeholder="Password"
                required
                aria-label="Password"
                type="password"
              />
            </label>

            <div className="flex items-center justify-end gap-3">
              <Button type="button" variant="ghost" onClick={onClose} className="px-4 py-2">Cancel</Button>
              <Button type="submit" className="px-4 py-2" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
            </div>
          </form>

            <div className="mt-4 text-sm text-center">
              <p>Don't have an account? <a href="/signup" className="text-app-primary underline">Sign up</a></p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginModal;