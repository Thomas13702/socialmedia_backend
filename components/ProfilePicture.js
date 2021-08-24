import styles from "@/styles/ProfilePicture.module.css";
import defaultProfile from "../public/images/default_profile_picture.jpg";
import Image from "next/image";

export default function ProfilePicture({ account }) {
  return (
    <div className={styles.profileImage}>
      {account.avatar === undefined || account.avatar === "" ? (
        <Image
          src={defaultProfile}
          alt="Default Profile Picture"
          layout="fill"
          objectFit="cover"
          className={styles.image}
        />
      ) : (
        <Image
          src={account.avatar}
          alt="Profile Picture"
          layout="fill"
          objectFit="cover"
          className={styles.image}
        />
      )}
    </div>
  );
}
