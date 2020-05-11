// 是否是已登录状态处理
export const dealISLogin = (account, push) => {
  // if (!account) {
  //   push("/login");
  // }
};

// 时间戳转换函数
export const formatDate = (time, type) => {
  let date = new Date(time);
  let year = toDouble(date.getFullYear());
  let month = toDouble(date.getMonth() + 1);
  let day = toDouble(date.getDate());
  let hour = toDouble(date.getHours());
  let min = toDouble(date.getMinutes());
  let second = toDouble(date.getSeconds());
  if (time === "" || time === 0) {
    return "";
  }
  if (time === "1999999999") {
    return "终身有效";
  }
  if (type == "y-m-d") {
    return year + "-" + month + "-" + day;
  } else {
    return year + "-" + month + "-" + day + " " + hour + ":" + min;
  }
};

//低于两位自动补零
export const toDouble = str => {
  let strr = String(str);
  if (strr.length < 2) {
    strr = "0" + strr;
  }
  return strr;
};

//获取地址栏后面数据参数
export const GetArgsFromHref = (sHref, sArgName) => {
  var args = sHref.split("?");
  var retval = "";

  if (args[0] == sHref) {
    /*参数为空*/
    return retval; /*无需做任何处理*/
  }
  var str = args[1];
  args = str.split("&");
  for (var i = 0; i < args.length; i++) {
    str = args[i];
    var arg = str.split("=");
    if (arg.length <= 1) continue;
    if (arg[0] == sArgName) retval = arg[1];
  }
  return retval;
};
