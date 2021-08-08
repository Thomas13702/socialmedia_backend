import styles from "@/styles/AccountItem.module.css";
import { FaPencilAlt, FaTimes } from "react-icons/fa";
import { API_URL } from "@/config/index";
import Link from "next/link";

export default function PostItem({ post, cookies, handleDelete, post1 }) {
  //   const handleDelete = async () => {
  //     const res = await fetch(`${API_URL}/posts/${post._id}`, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${cookies.token}`,
  //       },
  //     });
  //     const responseMSG = await res.json();
  //   };
  return (
    <div className={styles.post}>
      <div className={styles.info}>
        <span>
          {new Date(post.date).toLocaleDateString("en-US")} {post.username}
        </span>
        <h4>{post.text}</h4>
      </div>

      <div className={styles.icons}>
        <Link href={`/events/edit/${post.id}`}>
          <a className={styles.edit}>
            <FaPencilAlt /> <span>Edit Event</span>
          </a>
        </Link>
        <a href="#" className={styles.delete} onClick={handleDelete}>
          <FaTimes /> <span>Delete</span>
        </a>
      </div>
    </div>
  );
}
