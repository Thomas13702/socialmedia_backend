import Layout from "@/components/Layout";
import nookies from "nookies";
import { verifyIdToken } from "../../../firebaseAdmin";
import firebaseClient from "../../../firebaseClient";
import { API_URL } from "@/config/index";
import PostItem from "@/components/PostItem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import styles from "@/styles/SlugProfile.module.css";
import router from "next/router";

export default function SlugProfile({
  session,
  posts,
  cookies,
  slugProfile,
  user,
}) {
  firebaseClient();

  const follow = async () => {
    console.log(user.following);
    console.log(
      `${API_URL}/user/${
        user.following.filter((follows) => {
          return follows.user.toString() === slugProfile._id.toString();
        }) === 0
          ? "follow"
          : "unfollow"
      }/${slugProfile.username}`
    );

    console.log(
      user.following.filter((follows) => {
        console.log(follows.user.toString());
        console.log(slugProfile._id.toString());
        return follows.user.toString() === slugProfile._id.toString();
      }).length === 0
    );

    const res = await fetch(
      `${API_URL}/user/${
        user.following.filter((follows) => {
          return follows.user.toString() === slugProfile._id.toString();
        }).length === 0
          ? "follow"
          : "unfollow"
      }/${slugProfile.username}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      }
    );

    const profile = await res.json();

    if (!res.ok) {
      toast.error(profile.msg);
    } else {
      router.reload();
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
          <h1>{slugProfile.username}</h1>
          <div className={styles.right}>
            <div className={styles.follow}>
              <h2>Followers: {slugProfile.followers.length}</h2>
              <h2>Following: {slugProfile.following.length}</h2>
            </div>

            {user.following.filter((follows) => {
              return follows.user.toString() === slugProfile._id.toString();
            }).length === 0 ? (
              <button className="btn" onClick={follow}>
                Follow
              </button>
            ) : (
              <button className="btnRed" onClick={follow}>
                Unfollow
              </button>
            )}
          </div>
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

    const res = await fetch(
      `${API_URL}/posts/getTextPostsBySlug/${context.params.slug}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      }
    );

    const posts = await res.json();

    const res1 = await fetch(`${API_URL}/profile/slug/${context.params.slug}`, {
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

    return {
      props: {
        session: `Your email is ${email} and your UID is ${uid}.`,
        posts,
        cookies,
        slugProfile,
        user,
      },
    };
  } catch (err) {
    console.log(err);
    context.res.writeHead(302, { Location: "/login" });
    context.res.end();
    return { props: {} };
  }
}
