import ModalStore from "../../../../store/ModalStore";
import {
  approveEIP155Request,
  rejectEIP155Request,
} from "../../../../utils/EIP155RequestHandlerUtil";
import {
  getSignParamsMessage,
  getSignParamsAddress,
} from "../../../../utils/helperUtil";
import { signClient } from "../../../../utils/WalletConnectUtil";
import Box from "@mui/material/Box";
import { Form, Input, Radio, Button } from "antd";
import { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../../store/store";

const style = {
  position: "absolute" as any,
  top: "100px",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "360px",
  height: "200px",
  bgcolor: "#252525",
  boxShadow: 24,
  padding: "17px 7px",
  borderRadius: "14px",
  color: "white",

  outline: "none",
};

export default function SessionSignModal() {
  const [form] = Form.useForm();

  const [loadingPostParam, setLoadingPostParam] = useState(false);

  const { eip155Addresses } = useSelector((state: RootState) => state.accounts);

  const requestEvent = ModalStore.state.data?.requestEvent;
  const requestSession = ModalStore.state.data?.requestSession;

  // Ensure request and wallet are defined
  if (!requestEvent || !requestSession) {
    return <h3>Missing request data</h3>;
  }

  // Get required request data
  const { topic, params } = requestEvent;
  const { request } = params;

  // Get message, convert it to UTF8 string if it is valid hex
  const message = getSignParamsMessage(request.params);
  const addressSign = getSignParamsAddress(request.params);
  const index = eip155Addresses.findIndex(
    (item) => item.address.toLowerCase() === addressSign.toLowerCase()
  );

  const signMessage = async (pin: string) => {
    const { result } = await window.Main.handleLogin(pin);
    if (result) {
      const { signature } = await window.Main.handleSignMessage({
        message,
        pin,
        index,
      });
      return `0x${signature}`;
    }
  };

  // Handle approve action (logic varies based on request method)
  async function onApprove(pin: string) {
    if (requestEvent) {
      const signedMessage = await signMessage(pin);
      const _requestEvent = {
        ...requestEvent,
        signedMessage,
      };
      const response = await approveEIP155Request(_requestEvent);
      await signClient.respond({
        topic,
        response,
      });
      ModalStore.close();
    }
  }

  // Handle reject action
  async function onReject() {
    if (requestEvent) {
      const response = rejectEIP155Request(requestEvent);
      await signClient.respond({
        topic,
        response,
      });
      ModalStore.close();
    }
  }

  return (
    <Fragment>
      {!loadingPostParam ? (
        <Box sx={style} className="box-modal">
          <h2 className="title">Sign Message</h2>
          <Form form={form}>
            <p style={{ color: "white" }}>
              You are signing message with account:{" "}
              {eip155Addresses[index].name}
            </p>
            <div className="button-group">
              <button onClick={() => onReject()}>Reject</button>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="btn-confirm"
                  onClick={() => setLoadingPostParam(true)}
                >
                  Approve
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Box>
      ) : (
        <Box sx={style} className="box-modal">
          <h2 className="title">Enter your PIN</h2>
          <div>
            <Form
              form={form}
              onFinish={async (values) => {
                await onApprove(values.pincode);
              }}
            >
              <Form.Item name="pincode">
                <Input.Password />
              </Form.Item>
              <div className="button-group">
                <Button onClick={() => onReject()}>Reject</Button>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="btn-confirm"
                  >
                    Approve
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </Box>
      )}
    </Fragment>
  );
}
