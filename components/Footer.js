import styles from "@/styles/Footer.module.css";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>Copyright &copy; Thomas Pritchard {new Date().getFullYear()}</p>
      <div className={styles.links}>
        <p>
          <Link href="/privacy-policy">Privacy Policy</Link>
        </p>
        <p>
          <Link href="/about">About This Project</Link>
        </p>
        <p>
          <Link href="/about">Terms and Conditions</Link>
        </p>
        <p>
          <Link href="/cookie">Cookie Policy</Link>
        </p>
      </div>
    </footer>
  );
}
