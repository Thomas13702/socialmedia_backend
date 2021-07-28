import Layout from "@/components/Layout";
import nookies from "nookies";
import { verifyIdToken } from "../../../firebaseAdmin";
import firebaseClient from "../../../firebaseClient";
import { API_URL } from "@/config/index";
import PostItem from "@/components/PostItem";
import styles from "@/styles/Account.module.css";
import Link from "next/link";

export default function Account({ session, account, posts }) {
  firebaseClient();

  if (session) {
    return (
      <Layout title="Your Account">
        <div className={styles.header}>
          <h1>{account.username}</h1>
          <h2>Followers: {account.followers.length}</h2>
          <h2>Following: {account.following.length}</h2>
          <Link href="/authenticated/profile/createPost">
            <button className="btn">Create a Post</button>
          </Link>
        </div>

        {posts.map((post, index) => (
          <PostItem key={index} post={post} />
        ))}
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

    const res = await fetch(`${API_URL}/profile/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
    });

    const account = await res.json();

    const res1 = await fetch(`${API_URL}/posts/getLoggedInTextPosts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
    });

    const posts = await res1.json();

    return {
      props: { session: "Authenticated", account, posts, cookies },
    };
  } catch (err) {
    console.log(err);
    context.res.writeHead(302, { Location: "/login" });
    context.res.end();
    return { props: {} };
  }
}
