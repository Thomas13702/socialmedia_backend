import nookies from "nookies";
import { verifyIdToken } from "../../firebaseAdmin";
import firebaseClient from "../../firebaseClient";
import firebase from "firebase/app";
import Layout from "@/components/Layout";
import { API_URL } from "@/config/index";
import HomePageItem from "@/components/HomePageItem";

export default function Home({ session, posts, token, user, cookies }) {
  firebaseClient();
  //console.log(posts);
  if (session) {
    return (
      <Layout>
        <h1>Home Feed</h1>
        {posts.msg ? (
          <h1>{posts.msg}</h1>
        ) : (
          posts.map((post, index) => (
            <HomePageItem
              post={post}
              key={index}
              token={token}
              user={user}
              cookies={cookies}
            />
          ))
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

    const res = await fetch(`${API_URL}/posts/following`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
    });

    const posts = await res.json();

    const res1 = await fetch(`${API_URL}/profile/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
    });

    const user = await res1.json();

    return {
      props: {
        session: `Your email is ${email} and your UID is ${uid}.`,
        posts,
        token,
        user,
        cookies,
      },
    };
  } catch (err) {
    console.log(err);

    context.res.writeHead(302, { Location: "/login" });
    context.res.end();
    return { props: {} };
  }
}
