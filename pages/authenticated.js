import nookies from "nookies";
import { verifyIdToken } from "../firebaseAdmin";
import firebaseClient from "../firebaseClient";
import firebase from "firebase/app";

export default function authenticated({ session }) {
  firebaseClient();

  const signOut = async () => {
    await firebase.auth().signOut();
    window.location.href = "/";
  };

  if (session) {
    return (
      <div>
        <h1>Authenticated</h1>
        <h2>{session}</h2>
        <h6>You can do anything you want</h6>
        <button onClick={signOut}>Sign Out</button>
      </div>
    );
  } else {
    return <div>Loading ... </div>;
  }
}

export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);
    const { uid, email } = token;
    return {
      props: { session: `Your email is ${email} and your UID is ${uid}.` },
    };
  } catch (err) {
    context.res.writeHead(302, { Location: "/login" });
    context.res.end();
    return { props: {} };
  }
}