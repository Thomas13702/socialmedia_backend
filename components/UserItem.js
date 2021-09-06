import styles from "@/styles/UserItem.module.css";
import ProfilePicture from "@/components/ProfilePicture";
import Link from "next/link";

export default function UserItem({ user, uid }) {
  console.log(user);
  return (
    <div className={styles.post}>
      <Link
        href={
          uid.toString() !== user.firebaseUID.toString()
            ? `/authenticated/profile/${user.slug}`
            : `/authenticated/profile/account`
        }
      >
        <div className={styles.info}>
          <ProfilePicture account={user} />
          <div className={styles.data}>
            <div>
              <h4>{user.name}</h4>
              <h6>{user.username}</h6>
            </div>

            <div>
              <p>Following: {user.following.length}</p>
              <p>Followers: {user.followers.length}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
