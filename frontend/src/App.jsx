import React from "react";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <main className="container mx-auto p-4">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;
