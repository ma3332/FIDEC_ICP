import BackToHomeText from "../../components/Footers/Back";
import HeaderMain from "../../components/Headers/HeaderMain/HeaderMain";
import Navbar from "../../components/Navbar";
import "./styles.scss";
import SuccessIcon from "./images/success.png";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
// import { getAccounts } from "../../store/StoreComponents/Accounts/accounts";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../store/Hooks";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { Empty } from "antd";

const style = {
  position: "absolute" as any,
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "360px",
  height: "200px",
  bgcolor: "#252525",
  boxShadow: 24,
  p: 4,
  borderRadius: "14px",
  color: "white",
  outline: "none",
};

const History = () => {

  const [visible, setVisible] = useState<boolean>(false);
  const [listHistoryTransaction, setListHistoryTransaction] = useState([]);
  const [record, setRecord] = useState<any>();


  const userState = useSelector((state: RootState) => state.accounts);
  const { eip155Addresses } = userState;
  const dispatch = useAppDispatch(); 

  // console.log(eip155Addresses, "accounts history");

  const getListHistoryTransaction = async ()=>{
    const res = await window.Main.handleGetHistoryTransaction({id_card: 1});
    setListHistoryTransaction(res.listTxHash);
  }

  useEffect(()=>{
    getListHistoryTransaction()
  },[]);
  
  return (
    <div className="history--page">
      <HeaderMain />
      <h2 className="text--title">History</h2>
      <div className="content">
        {listHistoryTransaction.length > 0 ? listHistoryTransaction.map((item, index) => {
          return (
            <div
              className="history--item"
              onClick={() => {
                setRecord(item);
                setVisible(true);
              }}
              key={index}
            >
              <div onClick={()=> window.Main.handleOpenNewWindow({txHash: item})}>
                <img src={SuccessIcon} alt="" />
                <a>https://goerli.etherscan.io/tx/{item.slice(0, 5)}...{item.slice(-3)}</a>
              </div>
              {/* <p>1 month</p> */}
            </div>
          );
        })
        :
        <Empty
          description={
            <p style={{ margin: "0", color: "white" }}>No History</p>
          }
          imageStyle={{ height: "100px" }}
        />
      }
      </div>  
      <Navbar />
    </div>
  );
};

export default History;
