import { useState } from "react";
import Layout from "@/components/Layout";
import firebaseClient from "../firebaseClient";
import firebase from "firebase/app";
import "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../styles/AuthForm.module.css";

export default function Login() {
  firebaseClient();
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const register = async (e) => {
    e.preventDefault();
    if (email === confirmEmail) {
      if (password === confirmPassword) {
        await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then(() => {
            window.location.href = "/profile/setUp";
          })
          .catch((error) => {
            const message = error.message;
            toast.error(message);
          });
      } else {
        toast.error("Your passwords do not match");
      }
    } else {
      toast.error("Your emails have to match");
    }
  };

  return (
    <Layout title="Register">
      <ToastContainer />
      <div className={styles.auth}>
        <h1>Register</h1>
        <div className={styles.card}>
          <form onSubmit={register}>
            <label htmlFor="email">Enter email...</label>
            <input
              type="email"
              name="email"
              id=""
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              id="emailAddress"
            />
            <label htmlFor="email">Enter confirm email...</label>
            <input
              type="email"
              name="email"
              id=""
              onChange={(e) => setConfirmEmail(e.target.value)}
              value={confirmEmail}
              id="emailAddress"
            />
            <label htmlFor="password">Enter Password</label>
            <input
              type="password"
              name="password"
              id=""
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              id="password"
            />
            <label htmlFor="password">Enter Password</label>
            <input
              type="password"
              name="password"
              id=""
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              id="password"
            />
            <input className="btn" type="submit" value="Register" />
          </form>
        </div>
      </div>
    </Layout>
  );
}
