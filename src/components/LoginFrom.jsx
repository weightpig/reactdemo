import React, { Component } from "react";
import { Form, Icon, Input, Button } from "antd";
import { login } from "../../common/api.js";

class FilterForm extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    passwordStatus: "success",
    passwordHelp: ""
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const pwdisRight = this.passwordValidate(values.password);
      if (!err && pwdisRight) {
        login({
          account: values.account,
          password: values.password
        }).then(res => {
          if (res.status == 200) {
            if (res.data.code == "1") {
              this.props.changeStore({
                loginName: values.account,
                userid: res.data.data,
                passWord: values.password,
                leftMenuKey: "customer",
                crumb: [
                  {
                    name: "客户管理",
                    url: "/customer"
                  }
                ]
              });
              this.props.push("/customer");
            } else {
              this.setState({
                passwordHelp: res.data.msg
              });
            }
          }
        });
      }
    });
  };

  passwordChange = changedValue => {
    const value = changedValue.target.value;
    this.clearErr();
  };

  passwordValidate = value => {
    const reg = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/);
    let flag = false;
    if (!Boolean(value)) {
      this.setState({
        passwordStatus: "error",
        passwordHelp: "请输入密码！"
      });
    } else if (!reg.test(value)) {
      this.setState({
        passwordStatus: "error",
        passwordHelp: "请输入8-20位必须包含大小写字母和数字的密码！"
      });
    } else {
      flag = true;
      this.setState({
        passwordStatus: "Success",
        passwordHelp: ""
      });
    }
    return flag;
  };

  //清空错误提示
  clearErr = () => {
    this.setState({
      passwordStatus: "success",
      passwordHelp: ""
    });
  };

  render() {
    let { getFieldDecorator } = this.props.form;
    let { passwordStatus, passwordHelp } = this.state;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item className="inpForm inpH">
          {getFieldDecorator("account", {
            rules: [{ required: true, message: "请输入账号!" }]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="请输入账号"
              className="L_input"
              // onChange={this.accountChange}
            />
          )}
        </Form.Item>
        <Form.Item
          validateStatus={passwordStatus}
          help={passwordHelp}
          className="inpH"
        >
          {getFieldDecorator("password", {
            // rules: [{ required: true, message: "请输入密码！" }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              className="L_input"
              placeholder="请输入密码"
              onChange={this.passwordChange}
            />
          )}
        </Form.Item>
        <Form.Item className="L_input btn">
          {getFieldDecorator("remember", {
            valuePropName: "checked",
            initialValue: true
          })}
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            立即登录
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
export default FilterForm = Form.create()(FilterForm);
