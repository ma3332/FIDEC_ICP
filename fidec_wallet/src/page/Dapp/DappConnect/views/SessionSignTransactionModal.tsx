import ModalStore from "../../../../store/ModalStore";
import {
  approveEIP155Request,
  rejectEIP155Request,
} from "../../../../utils/EIP155RequestHandlerUtil";
import { signClient } from "../../../../utils/WalletConnectUtil";
import Box from "@mui/material/Box";
import { Form, Input, Radio, Button } from "antd";
import { Fragment, useState } from "react";
import Web3 from "web3";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../../store/store";
import {
  getSignParamsAddress,
  openNotification,
} from "../../../../utils/helperUtil";
import format from "../../../../utils/format";
import * as RLP from "@ethereumjs/rlp";
import { Buffer } from "buffer";

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

const TRANSACTION_TYPE_2 = 2;
const TRANSACTION_TYPE_2_BUFFER = Buffer.from(
  TRANSACTION_TYPE_2.toString(16).padStart(2, "0"),
  "hex"
);

type TxFields = {
  chainID: string;
  nonce: string;
  maxPriorityFeePerGas: string;
  maxFeePerGas: string;
  gasLimit: number;
  to: string;
  value: string;
  data: string;
  accessList: any;
  v: string;
  r: string;
  s: string;
};

export default function SessionSignTransactionModal() {
  const [loading, setLoading] = useState(false);
  const [loadingPostParam, setLoadingPostParam] = useState(false);

  const [form] = Form.useForm();

  const { network } = useSelector((state: RootState) => state.networks);
  const { eip155Addresses } = useSelector((state: RootState) => state.accounts);
  const { url } = network;

  const web3 = new Web3(url);

  // Get request and wallet data from store
  const requestEvent = ModalStore.state.data?.requestEvent;
  const requestSession = ModalStore.state.data?.requestSession;

  // Ensure request and wallet are defined
  if (!requestEvent || !requestSession) {
    return <h2>Missing request data</h2>;
  }

  // Get required proposal data
  console.log(requestEvent);
  const { topic, params } = requestEvent;
  const { request, chainId } = params;
  const transaction = request.params[0];
  const addressSign = transaction.from;
  const index = eip155Addresses.findIndex(
    (item) => item.address.toLowerCase() === addressSign.toLowerCase()
  );

  async function hashTx() {
    const block = await web3.eth.getBlock("pending");
    const baseFee = Number(block.baseFeePerGas);
    const maxPriorityFeePerGas = 1500000000;
    const max = maxPriorityFeePerGas + baseFee;
    const accessList: Array<any> = [];
    const value = transaction?.value ==="0x00" ? "0x" : transaction?.value;

    const _tx: TxFields = {
      chainID: `0x${chainId.split(":")[1]}`,
      nonce: transaction?.nonce,
      maxPriorityFeePerGas: `0x${maxPriorityFeePerGas.toString(16)}`,
      maxFeePerGas: `0x${max.toString(16)}`,
      gasLimit: transaction?.gasLimit,
      to: transaction?.to,
      value,
      data: transaction?.data,
      accessList: accessList,
      v: "0x",
      r: "0x",
      s: "0x",
    };
    const { result, msgHash, decode_to, message } =
      await window.Main.handleTxParam({ tx: _tx });
    if (result) {
      return { msgHash, _tx };
    } else {
      openNotification(message, "error");
    }
  }

  const signTransaction = async ({
    msgHash,
    pin,
    tx,
    index,
  }: {
    msgHash: string;
    pin: string;
    tx: TxFields;
    index: number;
  }) => {
    const { v, r, s } = await window.Main.handleSignTransaction({
      msgHash,
      pin,
      index,
    });
    format;
    const txParamSigned = {
      chainID: format.formatFieldTx(tx.chainID),
      nonce: format.formatFieldTx(tx.nonce),
      maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
      maxFeePerGas: tx.maxFeePerGas,
      gasLimit: tx.gasLimit,
      to: tx.to,
      value: tx.value,
      data: tx.data,
      accessList: tx.accessList,
      v,
      r,
      s,
    };
    const rawTransaction = Buffer.concat([
      TRANSACTION_TYPE_2_BUFFER,
      Buffer.from(RLP.encode(Object.values(txParamSigned))),
    ]);
    return rawTransaction;
  };

  async function onApprove(pin: string) {
    if (requestEvent) {
      setLoading(true);
      const { msgHash, _tx } = await hashTx();
      const rawTransaction = await signTransaction({
        msgHash,
        pin,
        tx: _tx,
        index,
      });
      const _requestEvent = {
        ...requestEvent,
        rawTransaction: `0x${rawTransaction.toString("hex")}`,
      };
      const response = await approveEIP155Request(_requestEvent);
      await signClient.respond({
        topic,
        response,
      });
      setLoading(false);
      ModalStore.close();
    } else {
      console.log("Please check Inf");
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
          <h2 className="title">Sign Transaction</h2>
          <Form
            form={form}
            onFinish={async () => {
              setLoadingPostParam(true);
            }}
          >
            <p style={{ color: "white" }}>
              Sign transaction with account: {eip155Addresses[index].name}
            </p>
            <div style={{ color: "white" }}>
              <p>ChainId: {`0x${chainId.split(":")[1]}`}</p>
              <p>Nonce: {transaction?.nonce}</p>
              <p>From: {transaction.from}</p>
              <p>GasLimit: {transaction.gasLimit}</p>
              <p>GasPrice: {transaction.gasPrice}</p>
              <p>To: {transaction.to}</p>
              <p>Value: {transaction.value}</p>
              <p>Data: {transaction.data}</p>
            </div>
            <div className="button-group">
              <button onClick={() => onReject()}>Reject</button>
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
        </Box>
      ) : (
        <Box sx={style} className="box-modal">
          <h2 className="title">Enter your PIN</h2>
          <div>
            <Form
              form={form}
              onFinish={async (values) => {
                const {result} = await window.Main.handleLogin(values.pincode);
                if(result){
                  await onApprove(values.pincode);
                }else openNotification("Sai mã pin", "error");
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
                    loading={loading}
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
