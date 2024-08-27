import { useState } from "react";
import type { RootState } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { Button, Form, Input, Row, Col } from "antd";
import BackToHomeText from "../../components/Footers/Back";
import HeaderMain from "../../components/Headers/HeaderMain/HeaderMain";
import Navbar from "../../components/Navbar";
import { openNotification } from "../../utils/helperUtil";
import { setCheckGetNetwork } from "../../store/StoreComponents/Networks/networks"
import "./styles.scss";

const ImportNetwork = () => {
  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(false); 

  const networksState = useSelector((state: RootState) => state.networks);
  const { networks } = networksState;

  const importNetwork = async (
    name: string,
    url: string,
    chainId: number,
    symbol: string
  ) => {
    setLoading(true);
    const {result, message} = await window.Main.handleImportNetwork({
      name,
      chainID: chainId,
      url,
      symbol,
      index: networks.length,
    })
    if (result) {
      dispatch(setCheckGetNetwork(true));  
    } 
    setLoading(false);
    form.resetFields();
    openNotification(message, "error") 
  };

  return (
    <div className="import--network--page">
      <HeaderMain />
      <h2 className="text--title">Import Network</h2>
      <div className="import--form--content">
        <Form
          form={form}
          onFinish={async (values) => {
            if (values.name && values.url && values.chainId && values.symbol) {
              await importNetwork(
                values.name,
                values.url,
                Number(values.chainId),
                values.symbol
              );
            }
          }}
        >
          <Row gutter={[12, 12]}>
            <Col xs={24} md={24}>
              <p className="text--label">Network name</p>
              <Form.Item name="name">
                <Input placeholder="Enter name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24}>
              <p className="text--label">New RPC URL</p>
              <Form.Item name="url">
                <Input placeholder="Enter New RPC URL" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24}>
              <p className="text--label">Chain ID</p>
              <Form.Item name="chainId">
                <Input placeholder="Enter Chain ID" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24}>
              <p className="text--label">Currency Symbol</p>
              <Form.Item name="symbol">
                <Input placeholder="Enter Current Symbol" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="form--item">
            <Button
              loading={loading}
              htmlType="submit"
              // type="primary"
              className="btn--primary"
            >
              Import
            </Button>
          </Form.Item>
        </Form>
      </div>
      <BackToHomeText/>
      <Navbar />
    </div>
  );
};

export default ImportNetwork;
