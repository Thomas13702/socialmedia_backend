import styles from "@/styles/PostItem.module.css";
import Image from "next/image";

export default function PosttItem({ post }) {
  return (
    <div className={styles.post}>
      <div className={styles.info}>
        <span>
          {new Date(post.date).toLocaleDateString("en-US")} {post.username}
        </span>
        {post.url === undefined ? (
          <div className={styles.text}>
            <p>{post.text}</p>
          </div>
        ) : (
          <>
            <div className={styles.imageHolder}>
              <Image
                src={post.url}
                alt="Post Image"
                layout="fill"
                objectFit="contain"
                className={styles.image}
              />
            </div>
            {post.text === "undefined" ? (
              <></>
            ) : (
              <div className={styles.text}>
                <h6>{post.text}</h6>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
