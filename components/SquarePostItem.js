import styles from "@/styles/SquarePostItem.module.css";
import Link from "next/link";
import { FaRegHeart } from "react-icons/fa";
import { FaCommentAlt } from "react-icons/fa";
import { useRouter } from "next/router";
import { API_URL } from "@/config/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Image from "next/image";

export default function PosttItem({ post, token, user, cookies }) {
  const router = useRouter();
  const handleLike = async () => {
    const res = await fetch(
      `${API_URL}/posts/${
        post.likes.filter((like) => {
          return like.user.toString() === user._id.toString();
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

  // const textPost = () => {
  //   return (
  //     <div className={styles.info}>
  //       <Link
  //         href={
  //           token.uid.toString() !== post.firebaseUID.toString()
  //             ? `/authenticated/profile/${post.slug}`
  //             : `/authenticated/profile/account`
  //         }
  //       >
  //         <div className={styles.span}>
  //           {new Date(post.date).toLocaleDateString("en-UK")}
  //           <h6>{post.username}</h6>
  //         </div>
  //       </Link>
  //       <p>{post.text}</p>
  //       <div className={styles.icons}>
  //         <div className={styles.heart}>
  //           <FaRegHeart
  //             onClick={handleLike}
  //             className={
  //               post.likes.filter((like) => {
  //                 return like.user.toString() === user._id.toString();
  //               }).length > 0
  //                 ? styles.heartRed
  //                 : styles.heartBlack
  //             }
  //           />
  //         </div>

  //         <Link href={`/authenticated/post/${post._id}`}>
  //           <div>
  //             <FaCommentAlt className={styles.comment} />
  //           </div>
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // };

  const imagePost = () => {
    return (
      <div className={styles.imgPost}>
        <div className={styles.profileImage}>
          <Link href={`/authenticated/post/${post._id}`}>
            <Image
              src={post.url}
              layout="fill"
              objectFit="cover"
              className={styles.image}
            />
          </Link>
        </div>
        <div className={styles.imgInfo}>
          <div>
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
          </div>
          <div>
            <div className={styles.icons}>
              <div className={styles.heart}>
                <FaRegHeart
                  onClick={handleLike}
                  className={
                    post.likes.filter((like) => {
                      return like.user.toString() === user._id.toString();
                    }).length > 0
                      ? styles.heartRed
                      : styles.heartBlack
                  }
                />
              </div>

              <Link href={`/authenticated/post/${post._id}`}>
                <div>
                  <FaCommentAlt className={styles.comment} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const textPost2 = () => {
    return (
      <div className={styles.body}>
        <div className={styles.bodyText}>
          <h6>{`${post.text.slice(0, 85)}${
            post.text.length >= 85 ? "..." : ""
          }`}</h6>
        </div>
        <div className={styles.data}>
          <div className={styles.username}>
            <Link
              href={
                token.uid.toString() !== post.firebaseUID.toString()
                  ? `/authenticated/profile/${post.slug}`
                  : `/authenticated/profile/account`
              }
            >
              <div>
                {post.username}{" "}
                {new Date(post.date).toLocaleDateString("en-UK")}
              </div>
            </Link>
          </div>
          <div className={styles.icons}>
            <div className={styles.heart}>
              <FaRegHeart
                onClick={handleLike}
                className={
                  post.likes.filter((like) => {
                    return like.user.toString() === user._id.toString();
                  }).length > 0
                    ? styles.heartRed
                    : styles.heartBlack
                }
              />
            </div>

            <Link href={`/authenticated/post/${post._id}`}>
              <div>
                <FaCommentAlt className={styles.comment} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.post}>
      <ToastContainer />
      {post.url ? imagePost() : textPost2()}
    </div>
  );
}
