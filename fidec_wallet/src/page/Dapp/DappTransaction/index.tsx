import BackToHomeText from "../../../components/Footers/Back";
import Navbar from "../../../components/Navbar";
import "./styles.scss";
import { Form, Input } from "antd";
import { useState } from "react";
import HeaderMain from "../../../components/Headers/HeaderMain/HeaderMain";

const DappTransaction = () => {
  const [form] = Form.useForm();
  const [tab, setTab] = useState<number>(1);
  return (
    <div className="dapp--transaction--page">
      <HeaderMain />
      <h2 className="text--title">Dapp Connect</h2>
      <div className="input--address">
        <h2 className="title">Dapp Address</h2>
        <Form form={form} className="form">
          <Form.Item name="name">
            <Input />
          </Form.Item>
        </Form>
        <p className="text--response">https://remix.ethereum.org/</p>
      </div>
      <div className="btn-container">
        <button
          className={tab === 1 ? "btn-active" : ""}
          onClick={() => setTab(1)}
        >
          DETAILS
        </button>
        <button
          className={tab === 2 ? "btn-active" : ""}
          onClick={() => setTab(2)}
        >
          HEX
        </button>
      </div>
      <div className="content--container">
        {/* xử lý logic ở đây */}
        {tab === 1 && (
          <div className="content">
            <div className="flex">
              <p className="text--bold">From</p>
              <div className="flex-line">
                <p>Account 1</p>
                <p>0xBf54.....A940</p>
              </div>
            </div>
            <div className="flex">
              <p className="text--bold">Balance</p>
              <div>
                <p>100.11 ETH</p>
              </div>
            </div>
            <div className="flex">
              <div>
                <p className="text--bold">
                  Amount <span className="tag">Max</span>
                </p>
              </div>
              <div>
                <Input placeholder="Amount" />
              </div>
            </div>
            <p className="text--bold">Transaction Speed</p>
            <div className="flex-center">
              <p className="item">Slow</p>
              {/* xử lý logic ở đây */}
              <div className="item text--active">
                <p>Moderate</p>
                <span>Likely 30 seconds</span>
              </div>
              <div className="item text--active">
                <p>Fast</p>
                <span>Likely 15 seconds</span>
              </div>
            </div>
            <div className="flex-end">
              <div className="col">
                <p>Gas Estimation:</p>
                <p>Total:</p>
              </div>
              <div className="col">
                <p>0.0000315 ETH</p>
                <p>0.0000315 ETH</p>
              </div>
            </div>
            <div className="button--group">
              <button className="btn btn-reject">Reject</button>
              <button className="btn btn-confirm">Confirm</button>
            </div>
          </div>
        )}
        {tab === 2 && (
          <div>
            <p>
              0x608060405234801561001057600080fd5b506104fa8061002
              06000396000f3fe608060405234801561001057600080fd5b5
              0600436106100575760003560
            </p>
          </div>
        )}
      </div>
      <BackToHomeText/>
      <Navbar />
    </div>
  );
};

export default DappTransaction;
