import nookies from "nookies";
import { verifyIdToken } from "../../../firebaseAdmin";
import { useState } from "react";
import { API_URL } from "@/config/index";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "@/styles/AuthForm.module.css";

import Layout from "@/components/Layout";

export default function setUp({ token, tokenForUID }) {
  const router = useRouter();
  const [values, setValues] = useState({
    name: "",
    dob: "",
    username: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const errors = await res.json();
      console.log(errors.message.name);

      if (Array.isArray(errors)) {
        errors.errors.map((error) => toast.error(error.msg));
      } else {
        toast.error(errors.message.name);
      }

      toast.error(errors);
    } else {
      const data = await res.json(); //get data
      router.push(`/authenticated/home`);
      toast.success("Your Account has been updated");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  return (
    <Layout title="Account Set Up">
      <ToastContainer />
      <div className={styles.auth}>
        <h1>Tell us about yourself</h1>
        <div className={styles.card}>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Your Name: </label>
              <input
                type="text"
                id="name"
                name="name"
                value={values.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="username">Username: </label>
              <input
                type="text"
                id="username"
                name="username"
                value={values.username}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="dob">Date of Birth: </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={values.dob}
                onChange={handleInputChange}
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
    console.log(token);
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
