import BackToHomeText from "../../../components/Footers/Back";
import HeaderMain from "../../../components/Headers/HeaderMain/HeaderMain";
import { Col, Input, Radio, Row, Spin } from "antd";
import "./styles.scss";
import Navbar from "../../../components/Navbar";
import Web3 from "web3";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCheckGetAccount } from "../../../store/StoreComponents/Accounts/accounts";
import { openNotification } from "../../../utils/helperUtil";
import { RootState } from "../../../store/store";

type SetStateFunction<T> = React.Dispatch<React.SetStateAction<T>>;

interface Props {
  mnemonic: string;
  setCheckImportMnemonic: SetStateFunction<boolean>;
  index: number;
}

const WalletIndexPage = ({
  mnemonic,
  setCheckImportMnemonic,
  index,
}: Props) => {
  const dispatch = useDispatch();
  const { url } = useSelector((state: RootState) => state.networks.network);

  const web3 = new Web3(url);

  const [listAccount, setListAccount] = useState([]);
  const [privateKey, setPrivateKey] = useState([]);
  const [accountOption, setAccountOption] = useState({
    privateKey: "0x",
    publicKey: "0x",
    balance: "0",
  });
  const [loading, setLoading] = useState(false);

  const createAccount = async () => {
    // const mnemonic = "dentist program solar catalog predict rural fitness evolve velvet ahead toddler way";
    const numKeys = 10; // Số lượng private key cần tạo

    const account = [];
    setLoading(true);

    for (let i = 0; i < numKeys; i++) {
      const path = `m/44'/60'/0'/0/${i}`;
      const wallet = ethers.Wallet.fromMnemonic(mnemonic, path);
      console.log("wallet", wallet);
      const privateKey = wallet.privateKey;
      const publicKey = wallet.address;
      const balance = await web3.eth.getBalance(publicKey);
      account.push({
        privateKey,
        publicKey,
        balance: (Number(balance) / 10 ** 18).toString(),
      });
    }
    setListAccount(account);
    setLoading(false);
  };

  const createAccountOption = async (value: number) => {
    // const mnemonic = "dentist program solar catalog predict rural fitness evolve velvet ahead toddler way";
    const path = `m/44'/60'/0'/0/${value}`;
    const wallet = ethers.Wallet.fromMnemonic(mnemonic, path);
    const privateKey = wallet.privateKey;
    const publicKey = wallet.address;
    const balance = await web3.eth.getBalance(publicKey);
    setAccountOption({
      privateKey,
      publicKey,
      balance,
    });
  };

  const importAccountMnemonic = async () => {
    const { result, message } = await window.Main.handleImportAccount({
      privateKey: privateKey.slice(2),
      name: "",
      index,
    });
    if (result) {
      openNotification(message, "success");
      setCheckImportMnemonic(false);
      dispatch(setCheckGetAccount(true));
    } else openNotification(message, "error");
  };

  useEffect(() => {
    createAccount();
  }, []);

  return (
    // loading ? <Spin spinning={loading} /> :

    <div className="walletIndex--page">
      <HeaderMain />
      <h2 className="text--title">Import Wallet Index</h2>
      {/* ------ Chia ra 2 màn, handle khi code ---- */}
      <div className="main">
        <div className="wallet--content">
          <Row gutter={[12, 12]}>
            <Col xs={8} md={8} style={{ textAlign: "center" }}>
              <p>Index</p>
            </Col>
            <Col xs={8} md={8} style={{ textAlign: "center" }}>
              <p>Address</p>
            </Col>
            <Col xs={8} md={8} style={{ textAlign: "center" }}>
              <p>Balance</p>
            </Col>
          </Row>
          <Radio.Group
            className="displayFlexColumn indexContainer"
            onChange={(e) => setPrivateKey(e.target.value)}
          >
            {listAccount?.map((item, index) => {
              return (
                <Radio key={index} value={item.privateKey}>
                  <div className="flex">
                    <p>{index}</p>
                    <p>
                      {item.publicKey.slice(0, 8) +
                        "..." +
                        item.publicKey.slice(-6)}
                    </p>

                    <p>{item.balance.slice(0, 8)}</p>
                  </div>
                </Radio>
              );
            })}
          </Radio.Group>
        </div>
        <div className="inputIndexContainer">
          <div className="item">
            <Input
              placeholder="Your Index"
              onChange={(e) => createAccountOption(Number(e.target.value))}
            />
          </div>
          <div className="item">
            <p>
              {accountOption.publicKey.slice(0, 5) +
                "..." +
                accountOption.publicKey.slice(0, -3)}
            </p>
          </div>
          <div className="item">
            <p>{accountOption.balance.slice(0, 8)}</p>
          </div>
        </div>
        <button
          className="btn--gray--default"
          onClick={() => importAccountMnemonic()}
        >
          Import
        </button>
      </div>
      <BackToHomeText />
      <Navbar />
    </div>
  );
};

export default WalletIndexPage;
