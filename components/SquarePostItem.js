import styles from "@/styles/SquarePostItem.module.css";
import Link from "next/link";
import { FaRegHeart } from "react-icons/fa";
import { FaCommentAlt } from "react-icons/fa";
import { useRouter } from "next/router";
import { API_URL } from "@/config/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

export default function PosttItem({ post, token, user, cookies }) {
  const router = useRouter();
  const handleLike = async () => {
    const res = await fetch(
      `${API_URL}/posts/${
        post.likes.map((like) => {
          like.user.toString() === user._id.toString();
        }).length === 0
          ? "like"
          : "unlike"
      }/${post._id}`,
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
      router.reload();
    }
  };

  return (
    <a className={styles.post}>
      <ToastContainer />
      <div className={styles.info}>
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
        <p>{post.text}</p>
        <div className={styles.icons}>
          <FaRegHeart
            className={styles.heart}
            onClick={handleLike}
            className={
              post.likes.map((like) => {
                like.user.toString() === user._id.toString();
              }).length > 0
                ? styles.heartRed
                : styles.heartBlack
            }
          />
          <Link href={`/authenticated/post/${post._id}`}>
            <div>
              <FaCommentAlt className={styles.comment} />
            </div>
          </Link>
        </div>
      </div>
    </a>
  );
}
