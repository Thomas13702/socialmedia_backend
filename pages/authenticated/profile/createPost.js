import Layout from "@/components/Layout";
import styles from "@/styles/CreatePost.module.css";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { API_URL } from "@/config/index";
import nookies from "nookies";
import { verifyIdToken } from "../../../firebaseAdmin";
import firebaseClient from "../../../firebaseClient";

export default function createPost({ token }) {
  firebaseClient();
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log(post);

    if (text === "") {
      toast.error("Please enter your post");
    }

    const post = { text: text };

    const res = await fetch(`${API_URL}/posts/text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(post),
    });

    console.log(res);

    if (!res.ok) {
      if (res.status === 403 || res.status === 401) {
        toast.error("No Token included");
        return;
      }

      toast.error("Something Went Wrong");
    } else {
      const resPost = await res.json(); //get data
      toast.success("All Posted");
    }
  };

  if (token) {
    return (
      <Layout>
        <ToastContainer />
        <h1 className={styles.header}>Create a Post</h1>
        <div>
          <form action="" className={styles.form} onSubmit={handleSubmit}>
            <textarea
              type="text"
              name="post"
              id="post"
              cols="100"
              rows="20"
              autoFocus
              maxLength="240"
              placeholder="Post Text..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
            <input type="submit" value="Post" className="btn" />
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
    const cookies = await nookies.get(context);
    const token1 = await verifyIdToken(cookies.token);
    const token = cookies.token;
    //console.log(token);

    return {
      props: { token },
    };
  } catch (err) {
    console.log(err);
    context.res.writeHead(302, { Location: "/login" });
    context.res.end();
    return { props: {} };
  }
}
