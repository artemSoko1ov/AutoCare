import { NavLink } from "react-router-dom";
import { headerLinks } from "../model/headerLinks";
import { useAppSelector } from "@app/providers/store/hooks.ts";
import LogoutButton from "@/features/auth/logout";

const Header = () => {
  const { isAuth } = useAppSelector((state) => state.session);

  return (
    <header>
      <nav>
        {headerLinks.map((link) => (
          <NavLink end={link.to === "/"} key={link.to} to={link.to}>
            {link.label}
          </NavLink>
        ))}
      </nav>
      {isAuth && <LogoutButton />}
    </header>
  );
};

export default Header;
