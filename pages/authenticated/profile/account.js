import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import nookies from "nookies";
import { verifyIdToken } from "../../../firebaseAdmin";
import firebaseClient from "../../../firebaseClient";
import { API_URL, PAGINATION_NUMBER } from "@/config/index";
import AccountItem from "@/components/AccountItem";
import styles from "@/styles/Account.module.scss";
import Link from "next/link";
import ProfilePicture from "@/components/ProfilePicture";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Account({
  session,
  account,
  data,
  cookies,
  numberOfPosts,
}) {
  firebaseClient();
  // console.log(account.avatar);

  const [posts, setPosts] = useState(data);
  const [hasMore, setHasMore] = useState(true);

  const getMorePosts = async () => {
    const res = await fetch(
      `${API_URL}/posts/getNextLoggedInPosts/${posts.length}/${PAGINATION_NUMBER}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      }
    );

    const newPosts = await res.json();
    setPosts((posts) => [...posts, ...newPosts]);
  };

  useEffect(() => {
    // console.log(numberOfPosts);
    // console.log(posts.length);
    setHasMore(numberOfPosts > posts.length ? true : false);
  }, [posts]); //everytime posts changes this will trigger

  if (account.msg) {
    return (
      <Layout>
        <h1>{account.msg}</h1>
      </Layout>
    );
  }

  if (session) {
    return (
      <Layout title="Your Account">
        <div className={styles.profile}>
          <div className={styles.profilePicture}>
            <ProfilePicture account={account} />

            <h1>{account.username}</h1>
          </div>

          <div className={styles.right}>
            <div className={styles.follow}>
              <h2>
                <Link href={`/authenticated/profile/followers/${account._id}`}>
                  <a>Followers: {account.followers.length}</a>
                </Link>
              </h2>
              <h2>
                {" "}
                <Link href={`/authenticated/profile/following/${account._id}`}>
                  <a>Following: {account.following.length}</a>
                </Link>
              </h2>
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
        <InfiniteScroll
          dataLength={posts.length}
          next={getMorePosts}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "centre" }}>
              <strong>You have reached the end!</strong>
            </p>
          }
        >
          {posts.map((post, index) => (
            <AccountItem key={index} post={post} cookies={cookies} />
          ))}
        </InfiniteScroll>
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
    // console.log(account);

    const res1 = await fetch(
      `${API_URL}/posts/getFirstLoggedInPosts/${PAGINATION_NUMBER}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      }
    );

    const data = await res1.json();
    // console.log(data);

    const getNumberOfPosts = await fetch(
      `${API_URL}/posts/countLoggedInPosts`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      }
    );
    const numberOfPosts = await getNumberOfPosts.json();

    return {
      props: {
        session: "Authenticated",
        account,
        data,
        cookies,
        numberOfPosts,
      },
    };
  } catch (err) {
    console.log(err);
    context.res.writeHead(302, { Location: "/login" });
    context.res.end();
    return { props: {} };
  }
}
