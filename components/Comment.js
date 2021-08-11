import styles from "@/styles/PostItem.module.css";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";
import { API_URL } from "@/config/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { useRouter } from "next/router";

export default function Comment({ comment, token, postID, cookie }) {
  const router = useRouter();
  const handleDelete = async () => {
    const res = await fetch(
      `${API_URL}/posts/comment/${postID}/${comment._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
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
      const resText = await res.json();

      router.reload();
    }
  };
  return (
    <div className={styles.post}>
      <ToastContainer />
      <div className={styles.info}>
        <span>
          <Link href={`/authenticated/profile/${comment.slug}`}>
            <div>
              {new Date(comment.date).toLocaleDateString("en-US")}{" "}
              {comment.username}
            </div>
          </Link>
        </span>

        <p>{comment.text}</p>
      </div>

      {token.uid === comment.firebaseUID && (
        <div className={styles.icons}>
          <a href="#" className={styles.delete} onClick={handleDelete}>
            <FaTimes /> <span>Delete</span>
          </a>
        </div>
      )}
    </div>
  );
}
