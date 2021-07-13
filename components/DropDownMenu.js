import styles from "@/styles/DropDownMenu.module.css";
import firebaseClient from "../firebaseClient";
import firebase from "firebase/app";

export default function DropDownMenu({ heading }) {
  firebaseClient();

  const signOut = async () => {
    await firebase.auth().signOut();
    window.location.href = "/";
  };
  return (
    <div className={styles.dropdown}>
      <button className={styles.dropbtn}>{heading}</button>
      <div className={styles.dropdownContent}>
        <a href="#">My Account</a>
        <a href="#" onClick={signOut}>
          Logout
        </a>
      </div>
    </div>
  );
}
