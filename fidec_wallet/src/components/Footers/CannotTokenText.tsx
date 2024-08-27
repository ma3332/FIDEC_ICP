import { useDispatch } from "react-redux";
import { setTypeImport } from "../../store/StoreComponents/Tokens/tokens";
import { Link } from "react-router-dom";
import "./styles.scss";

const CannotTokenText = (props: any) => {
  const dispatch = useDispatch();

  const { type } = props;
  return (
    <div className="cannot--token--text">
      Cannot find your token? <br />{" "}
      <Link
        to="/token/import-token"
        onClick={() => dispatch(setTypeImport(type))}
      >
        Import Token
      </Link>
    </div>
  );
};

export default CannotTokenText;
