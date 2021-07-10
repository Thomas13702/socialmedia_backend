import Head from "next/head";
import { useRouter } from "next/router";
import Navbar from "./Navbar";
// import Footer from "./Footer";
import styles from "@/styles/Layout.module.css";

export default function Layout({ title, keywords, description, children }) {
  //layout will wrap content, what ever is wrapped will be the children

  const router = useRouter();

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Head>
      <Navbar />

      <div className={styles.container}>{children}</div>
      {/* <Footer /> */}
    </div>
  );
}

Layout.defaultProps = {
  title: "DJ Events | Find the hottest parties",
  description: "Find the latest Dj and other musical events",
  keywords: "music, dj, edm, events",
};
