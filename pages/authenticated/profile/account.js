import Layout from "@/components/Layout";

export default function Account() {
  return (
    <Layout title="Your Account">
      <h1>Backend Tasks</h1>
      <ul>
        <li>
          Posts
          <ul>
            <li>Make - image/text, age rating, tier</li>
            <li>Delete</li>
            <li>Show on profile</li>
          </ul>
        </li>
        <li>
          Account{" "}
          <ul>
            <li>Show account details</li>
            <li>update username / profile picture</li>
          </ul>
        </li>
      </ul>
    </Layout>
  );
}
