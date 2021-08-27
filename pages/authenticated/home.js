import nookies from "nookies";
import { verifyIdToken } from "../../firebaseAdmin";
import firebaseClient from "../../firebaseClient";
import firebase from "firebase/app";
import Layout from "@/components/Layout";
import { API_URL, PAGINATION_NUMBER } from "@/config/index";
import HomePageItem from "@/components/HomePageItem";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Home({
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
  // console.log(posts);

  const getMorePosts = async () => {
    const res = await fetch(
      `${API_URL}/posts/getNextFollowing/${posts.length}/${PAGINATION_NUMBER}`,
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
      <Layout>
        <h1>Home Feed</h1>

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
            {posts.map((post, index) => (
              <HomePageItem
                post={post}
                key={index}
                token={token}
                user={user}
                cookies={cookies}
              />
            ))}
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
    console.log("Cookie" + cookies.token);
    //nookies isnt getting token
    const token = await verifyIdToken(cookies.token);
    console.log(token);
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
      `${API_URL}/posts/getFirstFollowing/${PAGINATION_NUMBER}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      }
    );

    const data = await res.json();
    // console.log(data);

    const res1 = await fetch(`${API_URL}/profile/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
    });

    const user = await res1.json();

    const getNumberOfPosts = await fetch(`${API_URL}/posts/following/count`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
    });
    const numberOfPosts = await getNumberOfPosts.json();

    return {
      props: {
        session: `Your email is ${email} and your UID is ${uid}.`,
        data,
        token,
        user,
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
