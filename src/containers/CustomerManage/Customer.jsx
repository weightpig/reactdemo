import React, { Component } from "react";
import Layout from "../Layout/Layout.jsx";
import Crumb from "../../components/Crumb.jsx";
import { Select, Input, Table } from "antd";
import "./Customer.scss";
import { getCustomerData } from "../../../common/api.js";
import { dealISLogin } from "../../../common/tools.js";
import { changeStore } from "../../store/actions.js";
import { connect } from "react-redux";
import PaginationOwn from "../../components/PaginationOwn.jsx";
const { Option } = Select;
const { Search } = Input;

class Customer extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    contractNo: "",
    contractName: "",
    contractType: "contractName",
    placeholder: "请输入合同名称",
    pagination: {
      current: 1
    },
    dataSource: [],
    pageNum: 1,
    pageInp: ""
  };

  columns = [
    {
      title: "合同编号",
      dataIndex: "contractno",
      key: "contractno"
    },
    {
      title: "合同名称",
      dataIndex: "contractname",
      key: "contractname"
    },

    {
      title: "销售人员",
      dataIndex: "salesname",
      key: "salesname"
    },
    {
      title: "授权订单",
      dataIndex: "authonum",
      key: "authonum"
    },
    {
      title: "操作",
      dataIndex: "id",
      key: "id",
      render: (id, record) => {
        return (
          <div className="operation">
            <span
              className="look"
              onClick={() => {
                this.toCustomerdes(id, record);
              }}
            >
              查看
            </span>
            <span
              onClick={() => {
                this.toCreateAuthor(record);
              }}
            >
              新建
            </span>
          </div>
        );
      }
    }
  ];

  componentWillMount() {
    dealISLogin(this.props.loginName, this.props.history.push);
    this.getTableData();
  }

  contractChange = value => {
    const { contractType } = this.state;
    let placeholder =
      contractType == "contractName" ? "请输入合同名称" : "请输入合同编号";
    this.setState(
      {
        contractType: value,
        placeholder
      },
      () => {
        this.getTableData();
      }
    );
  };

  searchChange = value => {
    const { contractType } = this.state;
    if (contractType == "contractName") {
      this.setState({
        contractName: value
      });
    } else {
      this.setState({
        contractNo: value
      });
    }
    Promise.resolve().then(() => {
      this.getTableData();
    });
  };

  toCustomerdes = (id, record) => {
    let crumb = this.props.crumb;
    this.props.change({
      customerId: id,
      contractDetailName: record.contractname,
      crumb: crumb.concat({
        name: "客户详情",
        url: "/customerDetails"
      }),
      customernoAndname: record.contractno + "|" + record.contractname
    });
    this.props.history.push("/customerDetails");
  };

  getTableData = () => {
    const { contractNo, contractName, contractType } = this.state;
    getCustomerData({
      type: contractType,
      value: contractType == "contractName" ? contractName : contractNo
    }).then(res => {
      let dataSource = [];
      if (res.status == 200) {
        dataSource = res.data.data == null ? [] : res.data.data;
      }
      this.setState({
        dataSource,
        pagination: {
          current: 1
        },
        pageNum: 1
      });
    });
  };

  toCreateAuthor = record => {
    let crumb = this.props.crumb;
    this.props.change({
      crumb: crumb.concat({
        name: "新建授权",
        url: "/createAuthor"
      }),
      authorPageType: "customer",
      customernoAndname: record.contractno + "|" + record.contractname
    });
    this.props.history.push("/createAuthor");
  };

  pageChange = page => {
    this.setState({
      pageNum: page,
      pagination: {
        current: page
      }
    });
  };

  //跳到某页事件
  jump = () => {
    const { pageInp, dataSource } = this.state;
    const pageNumMax = Math.ceil(dataSource.length / 10);
    const currentPage =
      Number(pageInp) > pageNumMax ? pageNumMax : Number(pageInp);
    this.setState({
      pageNum: currentPage,
      pagination: {
        current: currentPage
      },
      pageInp: ""
    });
  };

  inpChange = changeValue => {
    this.setState({
      pageInp: changeValue.target.value
    });
  };

  render() {
    const {
      placeholder,
      pagination,
      dataSource,
      pageNum,
      pageInp
    } = this.state;
    return (
      <Layout
        push={this.props.history.push}
        children={
          <div className="customer">
            <Crumb
              crumbData={this.props.crumb}
              push={this.props.history.push}
            />
            <div className="formDiv">
              <div className="form">
                <Select
                  className="contractSelect selectHeight"
                  defaultValue="contractName"
                  onChange={this.contractChange}
                >
                  <Option value="contractName">合同名称</Option>
                  <Option value="contractNo">合同编号</Option>
                </Select>
                <Search
                  className="search"
                  placeholder={placeholder}
                  onSearch={this.searchChange}
                />
              </div>
            </div>
            <div className="contractTable">
              <Table
                className="Table"
                dataSource={dataSource}
                columns={this.columns}
                pagination={pagination}
              />
              <PaginationOwn
                total={dataSource.length}
                onChange={this.pageChange}
                current={pageNum}
                jump={this.jump}
                inpChange={this.inpChange}
                inputValue={pageInp}
              />
            </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(Customer);
