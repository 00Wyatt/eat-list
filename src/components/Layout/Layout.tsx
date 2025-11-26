import { Outlet } from "react-router";
import { Header } from "../Header";
import { Footer } from "../Footer";

export const Layout = () => {
  return (
    <>
      <Header />
      <main className="h-full flex-1">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
