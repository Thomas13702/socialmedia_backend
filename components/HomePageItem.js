import styles from "@/styles/HomePageItem.module.css";
import { FaRegHeart } from "react-icons/fa";
import { FaCommentAlt } from "react-icons/fa";
import Link from "next/link";
import { useEffect } from "react";

export default function HomePageItem({ post, token, user }) {
  return (
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

      <p>{post.text}</p>
      <div className={styles.icons}>
        <FaRegHeart
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
  );
}
