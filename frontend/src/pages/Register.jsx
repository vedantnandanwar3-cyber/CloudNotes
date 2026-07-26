import "./Login.css";
import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Register() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {

        e.preventDefault();

        try {

            await api.post("/auth/register", {
                username,
                email,
                password
            });

            toast.success("Registration Successful 🎉");

            navigate("/");

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.detail || "Registration Failed"
            );

        }

    };

    return (

        <div className="login-container">

            <div className="login-card">

                <h1>CloudNotes</h1>

                <p>Create Your Account 🚀</p>

                <form onSubmit={handleRegister}>

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

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

                    <button type="submit">

                        Register

                    </button>

                </form>

            </div>

        </div>

    );

}

export default Register;