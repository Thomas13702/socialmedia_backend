import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import nookies from "nookies";
import { verifyIdToken } from "../../../firebaseAdmin";
import firebaseClient from "../../../firebaseClient";
import { API_URL } from "@/config/index";
import AccountItem from "@/components/AccountItem";
import styles from "@/styles/Account.module.scss";
import Link from "next/link";
import Image from "next/image";
import defaultProfile from "../../..//public/images/default_profile_picture.jpg";

export default function Account({ session, account, posts, cookies }) {
  firebaseClient();

  if (session) {
    return (
      <Layout title="Your Account">
        <div className={styles.profile}>
          <div className={styles.profileImage}>
            {!account.avatar === "" ? (
              <Image
                src={defaultProfile}
                alt="Default Profile Picture"
                layout="fill"
                objectFit="cover"
                className={styles.image}
              />
            ) : (
              <Image
                src={account.avatar}
                alt="Profile Picture"
                layout="fill"
                objectFit="cover"
                className={styles.image}
              />
            )}
          </div>

          <h1>{account.username}</h1>
          <div className={styles.right}>
            <div className={styles.follow}>
              <h2>Followers: {account.followers.length}</h2>
              <h2>Following: {account.following.length}</h2>
            </div>
            <div className={styles.button}>
              <Link href="/authenticated/profile/createPost">
                <button className="btn">Create a Text Post</button>
              </Link>
              <Link href="/authenticated/post/uploadImage">
                <button className="btn">Upload an Image</button>
              </Link>
              <Link href="/authenticated/profile/editProfile">
                <button className="btn">Edit Profile</button>
              </Link>
            </div>
          </div>
        </div>

        {posts.map((post, index) => (
          <AccountItem key={index} post={post} cookies={cookies} />
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
