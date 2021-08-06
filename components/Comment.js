import styles from "@/styles/PostItem.module.css";
import Link from "next/link";

export default function Comment({ comment }) {
  return (
    <div className={styles.post}>
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
    </div>
  );
}
