import styles from "@/styles/PostItem.module.css";

export default function PosttItem({ post }) {
  return (
    <div className={styles.post}>
      <div className={styles.info}>
        <span>
          {new Date(post.date).toLocaleDateString("en-US")} {post.username}
        </span>
        <p>{post.text}</p>
      </div>
    </div>
  );
}
