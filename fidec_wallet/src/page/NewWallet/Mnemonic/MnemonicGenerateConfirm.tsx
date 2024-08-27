import { Form, Button, Input, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import HeaderHome from "../../../components/Headers/HeaderHome/Header";
import Footer from "../../../components/Footers";
import "./styles.scss";
import ModalViewDetail from "./components/ModalViewDetail";
import {useSelector} from "react-redux";
import type { RootState } from "../../../store/store";

const GenerateNewWalletConfirm = () => {
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const acountState = useSelector((state : RootState) => state.accounts);
  const {mnemonic} = acountState; 

  const [notification, setNotification] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleView, setVisibleView] = useState<boolean>(false);

  const createWalletByMnemonic = async (mnemonicWords: string) => {
    setLoading(true);
    const {result, message} = await window.Main.handleImportMnemonicWord({
      mnemonic: mnemonicWords,
    })
    if (result) {
      setLoading(false);
      navigate("/set-new-pin-generate");
    }else {
      setLoading(false);
      setNotification("Please check mnemonic words");
    } 
  };

  return (
    <div>
      <div className="wallet--container wallet--page">
        <HeaderHome />
        <div className="content--container">
          <div className="form--container">
            <Form
              form={form}
              onFinish={async (values) => {
                console.log(values, "values");
                if (
                  values.word_1 !== undefined &&
                  values.word_2 !== undefined &&
                  values.word_3 !== undefined &&
                  values.word_4 !== undefined &&
                  values.word_5 !== undefined &&
                  values.word_6 !== undefined &&
                  values.word_7 !== undefined &&
                  values.word_8 !== undefined &&
                  values.word_9 !== undefined &&
                  values.word_10 !== undefined &&
                  values.word_11 !== undefined &&
                  values.word_12 !== undefined && 
                  values.word_13 !== undefined &&
                  values.word_14 !== undefined &&
                  values.word_15 !== undefined &&
                  values.word_16 !== undefined &&
                  values.word_17 !== undefined &&
                  values.word_18 !== undefined &&
                  values.word_19 !== undefined &&
                  values.word_20 !== undefined &&
                  values.word_21 !== undefined &&
                  values.word_22 !== undefined &&
                  values.word_23 !== undefined &&
                  values.word_24 !== undefined
                ) {
                  const mnemonicWords = `${values.word_1} ${values.word_2} ${values.word_3} ${values.word_4} ${values.word_5} ${values.word_6} ${values.word_7} ${values.word_8} ${values.word_9} ${values.word_10} ${values.word_11} ${values.word_12} ${values.word_13} ${values.word_14} ${values.word_15} ${values.word_16} ${values.word_17} ${values.word_18} ${values.word_19} ${values.word_20} ${values.word_21} ${values.word_22} ${values.word_23} ${values.word_24}`;
                  if(mnemonic.join(" ") === mnemonicWords){
                    createWalletByMnemonic(mnemonicWords);
                  }else {
                    setNotification("Please check mnemonic words");
                  }
                } else {
                  setNotification("Please check mnemonic words");
                }
              }}
            >
              <div className="form--container">
                <Row gutter={[12, 12]} style={{height: "228px", overflow: "auto", overflowX: "hidden"}}>
                  <Col xs={8} md={8}>
                    <Form.Item name="word_10" className="form--item">
                      <Input.Password placeholder="10" />
                    </Form.Item>
                  </Col>
                  <Col xs={8} md={8}>
                    <Form.Item name="word_5" className="form--item">
                      <Input.Password placeholder="5" />
                    </Form.Item>
                  </Col>
                  <Col xs={8} md={8}>
                    <Form.Item name="word_9" className="form--item">
                      <Input.Password placeholder="9" />
                    </Form.Item>
                  </Col>

                  <Col xs={8} md={8}>
                    <Form.Item name="word_1" className="form--item">
                      <Input.Password placeholder="1" />
                    </Form.Item>
                  </Col>
                  <Col xs={8} md={8}>
                    <Form.Item name="word_12" className="form--item">
                      <Input.Password placeholder="12" />
                    </Form.Item>
                  </Col>
                  <Col xs={8} md={8}>
                    <Form.Item name="word_11" className="form--item">
                      <Input.Password placeholder="11" />
                    </Form.Item>
                  </Col>

                  <Col xs={8} md={8}>
                    <Form.Item name="word_4" className="form--item">
                      <Input.Password placeholder="4" />
                    </Form.Item>
                  </Col>
                  <Col xs={8} md={8}>
                    <Form.Item name="word_2" className="form--item">
                      <Input.Password placeholder="2" />
                    </Form.Item>
                  </Col>
                  <Col xs={8} md={8}>
                    <Form.Item name="word_7" className="form--item">
                      <Input.Password placeholder="7" />
                    </Form.Item>
                  </Col>

                  <Col xs={8} md={8}>
                    <Form.Item name="word_3" className="form--item">
                      <Input.Password placeholder="3" />
                    </Form.Item>
                  </Col>
                  <Col xs={8} md={8}>
                    <Form.Item name="word_6" className="form--item">
                      <Input.Password placeholder="6" />
                    </Form.Item>
                  </Col>
                  <Col xs={8} md={8}>
                    <Form.Item name="word_8" className="form--item">
                      <Input.Password placeholder="8" />
                    </Form.Item>
                  </Col>
                  <Col xs={8} md={8}>
                    <Form.Item name="word_13" className="form--item">
                      <Input.Password placeholder="13" />
                    </Form.Item>
                  </Col>
                  <Col xs={8} md={8}>
                    <Form.Item name="word_14" className="form--item">
                      <Input.Password placeholder="14" />
                    </Form.Item>
                  </Col>
                  <Col xs={8} md={8}>
                    <Form.Item name="word_15" className="form--item">
                      <Input.Password placeholder="15" />
                    </Form.Item>
                  </Col>

                  <Col xs={8} md={8}>
                    <Form.Item name="word_16" className="form--item">
                      <Input.Password placeholder="16" />
                    </Form.Item>
                  </Col>
                  <Col xs={8} md={8}>
                    <Form.Item name="word_17" className="form--item">
                      <Input.Password placeholder="17" />
                    </Form.Item>
                  </Col>
                  <Col xs={8} md={8}>
                    <Form.Item name="word_18" className="form--item">
                      <Input.Password placeholder="18" />
                    </Form.Item>
                  </Col>

                  <Col xs={8} md={8}>
                    <Form.Item name="word_19" className="form--item">
                      <Input.Password placeholder="19" />
                    </Form.Item>
                  </Col>
                  <Col xs={8} md={8}>
                    <Form.Item name="word_20" className="form--item">
                      <Input.Password placeholder="20" />
                    </Form.Item>
                  </Col>
                  <Col xs={8} md={8}>
                    <Form.Item name="word_21" className="form--item">
                      <Input.Password placeholder="21" />
                    </Form.Item>
                  </Col>

                  <Col xs={8} md={8}>
                    <Form.Item name="word_22" className="form--item">
                      <Input.Password placeholder="22" />
                    </Form.Item>
                  </Col>
                  <Col xs={8} md={8}>
                    <Form.Item name="word_23" className="form--item">
                      <Input.Password placeholder="23" />
                    </Form.Item>
                  </Col>
                  <Col xs={8} md={8}>
                    <Form.Item name="word_24" className="form--item">
                      <Input.Password placeholder="24" />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
              <Form.Item>
                <Button
                  loading={loading}
                  htmlType="submit"
                  type="primary"
                  className="btn--submit"
                > 
                    Confirm Your Mnemonic Words 
                </Button>
              </Form.Item>
            </Form>
          </div>
          {/* Xử lý logic ở đây khi response trả về */}
          <p className="text--response">
            {notification}{" "}
            <a onClick={() => setVisibleView(true)}>View again</a>
          </p>
        </div>
        {visibleView ? (
          <ModalViewDetail
            visible={visibleView}
            setVisible={setVisibleView}
            form={form}
          />
        ) : null}
        <Footer />
      </div>
    </div>
  );
};

export default GenerateNewWalletConfirm;
