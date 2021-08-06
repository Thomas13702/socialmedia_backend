import { useState } from "react";
import Layout from "@/components/Layout";
import nookies from "nookies";
import { verifyIdToken } from "../../../firebaseAdmin";
import firebaseClient from "../../../firebaseClient";
import { API_URL } from "@/config/index";
import PostItem from "@/components/PostItem";
import Comment from "@/components/Comment";
import styles from "@/styles/CommentPage.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

export default function SlugProfile({ session, post, token }) {
  firebaseClient();
  const [text, setText] = useState("");
  console.log(post._id);

  const onSubmit = async (e) => {
    //e.preventDefault();
    if (text === "") {
      toast.error("Please enter your post");
    }

    const res = await fetch(`${API_URL}/posts/comment/${post._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: text }),
    });

    console.log(res);

    if (!res.ok) {
      if (res.status === 403 || res.status === 401) {
        toast.error("No Token included");
        return;
      }

      toast.error("Something Went Wrong");
    } else {
      const resText = await res.json(); //get data
      toast.success("Added Comment");
      setText("");
    }
  };

  if (session) {
    return (
      <Layout>
        <ToastContainer />
        <PostItem post={post} />
        <div className={styles.postForm}>
          <div className={styles.bgPrimary}>
            <h3>Leave a Comment...</h3>
          </div>
          <form className={styles.form} onSubmit={onSubmit}>
            <textarea
              name="text"
              cols="30"
              rows="5"
              placeholder="Comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
            <input type="submit" className={styles.btn} value="Submit" />
          </form>
          {post.comments.map((comment, index) => (
            <Comment key={index} comment={comment} />
          ))}
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
        token: cookies.token,
      },
    };
  } catch (err) {
    console.log(err);
    context.res.writeHead(302, { Location: "/login" });
    context.res.end();
    return { props: {} };
  }
}
