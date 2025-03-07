// pages/_app.js
import "../app/globals.css";
import AdminLayout from "../components/AdminLayout";

function MyApp({ Component, pageProps, router }) {
  // If the route is the login page, render without the admin layout
  if (router.pathname === "/" || router.pathname === "/login") {
    return <Component {...pageProps} />;
  }

  // Otherwise, wrap the page in the AdminLayout
  return (
    <AdminLayout>
      <Component {...pageProps} />
    </AdminLayout>
  );
}

export default MyApp;
