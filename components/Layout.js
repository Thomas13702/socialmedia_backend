import Head from "next/head";
import { useRouter } from "next/router";
import Navbar from "./NavBar";
import Footer from "./Footer";
import styles from "@/styles/Layout.module.css";
import { useEffect } from "react";

export default function Layout({ title, keywords, description, children }) {
  //layout will wrap content, what ever is wrapped will be the children

  const router = useRouter();
  // console.log(router.pathname);

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
          integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
          crossOrigin="anonymous"
        />
      </Head>
      {router.pathname !== "/" &&
        router.pathname !== "/login" &&
        router.pathname !== "/register" && <Navbar />}

      <div className={styles.container}>{children}</div>
      {/* {router.pathname === "/" &&
        router.pathname === "/login" &&
        router.pathname === "/register" && <Footer />} */}
      {router.pathname === "/" ? (
        <Footer />
      ) : router.pathname === "/login" ? (
        <Footer />
      ) : router.pathname === "/register" ? (
        <Footer />
      ) : null}
      {/* <Footer /> */}
    </div>
  );
}

Layout.defaultProps = {
  title: "Social Media",
  description: "Find the latest Dj and other musical events",
  keywords: "music, dj, edm, events",
};
