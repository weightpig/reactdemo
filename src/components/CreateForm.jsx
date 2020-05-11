import React, { Component } from "react";
import { DatePicker, Button, Select, Form, Input, Radio } from "antd";
import "../containers/CreateAuthor/CreateAuthor.scss";
import {
  getCustomerData,
  createAuthorPost,
  getAuthorDetail
} from "../../common/api.js";
import { formatDate } from "../../common/tools.js";
import moment from "moment";

const { Option } = Select;
const { TextArea } = Input;

class CreateForm extends Component {
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
    radioValue: "0",
    textAreaValue: ""
  };

  componentWillMount() {
    this.getContractNum();
  }

  componentDidMount() {
    const { customerId, customernoAndname, type } = this.props;
    if (type == "customer") {
      //客户管理的新建
      this.props.form.setFieldsValue({
        contractNo: customernoAndname
      });
      this.setState({
        selectValue: customernoAndname
      });
    } else if (type == "edit") {
      this.getData();
    }
  }

  getData = () => {
    const {} = this.state;
    getAuthorDetail(this.props.authorId).then(res => {
      if (res.status == 200 && res.data.code == "1") {
        const data = res.data.data;
        this.setState({
          selectValue: data.contractno + "|" + data.contractname,
          authoObject: data.authoObject,
          contractNoValue: "1",
          authorNum: data.authonum,
          startTime: data.startat,
          endTime: data.asofat,
          radioValue: String(data.overaction),
          textAreaValue: data.note
        });
        this.props.form.setFieldsValue({
          contractNo: data.contractno + "|" + data.contractname,
          authoObject: data.authoobject,
          startTime: moment(
            formatDate(data.startat * 1000, "y-m-d").replace("-", "/"),
            "YYYY/MM/DD"
          ),
          endTime: moment(
            formatDate(data.asofat * 1000, "y-m-d").replace("-", "/"),
            "YYYY/MM/DD"
          )
        });
      }
    });
  };

  //获取合同编号数据
  getContractNum = () => {
    const { contractNoValue } = this.state;
    getCustomerData({
      type: "contractNo",
      value: contractNoValue
    }).then(res => {
      const OptionData = [];
      if (res.status == 200 && res.data.code == "1") {
        res.data.data.map((item, idx) => {
          OptionData.push({
            value: item.contractno + "|" + item.contractname,
            text: item.contractno + "|" + item.contractname
          });
        });
      }
      this.setState({
        OptionData
      });
    });
  };

  selectChange = value => {
    this.setState({
      selectValue: value
    });
  };

  authoObjectChange = value => {
    this.setState({
      authoObject: value.target.value.substring(0, 30)
    });
    this.props.form.setFieldsValue({
      authoObject: value.target.value.substring(0, 30)
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const authorNumFlag = this.authorNumValidata();
    this.props.form.validateFields((err, values) => {
      if (!err && authorNumFlag) {
        this.confirmCreate();
      }
    });
  };

  // 新建授权
  confirmCreate = () => {
    const {
      selectValue,
      authoObject,
      authorNum,
      startTime,
      endTime,
      textAreaValue,
      radioValue
    } = this.state;
    createAuthorPost(
      {
        contractNo: selectValue.split("|")[0],
        contractName: selectValue.split("|")[1],
        authoObject,
        authoProduct: "0",
        authoType: "0",
        authoNum: String(authorNum),
        startAt: String(startTime),
        overAction: radioValue,
        asofAt: !endTime ? "1999999999" : String(endTime),
        note: textAreaValue
      },
      this.props.type,
      this.props.authorId
    ).then(res => {
      if (res.status == 200 && res.data.code == "1") {
        const crumb = this.props.crumb;
        this.props.change({
          crumb: crumb.splice(0, crumb.length - 1)
        });
        window.history.go(-1);
      }
    });
  };

  // 授权数量改变事件
  authorNumChange = changeValue => {
    const value = changeValue.target.value;
    if ((value > 0 && value <= 10000) || value == "") {
      this.setState({
        authorNum: value,
        authorNumStatus: "success",
        authorNumHelp: ""
      });
    } else {
      this.setState({
        authorNumStatus: "error",
        authorNumHelp: "最大不允许超过10000"
      });
      setTimeout(() => {
        this.setState({
          authorNumStatus: "success",
          authorNumHelp: ""
        });
      }, 1000);
    }
  };

  //授权数量校验事件
  authorNumValidata = () => {
    const { authorNum } = this.state;
    let flag = false;
    if (!authorNum) {
      this.setState({
        authorNumStatus: "error",
        authorNumHelp: "请输入数量"
      });
    } else {
      flag = true;
      this.setState({
        authorNumStatus: "success",
        authorNumHelp: ""
      });
    }
    return flag;
  };

  startTimeChange = (time, timeString) => {
    this.setState({
      startTime: Math.round(Date.parse(timeString) / 1000),
      startValue: time
    });
  };

  endTimeChange = (time, timeString) => {
    this.setState({
      endTime: Math.round(Date.parse(timeString) / 1000),
      endValue: time
    });
  };

  disabledStartDate = startValue => {
    const { endValue } = this.state;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = endValue => {
    const { startValue } = this.state;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  textAreaChange = chageValue => {
    const value = chageValue.target.value;
    this.setState({
      textAreaValue: value.substring(0, 500)
    });
  };

  radioOnChange = e => {
    this.setState({
      radioValue: e.target.value
    });
  };

  cancelClick = () => {
    const crumb = this.props.crumb;
    this.props.change({
      crumb: crumb.splice(0, crumb.length - 1)
    });
    window.history.go(-1);
  };

  render() {
    const {
      authorNumStatus,
      authorNumHelp,
      OptionData,
      selectValue,
      authoObject,
      authorNum,
      radioValue,
      textAreaValue
    } = this.state;
    let { getFieldDecorator } = this.props.form;
    const dateFormat = "YYYY-MM-DD";
    const disabledflag = this.props.type == "edit" ? true : false;
    return (
      <Form className="form" onSubmit={this.handleSubmit}>
        <div>
          <span className="leftTitle">合同编号:</span>
          <Form.Item className="formEle">
            {getFieldDecorator("contractNo", {
              rules: [{ required: true, message: "请输入合同编号!" }]
            })(
              <Select
                showSearch
                placeholder="请输入合同编号"
                value={selectValue}
                onChange={this.selectChange}
                disabled={disabledflag}
              >
                {OptionData.map(d => (
                  <Option key={d.value}>{d.text}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </div>
        <div>
          <span className="leftTitle">授权对象:</span>
          <Form.Item className="formEle">
            {getFieldDecorator("authoObject", {
              rules: [{ required: true, message: "请输入授权对象!" }]
            })(
              <Input
                placeholder="授权对象显示在授权客户端，请谨慎填写！"
                onChange={this.authoObjectChange}
                maxLength={30}
                disabled={disabledflag}
              />
            )}
          </Form.Item>
        </div>
        <div>
          <span className="leftTitle">授权产品:</span>
          <Form.Item className="formEle">
            <Select
              placeholder="请选择产品"
              style={{ width: "100%" }}
              defaultValue="0"
              disabled={disabledflag}
            >
              <Option value="0">v20专业版</Option>
            </Select>
          </Form.Item>
        </div>
        <div>
          <span className="authoType">授权类型:</span>
          <Form.Item className="formEle">
            <Radio.Group value={0} disabled={disabledflag}>
              <Radio value={0}>激活码</Radio>
              <Radio value={1} disabled>
                KMS
              </Radio>
            </Radio.Group>
          </Form.Item>
        </div>
        <div>
          <span className="authorNum">授权数量:</span>
          <Form.Item
            className="formEle"
            validateStatus={authorNumStatus}
            help={authorNumHelp}
          >
            <Input
              placeholder="请输入数量"
              value={authorNum}
              onChange={this.authorNumChange}
            />
          </Form.Item>
        </div>
        <div>
          <span className="leftTitle">开始日期:</span>
          <Form.Item className="formEle">
            {getFieldDecorator("startTime", {
              rules: [{ required: true, message: "请选择开始日期!" }]
            })(
              <DatePicker
                placeholder="请选择开始日期"
                disabledDate={this.disabledStartDate}
                onChange={this.startTimeChange}
                defaultValue={moment("2015/01/01", "YYYY/MM/DD")}
                format={"YYYY/MM/DD"}
              />
            )}
          </Form.Item>
        </div>
        <div>
          <span className="leftTitle">过期操作:</span>
          <Form.Item className="formEle">
            <Radio.Group value={radioValue} onChange={this.radioOnChange}>
              <Radio value={"0"}>终身有效</Radio>
              <Radio value={"1"}>仅系统提醒</Radio>
              <Radio value={"2"}>提醒并取消授权</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
        <div>
          <span className="leftTitle">截止日期:</span>
          <Form.Item className="formEle">
            {getFieldDecorator("endTime", {
              rules: [
                {
                  required: radioValue == "0" ? false : true,
                  message: "请选择截止日期!"
                }
              ]
            })(
              <DatePicker
                placeholder="请选择截止日期"
                disabledDate={this.disabledEndDate}
                onChange={this.endTimeChange}
                disabled={radioValue == "0" ? true : false}
              />
            )}
          </Form.Item>
        </div>
        <div>
          <span className="leftTitle">备注信息:</span>
          <Form.Item className="formEle">
            <TextArea
              className="text"
              placeholder="请输入内容500字以内"
              onChange={this.textAreaChange}
              maxLength={500}
              value={textAreaValue}
            />
          </Form.Item>
        </div>
        <Form.Item className="btns">
          <Button type="primary" className="cancel" onClick={this.cancelClick}>
            返回
          </Button>
          <Button className="create" htmlType="submit" type="primary">
            {this.props.type == "edit" ? "确定" : "创建授权"}
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
export default CreateForm = Form.create()(CreateForm);
