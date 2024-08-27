import { Fragment, useEffect, useState } from "react";
import { SessionTypes } from "@walletconnect/types";
import { getSdkError } from "@walletconnect/utils";
import { signClient } from "../../../../utils/WalletConnectUtil";
import ModalStore from "../../../../store/ModalStore";
import Box from "@mui/material/Box";
import { Form, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import { setLoading } from "../../../../store/Support/Loading/LoadingSlice";
import { getChainData } from "../../../../data/networkConfig/chainsUtil";

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

type Chain = {
  chainID?: number;
  name?: string;
  url?: string;
  ws?: string;
  symbol?: string;
};

export default function SessionProposalModal() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { eip155Address } = useSelector((state: RootState) => state.accounts);
  const { network, networks } = useSelector(
    (state: RootState) => state.networks
  );
  const { chainID, url } = network;
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  const [checkExistNetwork, setCheckExistNetwork] = useState<boolean>();
  const [checkSwitchNetwork, setCheckSwitchNetwork] = useState<boolean>();
  const [textExistNetwork, setTextExistNetwork] = useState("");

  // Get proposal data and wallet address from store
  const proposal = ModalStore.state.data?.proposal;

  // Ensure proposal is defined
  if (!proposal) {
    return <h3>Missing proposal data</h3>;
  }

  // Get required proposal data
  const { id, params } = proposal;
  const { proposer, requiredNamespaces, relays } = params;
  console.log("proposal", params);
  const { optionalNamespaces } = params;
  const { eip155 } = optionalNamespaces;
  const { chains } = eip155;
  console.log("chains", chains);
  const dataChain: Chain = getChainData(chains[0], networks);

  const switchNetwork = () => {
    const index = networks.findIndex(
      (item) => item.chainID === dataChain.chainID
    );
    localStorage.setItem("network_select", index.toString());
    setCheckExistNetwork(true);
    setTextExistNetwork("");
  };

  const onApprove = async () => {
    dispatch(setLoading(true));
    if (proposal) {
      const namespaces: SessionTypes.Namespaces = {};
      Object.keys(requiredNamespaces).forEach((key) => {
        const accounts: string[] = [
          `${requiredNamespaces[key].chains}:${eip155Address.address}`,
        ];

        namespaces[key] = {
          accounts,
          methods: requiredNamespaces[key].methods,
          events: requiredNamespaces[key].events,
        };
      });
      const { acknowledged } = await signClient.approve({
        id,
        relayProtocol: relays[0].protocol,
        namespaces,
      });
      await acknowledged();
    }
    ModalStore.close();
    dispatch(setLoading(false));
  };

  // Hanlde reject action
  async function onReject() {
    dispatch(setLoading(true));
    if (proposal) {
      await signClient.reject({
        id,
        reason: getSdkError("USER_REJECTED_METHODS"),
      });
    }
    ModalStore.close();
    dispatch(setLoading(false));
  }

  useEffect(() => {
    if (!dataChain) {
      // setCheckSwitchNetwork(false);
      setCheckExistNetwork(false);
      setTextExistNetwork("Unsupported network");
    } else {
      setCheckExistNetwork(true);
      setTextExistNetwork("");
    }
  }, [url, chains[0]]);

  return (
    <Fragment>
      <Box sx={style} className="box-modal">
        <h2 className="title">Connect Dapp</h2>
        {checkExistNetwork ? (
          <div>
            <Form
              form={form}
              onFinish={async (values) => {
                console.log(values, "values");
              }}
            >
              <p className="text " style={{ color: "white" }}>
                Are you sure you want to connect {proposer.metadata.name} with
                account: {eip155Address.name}
              </p>
              <div className="button-group">
                <button onClick={() => onReject()}>Reject</button>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="btn-confirm"
                    loading={isLoading}
                    onClick={() => onApprove()}
                  >
                    Approve
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        ) : (
          <Form form={form}>
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
        )}
      </Box>
    </Fragment>
  );
}
