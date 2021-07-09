import { useState } from "react";
import Layout from "@/components/Layout"
import firebaseClient from "../firebaseClient";
import firebase from "firebase/app";
import "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../styles/Login.module.css";

export default function Login() {
  firebaseClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        window.location.href = "/";
      })
      .catch((error) => {
        const message = error.message;
        toast.error(message);
      });
  };



  return (
    <Layout>
      <ToastContainer />
      <div className={styles.body}>
        <div className={styles.title}>Register</div>
        <div className={styles.card}>
          <form action="">
            <label htmlFor="email">Enter email...</label>
            <input
              type="email"
              name="email"
              id=""
              onChange={(e) => setEmail(e.target.value)}
              value={email}
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
          </form>
          <button onClick={register}>Create Account</button>
          
        </div>
      </div>
    </Layout>
  );
}
