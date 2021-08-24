import nookies from "nookies";
import firebaseClient from "../../../firebaseClient";
import { verifyIdToken } from "../../../firebaseAdmin";
import { useState } from "react";
import { API_URL } from "@/config/index";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "@/styles/AuthForm.module.css";
import axios from "axios";
import { PropagateLoader } from "react-spinners";
import { css } from "@emotion/react";

import Layout from "@/components/Layout";

export default function EditProfile({ token, tokenForUID, account }) {
  firebaseClient();
  const router = useRouter();

  const [name, setName] = useState(account.name);
  const [dob, setDob] = useState(account.dob);
  const [username, setUsername] = useState(account.username);
  const [avatar, setAvatar] = useState();

  //React Spinner

  const [loading, setLoading] = useState(false);

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    //console.log(values);

    const formData = new FormData(); //backend expects data in form type
    console.log(avatar);
    formData.append("image", avatar);
    formData.append("name", name);
    formData.append("dob", dob);
    formData.append("username", username);

    const res = await axios.put(`${API_URL}/user/update`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.statusText === "OK") {
      const errors = await res;
      console.log(errors);

      if (Array.isArray(errors)) {
        errors.errors.map((error) => toast.error(error.msg));
      } else {
        toast.error(errors);
      }

      // toast.error(errors);
    } else {
      setLoading(false);
      const data = await res; //get data
      router.push(`/authenticated/profile/account`);
      toast.success("Your Account has been updated");
    }
  };

  const handleChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  return (
    <Layout title="Edit Account">
      <ToastContainer />

      <div className={styles.auth}>
        <div className={styles.loading}>
          <PropagateLoader
            //  color={color}
            css={override}
            loading={loading}
            size={15}
          />
        </div>
        <h1>Change your info...</h1>
        <div className={styles.card}>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Your Name: </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="username">Username: </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="fileInput">Profile Picture:</label>
              <input
                onChange={handleChange}
                accept=".jpg, .png, .jpeg"
                type="file"
                name="fileInput"
                id="fileInput"
              ></input>
            </div>
            <div>
              <label htmlFor="dob">Date of Birth: </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            <input type="submit" value="Submit" className="btn" />
          </form>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context);
    const tokenForUID = await verifyIdToken(cookies.token);
    //const token = await auth.currentUser.getIdToken();
    //const { uid, email } = tokenForUID;
    const token = cookies.token;

    const res = await fetch(`${API_URL}/profile/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
    });

    const account = await res.json();

    return {
      props: { token, tokenForUID, account },
    };
  } catch (err) {
    console.log(err);
    context.res.writeHead(302, { Location: "/login" });
    context.res.end();
    return { props: {} };
  }
}
