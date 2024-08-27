import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Row, Col } from "antd";
import HeaderForm from "../../components/Headers/HeaderForm";
import { openNotification } from "../../utils/helperUtil";
import { setLoading } from "../../store/Support/Loading/LoadingSlice";
import "./styles.scss";

const ForgetPassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoading = useSelector((state: any) => state.loading.isLoading);

  const WordNumber = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24,
  ];
  const [notification, setNotification] = useState("");

  const handleForgotPassword = async (values: any) => {
    dispatch(setLoading(true));
    const mnemonic: string[] = [];
    WordNumber.forEach((item) => {
      mnemonic.push(form.getFieldValue(`word_${item}`));
    });
    const test =
      "month dinosaur half bus click own puppy country panther glide ocean fade april benefit razor negative middle globe envelope void toast toast cigar left";
    const { result, message } = await window.Main.handleForgotPassword({
      // mnemonic: mnemonic.join(' '),
      mnemonic: test,
      newPin: values.newpin,
    });
    if (result) {
      navigate("/");
    }
    dispatch(setLoading(false));
    openNotification(message, "error");
  };

  const checkValueInput = (event: any) => {
    const value = event.target.value;
    if (value.length > 0) {
      // Kiểm tra nếu giá trị không phải là số nguyên
      if (isNaN(value) || parseInt(value) !== parseFloat(value)) {
        setNotification("The input value must be an integer");
      } else {
        setNotification("");
        // kiểm tra độ dài
        if (value.length > 8) {
          setNotification("Password has only 8 numbers");
        } else {
          setNotification("");
        }
      }
    } else {
      setNotification("");
    }
  };

  return (
    <div>
      <div className="main--container reset--pin--container">
        <HeaderForm />
        <h2 className="text--title">Reset Wallet Pin</h2>
        <p className="text--desc">Please enter your 12-word phrases</p>
        <div className="form--container">
          <Form
            form={form}
            onFinish={async (values) => {
              if (
                values.newpin === values.comfirmpin &&
                values.newpin.length == 8
              ) {
                await handleForgotPassword(values);
              } else {
                setNotification("Invalid pin code.");
              }
            }}
          >
            <div
              style={{ height: "315px", overflow: "auto", overflowX: "hidden" }}
            >
              <Row gutter={[12, 6]}>
                {WordNumber.map((item) => (
                  <Col xs={12} md={12} key={item}>
                    <Form.Item name={`word_${item}`}>
                      <Input.Password placeholder={`${item}`} />
                    </Form.Item>
                  </Col>
                ))}
              </Row>
            </div>
            <p className="text--detail">
              New Pin (6 number min - 16 number max)
            </p>
            <div className="new--password--form">
              <Form.Item name="newpin">
                <Input.Password
                  placeholder="New Pin"
                  onChange={(e) => checkValueInput(e)}
                />
              </Form.Item>
            </div>
            <div className="new--password--form">
              <p className="text--detail">Confirm Pin</p>
              <Form.Item name="comfirmpin">
                <Input.Password placeholder="Comfirm Pin" />
              </Form.Item>
            </div>
            <Row gutter={[12, 12]}>
              <Col xs={12} md={12}>
                <Form.Item>
                  <Button
                    htmlType="submit"
                    type="primary"
                    style={{ width: "100%" }}
                    className="btn"
                    loading={isLoading}
                  >
                    Restore
                  </Button>
                </Form.Item>
              </Col>
              <Col xs={12} md={12}>
                <p className="btn--desc">{notification}</p>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
