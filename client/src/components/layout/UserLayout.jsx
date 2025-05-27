import { Outlet } from "react-router-dom";
import Header from "../../components/user/header/Header";
import Footer from "../footer/Footer";

const UserLayout = () => {
  return (
    <>
      <Header className="fixed top-0 left-0 z-50" />
      <Outlet />
      <Footer />
    </>
  );
};

export default UserLayout;
