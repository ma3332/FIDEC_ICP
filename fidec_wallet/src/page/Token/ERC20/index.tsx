import Web3 from "web3";
import React, { useState, useEffect } from "react";
import { Button, Typography } from "antd";
import AxieIcon from "../../../data/images/axie-infinity.png";
import CannotTokenText from "../../../components/Footers/CannotTokenText";
import HeaderMain from "../../../components/Headers/HeaderMain/HeaderMain";
import Navbar from "../../../components/Navbar";
// import TokenPage from "../../../components/TokenPage/TokenPageERC20";
import TokenGroupERC20 from "../../../components/TokenPage/component/TokenGroupERC20";
import EthereumIcon from "./images/Ethereum.png";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../store/store";
import { AppDispatch } from "../../../store/store";
import {
  setBalance,
  setPath,
} from "../../../store/StoreComponents/Accounts/accounts";
import {
  setAddressERC20,
  setCheckTokenDetail,
} from "../../../store/StoreComponents/Tokens/tokens";
import abiERC20 from "../../../data/abiJsonToken/abiERC20.json";
import "./styles.scss";
import { setLoading } from "../../../store/Support/Loading/LoadingSlice";
import { setDisableHeader } from "../../../store/StoreComponents/Accounts/accounts";
// eslint-disable-next-line import/no-unresolved
import { CovalentClient } from "@covalenthq/client-sdk";

const ERC20 = () => {
  const dispatch = useDispatch<AppDispatch>();

  const isLoading = useSelector((state: any) => state.loading.isLoading);
  const setCheckGetBalance = useSelector(
    (state: any) => state.accounts.checkGetBalance
  );

  const accountsState = useSelector((state: RootState) => state.accounts);
  const networksState = useSelector((state: RootState) => state.networks);
  const tokensState = useSelector((state: RootState) => state.tokens);
  const { eip155Address, path } = accountsState;
  const { network } = networksState;
  const { address, name, indexAccount } = eip155Address;
  const { chainID, url, ws, symbol } = network;
  const { addressesERC20, addressERC20 } = tokensState;
  const { addressToken, type, symbolToken } = addressERC20;

  const [balanceAccount, setBalanceAccount] = useState("0");
  const [balanceToken, setBalanceToken] = useState("0");

  const web3 = new Web3(url);
  const abi: any = abiERC20.abi;
  const client = new CovalentClient("cqt_rQHmtbyfHRKJ4PT9dQxcKXQk8KKm");
  const getBalance = async () => {
    dispatch(setLoading(true));
    await client.BalanceService.getNativeTokenBalance(
      "eth-goerli",
      address
    ).then((result: any) => {
      console.log(result);
      const amount = result.data.items[0].balance;
      dispatch(setBalance((Number(amount) / 10 ** 18).toString()));
      setBalanceAccount((Number(amount) / 10 ** 18).toString());
    });
    // await web3.eth.getBalance(address).then((result) => {
    //   dispatch(setBalance((Number(result) / 10 ** 18).toString()));
    //   setBalanceAccount((Number(result) / 10 ** 18).toString());
    // });
    dispatch(setLoading(false));
  };

  const getBalanceToken = async () => {
    dispatch(setLoading(true));
    setLoading(true);
    const contract = new web3.eth.Contract(abi, addressToken);
    const balance = await contract.methods.balanceOf(address).call();
    setBalanceToken(balance);
    dispatch(setLoading(false));
    setLoading(true);
  };

  useEffect(() => {
    getBalance();
  }, [address, url, setCheckGetBalance]);

  useEffect(() => {
    if (addressToken) {
      getBalanceToken();
    }
  }, [address, url, addressToken]);

  useEffect(() => {
    dispatch(setDisableHeader(""));
  }, []);

  useEffect(() => {
    if (addressToken) {
      const web3ws = new Web3(ws);
      const contractws = new web3ws.eth.Contract(abi, addressToken);
      const contract = new web3.eth.Contract(abi, addressToken);

      //event receive
      contractws.events
        .Transfer(
          {
            // filter options, if any
            filter: { from: "", to: address },
          },
          function (error: any, event: any) {
            if (!error) {
              console.log(event.returnValues);
            } else {
              console.error(error);
            }
          }
        )
        .on("data", async function (event: any) {
          const balance = await contract.methods.balanceOf(address).call();
          setBalanceToken(balance);
        })
        .on("changed", function (event: any) {
          // remove
        })
        .on("error", console.error);

      //event send
      contractws.events
        .Transfer(
          {
            // filter options, if any
            filter: { from: address, to: "" },
          },
          function (error: any, event: any) {
            if (!error) {
              console.log(event.returnValues);
            } else {
              console.error(error);
            }
          }
        )
        .on("data", async function (event: any) {
          const balance = await contract.methods.balanceOf(address).call();
          setBalanceToken(balance);
        })
        .on("changed", function (event: any) {
          // remove
        })
        .on("error", console.error);
    }
  }, [addressToken, address, url]);

  return (
    <div>
      <HeaderMain />
      <div className="token--page--container">
        <div className="account--container">
          <div className="account--name">
            <p>{name ? name : `Account ${indexAccount + 1}`}</p>
            <Typography.Paragraph
              copyable={{
                tooltips: false,
                text: address,
              }}
            >
              {address.substring(0, 6)}...
            </Typography.Paragraph>
          </div>
          <div className="content--container">
            <img
              src={addressToken ? null : EthereumIcon}
              alt=""
              onClick={() => {
                dispatch(setLoading(true));
                setTimeout(() => {
                  getBalance();
                  dispatch(setLoading(false));
                }, 3000);
              }}
            />
            <h1>
              {addressToken
                ? balanceToken + " " + symbolToken
                : balanceAccount.slice(0, 10) + " " + `${symbol}`}
            </h1>
            <div className="btn--group">
              <Link to="/token/buy-token">
                <Button type="primary">BUY</Button>
              </Link>
              <Link to={path}>
                <Button
                  type="primary"
                  onClick={() =>
                    dispatch(
                      setDisableHeader({ pointerEvents: "none", opacity: 0.5 })
                    )
                  }
                >
                  SEND
                </Button>
              </Link>
            </div>
          </div>
          <div className="token--content">
            <div className="token--container">
              <div
                className="token--item"
                onClick={() => {
                  dispatch(setPath("/token/send-token-transaction"));
                  dispatch(setAddressERC20({}));
                  dispatch(setCheckTokenDetail(false));
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "15px" }}
                >
                  <img
                    src={EthereumIcon}
                    alt=""
                    style={{ width: "30px", height: "30px" }}
                  />
                  <p>{balanceAccount.slice(0, 10)}</p>
                  <p>{symbol}</p>
                </div>
              </div>
            </div>
            {addressesERC20.length > 0 &&
              addressesERC20.map(
                ({ addressToken, type, symbolToken, indexToken }) => {
                  const info = {
                    addressToken,
                    type,
                    symbolToken: symbolToken,
                    indexToken,
                    url,
                    ws,
                    logo: AxieIcon,
                  };
                  return <TokenGroupERC20 key={indexToken} info={info} />;
                }
              )}
          </div>
        </div>
        <CannotTokenText type={"Token"} />
      </div>
      <Navbar />
    </div>
  );
};

export default ERC20;
