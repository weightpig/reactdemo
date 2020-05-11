import React, { Component } from "react";
import { Menu } from "antd";
import "./Layout.scss";
import LeftMenu from "../../components/LeftMenu.jsx";
import { layOutDel } from "../../../common/api.js";
import { connect } from "react-redux";
import { changeStore } from "../../store/actions.js";
import Crumb from "../../components/Crumb.jsx";

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrowIsOpen: false
    };
  }

  handleClick = e => {
    this.setState({
      current: e.key
    });
  };

  nameClick = () => {
    this.setState({
      arrowIsOpen: !this.state.arrowIsOpen
    });
  };

  Logout = () => {
    layOutDel(this.props.loginName);
    this.props.change({ loginName: "", passWord: "" });
    this.props.push("/login");
  };

  editPwd = () => {
    this.props.change({
      leftMenuKey: "",
      crumb: [{ name: "个人中心", url: "/person" }]
    });
    this.props.push("/person");
  };

  render() {
    const { arrowIsOpen } = this.state;
    return (
      <div className="manage">
        <div className="top">
          <div className="topHead">
            <div className="username" onClick={this.nameClick}>
              {this.props.loginName}
              <span
                className={arrowIsOpen ? "arrow arrowDown" : "arrow arrowUp"}
              ></span>
              <ul
                style={arrowIsOpen ? { display: "block" } : { display: "none" }}
              >
                <li className="firstli" onClick={this.editPwd}>
                  修改密码
                </li>
                <li onClick={this.Logout}>退出登录</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="center">
          <div className="center_l">
            <LeftMenu menuKey={this.props.menuKey} push={this.props.push} />
          </div>
          <div className="center_r">{this.props.children}</div>
        </div>
      </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(Layout);
