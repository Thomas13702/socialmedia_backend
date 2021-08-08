import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import nookies from "nookies";
import { verifyIdToken } from "../../../firebaseAdmin";
import firebaseClient from "../../../firebaseClient";
import { API_URL } from "@/config/index";
import AccountItem from "@/components/AccountItem";
import styles from "@/styles/Account.module.css";
import Link from "next/link";

export default function Account({ session, account, posts, cookies }) {
  firebaseClient();
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    setUserPosts(posts);
  }, []);

  const handleDelete = async () => {
    const postIndex = userPosts;
    const res = await fetch(`${API_URL}/posts/${postid}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
    });

    if (!res.ok) {
      if (res.status === 403 || res.status === 401) {
        toast.error("No Token included");
        return;
      }

      toast.error("Something Went Wrong");
    } else {
      const resText = await res.json(); //get data
      toast.success(resText);

      setUserPosts(userPosts.splice());
      //comment.unshift(resText);
    }
    const responseMSG = await res.json();
  };

  if (session) {
    return (
      <Layout title="Your Account">
        <div className={styles.profile}>
          <h1>{account.username}</h1>
          <div className={styles.right}>
            <div className={styles.follow}>
              <h2>Followers: {account.followers.length}</h2>
              <h2>Following: {account.following.length}</h2>
            </div>
            <Link href="/authenticated/profile/createPost">
              <button className="btn">Create a Post</button>
            </Link>
          </div>
        </div>

        {posts.map((post, index) => (
          <AccountItem
            key={index}
            post={post}
            cookies={cookies}
            handleDelete={handleDelete}
            postid={postid}
          />
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
