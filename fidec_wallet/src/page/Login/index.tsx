import { Form, Input, Button, Spin, Row, Col } from "antd";
import "./styles.scss";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/Footers";
import HeaderHome from "../../components/Headers/HeaderHome/Header";
import { useDispatch, useSelector } from "react-redux";
import { setCheckLogin } from "../../store/StoreComponents/Accounts/accounts";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { setLoading } from "../../store/Support/Loading/LoadingSlice";
import { openNotification } from "../../utils/helperUtil";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
 
  const isLoading = useSelector((state: any) => state.loading.isLoading); 
 
  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const [messageError, setMessageError] = useState<string>("");

  const insertPin = async (password: string) => {
    if (password.length == 8) {
      dispatch(setLoading(true));
      const {result, times, message} = await window.Main.handleLogin(password);
      if (result) {
        setMessageError("");
        const res = await window.Main.handleGetNetwork();  
        if(res.listNetwork.length == 0) { 
          navigate("/network/import-network-default");
        }else dispatch(setCheckLogin(true)); 
      } else {
        setMessageError(`${message},${times ? `times ${times}` : ""}`);
        dispatch(setLoading(false));
      }
    } else setMessageError("Password has only 8 numbers");
  };

  const checkValueInput = (event: any) => {
    const value = event.target.value;
    if (value.length > 0) {
      // Kiểm tra nếu giá trị không phải là số nguyên
      if (isNaN(value) || parseInt(value) !== parseFloat(value)) {
        setMessageError("The input value must be an integer");
      } else {
        setMessageError("");
        // kiểm tra độ dài
        if (value.length > 8) {
          setMessageError("Password has only 8 numbers");
        } else {
          setMessageError("");
        }
      }
    } else {
      setMessageError("");
    }
  };

  const checkCard = async ()=>{
   const {result, message} = await window.Main.hanldeGetStatus();
   if(result === "0001") {
     navigate('/new-wallet')
   }else {
    openNotification(message, "warning")

   }
  }

  return ( 
    <div className="home--container home--page">
      <HeaderHome />
      <div className="text--container">
        <p className="title--text">Welcome Back</p>
        <p className="description--text">
          The Secure Decentralized Web <br /> & Crypto Access Connection
        </p>
      </div>
      <div className="main--container">
        <div className="form--container">
          <p className="text--label">Enter Your Pin</p>
          <Form
            form={form}
            onFinish={async (values) => {
              insertPin(values.password);
              form.resetFields();
            }}
          >
            <Form.Item name="password">
              <div className="input--row">
                <Col xs={22} md={22}>
                  <input
                    type={hidePassword ? "password" : "text"}
                    placeholder="Enter your password"
                    className="input--password"
                    onChange={(e) => checkValueInput(e)}
                  />
                </Col>
                <Col
                  xs={2}
                  md={2}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <div onClick={() => setHidePassword(!hidePassword)}>
                    {hidePassword ? (
                      <EyeInvisibleOutlined
                        style={{ color: "white", width: "40px" }}
                      />
                    ) : (
                      <EyeOutlined style={{ color: "white", width: "40px" }} />
                    )}
                  </div>
                </Col>
              </div>
            </Form.Item>

            {/* Tạo một state, check login trả về response mà hiển thị hoặc không */}
            <span className="text--error">{messageError}</span>
            <Form.Item>
              <Button
                loading={isLoading}
                htmlType="submit"
                type="primary"
                className="btn--primary"
              >
                Enter Your Wallet
              </Button>
            </Form.Item>
          </Form>
          <p className="text--detail">
            You only have atmost 5 trials before your wallet is blocked
          </p>
        </div>

        <div className="footer--container">
          <p>
            Forgot Wallet Pin? <Link to="/forget-password">Restore</Link>
          </p>
          <p>
            New Wallet? <a onClick={()=>checkCard()}>Activate</a>
          </p>
        </div>
        <Footer />
      </div>
    </div>
  );
}
