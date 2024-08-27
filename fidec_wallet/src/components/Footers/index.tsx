import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bottom: "0",
      }}
    >
      <p
        style={{
          fontWeight: "400",
          fontSize: "14px",
        }}
      >
        Need help? Contact <Link to="/">Support</Link>
      </p>
    </div>
  );
};

export default Footer;
