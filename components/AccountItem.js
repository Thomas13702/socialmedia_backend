import styles from "@/styles/AccountItem.module.css";
import { FaPencilAlt, FaTimes } from "react-icons/fa";
import { API_URL } from "@/config/index";
import Link from "next/link";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Image from "next/image";

export default function PostItem({ post, cookies, res }) {
  const router = useRouter();
  const handleDelete = async () => {
    const res = await fetch(`${API_URL}/posts/${post._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
    });

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
          {new Date(post.date).toLocaleDateString("en-US")} {post.username}
        </span>
        {post.url ? (
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
        ) : (
          <div className={styles.postText}>
            <h4>{post.text}</h4>
          </div>
        )}
      </div>

      <div className={styles.icons}>
        <Link href={`/authenticated/post/edit/${post._id}`}>
          <a className={styles.edit}>
            <FaPencilAlt /> <span>Edit Post</span>
          </a>
        </Link>
        <a href="#" className={styles.delete} onClick={handleDelete}>
          <FaTimes /> <span>Delete</span>
        </a>
      </div>
    </div>
  );
}
