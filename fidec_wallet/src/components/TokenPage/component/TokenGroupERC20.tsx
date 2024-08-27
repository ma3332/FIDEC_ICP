import Web3 from "web3";
import { useState, useEffect } from "react";
import { CloseCircleOutlined } from "@ant-design/icons";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import "../styles.scss";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../store/store";
import { setPath } from "../../../store/StoreComponents/Accounts/accounts";
import {
  setAddressERC20,
  setCheckGetAddressERC,
  setCheckTokenDetail,
} from "../../../store/StoreComponents/Tokens/tokens";
import { openNotification } from "../../../utils/helperUtil";
import abiERC20 from "../../../data/abiJsonToken/abiERC20.json"; 

const style = {
  position: "absolute" as any,
  top: "45%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "360px",
  height: "200px",
  bgcolor: "#252525",
  boxShadow: 24,
  p: 4,
  borderRadius: "14px",
  textAlign: "center",
  color: "white",
};

const TokenGroup = (props: any) => {
  const { addressToken, type, symbolToken, indexToken, url, ws, logo } = props.info;

  const web3 = new Web3(url);
  const abi: any = abiERC20.abi;

  const accountsState = useSelector((state: RootState) => state.accounts);
  const tokensState = useSelector((state: RootState) => state.tokens);
  const { eip155Address } = accountsState;
  const { address } = eip155Address;
  const { checkTokenDetail, addressERC20 } = tokensState;

  const dispatch = useDispatch();

  const [recordToken, setRecordToken] = useState<any>();
  const [open, setOpen] = useState<boolean>(false);
  const [errGetBalance, setErrGetBalance] = useState<boolean>(false);
  const [balance, setBalance] = useState(0);

  const deletToken = async () => { 
    try {
      const {result, message} = await window.Main.handleDeleteToken({
        index: indexToken,
      }); 
      if (result) {
        setOpen(false);
        dispatch(setCheckGetAddressERC(true)); 
        dispatch(setPath("/token/send-token-transaction")); 
        dispatch(setAddressERC20({})); 
      } 
      openNotification(message,result ? "success":"error") 
    } catch (e) {
      console.error(e);
    }
  };

  const getBalance = async () => {
    try {
      const addressERC20 = addressToken;
      const contract = new web3.eth.Contract(abi, addressERC20);
      const balance = await contract.methods.balanceOf(address).call();
      setErrGetBalance(false);
      setBalance(balance);
      if (checkTokenDetail) {
        dispatch(
          setAddressERC20({
            addressToken,
            typeToken: type,
            symbolToken,
            balanceToken: balance,
          })
        );
      }
    } catch (error) {
      setErrGetBalance(true);
    }
  };

  useEffect(() => {
    const web3ws = new Web3(ws);
    const contractws = new web3ws.eth.Contract(abi, addressToken);

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
      .on("data", function (event: any) {
        getBalance();
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
      .on("data", function (event: any) {
        getBalance();
      })
      .on("changed", function (event: any) {
        // remove
      })
      .on("error", console.error);
  }, [address, url]);

  useEffect(() => {
    getBalance();
  }, [address, url]);

  return (
     <div>
      {
        !errGetBalance &&
          <div className="token--container">
            <div
              className="token--item"
              onClick={() => {
                dispatch(setPath("/token/send-token"));
                dispatch(
                  setAddressERC20({
                    addressToken,
                    typeToken: type,
                    symbolToken,
                    balanceToken: balance,
                    logo,
                  })
                );
              }}
            >
              <div>
                <img src={logo} alt="" />
                <p>{balance}</p>
                <p>{symbolToken}</p>
              </div>
              <div>
                <CloseCircleOutlined
                  style={{ marginRight: "10px" }}
                  onClick={() => {
                    setRecordToken({ type, addressToken, indexToken });
                    setOpen(true);
                  }}
                />
              </div>
            </div>

            <Modal
              open={open}
              onClose={() => setOpen(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  REMOVE TOKEN
                </Typography>

                <p style={{ fontWeight: "400", fontSize: "16px", margin: "20px 0" }}>
                  Are you sure you want to remove <br /> {recordToken?.type ?? ""}{" "}
                  Token ?
                </p>
                <div className="button-remove-group">
                  <button className="btn--remove" onClick={() => setOpen(false)}>
                    Back
                  </button>
                  <button className="btn--remove" onClick={() => deletToken()}>
                    Confirm
                  </button>
                </div>
              </Box>
            </Modal>
          </div>
      }
     </div>
  );
};

export default TokenGroup;
