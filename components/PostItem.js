import styles from "@/styles/PostItem.module.css";
import Image from "next/image";

export default function PosttItem({ post }) {
  return (
    <div className={styles.post}>
      <div className={styles.info}>
        <span>
          {new Date(post.date).toLocaleDateString("en-US")} {post.username}
        </span>
        {post.url ? (
          <>
            <div className={styles.imageHolder}>
              <Image
                src={post.url}
                alt="Default Profile Picture"
                layout="fill"
                objectFit="contain"
                className={styles.image}
              />
            </div>
            <div className={styles.text}>
              <h6>{post.text}</h6>
            </div>
          </>
        ) : (
          <>
            <p>{post.text}</p>
          </>
        )}
      </div>
    </div>
  );
}
