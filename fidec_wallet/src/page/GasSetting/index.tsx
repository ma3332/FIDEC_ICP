import HeaderMain from "../../components/Headers/HeaderMain/HeaderMain";
import { Form, Input } from "antd";
import BackToHomeText from "../../components/Footers/Back";
import Navbar from "../../components/Navbar";
import "./styles.scss";

const GasSetting = () => {
  const [form] = Form.useForm();

  return (
    <div className="gasSetting--page">
      <HeaderMain />
      <div className="content">
        <h2 className="text--title">Gas Setting</h2>
        <Form form={form} className="form--container">
          <div>
            <p className="text--label">Gas Limit (fixed)</p>
            <Form.Item name="symbolToken">
              <Input />
            </Form.Item>
          </div>
          <div>
            <p className="text--label">Max priority fee (Gwei)</p>
            <Form.Item name="symbolToken">
              <Input />
            </Form.Item>
          </div>
          <div>
            <p className="text--label">Max Fee (Gwei)</p>
            <Form.Item name="decimalToken">
              <Input />
            </Form.Item>
          </div>
          <button className="btn--gray--default">Import</button>
        </Form>
      </div>
      <BackToHomeText />
      <Navbar />
    </div>
  );
};

export default GasSetting;
