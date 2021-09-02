import styles from "@/styles/HomePageItem.module.css";
import { FaRegHeart } from "react-icons/fa";
import { FaCommentAlt } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/router";
import { API_URL } from "@/config/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Image from "next/image";
import { useState } from "react";

export default function HomePageItem({ post, token, user, cookies }) {
  const [likes, setLikes] = useState(post.likes.length);
  const [liked, setLiked] = useState(
    post.likes.filter((like) => {
      return like.user.toString() === user._id.toString();
    }).length > 0
  );

  const router = useRouter();
  const handleLike = async () => {
    const res = await fetch(
      `${API_URL}/posts/${!liked ? "like" : "unlike"}/${post._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      }
    );

    if (!res.ok) {
      if (res.status === 403 || res.status === 401) {
        toast.error("No Token included");
        return;
      }

      toast.error("Something Went Wrong");
    } else {
      const like = await res.json(); //get data
      setLiked(!liked);
      setLikes(liked === false ? likes + 1 : likes - 1);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className={styles.post}>
        <Link
          href={
            token.uid.toString() !== post.firebaseUID.toString()
              ? `/authenticated/profile/${post.slug}`
              : `/authenticated/profile/account`
          }
        >
          <div className={styles.span}>
            {new Date(post.date).toLocaleDateString("en-UK")}
            <h6>{post.username}</h6>
          </div>
        </Link>
        {post.url === undefined ? (
          <div className={styles.postText}>
            <p>{post.text}</p>
          </div>
        ) : (
          <>
            <div className={styles.imageHolder}>
              <Link href={`/authenticated/post/${post._id}`}>
                <Image
                  src={post.url}
                  alt="Post Image"
                  layout="fill"
                  objectFit="cover"
                  className={styles.image}
                />
              </Link>
            </div>
          </>
        )}

        <div className={styles.icons}>
          <div className={styles.likes}>
            <Link href={`/authenticated/post/likes/${post._id}`}>
              <a>{likes}</a>
            </Link>
            <FaRegHeart
              className={liked ? styles.heartRed : styles.heartBlack}
              onClick={handleLike}
            />
          </div>

          <Link href={`/authenticated/post/${post._id}`}>
            <div>
              <FaCommentAlt className={styles.comment} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
