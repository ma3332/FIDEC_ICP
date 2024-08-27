import { useState } from "react";
import { useDispatch } from "react-redux";
import {Link} from "react-router-dom"
import { Form, Input, Button, Row, Col } from "antd";
import {Box, Modal} from "@mui/material";
import Typography from "@mui/material/Typography";
import Footer from "../../../components/Footers";
import HeaderHome from "../../../components/Headers/HeaderHome/Header";
import { setCheckLogin } from "../../../store/StoreComponents/Accounts/accounts";
import "./styles.scss";

const style = {
  position: "absolute" as any,
  top: "55%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "348px",
  height: "124px",
  bgcolor: "#252525",
  boxShadow: 24,
  padding: "17px 7px",
  borderRadius: "14px",
  color: "white",

  outline: "none",
};

const SetNewPin = () => {
  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const [checkChangePin, setCheckChangePin] = useState<boolean>(false); 
  const [disabled, setDisabled] = useState<boolean>(true);
  const [messageErr, setMessageErr] = useState("");

  const handleChangePin = async (values: any) => {
    if (values.passwordNew.length === 8 && values.passwordNew && values.passwordOld) {
      const {result, message} = await window.Main.handleChangePin({ oldPin: values.passwordOld, newPin: values.passwordNew}) 
        if (result) {
          setCheckChangePin(true);
        } else {
          setCheckChangePin(false);
          form.resetFields(); 
          setMessageErr(message);
        } 
    }else {
      setMessageErr("Change pin failed, please try again.");
      form.resetFields();
    }
  };

  return (
    <div className="newpin--page">
      <HeaderHome />
      <h2 className="text--title">SET UP YOUR WALLET NEW PIN</h2>
      <div className="content--container">
        <Form
          form={form}
          onFinish={(values) => {
            console.log(values, "values");
            handleChangePin(values);
          }}
        >
          <Row gutter={[12, 12]}>
            <Col xs={24} md={24}>
              <p className="text--label">Your Current Pin</p>
              <Form.Item name="passwordOld" className="mb-16">
                <Input.Password
                  placeholder="Enter Your Current Pin" 
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={24}>
              <p className="text--label">
                New Pin (6 number min - 16 number max)
              </p>
              <Form.Item name="passwordNew" className="mb-16">
                <Input.Password
                  placeholder="Enter New Pin" 
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={24}>
              <p className="text--label">Confirm Pin</p>
              <Form.Item name="passwordComfirm">
                <Input.Password
                  placeholder="Enter Confirm Pin"
                  onChange={(e) => {
                    if (e.target.value === form.getFieldValue("passwordNew")) {
                      setDisabled(false); 
                    } else {
                      setDisabled(true);
                    }
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <p style={{ color: 'red' }}>{messageErr}</p>
          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              className="btn--primary"
              disabled={disabled} 
            >
              Confirm Your Pin
            </Button>
          </Form.Item>
        </Form>
        <Modal
          open={checkChangePin} 
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="box-modal">
            <h2 className="title">Change Pin Success.</h2>
            <div> 
                <div className="button-group">  
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="btn-confirm" 
                    onClick={()=>dispatch(setCheckLogin(false))}
                  >
                    <Link to="/">Back Login</Link>
                  </Button> 
                </div> 
            </div>
          </Box>
        </Modal>
      </div>
      <div>
        <Link to="/settings" className="back--to--setting--text">
          Back to settings
        </Link>
      </div>
    </div>
  );
};

export default SetNewPin;
