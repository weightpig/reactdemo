import React, { Component } from "react";
import Layout from "../Layout/Layout.jsx";
import Crumb from "../../components/Crumb.jsx";
import "./CreateAuthor.scss";
import { dealISLogin } from "../../../common/tools.js";
import { changeStore } from "../../store/actions.js";
import { connect } from "react-redux";
import CreateForm from "../../components/CreateForm.jsx";

class CreateAuthor extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    OptionData: [],
    selectValue: null,
    authoObject: "",
    contractNoValue: "",
    authorNum: null,
    authorNumStatus: "success",
    authorNumHelp: "",
    startTime: null,
    startValue: null,
    endTime: null,
    endValue: null,
    radioValue: 0,
    textAreaValue: ""
  };

  componentWillMount() {
    dealISLogin(this.props.loginName, this.props.history.push);
  }

  render() {
    return (
      <Layout
        push={this.props.history.push}
        children={
          <div className="createAuthor">
            <Crumb
              crumbData={this.props.crumb}
              push={this.props.history.push}
            />
            <CreateForm
              wrappedComponentRef={inst => {
                this.createForm = inst;
              }}
              type={this.props.authorPageType}
              change={this.props.change}
              crumb={this.props.crumb}
              push={this.props.history.push}
              customerId={this.props.customerId}
              customernoAndname={this.props.customernoAndname}
              authorId={this.props.authorId}
            />
          </div>
        }
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state
  };
};
const mapDispatchToProps = dispatch => {
  return {
    change: parmares => dispatch(changeStore(parmares))
  };
};

// 导出 容器组件
export default connect(mapStateToProps, mapDispatchToProps)(CreateAuthor);
