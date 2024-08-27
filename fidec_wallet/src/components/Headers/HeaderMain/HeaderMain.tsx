import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import type { RootState } from "../../../store/store";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import { Radio, Space, Input, Form, Row, Col } from "antd";
import { DeleteOutlined, DownOutlined } from "@ant-design/icons";
import { AppDispatch } from "../../../store/store";
import {
  setSelectAccount,
  setCheckGetAccount,
} from "../../../store/StoreComponents/Accounts/accounts";
import {
  selectNetwork,
  setCheckGetNetwork,
} from "../../../store/StoreComponents/Networks/networks";
import { openNotification } from "../../../utils/helperUtil";
import "./styles.scss";
import IconSVG from "../../Icons/IconSVG";

const HeaderMain = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const networksState = useSelector((state: RootState) => state.networks);
  const accountsState = useSelector((state: RootState) => state.accounts);
  const { networks, network } = networksState;
  const { eip155Addresses, eip155Address, disableHeader } = accountsState;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [anchorEl2, setAnchorEl2] = useState<HTMLButtonElement | null>(null);
  const [indexAccount, setIndexAccount] = useState<number>(null);
  const [indexNetwork, setIndexNetwork] = useState<number>(null);
  const [selectedNetWork, setSelectedNetWork] = useState<string>("");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick2 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorEl2);
  const id1 = open ? "simple-popover" : undefined;
  const id2 = open2 ? "simple-popover" : undefined;

  const onSelectAccount = async (value: number) => {
    setIndexAccount(value);
    dispatch(setSelectAccount(value));
  };

  const deleteAcount = async (value: number) => {
    const { result, message } = await window.Main.handleDeleteAccount({
      index: value,
    });
    if (result) {
      dispatch(setCheckGetAccount(true));
    }
    if (value == Number(localStorage.getItem("account_select"))) {
      localStorage.setItem("account_select", "0");
      setIndexAccount(value);
      dispatch(setSelectAccount(value));
    }
    openNotification(message, "error");
  };

  const deleteNetwork = async (value: number) => {
    const { result, message } = await window.Main.handleDeleteNetwork({
      index: value,
    });
    if (result) {
      dispatch(setCheckGetNetwork(true));
    }
    if (value == Number(localStorage.getItem("network_select"))) {
      localStorage.setItem("network_select", "0");
      setIndexNetwork(0);
    }
    openNotification(message, result ? "success" : "error");
  };

  useEffect(() => {
    setTimeout(() => {
      const network_select = Number(localStorage.getItem("network_select"));
      const account_select = Number(localStorage.getItem("account_select"));
      const { name } = networks[network_select];
      setSelectedNetWork(name);
      setIndexNetwork(network_select);
      dispatch(selectNetwork(network_select));
      setIndexAccount(account_select);
    }, 1000);
  }, [selectedNetWork, indexNetwork, localStorage.getItem("network_select")]);

  return (
    <header>
      <Link to="/" className="logo--container">
        <IconSVG iconName="header-main" />
      </Link>
      <div className="button--container" style={{ ...disableHeader }}>
        <div>
          <Button
            aria-describedby={id1}
            // variant="contained"
            onClick={handleClick}
          >
            {eip155Address.name} &nbsp;
            <DownOutlined />
          </Button>
          <Popover
            id={id1}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            className="popup--header"
          >
            <div className="text--accounts">
              <h2 className="title title--accounts">{eip155Address.name}</h2>
              <p className="text--desc">{selectedNetWork ?? ""}</p>
            </div>
            <div className="search--bar">
              <Form form={form}>
                <Form.Item name="search">
                  <Input placeholder="Search accounts" />
                </Form.Item>
              </Form>
            </div>
            <Radio.Group
              value={indexAccount}
              onChange={(e) => {
                onSelectAccount(e.target.value);
                localStorage.setItem("account_select", e.target.value);
                handleClose();
              }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                {eip155Addresses.map(
                  ({ address, name, indexAccount }, index: number) => {
                    if (indexAccount <= 9) {
                      return (
                        <div key={indexAccount} className="account--option">
                          <Radio value={indexAccount}>{name} </Radio>
                        </div>
                      );
                    } else if (indexAccount >= 10) {
                      return (
                        <Row
                          gutter={[12, 12]}
                          key={indexAccount}
                          className="account--option"
                        >
                          <Col xs={13} md={13}>
                            <Radio value={indexAccount}>{name}</Radio>
                          </Col>
                          <Col xs={8} md={8}>
                            <p>Imported</p>
                          </Col>
                          <Col xs={3} md={3}>
                            <DeleteOutlined
                              style={{
                                color: "white",
                                fontSize: "14px",
                                marginLeft: "5px",
                              }}
                              onClick={() => deleteAcount(index)}
                            />
                          </Col>
                        </Row>
                      );
                    }
                  }
                )}
              </Space>
            </Radio.Group>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button className="btn--add btn--gray--default">
                <Link to="/account/import-account" style={{ color: "black" }}>
                  Import Accounts
                </Link>
              </button>
            </div>
          </Popover>
        </div>
        <div>
          <Button aria-describedby={id2} onClick={handleClick2}>
            <p style={{ marginRight: "5px", width: "75px" }}>
              {networks?.length ? (
                selectedNetWork?.length > 8 ? (
                  <>{selectedNetWork.substr(0, 8)}...</>
                ) : (
                  selectedNetWork
                )
              ) : (
                <>Networks</>
              )}
            </p>
            <DownOutlined />
          </Button>
          <Popover
            id={id2}
            open={open2}
            anchorEl={anchorEl2}
            onClose={handleClose2}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            className="popup--header"
          >
            <h2 className="title title--networks">Networks</h2>
            <Radio.Group
              // defaultValue="Ethereum Mainnet"
              value={indexNetwork}
              onChange={(e) => {
                localStorage.setItem("network_select", e.target.value);
                handleClose2();
              }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                {networks.map(({ name }, index: number) => {
                  return (
                    <Row
                      gutter={[12, 12]}
                      key={index}
                      className="account--option"
                    >
                      <Col xs={21} md={21}>
                        <Radio
                          value={index}
                          onClick={() => {
                            setIndexNetwork(index);
                            setSelectedNetWork(name);
                          }}
                        >
                          {name}
                        </Radio>
                      </Col>
                      <Col xs={3} md={3}>
                        {index > 0 && (
                          <DeleteOutlined
                            style={{ color: "white", fontSize: "14px" }}
                            onClick={() => deleteNetwork(index)}
                          />
                        )}
                      </Col>
                    </Row>
                  );
                })}
              </Space>
            </Radio.Group>
            <div style={{ textAlign: "center" }}>
              <Link
                to="/network/import-network"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <button className="btn--add btn--gray--default">
                  Add Network
                </button>
              </Link>
            </div>
          </Popover>
        </div>
      </div>
    </header>
  );
};

export default HeaderMain;
