import Layout from "@/components/Layout";
import nookies from "nookies";
import { verifyIdToken } from "../../../firebaseAdmin";
import firebaseClient from "../../../firebaseClient";
import { API_URL, PAGINATION_NUMBER } from "@/config/index";
import PostItem from "@/components/PostItem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import styles from "@/styles/SlugProfile.module.css";
import ProfilePicture from "@/components/ProfilePicture";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SlugProfile({
  session,
  data,
  cookies,
  slugProfile,
  user,
  numberOfPosts,
}) {
  firebaseClient();

  const [posts, setPosts] = useState(data);
  const [hasMore, setHasMore] = useState(true);
  const [followed, setFollowed] = useState(
    user.following.filter((follows) => {
      return follows.user.toString() === slugProfile._id.toString();
    }).length === 0
  );
  const [followers, setFollowers] = useState(slugProfile.followers.length);
  const [following, setFollowing] = useState(slugProfile.following.length);

  const getMorePosts = async () => {
    const res = await fetch(
      `${API_URL}/posts/getNextPostsBySlug/${slugProfile.slug}/${posts.length}/${PAGINATION_NUMBER}`,
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
    setHasMore(numberOfPosts > posts.length ? true : false);
  }, [posts]); //everytime posts changes this will trigger

  const follow = async () => {
    const res = await fetch(
      `${API_URL}/user/${followed ? "follow" : "unfollow"}/${
        slugProfile.username
      }`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      }
    );

    const profile = await res.json();
    console.log(profile);

    if (!res.ok) {
      toast.error(profile.msg);
    } else {
      setFollowed(!followed);
      setFollowers(profile.profile.followers.length);

      // router.reload();
    }
  };

  // const following = async () => {
  //   console.log(user);
  //   if (
  //     user.following.filter((follows) => {
  //       return follows.user.toString() === slugProfile._id.toString();
  //     }) === 0
  //   ) {
  //     return "notFollowing";
  //   } else {
  //     return "following";
  //   }
  // };

  if (session) {
    return (
      <Layout>
        <ToastContainer />
        <div className={styles.profile}>
          <div className={styles.left}>
            <div className={styles.profilePic}>
              <ProfilePicture account={slugProfile} />
            </div>

            <h1>{slugProfile.username}</h1>
          </div>

          <div className={styles.follow}>
            <h2>
              <Link
                href={`/authenticated/profile/followers/${slugProfile._id}`}
              >
                <a>Followers: {followers}</a>
              </Link>
            </h2>
            <h2>
              <Link
                href={`/authenticated/profile/following/${slugProfile._id}`}
              >
                <a>Following: {following}</a>
              </Link>
            </h2>
          </div>

          {followed ? (
            <button className="btn" onClick={follow}>
              Follow
            </button>
          ) : (
            <button className="btnRed" onClick={follow}>
              Unfollow
            </button>
          )}
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
            <PostItem key={index} post={post} />
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
    const slug = context.params.slug;

    const res = await fetch(
      `${API_URL}/posts/getPostsBySlug/${context.params.slug}/${PAGINATION_NUMBER}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      }
    );

    const data = await res.json();

    const res1 = await fetch(`${API_URL}/profile/slug/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
    });

    const slugProfile = await res1.json();

    const res2 = await fetch(`${API_URL}/profile/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
    });

    const user = await res2.json();

    const getNumberOfPosts = await fetch(
      `${API_URL}/posts/countPostsBySlug/${slug}`,
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
        session: `Your email is ${email} and your UID is ${uid}.`,
        data,
        cookies,
        slugProfile,
        user,
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
