import { NavLink } from "react-router-dom";
import { headerLinks } from "../model/headerLinks";
import { useAppSelector } from "@app/providers/store/hooks.ts";
import LogoutButton from "@/features/auth/logout";

const Header = () => {
  const { isAuth } = useAppSelector((state) => state.session);
  const visibleLinks = headerLinks.filter(
    (link) =>
      link.visibility === "always" ||
      (link.visibility === "auth" && isAuth) ||
      (link.visibility === "guest" && !isAuth),
  );

  return (
    <header>
      <nav>
        {visibleLinks.map((link) => (
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
