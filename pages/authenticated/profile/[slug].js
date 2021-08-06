import Layout from "@/components/Layout";
import nookies from "nookies";
import { verifyIdToken } from "../../../firebaseAdmin";
import firebaseClient from "../../../firebaseClient";
import { API_URL } from "@/config/index";
import PostItem from "@/components/PostItem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

export default function SlugProfile({ session, posts, cookies, slugProfile }) {
  firebaseClient();

  const follow = async () => {
    const res = await fetch(`${API_URL}/user/follow/${slugProfile.username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
    });

    const profile = await res.json();

    if (!res.ok) {
      toast.error(profile.msg);
    }
  };

  if (session) {
    return (
      <Layout>
        <ToastContainer />
        <h1>{posts[0].username}</h1>
        <h2>Followers: {slugProfile.followers.length}</h2>
        <h2>Following: {slugProfile.following.length}</h2>
        <button className="btn" onClick={follow}>
          Follow
        </button>
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

    return {
      props: {
        session: `Your email is ${email} and your UID is ${uid}.`,
        posts,
        cookies,
        slugProfile,
      },
    };
  } catch (err) {
    console.log(err);
    context.res.writeHead(302, { Location: "/login" });
    context.res.end();
    return { props: {} };
  }
}
