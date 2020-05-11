import React, { Component } from "react";
import { Icon, Menu } from "antd";
import { changeStore } from "../store/actions.js";
import "./LeftMenu.scss";
import { connect } from "react-redux";

class LeftMenu extends Component {
  constructor(props) {
    super(props);
  }
  state = {};

  menuClick = key => {
    let crumb = [];
    if (key == "customer") {
      crumb = [
        {
          name: "客户管理",
          url: "/customer"
        }
      ];
    } else if (key == "limits") {
      crumb = [
        {
          name: "授权管理",
          url: "/limits"
        }
      ];
    } else {
      crumb = [
        {
          name: "操作日志",
          url: "/journal"
        }
      ];
    }
    this.props.change({
      leftMenuKey: key,
      crumb
    });
    this.props.push(`/${key}`);
  };

  render() {
    const menuKey = this.props.leftMenuKey;

    return (
      <Menu
        className="leftMenu"
        selectedKeys={[menuKey]}
        mode="inline"
        threm="light"
      >
        <Menu.Item
          key="customer"
          onClick={() => {
            this.menuClick("customer");
          }}
        >
          {menuKey == "customer" ? (
            <img src="../img/customer-active.svg" alt="" className="icon" />
          ) : (
            <img src="../img/customer.svg" alt="" className="icon" />
          )}
          <span className={menuKey == "customer" ? "text active" : "text"}>
            客户管理
          </span>
        </Menu.Item>
        <Menu.Item
          key="limits"
          onClick={() => {
            this.menuClick("limits");
          }}
        >
          {menuKey == "limits" ? (
            <img src="../img/limits-active.svg" alt="" className="icon" />
          ) : (
            <img src="../img/limits.svg" alt="" className="icon" />
          )}
          <span className={menuKey == "limits" ? "text active" : "text"}>
            授权管理
          </span>
        </Menu.Item>
        <Menu.Item
          key="journal"
          className="lastMenu"
          onClick={() => {
            this.menuClick("journal");
          }}
        >
          {menuKey == "journal" ? (
            <img src="../img/journal-active.svg" alt="" className="icon" />
          ) : (
            <img src="../img/journal.svg" alt="" className="icon" />
          )}
          <span className={menuKey == "journal" ? "text active" : "text"}>
            操作日志
          </span>
        </Menu.Item>
      </Menu>
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
export default connect(mapStateToProps, mapDispatchToProps)(LeftMenu);
