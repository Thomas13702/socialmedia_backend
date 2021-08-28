import { useState } from "react";
import Layout from "@/components/Layout";
import firebaseClient from "../firebaseClient";
import firebase from "firebase/app";
import "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../styles/AuthForm.module.css";
import Link from "next/link";

export default function ForgottenPassword() {
  const [email, setEmail] = useState("");
  const [emailHasBeenSent, setEmailHasBeenSent] = useState(false);

  const sendResetEmail = (e) => {
    e.preventDefault();
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        setEmailHasBeenSent(true);
        setTimeout(() => {
          setEmailHasBeenSent(false);
        }, 3000);
        toast.success("An Email has been sent to you");
      })
      .catch(() => {
        toast.error("Error resetting password");
      });
  };

  return (
    <div>
      <ToastContainer />
      <div className={styles.auth}>
        <h1>Forgotten your password</h1>
        <div className={styles.card}>
          <form onSubmit={sendResetEmail}>
            <label htmlFor="email">Enter email...</label>
            <input
              type="email"
              name="email"
              id=""
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              id="emailAddress"
            />

            <input className="btn" type="submit" value="Send Email" />
          </form>
          <p>
            Don't have an account? <Link href={"/register"}>Register Here</Link>
          </p>
          <p>
            Know your Password? <Link href={"/login"}>Login Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
