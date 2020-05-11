import React, { Component } from "react";
import Layout from "../Layout/Layout.jsx";
import Crumb from "../../components/Crumb.jsx";
import { Button, Input, Form } from "antd";
import "./Person.scss";
import { editPwd } from "../../../common/api.js";
import { dealISLogin } from "../../../common/tools.js";
import { connect } from "react-redux";
import { changeStore } from "../../store/actions.js";

class Person extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    currentPwd: {
      value: "",
      status: "",
      help: ""
    },
    newPwd: {
      value: "",
      status: "",
      help: ""
    },
    confirmPwd: {
      value: "",
      status: "",
      help: ""
    }
  };

  componentWillMount() {
    dealISLogin(this.props.loginName, this.props.history.push);
  }

  passwordValidate = (type, value, compareValue) => {
    const { newPwd, confirmPwd } = this.state;
    const reg = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/);
    let result = {
      status: "error",
      help: ""
    };
    if (type == "confirmPwd" && compareValue != value) {
      result.help = "新密码不一致！";
    } else if (!Boolean(value)) {
      result.help = "请输入密码！";
    } else if (value.length > 20 || value.length < 8) {
      result.help = "长度不符8-20位!";
    } else if (!reg.test(value)) {
      result.help = "密码必须包含大写、小写和数字!";
    } else if (type == "newPwd" && value == compareValue) {
      result.help = "新密码与当前密码不能相同！";
    } else {
      result.help = "";
      result.status = "success";
    }

    if (type == "newPwd" && confirmPwd.value !== "") {
      const validateResult = this.passwordValidate(
        "confirmPwd",
        confirmPwd.value,
        value
      );
      this.setState({
        confirmPwd: { ...validateResult, value: confirmPwd.value }
      });
    }

    if (type == "current" && newPwd.value !== "") {
      const validateResult = this.passwordValidate(
        "newPwd",
        newPwd.value,
        value
      );
      this.setState({ newPwd: { ...validateResult, value: newPwd.value } });
    }
    console.log(type, value, compareValue, result);
    return result;
  };

  currentPwdChange = changedValue => {
    const { currentPwd } = this.state;
    const value = changedValue.target.value;
    const validateResult = this.passwordValidate("current", value);
    this.setState({ currentPwd: { ...validateResult, value } });
  };

  newPwdChange = changedValue => {
    const { newPwd, currentPwd } = this.state;
    const value = changedValue.target.value;
    const validateResult = this.passwordValidate(
      "newPwd",
      value,
      currentPwd.value
    );
    this.setState({ newPwd: { ...validateResult, value } });
  };

  confirmPwdChange = changedValue => {
    const { newPwd, confirmPwd } = this.state;
    const value = changedValue.target.value;
    const validateResult = this.passwordValidate(
      "confirmPwd",
      value,
      newPwd.value
    );
    this.setState({ confirmPwd: { ...validateResult, value } });
  };

  cancelClick = () => {
    this.props.change({
      leftMenuKey: "customer",
      crumb: [{ name: "客户管理", url: "/customer" }]
    });
    this.props.history.push("/customer");
  };

  confirmClick = () => {
    const { currentPwd, newPwd, confirmPwd } = this.state;
    const currentResult = this.passwordValidate("current", currentPwd.value);
    const newResult = this.passwordValidate(
      "newPwd",
      newPwd.value,
      currentPwd.value
    );
    const confirmResult = this.passwordValidate(
      "confirmPwd",
      confirmPwd.value,
      newPwd.value
    );
    this.setState({
      currentPwd: { ...currentPwd, ...currentResult },
      confirmPwd: { ...confirmPwd, ...newResult },
      newPwd: { ...newPwd, ...confirmResult }
    });
    if (
      currentPwd.status == "success" &&
      confirmPwd.status == "success" &&
      newPwd.status == "success"
    ) {
      editPwd(this.props.loginName, {
        password: currentPwd.value,
        new_password: newPwd.value,
        sure_password: confirmPwd.value
      }).then(res => {
        if (200 == res.status) {
          if (res.data.code == "1") {
            this.props.change({
              passWord: newPwd.value,
              leftMenuKey: "customer",
              crumb: [{ name: "客户管理", url: "/customer" }]
            });
            this.props.history.push("/customer");
          } else {
            this.setState({
              confirmPwd: { ...confirmPwd, help: res.data.msg }
            });
          }
        }
      });
    }
  };

  render() {
    const { currentPwd, newPwd, confirmPwd } = this.state;
    const p = [0, 1, 2, 3, 4];

    return (
      <Layout
        push={this.props.history.push}
        children={
          <div className="customer">
            <Crumb
              crumbData={this.props.crumb}
              push={this.props.history.push}
            />
            <Form className="pwdEdit">
              <div className="title">密码修改</div>
              <div className="inputDiv first">
                <span className="leftTitle">当前密码:</span>
                <Form.Item
                  className="input"
                  validateStatus={currentPwd.status}
                  help={currentPwd.help}
                >
                  <Input
                    placeholder="请输入当前密码"
                    type="password"
                    onChange={this.currentPwdChange}
                  />
                </Form.Item>
              </div>
              <div className="inputDiv">
                <span className="leftTitle">输入新密码:</span>
                <Form.Item
                  className="input"
                  validateStatus={newPwd.status}
                  help={newPwd.help}
                >
                  <Input
                    placeholder="请输入新密码"
                    type="password"
                    onChange={this.newPwdChange}
                  />
                </Form.Item>
              </div>
              <div className="inputDiv">
                <span className="leftTitle">确认新密码:</span>
                <Form.Item
                  className="input"
                  validateStatus={confirmPwd.status}
                  help={confirmPwd.help}
                >
                  <Input
                    placeholder="请再次输入新密码"
                    type="password"
                    onChange={this.confirmPwdChange}
                  />
                </Form.Item>
              </div>
              <Form.Item className="btns">
                <Button
                  type="primary"
                  className="cancel"
                  onClick={this.cancelClick}
                >
                  取消
                </Button>
                <Button
                  className="save"
                  type="primary"
                  onClick={this.confirmClick}
                >
                  保存
                </Button>
              </Form.Item>
            </Form>
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
export default connect(mapStateToProps, mapDispatchToProps)(Person);
