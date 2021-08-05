import nookies from "nookies";
import { verifyIdToken } from "../../firebaseAdmin";
import firebaseClient from "../../firebaseClient";
import firebase from "firebase/app";
import Layout from "@/components/Layout";

export default function home({ session }) {
  if (session) {
    return (
      <Layout>
        <h1>Home Feed</h1>
      </Layout>
    );
  } else {
    return <Layout>Loading ... </Layout>;
  }
}

export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context);
    console.log(cookies.token);
    const token = await verifyIdToken(cookies.token);
    const { uid, email } = token;
    return {
      props: { session: `Your email is ${email} and your UID is ${uid}.` },
    };
  } catch (err) {
    console.log(err);

    context.res.writeHead(302, { Location: "/login" });
    context.res.end();
    return { props: {} };
  }
}
