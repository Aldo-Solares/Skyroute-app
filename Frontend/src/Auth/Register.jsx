import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerRequest, loginRequest } from "../services/AuthService";
import "./Register.css";
import {
  setToken,
  setUser,
  setRole,
  setImgProfile,
} from "../storage/StorageService";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await registerRequest({ username, password });
      setToken(data.jwt);
      setUser(data.username);
      setRole(data.role);

      if (data.img) {
        setImgProfile(data.img);
      }
      console.log(data.img);
      try {
        await loginRequest({ username, password });
        navigate("/home", { replace: true });
        return;
      } catch {
        navigate("/login", { replace: true });
        return;
      }
    } catch (err) {
      const msg = err?.response?.data || "Registration failed";
      setError(typeof msg === "string" ? msg : "Could not register");
    }
  };

  return (
    <div className="RegisterPage-Container">
      <form onSubmit={onSubmit}>
        <div id="image-container">
          <img id="icon" src="./images/Logo.ico" alt="" />
        </div>
        <h1>Create account</h1>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          autoComplete="username"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="new-password"
          required
        />

        <button type="submit">Register</button>
        {error && <div className="error">{error}</div>}
        <Link id="Login" to="/login">
          Already have an account?
        </Link>
      </form>
    </div>
  );
}
