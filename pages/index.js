import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { useAuth } from "../auth";

export default function Home() {
  const { user } = useAuth();
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to the home page</h1>
      <h2 className={styles.description}>{`user ID: ${
        user ? user.uid : "No user signed in"
      }`}</h2>
      {user ? (
        <Link href="/authenticated">
          <a>Go to authenticated route</a>
        </Link>
      ) : (
        <Link href="/login">
          <a>Login</a>
        </Link>
      )}
    </div>
  );
}

//test
