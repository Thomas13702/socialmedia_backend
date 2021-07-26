import styles from "@/styles/PostItem.module.css";
import Link from "next/link";

export default function PosttItem({ post }) {
  return (
    <Link href={`/authenticated/profile/${post.slug}`}>
      <a className={styles.post}>
        <div className={styles.info}>
          <span>
            {new Date(post.date).toLocaleDateString("en-US")} {post.name}
          </span>
          <p>{post.text}</p>
        </div>
      </a>
    </Link>
  );
}
