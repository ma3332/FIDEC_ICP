import BackToHomeText from "../../../components/Footers/Back";
import HeaderMain from "../../../components/Headers/HeaderMain/HeaderMain";
import Navbar from "../../../components/Navbar";
import { Form, Input, Button } from "antd";
import "./styles.scss";

const TransactionPinCode = () => {
  const [form] = Form.useForm();
  return (
    <div className="transaction--page">
      <HeaderMain />
      <h2 className="text--title">
        Transaction <br />
        PIN Verification
      </h2>
      <p className="text--desc">
        Maximum 3 trials otherwise your <br />
        wallet will be locked
      </p>
      <div className="form--content">
        <Form form={form}>
          <p className="text--label">Enter your Pin</p>
          <Form.Item name="name">
            <Input />
          </Form.Item>
          {/* xử lý logic ở đây */}
          <p className="text-response">Your PIN is not correct</p>
          <Form.Item>
            <div style={{ textAlign: "center" }}>
              <Button
                htmlType="submit"
                type="primary"
                className="btn btn--primary"
              >
                Confirm
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
      <BackToHomeText/>
      <Navbar />
    </div>
  );
};

export default TransactionPinCode;
