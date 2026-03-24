import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginRequest } from "../services/AuthService";
import {
  setToken,
  setUser,
  setRole,
  setImgProfile,
} from "../storage/StorageService";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async () => {
    setError("");

    try {
      const data = await loginRequest({ username, password });

      setToken(data.jwt);
      setUser(data.username);
      setRole(data.role);

      if (data.img) {
        setImgProfile(data.img);
      }

      navigate("/home", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="LoginPage-Container">
      <div className="login-box">
        <div id="image-container">
          <img id="icon" src="/images/Logo.ico" alt="Logo" />
        </div>

        <h1>Welcome back</h1>

        <input
          className="login-input"
          placeholder="User"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="login-input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-button" onClick={onSubmit}>
          Login
        </button>

        {error && <div className="error">{error}</div>}

        <Link id="CreateAccount" to="/register">
          Don't have an account
        </Link>
      </div>
    </div>
  );
}
