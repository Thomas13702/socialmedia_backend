import { useState } from "react";
import Layout from "@/components/Layout";
import nookies from "nookies";
import { verifyIdToken } from "../../../firebaseAdmin";
import firebaseClient from "../../../firebaseClient";
import { API_URL } from "@/config/index";
import PostItem from "@/components/PostItem";

export default function SlugProfile({ session, post }) {
  firebaseClient();
  const [text, setText] = useState("");

  if (session) {
    return (
      <Layout>
        <PostItem post={post} />
        <div className="post-form">
          <div className="bg-primary p">
            <h3>Leave a Comment...</h3>
          </div>
          <form
            className="form my-1"
            onSubmit={(e) => {
              e.preventDefault();
              addComment(postId, { text });
              setText("");
            }}
          >
            <textarea
              name="text"
              cols="30"
              rows="5"
              placeholder="Create a post"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
            <input type="submit" className="btn btn-dark my-1" value="Submit" />
          </form>
        </div>
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
      `${API_URL}/posts/getPostByID/${context.params.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      }
    );

    const post = await res.json();

    return {
      props: {
        session: `Your email is ${email} and your UID is ${uid}.`,
        post,
      },
    };
  } catch (err) {
    console.log(err);
    context.res.writeHead(302, { Location: "/login" });
    context.res.end();
    return { props: {} };
  }
}
