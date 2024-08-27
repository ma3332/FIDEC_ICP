import BackToHomeText from "../../../components/Footers/Back";
import Navbar from "../../../components/Navbar";
import { signClient } from "../../../utils/WalletConnectUtil";
import { getSdkError } from "@walletconnect/utils";
import { useEffect, useState } from "react";
import { Form, Input, Button, Row, Col, Empty, Modal } from "antd";
import { useSnapshot } from "valtio";
import HeaderMain from "../../../components/Headers/HeaderMain/HeaderMain";
import PairingCard from "./components/SessionCard";
import ModalStore from "../../../store/ModalStore";
import QrReaderDappConnect from "../../../components/QRCode/QrReaderDappConnect";
import "./styles.scss";

const DappConnect = () => {
  const [form] = Form.useForm();

  const { open } = useSnapshot(ModalStore.state);

  const [sessions, setSessions] = useState(signClient.session.values);
  const [uri, setUri] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkSession, setCheckSession] = useState(false);

  async function onConnect(uri: string) {
    try {
      setLoading(true);
      console.log("connecting..");
      await signClient.pair({ uri });
    } catch (err: unknown) {
      alert(err);
    } finally {
      setCheckSession(!checkSession);
      setUri("");
      setLoading(false);
    }
  }

  async function onDelete(topic: string) {
    try {
      await signClient.disconnect({
        topic,
        reason: getSdkError("USER_DISCONNECTED"),
      });
    } catch (err: unknown) {
      alert(err);
    } finally {
      setCheckSession(!checkSession);
    }
  }

  useEffect(() => {
    setSessions(signClient.session.values);
  }, [checkSession, open]);

  return (
    <div className="dapp--connect--page">
      <HeaderMain />
      <div style={{ padding: "0 16px" }}>
        <h2 className="text--title">Dapp Connect</h2>
        <QrReaderDappConnect onConnect={onConnect} />
        <div className="dapp--content">
          <div className="input-search">
            <Form form={form}>
              <Row gutter={[12, 12]} style={{ width: "100%" }}>
                <Col xs={18} md={18}>
                  {/* <Form.Item name="name"> */}
                  <Input
                    placeholder="URI Connection"
                    onChange={(e) => setUri(e.target.value)}
                    value={uri}
                    style={{ height: "40px" }}
                  />
                  {/* </Form.Item> */}
                </Col>
                <Col xs={6} md={6}>
                  <Button
                    htmlType="submit"
                    type="primary"
                    className="btn btn-primary"
                    onClick={() => onConnect(uri)}
                    loading={loading}
                  >
                    Connect
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
          <h2 className="title">Dapps Connected</h2>
          <div className="content">
            {sessions.length ? (
              sessions.map((session: any) => {
                const { name, icons, url } = session.peer.metadata;

                return (
                  <PairingCard
                    key={session.topic}
                    logo={icons[0]}
                    url={url}
                    name={name}
                    onDelete={() => onDelete(session.topic)}
                  />
                );
              })
            ) : (
              <Empty
                description={
                  <p style={{ margin: "0", color: "white" }}>No section</p>
                }
                imageStyle={{ height: "60px" }}
              />
            )}
          </div>
        </div> 
        <Navbar />
      </div>
    </div>
  );
};

export default DappConnect;
