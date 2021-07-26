import Layout from "@/components/Layout";
import nookies from "nookies";
import { verifyIdToken } from "../../../firebaseAdmin";
import firebaseClient from "../../../firebaseClient";
import { API_URL } from "@/config/index";
import PostItem from "@/components/PostItem";

export default function SlugProfile({ session, posts }) {
  firebaseClient();

  if (session) {
    return (
      <Layout>
        <h1>{posts[0].username}</h1>
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

    return {
      props: {
        session: `Your email is ${email} and your UID is ${uid}.`,
        posts,
      },
    };
  } catch (err) {
    console.log(err);
    context.res.writeHead(302, { Location: "/login" });
    context.res.end();
    return { props: {} };
  }
}

//chnage slug to usernmae
