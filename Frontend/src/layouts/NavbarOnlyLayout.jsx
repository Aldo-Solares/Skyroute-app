import { Outlet } from "react-router-dom";
import GuideNavbar from "../GuideComponents/GuideNavbar";

const NavbarOnlyLayout = () => (
  <div className="app-container">
    <GuideNavbar />
    <div className="page-container">
      <Outlet />
    </div>
  </div>
);

export default NavbarOnlyLayout;
