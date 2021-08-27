import Layout from "@/components/Layout";

export default function Todo() {
  return (
    <Layout>
      <h1>Backend Tasks</h1>
      <ul>
        <li>
          Posts
          <ul>
            <li>Make - image/text✓, age rating✓ , tier</li>
            <li>Delete✓</li>
            <li>Show on profile✓</li>
            <li>When Clicking on image opens page with text and comment✓</li>
            <li>long text posts are broken across lines✓</li>
            <li>
              Add scrolling pagination - for account page and other peoples
              account✓
            </li>
          </ul>
        </li>
        <li>
          Account
          <ul>
            <li>Show account details ✓</li>
            <li>update username / profile picture✓</li>
            <li>Fix Unfollow Bug ✓</li>
          </ul>
        </li>
        <li>
          Auth
          <ul>
            <li>Fix AUTH :( ✓</li>
          </ul>
        </li>
      </ul>
    </Layout>
  );
}
