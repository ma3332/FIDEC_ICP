import ModalStore from "../../../../store/ModalStore";
import {
  approveEIP155Request,
  rejectEIP155Request,
} from "../../../../utils/EIP155RequestHandlerUtil";
import { signClient } from "../../../../utils/WalletConnectUtil";
import Box from "@mui/material/Box";
import { Form, Input, Radio, Button, Modal } from "antd";
import { Fragment, useEffect, useState } from "react";
import Web3 from "web3";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../../store/store";
import { openNotification } from "../../../../utils/helperUtil";
import format from "../../../../utils/format";
import * as RLP from "@ethereumjs/rlp";
import { Buffer } from "buffer";
import { getChainData } from "../../../../data/networkConfig/chainsUtil";
import { setCheckGetNetwork } from "../../../../store/StoreComponents/Networks/networks";
import {setCheckGetBalance} from "../../../../store/StoreComponents/Accounts/accounts";

const style = {
  position: "absolute" as any,
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "360px",
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

type Chain = {
  chainID?: number;
  name?: string;
  url?: string;
  ws?: string;
  symbol?: string;
};

export default function SessionSignTransactionModal() {
  const [loading, setLoading] = useState(false);
  const [checkComfirmInfSend, setCheckComfirmInfSend] = useState(false);

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { network, networks } = useSelector(
    (state: RootState) => state.networks
  );
  const { eip155Addresses } = useSelector((state: RootState) => state.accounts);
  const { chainID, url } = network;
  const web3 = new Web3(url);

  const [checkExistNetwork, setCheckExistNetwork] = useState<boolean>();
  const [checkSwitchNetwork, setCheckSwitchNetwork] = useState<boolean>();
  const [textExistNetwork, setTextExistNetwork] = useState("");

  // Get request and wallet data from store
  const requestEvent = ModalStore.state.data?.requestEvent;
  const requestSession = ModalStore.state.data?.requestSession;

  // Ensure request and wallet are defined
  if (!requestEvent || !requestSession) {
    return <h2>Missing request data</h2>;
  }

  // Get required proposal data
  const { topic, params } = requestEvent;
  const { request, chainId } = params;
  const transaction = request.params[0];
  const dataChain: Chain = getChainData(chainId, networks);
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
    const value =
      transaction?.value === "0x00" || transaction?.value === "0x0"
        ? "0x"
        : transaction?.value;
    const nonce = await web3.eth.getTransactionCount(transaction.from);
    console.log("nonce", nonce);
    const gasLimit = transaction?.gasLimit
      ? transaction?.gasLimit
      : transaction?.gas;
    const data = transaction?.data ? transaction?.data : "0x";

    const _tx: TxFields = {
      chainID: format.formatFieldTx(`0x${chainId.split(":")[1]}`),
      nonce: format.formatFieldTx(`0x${nonce.toString(16)}`),
      maxPriorityFeePerGas: `0x${maxPriorityFeePerGas.toString(16)}`,
      maxFeePerGas: `0x${max.toString(16)}`,
      gasLimit,
      to: transaction?.to,
      value,
      data,
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
    const { r, s, v } = await window.Main.handleSignTransaction({
      msgHash,
      pin,
      index,
    });
    const txParamSigned = {
      chainID: tx.chainID,
      nonce: tx.nonce,
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
      ModalStore.close();
      try {
        openNotification("Transfer Sending...", "");
        const receipt = await web3.eth.sendSignedTransaction(
          `0x${rawTransaction.toString("hex")}`
        );
        const hash = receipt.transactionHash;
        const _requestEvent = {
          ...requestEvent,
          hash,
        };
        openNotification("Transfer success.", "success");
        dispatch(setCheckGetBalance(true));
        const response = await approveEIP155Request(_requestEvent);
        await signClient.respond({
          topic,
          response,
        });
        form.resetFields();
        setLoading(false);
      } catch (e) {
        console.log(e);
        onReject();
        openNotification("Transfer fail.", "error");
      }
    } else {
      onReject();
    }
    setCheckComfirmInfSend(false);
  }

  // Handle reject action
  async function onReject() {
    setCheckComfirmInfSend(false);
    if (requestEvent) {
      const response = rejectEIP155Request(requestEvent);
      await signClient.respond({
        topic,
        response,
      });
      form.resetFields();
      ModalStore.close();
    }
  }

  const switchNetwork = () => {
    const index = networks.findIndex(
      (item) => item.chainID === dataChain.chainID
    );
    localStorage.setItem("network_select", index.toString());
    dispatch(setCheckGetNetwork(true));
    setTimeout(() => {
      setCheckExistNetwork(true);
      setTextExistNetwork("");
    }, 3000);
  };

  useEffect(() => {
    if (!dataChain) {
      setCheckSwitchNetwork(false);
      setCheckExistNetwork(false);
      setTextExistNetwork("Unsupported network");
    } else {
      if (dataChain.chainID == chainID) {
        setCheckExistNetwork(true);
        setTextExistNetwork("");
      } else {
        setTextExistNetwork(`Switch network ${dataChain.name}`);
        setCheckExistNetwork(false);
        setCheckSwitchNetwork(true);
      }
    }
  }, [url]);

  return (
    <>
      {checkExistNetwork ? (
        <Fragment>
          {!checkComfirmInfSend ? (
            <Box
              sx={{ ...style, height: "380px", top: "190px" }}
              className="box-modal"
            >
              <h2 className="title">Sign Transaction</h2>
              <Form form={form}>
                <h3 style={{ color: "white" }}>
                  Send transaction with account: {eip155Addresses[index].name}
                </h3>
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
                      onClick={() => setCheckComfirmInfSend(true)}
                    >
                      Approve
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            </Box>
          ) : (
            <Box
              sx={{ ...style, height: "200px", top: "100px" }}
              className="box-modal"
            >
              <h2 className="title">Enter your PIN</h2>
              <div>
                <Form
                  form={form}
                  onFinish={async (values) => {
                    const { result } = await window.Main.handleLogin(
                      values.pincode
                    );
                    if (result) {
                      await onApprove(values.pincode);
                    } else openNotification("Sai mã pin", "error");
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
      ) : (
        <Box
          sx={{ ...style, height: "200px", top: "100px" }}
          className="box-modal"
        >
          <Form form={form}>
            <h2 className="title">Send transaction</h2>
            <p className="text " style={{ color: "white" }}>
              {textExistNetwork}
            </p>
            <div className="button-group">
              <Button onClick={onReject}>Reject</Button>
              {checkSwitchNetwork && (
                <Button type="primary" onClick={switchNetwork}>
                  switch
                </Button>
              )}
            </div>
          </Form>
        </Box>
      )}
    </>
  );
}
