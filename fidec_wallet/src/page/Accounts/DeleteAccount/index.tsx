import React from "react";
import BackToHomeText from "../../../components/Footers/Back";
import HeaderMain from "../../../components/Headers/HeaderMain/HeaderMain";
import Navbar from "../../../components/Navbar";
import { Typography } from "antd";
import "./styles.scss";

const DeleteAccount = () => {
  return (
    <div className="delete--account--page">
      <HeaderMain />
      <h2 className="text--title">Remove Accounts</h2>
      <div className="delete--content--container">
        <div className="tag--account">
          <p>Account 11</p>
          <p className="tag--import">imported</p>
          <Typography.Paragraph copyable={{ tooltips: false }}>
            Address account
          </Typography.Paragraph>
        </div>
        <div className="text--description">
          This account will be removed from your wallet. Please make sure you
          have the original Secret Recovery Phrase or private key for this
          imported account before continuing. You can import this accounts again
          to the wallet later
        </div>
        <button className="btn--primary">Remove</button>
      </div>
      <BackToHomeText/>
      <Navbar />
    </div>
  );
};

export default DeleteAccount;
