import { connect } from "react-redux";
import Banner from "@components/Banner";

const mapStateToProps = () => {
  return {
    APIURL: "/api/ad/index"
  };
};

export default connect(mapStateToProps)(Banner);
