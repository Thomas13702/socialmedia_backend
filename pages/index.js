import Layout from "@/components/Layout.js";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../auth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import CookieConsent, { Cookies } from "react-cookie-consent";

export default function Home({}) {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <Layout>
      <CookieConsent
        // debug={true}
        // enableDeclineButton
        // onDecline={() => {
        //   console.log("declined");
        // }}
        declineButtonText="Reject"
        location="bottom"
        buttonText="Accept Cookies"
        cookieName="CookieConsent"
        style={{ background: "#548ca8" }}
        // declineButtonStyle={{ background: "#548ca8" }}
        buttonStyle={{
          color: "black",
          fontSize: "13px",
          background: "white",
        }}
        expires={150}
      >
        This website uses cookies to enhance the user experience.{" "}
        <Link href={"/cookies"}>
          <a style={{ fontSize: "10px" }}>Cookie Disclosure</a>
        </Link>
      </CookieConsent>

      <div className={styles.container}>
        <div className={styles.image}>
          <Image
            src={"/images/pexels-oliver-sjöström-1098365.jpg"}
            layout="fill"
            objectFit="contain"
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
