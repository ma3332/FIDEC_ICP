import { useState } from "react";
import { Button } from "antd";
import HeaderHome from "../../components/Headers/HeaderHome/Header";
import Footer from "../../components/Footers";
import "./styles.scss";
import { Link } from "react-router-dom";

const PasswordDone = () => {
  const [statePage, setStatePage] = useState<"done" | "already" | "check">(
    "done"
  );
  return (
    <div className="password--setup--container">
      <HeaderHome />
      <div className="content--container">
        {statePage === "done" ? (
          <h2 className="title--text title--done">
            CONGRATULATION <br />
            PLEASE START YOUR JOURNEY <br />
            WITH FIDEC
          </h2>
        ) : statePage === "already" ? (
          <h2 className="title--text title--already">
            This wallet is already activated <br />
            please return to home page <br />
            and login with your pin
          </h2>
        ) : (
          <h2 className="title--text title--check">
            We cannot recognize your device <br />
            This might be due to our <br />
            Genuine Check mechanism <br />
            <br />
            Please contact your supplier <br />
            for more details
          </h2>
        )}
        <Button className="btn--primary btn--done">
          <Link to="/">Back to Home Page</Link>
        </Button>
      </div>
      <Footer />
    </div>
  );
};

export default PasswordDone;
