import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import Header from '../header/header'
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Ingelogd als:", result.user.displayName);
      navigate("/admin");
    } catch (error) {
      console.error("Google Login mislukt:", error.message);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("Account aangemaakt.");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Succesvol ingelogd.");
      }
      navigate("/admin");
    } catch (error) {
      console.error("Fout:", error.message);
    }
  };

  return (
    <div>
       <Header/>
      <h2>{isRegistering ? "Registreren" : "Inloggen"}</h2>
      <form onSubmit={handleEmailSubmit}>
        <input
          type="email"
          placeholder="E-mailadres"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Wachtwoord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">
          {isRegistering ? "Account aanmaken" : "Inloggen"}
        </button>
      </form>

      <button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering
          ? "Log in"
          : "Registreer"}
      </button>

      <hr />
      <button onClick={handleGoogleLogin}>Log in met Google</button>
    </div>
  );
}

export default Login;
