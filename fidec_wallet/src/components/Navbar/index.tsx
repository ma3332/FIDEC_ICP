import IconSVG from "../Icons/IconSVG";
import "./styles.scss";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav>
      <Link
        to="/"
        className={
          location?.pathname == "/" ? "nav--item nav--active" : "nav--item"
        }
      >
        <IconSVG iconName="nav-erc20" />
      </Link>
      <Link
        to="/nft"
        className={
          location?.pathname?.includes("nft")
            ? "nav--item nav--active"
            : "nav--item"
        }
      >
        <IconSVG iconName="nav-nft" />
      </Link>
      <Link
        to="/dapp/connect-dapp"
        className={
          location?.pathname?.includes("dapp")
            ? "nav--item nav--active"
            : "nav--item"
        }
      >
        <IconSVG iconName="nav-dapp" />
      </Link>
      <Link
        to="/history"
        className={
          location?.pathname?.includes("history")
            ? "nav--item nav--active"
            : "nav--item"
        }
      >
        <IconSVG iconName="nav-history" />
      </Link>
      <Link
        to="/settings"
        className={
          location?.pathname?.includes("settings")
            ? "nav--item nav--active"
            : "nav--item"
        }
      >
        <IconSVG iconName="nav-setting" />
      </Link>
    </nav>
  );
};

export default Navbar;
