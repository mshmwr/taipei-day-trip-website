import { changeText } from "./ui/utils.js";
import { orderApiController } from "./api/orderApi.js";
import { dialogController, navController } from "./ui/member.js";

let thankyouModel = {
  orderInfoDOM: null,
  orderStatusDOM: null,
  queryStr: "?number=",
  init: function () {
    this.getDOM();
  },
  getDOM: function () {
    this.orderInfoDOM = document.getElementById("orderInfo");
    this.orderStatusDOM = document.getElementById("orderStatus");
  },
};

let thankyouView = {
  renderOrderInfo: async function () {
    //取得目前網址
    let url = window.location.search;
    console.log("url");
    console.log(url);
    let orderNumber = url.replace(thankyouModel.queryStr, "");
    console.log(orderNumber);

    let response = await orderApiController.doGet(orderNumber);
    console.log(response);
    if (response["success"]) {
      let data = response["message"]["data"];
      let statusStr =
        data["status"] === 0 ? "尚未付款" : "完成付款，以下是您的訂單資訊：";
      changeText(thankyouModel.orderStatusDOM, statusStr);
      changeText(thankyouModel.orderInfoDOM, data["number"]);
    }
  },
};

let thankyouController = {
  init: async function () {
    thankyouModel.init();
    thankyouView.renderOrderInfo();
    await navController.checkUserLogin(); //一進入頁面就先確認使用者登入狀態
  },
};

function init() {
  dialogController.init();
  navController.init();
  thankyouController.init();
}

window.onload = function () {
  init();
};
