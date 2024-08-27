import { useEffect, useState } from "react";
import { Spin } from "antd";
import { useSelector, useDispatch } from "react-redux";
import Modal from "./page/Dapp/DappConnect/components/Modal";
import Routes from "./routes";
import { setLoading } from "./store/Support/Loading/LoadingSlice";
import { openNotification } from "./utils/helperUtil";
 
function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state: any) => state.loading.isLoading);
  const isOnline = navigator.onLine;

  useEffect(() => {
    //
  }, []);

  useEffect(() => {
    if (!isOnline) {
      openNotification("Không kết nối internet.", "warning");
      dispatch(setLoading(true));
    }

    const handleOnline = () => {
      openNotification("Kết nối internet.", "success");
      dispatch(setLoading(false));
    };

    const handleOffline = () => {
      openNotification("Mất kết nối internet.", "warning");
      dispatch(setLoading(true));
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <Spin spinning={isLoading}>
      <div className="App">
        <Routes />
        <Modal />
      </div>
    </Spin>
  );
}

export default App;
