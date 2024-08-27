import { useState } from "react";
import { Link } from "react-router-dom";
import CannotTokenText from "../../../components/Footers/CannotTokenText";
import HeaderMain from "../../../components/Headers/HeaderMain/HeaderMain";
import Navbar from "../../../components/Navbar";
import { Typography } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import "./styles.scss";

const NftTokenIdDetail = () => {
  return (
    <div>
      <HeaderMain />
      <div className="token--detail">
        <div className="account--name">
          <p>Account Name</p>
          <Typography.Paragraph
            copyable={{
              tooltips: false,
              text: "0xb98Ef0896C9f1A175B97078f40097ea9fdf18588",
            }}
          >
            {"0xb98Ef0896C9f1A175B97078f40097ea9fdf18588".substring(0, 6)}...
          </Typography.Paragraph>
        </div>
        <div className="content">
          <h1>TAT Collection</h1>
          <div className="flex">
            <p>ID: 12311</p>
            <p>Amount: 1</p>
          </div>
          <div className="btn--group">
            <button>
              <Link to="/token/buy-token/erc721-1150">BUY</Link>
            </button>
            <button>SEND</button>
          </div>
        </div>
        <span className="text-token">Token ID Info</span>
        <div className="info--container">
          <p>
            "name": "YuGiYn #1329",
            <br /> "description": "A Ticket towards YuGiYn ecosystem",
            "image":"https://assets.yu-gi-yn.com/production
            <br />
            /images/6c6a3a90c0222892ad52bf8d9f54dbaf35f6ac1e81b222f1e807825c1{" "}
            <br /> e7d574f.png", <br />
            "attributes":{" "}
            {`[{ "trait_type": "Type", "value": "Re:HACKERS++" },
            { "trait_type": "Eyes", "value": "No Brow Puppy Eyes TRI-CLR" },
{ "trait_type": "Head", "value": "Pacth GRN" },
{ "trait_type": "Hair", "value": "Quiff RED 01" },
{ "trait_type": "Mask", "value": "Robot ORN" },
{ "trait_type": "Clothing", "value": "T-Shirt 013" },
{ "trait_type": "Neck", "value": "Dice Gems Choker GLD" },
{ "trait_type": "Background", "value": "FUSHIZOME" } 
            ]`}
          </p>
        </div>
        <CannotTokenText />
      </div>
      <Navbar />
    </div>
  );
};

export default NftTokenIdDetail;
