import { Link } from "react-router-dom";
import "./styles.scss";
import IconSVG from "../../Icons/IconSVG";

const HeaderHome = () => {
  return (
    <div className="header">
      <Link to="/">
        <IconSVG iconName="header-home" />
      </Link>
    </div>
  );
};

export default HeaderHome;
