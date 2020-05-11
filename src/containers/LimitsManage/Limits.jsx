import React, { Component } from "react";
import Layout from "../Layout/Layout.jsx";
import Crumb from "../../components/Crumb.jsx";
import { Select, Button, Input, Table, Modal } from "antd";
import "./Limits.scss";
import {
  getAuthorData,
  getCreatePersonData,
  down,
  stopOrOpen
} from "../../../common/api.js";
import { dealISLogin, formatDate } from "../../../common/tools.js";
import { connect } from "react-redux";
import { changeStore } from "../../store/actions.js";
import PaginationOwn from "../../components/PaginationOwn.jsx";
const { Option } = Select;

class Limits extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    authoType: null,
    createPerson: null,
    author: 0,
    authorObj: "",
    activationCode: "",
    peopleData: [],
    TotalAuthorNum: 0, //总授权
    TotalActivationNumber: "0 / 0", //总激活数量
    visible: "",
    downVisible: false,
    pageNum: 1,
    pageInp: "",
    dataSource: [],
    totalNum: 0,
    selectedRowKeys: [],
    record: {}
  };

  columns = [
    {
      title: "授权订单",
      dataIndex: "authoorder",
      key: "authoorder"
    },
    {
      title: "授权对象",
      dataIndex: "authoobject",
      key: "authoobject"
    },
    {
      title: "授权类型",
      dataIndex: "authotype",
      key: "authotype",
      render: authotype => {
        return authotype == 0 ? "激活码" : "KMS";
      }
    },
    {
      title: "创建人",
      dataIndex: "founder",
      key: "founder"
    },
    {
      title: "激活/授权数",
      dataIndex: "Num",
      key: "Num"
    },
    {
      title: "截止日期",
      dataIndex: "asofat",
      key: "asofAt",
      render: asofat => {
        return formatDate(asofat * 1000, "y-m-d");
      }
    },
    {
      title: "创建时间",
      dataIndex: "createdat",
      key: "createdat",
      render: asofat => {
        return formatDate(asofat * 1000);
      }
    },
    {
      title: "操作",
      dataIndex: "Id",
      key: "Id",
      render: (id, record) => {
        return (
          <div className="operation">
            <span
              className="look"
              onClick={() => {
                this.toDetails(id);
              }}
            >
              详情
            </span>
            <span
              className="look"
              style={
                record.codestate == 0
                  ? { color: "red" }
                  : { color: "rgba(59, 159, 255, 1)" }
              }
              onClick={() => {
                this.startOrStop(record);
              }}
            >
              {record.codestate == 0 ? "停用" : "启用"}
            </span>
            <span
              onClick={() => {
                this.showDialog(record);
              }}
            >
              下载
            </span>
          </div>
        );
      }
    }
  ];

  componentWillMount() {
    dealISLogin(this.props.loginName, this.props.history.push);
    this.getTableData();
    this.getPeopleData();
  }

  toDetails = id => {
    let crumb = this.props.crumb;
    this.props.change({
      crumb: crumb.concat({
        name: "授权详情",
        url: "/authorDetails"
      }),
      authorId: id
    });
    this.props.history.push("/authorDetails");
  };

  getPeopleData = () => {
    getCreatePersonData(this.props.loginName).then(res => {
      if (res.status == 200) {
        this.setState({
          peopleData: res.data.data == null ? [] : res.data.data
        });
      }
    });
  };

  // 重置按钮灰化判断
  reSetIsDisabled = () => {
    const { accountValue, startTime, endTime } = this.state;
    let flag = false;
    if (!accountValue && !startTime && !endTime) {
      flag = true;
    }
    this.setState({ reSetBtnDisabled: flag });
  };

  reSet = () => {
    this.setState(
      {
        authoType: null,
        createPerson: null,
        author: 0,
        authorObj: "",
        activationCode: "",
        pageNum: 1
      },
      () => {
        this.getTableData();
      }
    );
  };

  //筛选
  filter = () => {
    this.setState(
      {
        pageNum: 1
      },
      () => {
        this.getTableData();
      }
    );
  };

  getTableData = () => {
    const {
      authoType,
      createPerson,
      activationCode,
      authorObj,
      author,
      pageNum
    } = this.state;
    let params = {
      authoType,
      type: author,
      typevalue: authorObj,
      actcode: activationCode,
      founder: createPerson,
      currpage: pageNum,
      size: 10
    };
    getAuthorData(params).then(res => {
      let dataSource = [];
      let TotalAuthorNum = 0;
      let TotalActivationNumber = "0 / 0";
      let totalNum = 0;
      if (res.status == 200 && res.data.code == "1") {
        const data = res.data.data;
        const source = data.Auths == null ? [] : data.Auths;
        source.map(item => {
          dataSource.push({
            ...item,
            Num: item.activationnum + "/" + item.authonum
          });
        });
        totalNum = res.data.data.TotalCount;
        TotalAuthorNum = data.ActTotalNum;
        TotalActivationNumber = data.ActTotalNum + "/" + data.AuthTotalNum;
      }
      this.setState({
        dataSource,
        TotalAuthorNum,
        TotalActivationNumber,
        totalNum
      });
    });
  };

  createAuthor = () => {
    let crumb = this.props.crumb;
    this.props.change({
      crumb: crumb.concat({
        name: "新建授权",
        url: "/createAuthor"
      }),
      authorPageType: "create"
    });
    this.props.history.push("/createAuthor");
  };

  authorTypeChange = value => {
    this.setState({
      authoType: value
    });
  };

  createPersonChange = value => {
    this.setState({
      createPerson: value
    });
  };

  authorChange = value => {
    this.setState({
      author: value,
      authorObj: ""
    });
  };

  authorObjChange = changeValue => {
    this.setState({
      authorObj: changeValue.target.value
    });
  };

  activationChange = changeValue => {
    this.setState({
      activationCode: changeValue.target.value
    });
  };

  hideModal = () => {
    this.setState({
      visible: false
    });
  };

  confrim = () => {
    const { record } = this.state;
    stopOrOpen({
      id: record.Id,
      state: record.codestate == 0 ? 1 : 0,
      idtype: 1
    }).then(res => {
      if (res.status == 200 && res.data.code == "1") {
        this.getTableData();
        this.setState({
          visible: false
        });
      }
    });
  };

  //启用或停用
  startOrStop = data => {
    this.setState({
      visible: true
    });
    this.setState({
      record: data
    });
  };

  //下载
  showDialog = record => {
    this.setState({
      record,
      downVisible: true
    });
  };

  pageChange = page => {
    this.setState(
      {
        pageNum: page
      },
      () => {
        this.getTableData();
      }
    );
  };

  //跳到某页事件
  jump = () => {
    const { pageInp, totalNum } = this.state;
    const pageNumMax = Math.ceil(totalNum / 10);
    const currentPage =
      Number(pageInp) > pageNumMax ? pageNumMax : Number(pageInp);
    this.setState(
      {
        pageNum: currentPage,
        pageInp: ""
      },
      () => {
        this.getTableData();
      }
    );
  };

  inpChange = changeValue => {
    this.setState({
      pageInp: changeValue.target.value
    });
  };

  downHideModal = () => {
    this.setState({
      downVisible: false
    });
  };

  downConfrim = () => {
    const { record, selectedRowKeys } = this.state;
    selectedRowKeys.map(item => {
      down({
        id: record.Id,
        type: Number(item)
      });
    });
    this.setState({
      downVisible: false,
      selectedRowKeys: []
    });
  };

  downColumns = [
    {
      title: "",
      dataIndex: "text",
      key: "text",
      render: text => {
        return (
          <div className="downCodeIcon">
            <img src="../img/file-icon.svg" alt="" />
            <span>{text}</span>
          </div>
        );
      }
    },
    {
      title: "",
      dataIndex: "type",
      key: "type",
      render: type => {
        return (
          <div
            className="downIcon"
            onClick={() => {
              this.actDown(type);
            }}
          >
            <span>下载</span>
            <img src="../img/download-icon.svg" alt="" />
          </div>
        );
      }
    }
  ];
  downSource = [
    { text: "激活码", type: 0 },
    { text: "激活文件", type: 1 },
    { text: "批量激活文件", type: 2 }
  ];

  // 激活码下载事件
  actDown = type => {
    const { record } = this.state;
    if (type != 2) {
      down({
        id: record.Id,
        type
      });
    }
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  render() {
    const {
      reSetBtnDisabled,
      dataSource,
      TotalAuthorNum,
      TotalActivationNumber,
      peopleData,
      authoType,
      createPerson,
      author,
      authorObj,
      activationCode,
      visible,
      pageNum,
      pageInp,
      totalNum,
      selectedRowKeys,
      record
    } = this.state;
    const pagination = {
      current: pageNum
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.type === 2
      })
    };
    return (
      <Layout
        push={this.props.history.push}
        children={
          <div className="limits">
            <Crumb
              crumbData={this.props.crumb}
              push={this.props.history.push}
            />
            <div className="filter">
              <div>
                <span className="authorType spanMiddle">授权类型：</span>
                <Select
                  className="authorTypeSelect selectHeight"
                  onChange={this.authorTypeChange}
                  placeholder="请选择类型"
                  value={authoType}
                >
                  <Option value={0}>激活码</Option>
                  <Option value={1} disabled>
                    KMS
                  </Option>
                </Select>
                <span className="createPerson spanMiddle">创建人：</span>
                <Select
                  className="createPersonSelect selectHeight"
                  onChange={this.createPersonChange}
                  placeholder="请选择创建人"
                  value={createPerson}
                >
                  {peopleData.map(item => {
                    return <Option value={item.account}>{item.account}</Option>;
                  })}
                </Select>
                <Select
                  className="author selectHeight"
                  onChange={this.authorChange}
                  defaultValue={0}
                  value={author}
                >
                  <Option value={0}>授权对象</Option>
                  <Option value={1}>授权订单</Option>
                </Select>
                <span className="authorObj" spanMiddle>
                  -
                </span>
                <Input
                  placeholder="请输入授权对象"
                  className="authorObjInp spanMiddle"
                  onChange={this.authorObjChange}
                  value={authorObj}
                />
              </div>
              <div className="filterChild">
                <span className="activationCode">激活码：</span>
                <Input
                  placeholder="请输入激活码"
                  className="activationCodeInp"
                  onChange={this.activationChange}
                  value={activationCode}
                />
                <Button
                  type="primary"
                  className="reSetBtn cancelBtnText"
                  disabled={reSetBtnDisabled}
                  onClick={this.reSet}
                >
                  重置
                </Button>
                <Button
                  type="primary"
                  className="filterBtn"
                  onClick={this.filter}
                >
                  筛选
                </Button>
              </div>
            </div>
            <div className="DetailTable">
              <div className="statics">
                <span className="firstspan">
                  总授权：<i>{TotalAuthorNum}</i>
                </span>
                <span>
                  总激活数量：<i>{TotalActivationNumber}</i>
                </span>
                <Button
                  className="addbtn"
                  type="primary"
                  icon="plus"
                  onClick={this.createAuthor}
                >
                  新建授权
                </Button>
              </div>
              <Table
                dataSource={dataSource}
                columns={this.columns}
                pageNum={pageNum}
                pagination={pagination}
                className="authorTable"
              />
              <PaginationOwn
                total={totalNum}
                onChange={this.pageChange}
                current={pageNum}
                jump={this.jump}
                inpChange={this.inpChange}
                inputValue={pageInp}
              />
            </div>
            <Modal
              title="提示"
              centered
              visible={this.state.visible}
              onOk={this.confrim}
              onCancel={this.hideModal}
              okText="确定"
              cancelText="取消"
              className="dialog"
              maskClosable={false}
            >
              <div className="modalTxt">
                {record.codestate == 0 ? "确定停用授权吗" : "确定启用授权吗？"}
              </div>
            </Modal>
            <Modal
              title="下载"
              centered
              visible={this.state.downVisible}
              onOk={this.downConfrim}
              onCancel={this.downHideModal}
              okText="确定"
              cancelText="取消"
              className="down"
              maskClosable={false}
            >
              <div className="authordiv">
                <span className="leftTitle">授权订单：</span>
                <span className="content">{record.authoorder}</span>
              </div>
              <div>
                <span className="leftTitle">授权对象：</span>
                <span className="content">{record.authoobject}</span>
              </div>
              <Table
                rowSelection={rowSelection}
                className="downTable"
                columns={this.downColumns}
                dataSource={this.downSource}
              />
            </Modal>
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
export default connect(mapStateToProps, mapDispatchToProps)(Limits);
