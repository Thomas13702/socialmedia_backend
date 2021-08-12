import Layout from "@/components/Layout";
import styles from "@/styles/CreatePost.module.css";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { API_URL } from "@/config/index";
import nookies from "nookies";
import { verifyIdToken } from "../../../firebaseAdmin";
import firebaseClient from "../../../firebaseClient";
import { useRouter } from "next/router";

export default function CreatePost({ token }) {
  firebaseClient();
  const router = useRouter();
  const [post, setPost] = useState({
    text: "",
    ageRating: "",
  });
  const handleInputChange = (e) => {
    //console.log(post);
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log(post);

    const hasEmptyFields = Object.values(post).some(
      (element) => element === ""
    ); //checks each part of values to see if its empty
    //some checks each item in object and will return treu or false whether it passes test (here is whether its equal to "")

    if (hasEmptyFields) {
      toast.error("Please fill in all fields"); //toastify for error messages
      return;
    }

    const res = await fetch(`${API_URL}/posts/text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(post),
    });

    //console.log(res);

    if (!res.ok) {
      if (res.status === 403 || res.status === 401) {
        toast.error("No Token included");
        return;
      }

      toast.error("Something Went Wrong");
    } else {
      const resPost = await res.json(); //get data
      router.push("/authenticated/profile/account");
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
            <div>
              <label htmlFor="ageRating">Age Rating</label>
              <select
                name="ageRating"
                id="ageRating"
                onChange={handleInputChange}
              >
                <option value="0"></option>
                <option value="0">0+</option>
                <option value="7">7+</option>
                <option value="12">12+</option>
                <option value="15">15+</option>
                <option value="18">18+</option>
                <option value="21">21+</option>
              </select>
            </div>
            <div>
              <textarea
                type="text"
                name="text"
                id="post"
                cols="100"
                rows="20"
                autoFocus
                maxLength="240"
                placeholder="Post Text..."
                value={post.text}
                onChange={handleInputChange}
              ></textarea>
            </div>

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
