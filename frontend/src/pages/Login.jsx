import "./Login.css";
import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post("/auth/login", {
                email,
                password
            });

            localStorage.setItem(
                "token",
                response.data.access_token
            );

            console.log("Login Successful");

            navigate("/dashboard");

            console.log("Login Successful");

        } catch (error) {

            console.log(error.response.data);

        }

    };

  return (
    <div className="login-container">

      <div className="login-card">

        <h1>CloudNotes</h1>

        <p>Welcome Back 👋</p>

        <form onSubmit={handleLogin}>

          <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

          <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

          <button type="submit">
            Login
          </button>

        </form>

        <p>
          Don't have an account?
        </p>

      </div>

    </div>
  );
}

export default Login;