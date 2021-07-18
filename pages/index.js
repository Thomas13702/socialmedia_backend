import Layout from "@/components/Layout.js";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../auth";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home({}) {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.image}>
          <Image
            src={"/images/pexels-oliver-sjöström-1098365.jpg"}
            layout="fill"
          />
        </div>
        <div className={styles.action}>
          <div>
            <h2>Find Out whats happening today</h2>
          </div>
          <div>
            <Link href={user ? "/authenticated/home" : "/login"}>
              <button className={`btn ${styles.button}`}>
                <a className={styles.link}>Login</a>
              </button>
            </Link>
          </div>
          <div>
            <Link href={user ? "/authenticated/home" : "/register"}>
              <button className={`btn-secondary ${styles.button}`}>
                <a className={styles.link}>Register</a>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
