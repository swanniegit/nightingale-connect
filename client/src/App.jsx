import Login from "@/components/ui/Login.tsx";
import { useState, useEffect } from "react";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  if (!token) {
    return <Login onLogin={setToken} />;
  }

  // The main app content would go here
  return (
    <div>
      <h1>Welcome to the Main App</h1>
      {/* Add other main app components here */}
    </div>
  );
}

export default App; 