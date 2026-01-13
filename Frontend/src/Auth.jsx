import { useState, useContext } from "react";
import { MyContext } from "./MyContext.jsx";
import "./public/Auth.css";

function Auth() {
  const { setIsAuth, setShowAuth } = useContext(MyContext);
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const endpoint = isLogin
      ? "http://localhost:8080/api/auth/login"
      : "http://localhost:8080/api/auth/signup";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
      } else {
        setIsAuth(true);
        setShowAuth(false);
      }
    } catch {
      setError("Server not reachable");
    }

    setLoading(false);
  };

  return (
    <div className="auth-overlay" onClick={() => setShowAuth(false)}>
      <div
        className="auth-card"
        onClick={(e) => e.stopPropagation()} 
      >
        <h1>SigmaGPT</h1>

        <p className="subtitle">
          {isLogin ? "Welcome back" : "Create your account"}
        </p>

        {error && <div className="error">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
        </button>

        <p className="toggle">
          {isLogin ? "New here?" : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Sign Up" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Auth;