import { NavLink } from "react-router-dom";
import { headerLinks } from "../model/headerLinks";
const Header = () => {
  return (
    <header>
      <nav>
        {headerLinks.map((link) => (
          <NavLink end={link.to === "/"} to={link.to}>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
};

export default Header;
