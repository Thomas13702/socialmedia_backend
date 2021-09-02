//Page of users who liked the post
import Layout from "@/components/Layout";
import nookies from "nookies";
import { verifyIdToken } from "../../../../firebaseAdmin";
import firebaseClient from "../../../../firebaseClient";
import { API_URL } from "@/config/index";
import UserItem from "@/components/UserItem.js";

export default function Likes({ session, following, uid }) {
  firebaseClient();
  if (session) {
    return (
      <Layout>
        <h2>Following: </h2>
        {following.map((follow, index) => (
          <UserItem user={follow} key={index} uid={uid} />
        ))}
      </Layout>
    );
  } else {
    return <Layout>Loading...</Layout>;
  }
}

export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context);
    // console.log("Cookie" + cookies.token);
    //nookies isnt getting token
    const token = await verifyIdToken(cookies.token);
    // console.log(token);
    const { uid, email } = token;

    const res = await fetch(`${API_URL}/user/following/${context.params.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
    });
    const following = await res.json();

    return {
      props: {
        session: `Your email is ${email} and your UID is ${uid}.`,
        following,
        uid,
      },
    };
  } catch (err) {
    console.log(err);

    context.res.writeHead(302, { Location: "/login" });
    context.res.end();
    return { props: {} };
  }
}
