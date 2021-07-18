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
        <a href="/authenticated/profile/account">My Account</a>
        <div onClick={signOut}>
          <a href="#">Logout</a>
        </div>
      </div>
    </div>
  );
}
