import { Form, Button, Input } from "antd";
import Footer from "../../components/Footers";
import HeaderHome from "../../components/Headers/HeaderHome/Header";
import "./styles.scss";

const PasswordSetup = () => {
  const [form] = Form.useForm();
  return (
    <div className="password--setup--container">
      <HeaderHome />
      <h2 className="title--text">SET UP YOUR WALLET PIN</h2>
      <div className="content--container">
        <Form
          form={form}
          onFinish={async (values) => {
            console.log(values, "values");
          }}
        >
          <div>
            <Form.Item name="password">
              <p className="text--label">
                New Pin (6 number min - 16 number max)
              </p>
              <Input.Password />
            </Form.Item>
          </div>
          <div>
            <Form.Item name="password">
              <p className="text--label">Confirm Pin</p>
              <Input.Password />
              <p className="text--warning">Your Pin does not match</p>
            </Form.Item>
          </div>
          <p className="text--desc">
            Please note that Mnemonics Words can <br />
            be used to restore your pin if need
          </p>
          <Form.Item>
            <Button htmlType="submit" className="btn--submit btn--primary">
              Confirm Your Pin
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Footer />
    </div>
  );
};

export default PasswordSetup;
