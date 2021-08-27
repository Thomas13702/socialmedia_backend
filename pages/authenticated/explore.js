import styles from "@/styles/Explore.module.css";
import Layout from "@/components/Layout";
import nookies from "nookies";
import { verifyIdToken } from "../../firebaseAdmin";
import firebaseClient from "../../firebaseClient";
import { API_URL, PAGINATION_NUMBER } from "@/config/index";
import SquarePostItem from "@/components/SquarePostItem";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";

export default function Explore({
  session,
  data,
  token,
  user,
  cookies,
  numberOfPosts,
}) {
  firebaseClient();

  const [posts, setPosts] = useState(data);
  const [hasMore, setHasMore] = useState(true);

  const getMorePosts = async () => {
    const res = await fetch(
      `${API_URL}/posts/getNextPosts/${posts.length}/${PAGINATION_NUMBER}`,
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

  if (session) {
    return (
      <Layout title="Explore">
        {posts.msg ? (
          <h1>{posts.msg}</h1>
        ) : (
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
            <div className={styles.feed}>
              {posts.map((post, index) => (
                <SquarePostItem
                  key={index}
                  post={post}
                  token={token}
                  user={user}
                  cookies={cookies}
                />
              ))}
            </div>
          </InfiniteScroll>
        )}
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

    const setUp = await fetch(`${API_URL}/user/checkUserSetUp`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
    });

    const hasUserSetUp = await setUp.json(setUp);

    if (!hasUserSetUp) {
      context.res.writeHead(302, { Location: "/authenticated/profile/setUp" });
      context.res.end();
    }

    const res = await fetch(
      `${API_URL}/posts/getFirstPosts/${PAGINATION_NUMBER}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      }
    );

    const data = await res.json();
    //console.log(posts);

    const res1 = await fetch(`${API_URL}/profile/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
    });

    const user = await res1.json();

    const getNumberOfPosts = await fetch(`${API_URL}/posts/count`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
    });
    const numberOfPosts = await getNumberOfPosts.json();

    return {
      props: { session: uid, token, user, cookies, data, numberOfPosts },
    };
  } catch (err) {
    console.log(err);
    context.res.writeHead(302, { Location: "/login" });
    //context.res.end();
    return { props: {} };
  }
}
