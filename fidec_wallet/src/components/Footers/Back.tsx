import "./styles.scss";

const BackToHomeText = () => { 
  return (
    <div>
      <a className="back--to--home--text" onClick={()=>{window.history.back();}}>
        Back
      </a>
    </div>
  );
};

export default BackToHomeText;
