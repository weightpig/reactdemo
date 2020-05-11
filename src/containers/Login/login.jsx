import React, { Component } from "react";
import { Form } from "antd";
import "./login.scss";
import { connect } from "react-redux";
import { changeStore } from "../../store/actions.js";
import FilterForm from "../../components/LoginFrom.jsx";

class Login extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="login">
        <div className="login_center">
          <div className="login_cen_l">
            <div className="title">授权管理后台系统</div>
            <div className="img">
              <img src="../img/login-bg.svg" alt="" />
            </div>
          </div>
          <div className="login_cen_r">
            <div className="r_title">管理员登录</div>
            <FilterForm
              wrappedComponentRef={inst => {
                this.filterForm = inst;
              }}
              changeStore={this.props.change}
              push={this.props.history.push}
            />
          </div>
        </div>
      </div>
    );
  }
}

const LoginForm = Form.create()(Login);
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
export default connect(mapStateToProps, mapDispatchToProps)(Login);
