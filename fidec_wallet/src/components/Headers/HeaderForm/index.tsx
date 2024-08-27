import { Link } from "react-router-dom";
import IconSVG from "../../Icons/IconSVG";

const HeaderForm = () => {
  return (
    <div style={{ padding: "13px 0" }}>
      <Link to="/">
        <IconSVG iconName="header-form" />
      </Link>
    </div>
  );
};

export default HeaderForm;
