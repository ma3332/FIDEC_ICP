import "./styles.scss";
import { useState } from "react";
import { Button, Modal } from "antd";
import { Link } from "react-router-dom";
import HeaderMain from "../../components/Headers/HeaderMain/HeaderMain";
import Navbar from "../../components/Navbar";
import IconSVG from "../../components/Icons/IconSVG";

const Settings = () => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <div className="settings--page">
      <HeaderMain />
      <h2 className="text--title">Setting</h2>
      <div className="content">
        <div className="setting--item" onClick={() => setVisible(true)}>
          <div>
            <IconSVG iconName="iconAbout" />
            <p>About</p>
          </div>
          <IconSVG iconName="IconArrowLeft" />
        </div>
        <Link to="/pin/set-new-pin" className="setting--item">
          <div>
            <IconSVG iconName="IconLock" />
            <p>PIN Setting</p>
          </div>

          <IconSVG iconName="IconArrowLeft" />
        </Link>
        <Link to="/pin/sign-message" className="setting--item">
          <div>
            <IconSVG iconName="IconWrite" />
            <p>Sign Message</p>
          </div>

          <IconSVG iconName="IconArrowLeft" />
        </Link>

        <div className="setting--item" onClick={() => setVisible(true)}>
          <div>
            <IconSVG iconName="IconGas" />
            <p>Gas Settings</p>
          </div>
          <IconSVG iconName="IconArrowLeft" />
        </div>
        <div className="setting--item" onClick={() => setVisible(true)}>
          <div>
            <IconSVG iconName="IconGeneral" />
            <p>General</p>
          </div>
          <IconSVG iconName="IconArrowLeft" />
        </div>
        <div className="setting--item" onClick={() => setVisible(true)}>
          <div>
            <IconSVG iconName="IconNoti" />
            <p>Alert</p>
          </div>
          <IconSVG iconName="IconArrowLeft" />
        </div>
      </div>

      <Modal
        title="Notification"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button type="primary" onClick={() => setVisible(false)}>
            OK
          </Button>,
        ]}
      >
        <h2 style={{ color: "white" }}>The skill are improving</h2>
      </Modal>
      <Navbar />
    </div>
  );
};

export default Settings;
