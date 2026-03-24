import "./Contactbar.css";
import { matchPath, useLocation } from "react-router-dom";

function Contactbar() {
  const { pathname } = useLocation();

  const isNormalFooter =
    pathname === "/home" || !!matchPath("/category/*", pathname);

  return (
    <footer
      className={`Contactbar-Container ${
        isNormalFooter ? "normal" : "transparent"
      }`}
    >
      <h1>Contact Us</h1>
      <p>Email: TravelTeam-2@outlook.com</p>
      <p>Phone: +52 55-2167-8932</p>
    </footer>
  );
}

export default Contactbar;
