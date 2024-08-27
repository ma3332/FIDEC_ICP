import BackToHomeText from "../../components/Footers/Back";
import HeaderMain from "../../components/Headers/HeaderMain/HeaderMain";
import { Input, Button, Form, Col } from "antd";
import Navbar from "../../components/Navbar";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import "./styles.scss";
import { openNotification } from "../../utils/helperUtil";

const SigningMessage = () => {
  const [form] = Form.useForm();

  const accountsState = useSelector((state: RootState) => state.accounts);
  const { eip155Address } = accountsState;
  console.log(eip155Address);
  const { address, name, indexAccount }: any = eip155Address;

  const [messageErr, setMessageErr] = useState("");
  const [disabled1, setDisabled1] = useState(true);
  const [disabled2, setDisabled2] = useState(true);
  const [showInsertPin, setShowInsertPin] = useState(false);
  const [showSignMessage, setShowSignMessage] = useState(false);
  const [sign, setSign] = useState("");

  const signMessage = async (pin: string) => { 
    const message = form.getFieldValue("input--message");
    await window.Main.handleSignMessage({
      message,
      pin,
      index: indexAccount,
    }).then((result) => {
      setShowSignMessage(true);
      setSign(result.signature);
    });
  };

  return (
    <div className="signing--page">
      <HeaderMain />

      <div className="main">
        <h2 className="text--title">Signing Message</h2>
        {!showSignMessage ? (
          <div className="sign--main">
            <div className="text">
              <p>Your current account</p>
              <span>{address}</span>
            </div>
            {!showInsertPin ? (
              <Form
                form={form}
                onFinish={async (values) => {
                  console.log(values, "values msg");
                  setShowInsertPin(true);
                }}
              >
                <div className="form--container">
                  <p>Enter your message to be signed</p>
                  <Col xs={24} md={24}>
                    <Form.Item name="input--message">
                      <Input
                        placeholder="Enter your message to be signed"
                        onChange={(e) => {
                          if (e.target.value.length > 0) {
                            setDisabled1(false);
                          } else setDisabled1(true);
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Form.Item>
                    <Button
                      className="btn--gray--default"
                      htmlType="submit"
                      type="primary"
                      disabled={disabled1}
                    >
                      Sign
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            ) : (
              <Form
                form={form}
                onFinish={async (values) => {
                  const pin = form.getFieldValue("input--pin");
                  const { result } = await window.Main.handleLogin(
                    pin
                  );
                  if (result) {
                    await signMessage(pin);
                    setShowSignMessage(true);
                  } else openNotification("Sai mã pin", "error");
                  form.resetFields();
                }}
              >
                <div className="form--container">
                  <p>Enter your pin</p>
                  <Form.Item name="input--pin">
                    <Input 
                      placeholder="Enter your pin"
                      onChange={(e) => {
                        if (e.target.value.length > 0) {
                          setDisabled2(false);
                        } else setDisabled1(true);
                      }}
                    />
                  </Form.Item>
                  <p className="text-respont">{messageErr}</p>
                  <Form.Item>
                    <Button
                      className="btn--gray--default"
                      htmlType="submit"
                      type="primary"
                      disabled={disabled2}
                    >
                      Comfirm
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            )}
          </div>
        ) : (
          <div className="message--main">
            <p>
              "add": {address}, "msg": {form.getFieldValue("input--message")},
              "sig": {sign}, "version": "3", "signer": {name}
            </p>
            <button
              className="btn--gray--default"
              onClick={() => {
                setMessageErr("");
                setDisabled1(true);
                setDisabled2(true);
                setShowInsertPin(false);
                setShowSignMessage(false);
                form.resetFields();
              }}
            >
              Done
            </button>
          </div>
        )}
      </div>
      <BackToHomeText />
      <Navbar />
    </div>
  );
};

export default SigningMessage;
