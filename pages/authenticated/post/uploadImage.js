import styles from "@/styles/UploadImage.module.css";

import { useState } from "react";
import axios from "axios";
import Progress from "@/components/Progress";
import Layout from "@/components/Layout";
import { API_URL } from "@/config/index";
import nookies from "nookies";
import { verifyIdToken } from "../../../firebaseAdmin";
import firebaseClient from "../../../firebaseClient";
import { useRouter } from "next/router";

export default function Home({ session, cookies }) {
  firebaseClient();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState();
  const [text, setText] = useState();
  const [age, setAge] = useState();
  const [images, setImages] = useState([]);
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const handleChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedImage || !text) {
      return;
    }

    const formData = new FormData(); //backend expects data in form type
    formData.append("image", selectedImage);
    formData.append("text", text);
    formData.append("age", age);

    const res = await axios.post(`${API_URL}/posts/image-upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${cookies.token}`,
      },
      onUploadProgress: (progressEvent) => {
        setUploadPercentage(
          parseInt(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          )
        );
        console.log(uploadPercentage);
      },
    });

    setTimeout(() => setUploadPercentage(0), 10000);
    console.log(res);

    if (res.statusText === "OK") {
      setImages([...images, res.data]);
      setUploadPercentage(0);
      setText("");
      setSelectedImage();
      router.push(`/authenticated/profile/account`);
    }
  };
  if (session) {
    return (
      <Layout>
        <Progress percentage={uploadPercentage} className={styles.progress} />

        <form action="" onSubmit={handleImageUpload} className={styles.form}>
          <div>
            <label htmlFor="fileInput">Image Upload</label>
            <input
              onChange={handleChange}
              accept=".jpg, .png, .jpeg"
              type="file"
              name="fileInput"
              id="fileInput"
              // className="fileInput mb-2"
            ></input>
          </div>

          <div>
            <label htmlFor="ageRating">Age Rating</label>
            <select
              name="ageRating"
              id="ageRating"
              onChange={(e) => setAge(e.target.value)}
            >
              <option value="0">Select an Age</option>
              <option value="0">0+</option>
              <option value="7">7+</option>
              <option value="12">12+</option>
              <option value="15">15+</option>
              <option value="18">18+</option>
              <option value="21">21+</option>
            </select>
          </div>
          <textarea
            type="text"
            name="text"
            id="post"
            cols="100"
            rows="5"
            autoFocus
            maxLength="240"
            placeholder="Post Text..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <div>
            <input
              type="submit"
              value="Upload"
              className="btn btn-primary mb-2"
            />
          </div>
        </form>

        <div className="row text-center tex-lg-left">
          {images
            ? images.map((image) => (
                <div
                  className="col-lg-3 col-md-4 col-6"
                  key={image.cloudinaryId}
                >
                  <a
                    href={image.url}
                    target="_blank"
                    className="d-block mb-4 h-100"
                  >
                    <img
                      className="img-fluid img-thumbnail"
                      src={image.url}
                      alt=""
                    />
                    <p>{image.comment}</p>
                  </a>
                </div>
              ))
            : "No Images"}
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

    return {
      props: { session: "Authenticated", cookies },
    };
  } catch (err) {
    console.log(err);
    context.res.writeHead(302, { Location: "/login" });
    context.res.end();
    return { props: {} };
  }
}
