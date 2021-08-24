import styles from "@/styles/DropDownMenu.module.css";
import firebaseClient from "../firebaseClient";
import firebase from "firebase/app";
import Link from "next/link";
import { useState } from "react";

export default function DropDownMenu({ heading }) {
  firebaseClient();
  const [click, setClick] = useState(false);

  const signOut = async () => {
    await firebase.auth().signOut();
    window.location.href = "/";
  };
  return (
    <div className={styles.dropdown}>
      <button className={styles.dropbtn} onClick={() => setClick(!click)}>
        {heading}
      </button>
      <div
        className={styles.dropdownContent}
        style={{ display: click && "block" }}
      >
        <Link href="/authenticated/profile/account">My Account</Link>
        <div onClick={signOut}>
          <a href="#">Logout</a>
        </div>
      </div>
    </div>
  );
}
