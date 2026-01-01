import React, { useState } from "react";
import { Card, CardContent } from "./card";
import { Button } from "./button";

export const LoginModal = ({ open, onClose, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ email });
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md mx-4 bg-white rounded-lg shadow-lg">
        <CardContent className="p-6">
          <header className="mb-4">
            <h3 className="text-lg font-semibold">Sign in to continue</h3>
            <p className="text-sm text-muted-foreground">You need an account to access this feature.</p>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col text-sm">
              Email
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 p-2 border rounded"
                placeholder="you@example.com"
                required
                aria-label="Email"
                type="email"
              />
            </label>

            <label className="flex flex-col text-sm">
              Password
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 p-2 border rounded"
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
            <p>Don't have an account? <button onClick={() => { onLogin({ email: email || 'demo' }); }} className="text-app-primary underline">Sign up</button></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginModal;