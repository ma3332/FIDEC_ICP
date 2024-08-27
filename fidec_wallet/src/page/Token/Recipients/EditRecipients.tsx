import "./styles.scss";
import { Button, Col, Form, Input, Row } from "antd";
import { useState } from "react";
import HeaderMain from "../../../components/Headers/HeaderMain/HeaderMain";
import Navbar from "../../../components/Navbar";
import BackToHomeText from "../../../components/Footers/Back";

const EditRecipientsPage = () => {
  const [form] = Form.useForm();

  return (
    <div className="recipients--page">
      <HeaderMain />
      <h2 className="text--title">Edit recipient</h2>
      <div className="input--address">
        <Form form={form} className="form">
          <Form.Item
            name="address"
            label={<p className="title">Recipients Address</p>}
            style={{ marginBottom: "20px" }}
          >
            <Input placeholder="Public Address, saved account" />
          </Form.Item>
          <p className="text--response">Not Correct EVM address</p>

          <Form.Item
            name="name"
            label={<p className="title">Recipients Nick Name</p>}
          >
            <Input placeholder="This field cannot be empty" />
          </Form.Item>
          <p className="text--response">Please fill the above field</p>

          <Form.Item>
            <Row gutter={[24, 24]}>
              <Col xs={12} md={12}>
                <Button type="default" className="button">
                  Delete
                </Button>
              </Col>
              <Col xs={12} md={12}>
                <Button type="primary" className="button">
                  Confirm
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </div>

      <BackToHomeText/>
      <Navbar />
    </div>
  );
};

export default EditRecipientsPage;
