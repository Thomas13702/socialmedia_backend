import Layout from "@/components/Layout.js";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { useAuth } from "../auth";

export default function Home() {
  const { user } = useAuth();
  return (
    <Layout className={styles.container}>
      <h1 className={styles.title}>Welcome to the home page</h1>
      <h2 className={styles.description}>{`user ID: ${
        user ? user.uid : "No user signed in"
      }`}</h2>
      {user ? (
        <Link href="/authenticated">
          <a>Go to authenticated route</a>
        </Link>
      ) : (
        <div>
          <Link href="/login">
            <a>Login</a>
          </Link>
          <Link href="/login">
            <a>Register</a>
          </Link>
        </div>
      )}
    </Layout>
  );
}
