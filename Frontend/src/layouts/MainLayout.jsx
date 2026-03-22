import { Outlet } from "react-router-dom";
import GuideNavbar from "../GuideComponents/GuideNavbar";
import Contactbar from "../GuideComponents/Contactbar";

const MainLayout = () => {
  return (
    <div className="app-container">
      <div className="nav-bar">
        <GuideNavbar />
      </div>

      <div className="content-container">
        <div className="page-container">
          <Outlet />
        </div>

        <Contactbar />
      </div>
    </div>
  );
};

export default MainLayout;
