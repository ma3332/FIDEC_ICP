import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HeaderMain from "../../../components/Headers/HeaderMain/HeaderMain";
import Navbar from "../../../components/Navbar";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Form, Input, Button, Row, Col } from "antd";
import BackToHomeText from "../../../components/Footers/Back"; 
import type { RootState } from "../../../store/store";
import { setCheckGetAccount } from "../../../store/StoreComponents/Accounts/accounts";
import WalletIndexPage from "../../Wallet/WalletIndex";
import { openNotification } from "../../../utils/helperUtil";
import "./styles.scss";

const ImportAccount = () => {
  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const [selectedKey, setSelectedKey] = useState<string>("12-word Phrase");
  const [checkImportMnemonic, setCheckImportMnemonic] = useState(false);
  const [checkMnemonic, setCheckMnemonic] = useState(true);
  const [mnemonic, setmnemonic] = useState("");

  const accountsState = useSelector((state: RootState) => state.accounts);
  const { eip155Addresses } = accountsState;

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedKey(event.target.value);
  };

  const importAccountPrivateKey = async (values: any) => {
    const index = eip155Addresses.length;
    if (index < 20) {
      const { result, message } = await window.Main.handleImportAccount({
        privateKey: values.privateKey,
        name: values.name,
        index,
      });
      if (result) {
        dispatch(setCheckGetAccount(true));
        openNotification(message, "success");

        form.resetFields();
      } else {
        form.resetFields();
      }
    } else {
      openNotification("Max account import", "warning");
    }
  };

  return !checkImportMnemonic ? (
    <div className="import--account--container">
      <HeaderMain />
      <div>
        <div className="content--container">
          <h2>Import Accounts</h2>
          {/* Xử lý ở dòng dưới */}
          <p className="text--warning">
            Only 5 accounts can be imported <br />
            to this wallet
          </p>
          <div className="main--container">
            <div className="select--line">
              <p>Import Method</p>
              <FormControl sx={{ m: 1, minWidth: 162 }}  style={{background: "white"}}>
                <Select
                  value={selectedKey}
                  onChange={handleChange}
                  displayEmpty
                >
                  <MenuItem value="Private key">Private key</MenuItem>
                  <MenuItem value="12-word Phrase">12-word Phrase</MenuItem>
                  <MenuItem value="15-word Phrase">15-word Phrase</MenuItem>
                  <MenuItem value="18-word Phrase">18-word Phrase</MenuItem>
                  <MenuItem value="24-word Phrase">24-word Phrase</MenuItem>
                </Select>
              </FormControl>
            </div>
            {selectedKey === "Private key" ? (
              <div className="private--key--container">
                <div className="form--container">
                  <p className="text--label">Enter your private key</p>
                  <Form
                    form={form}
                    onFinish={async (values) => {
                      console.log(values, "values");
                      importAccountPrivateKey(values);
                    }}
                  >
                    <Col xs={24} md={24}>
                      <Form.Item name="privateKey">
                        <Input
                          placeholder="Enter your private key"
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={24}>
                      <Form.Item name="name">
                        <Input
                          placeholder="Enter your name account"
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Form.Item
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Button
                        htmlType="submit"
                        type="primary"
                        className="btn--primary"
                      >
                        Import
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            ) : (
              <div className="not--private--key--container">
                <p className="text--title">Enter your Mnemonic Words</p>
                <Form
                  form={form}
                  onFinish={async (values) => {
                    console.log(values, "values");
                    let mnemonic = "";
                    for (const value of Object.keys(values)) {
                      if (values[value] === undefined) {
                        setCheckMnemonic(false);
                        return;
                      } else mnemonic = mnemonic + values[value] + " ";
                    }
                    setmnemonic(mnemonic.slice(0, -1));
                    if (checkMnemonic) {
                      setCheckImportMnemonic(true);
                      form.resetFields();
                    } else {
                      console.log("Please check mnemonic");
                    }
                  }}
                >
                  <div className="form--container">
                    <Row gutter={[12, 0]}>
                      <Col xs={12}>
                        <Form.Item name="mnemonic-1">
                          <Input.Password placeholder="1" />
                        </Form.Item>
                        <Form.Item name="mnemonic-2">
                          <Input.Password placeholder="2" />
                        </Form.Item>
                      </Col>

                      <Col xs={12}>
                        <Form.Item name="mnemonic-3">
                          <Input.Password placeholder="3" />
                        </Form.Item>

                        <Form.Item name="mnemonic-4">
                          <Input.Password placeholder="4" />
                        </Form.Item>
                      </Col>

                      <Col xs={12}>
                        <Form.Item name="mnemonic-5">
                          <Input.Password placeholder="5" />
                        </Form.Item>
                        <Form.Item name="mnemonic-6">
                          <Input.Password placeholder="6" />
                        </Form.Item>
                      </Col>

                      <Col xs={12}>
                        <Form.Item name="mnemonic-7">
                          <Input.Password placeholder="7" />
                        </Form.Item>
                        <Form.Item name="mnemonic-8">
                          <Input.Password placeholder="8" />
                        </Form.Item>
                      </Col>

                      <Col xs={12}>
                        <Form.Item name="mnemonic-9">
                          <Input.Password placeholder="9" />
                        </Form.Item>
                        <Form.Item name="mnemonic-10">
                          <Input.Password placeholder="10" />
                        </Form.Item>
                      </Col>

                      <Col xs={12}>
                        <Form.Item name="mnemonic-11">
                          <Input.Password placeholder="11" />
                        </Form.Item>
                        <Form.Item name="mnemonic-12">
                          <Input.Password placeholder="12" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                  <Form.Item>
                    <Button
                      htmlType="submit"
                      type="primary"
                      className="btn--primary"
                    >
                      Import
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            )}
          </div>
        </div>
      </div>
      <BackToHomeText />
      <Navbar />
    </div>
  ) : (
    <WalletIndexPage
      mnemonic={mnemonic}
      setCheckImportMnemonic={setCheckImportMnemonic}
      index={eip155Addresses.length}
    />
  );
};

export default ImportAccount;
