import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/images/logoDahiaKeratin.jpg";
import "./sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="text-center">
        <img src={logo} alt="logo" />
      </div>
      <nav className="nav">
        <Link
          to="/"
          className={`linknav ${
            location.pathname === "/" ? "activeLink" : ""
          }`}>
          <div
            className={`containerLinkNav ${
              location.pathname === "/" ? "activeLink" : ""
            }`}>
            <i className="bi bi-house-door-fill sideberIcon me-2"></i>
            Inicio
          </div>
        </Link>
        <Link
          to="/asesoras"
          className={`linknav ${
            location.pathname === "/asesoras" ? "activeLink" : ""
          }`}>
          <div
            className={`containerLinkNav ${
              location.pathname === "/contabilidad" ? "activeLink" : ""
            }`}>
            <i className="bi bi-cash-stack me-2"></i>
            Contabilidad
          </div>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
