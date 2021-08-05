import styles from "@/styles/Explore.module.css";
import Layout from "@/components/Layout";
import nookies from "nookies";
import { verifyIdToken } from "../../firebaseAdmin";
import firebaseClient from "../../firebaseClient";
import { API_URL } from "@/config/index";
import SquarePostItem from "@/components/SquarePostItem";

export default function explore({ session, posts }) {
  firebaseClient();
  if (session) {
    return (
      <Layout title="Explore">
        <div className={styles.feed}>
          {posts.map((post, index) => (
            <SquarePostItem key={index} post={post} />
          ))}
        </div>
      </Layout>
    );
  } else {
    return <Layout>Loading ... </Layout>;
  }
}

export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);

    const { uid, email } = token;

    const res = await fetch(`${API_URL}/posts/getAllTextPosts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
    });

    const posts = await res.json();

    return {
      props: { session: uid, posts },
    };
  } catch (err) {
    console.log(err);
    context.res.writeHead(302, { Location: "/login" });
    context.res.end();
    return { props: {} };
  }
}
