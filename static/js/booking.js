import { changeText } from "./ui/utils.js";
import { bookingApiController } from "./api/bookingApi.js";
import { orderApiController } from "./api/orderApi.js";
import { dialogController, navController, getData } from "./ui/member.js";

let bookingModel = {
  bookingData: null,
  titleDOM: null,
  dateDOM: null,
  timeDOM: null,
  priceDOM: null,
  addressDOM: null,
  attractionImgDOM: null,
  deleteIconDOM: null,
  bookingContentDOM: null,
  noOrderDOM: null,
  footerDOM: null,
  footerHeight: "104px",
  userNameDOM: null,
  contactContentDOMs: null,
  contacts: ["name", "email", "phone"],
  init: function () {
    this.getDOM();
  },
  getBookingData: async function () {
    let response = await bookingApiController.doGet();
    if (response["success"]) {
      this.bookingData = response["message"];
      return;
    }
    this.bookingData = null;
  },
  getDOM: function () {
    this.titleDOM = document.getElementById("title");
    this.dateDOM = document.getElementById("date");
    this.timeDOM = document.getElementById("time");
    this.priceDOM = document.getElementById("price");
    this.addressDOM = document.getElementById("address");
    this.attractionImgDOM = document.getElementById("attractionImg");
    this.deleteIconDOM = document.getElementById("delete-icon");
    this.bookingContentDOM = document.getElementById("bookingContent");
    this.noOrderDOM = document.getElementById("noOrder");
    this.footerDOM = document.getElementsByTagName("footer")[0];
    this.userNameDOM = document.getElementById("userName");

    this.contactContentDOMs = document.getElementsByClassName("contactContent");
  },
};

let bookingView = {
  renderBookingContent: async function () {
    await bookingModel.getBookingData().then(() => {
      let datas = bookingModel.bookingData["data"];
      changeText(bookingModel.userNameDOM, getData.getUserName());

      if (datas === null) {
        bookingModel.bookingContentDOM.style.display = "none";
        bookingModel.noOrderDOM.style.display = "block";
        bookingModel.footerDOM.style.height = "100%";
        return;
      }

      bookingModel.bookingContentDOM.style.display = "block";
      bookingModel.noOrderDOM.style.display = "none";
      bookingModel.footerDOM.style.height = bookingModel.footerHeight;
      let data_attraction = datas["attraction"];
      let data_name = data_attraction["name"];
      let data_address = data_attraction["address"];
      let data_image = data_attraction["images"];

      let data_date = datas["date"];
      let data_time =
        datas["time"] === "morning"
          ? "早上 9 點到下午 2 點"
          : "下午 2 點到晚上 9 點";
      let data_price = "新台幣 " + datas["price"] + " 元";

      changeText(bookingModel.titleDOM, data_name);
      changeText(bookingModel.dateDOM, data_date);
      changeText(bookingModel.timeDOM, data_time);
      changeText(bookingModel.priceDOM, data_price);
      changeText(bookingModel.addressDOM, data_address);
      bookingModel.attractionImgDOM.setAttribute("src", data_image);
    });
  },
  renderContactContent: function () {
    let contacts = bookingModel.contacts;
    bookingModel.contactContentDOMs[contacts.indexOf("name")].value =
      getData.getUserName();
    bookingModel.contactContentDOMs[contacts.indexOf("email")].value =
      getData.getUserEmail();
  },
};

let bookingController = {
  init: async function () {
    await navController.checkUserLogin(); //一進入頁面就先確認使用者登入狀態
    this.checkUserState();
    bookingModel.init();
    this.getBooking();
    this.addClickEvent();
  },
  checkUserState: async function () {
    if (getData.getIsUserLogin() === false) {
      document.location.assign("/");
    }
  },
  getBooking: function () {
    bookingView.renderBookingContent();
    bookingView.renderContactContent();
  },
  addClickEvent: function () {
    bookingModel.deleteIconDOM.addEventListener("click", () => {
      this.deleteBooking();
    });
  },
  deleteBooking: async function () {
    let response = await bookingApiController.doDelete();
    if (response["success"]) {
      location.reload();
      return;
    }
  },
};

let orderModel = {
  orderNumber: null,
  orderStatus: null,
  confirmButtonDOM: null,
  init: function () {
    this.getDOM();
  },
  getDOM: function () {
    this.confirmButtonDOM = document.getElementById("confirmButton");
  },
};

let orderController = {
  init: function () {
    orderModel.init();
    this.addClickEvent();
  },
  createOrder: async function (prime) {
    let datas = bookingModel.bookingData["data"];
    let data_attraction = datas["attraction"];
    let data_id = data_attraction["id"];
    let data_name = data_attraction["name"];
    let data_address = data_attraction["address"];
    let data_image = data_attraction["images"];

    let data_date = datas["date"];
    let data_time = datas["time"];
    let data_price = datas["price"];

    let attractionData = {
      id: data_id,
      name: data_name,
      address: data_address,
      image: data_image,
    };
    let tripData = {
      attraction: attractionData,
      date: data_date,
      time: data_time,
    };
    let contactData = {
      name: bookingModel.contactContentDOMs[0].value,
      email: bookingModel.contactContentDOMs[1].value,
      phone: bookingModel.contactContentDOMs[2].value,
    };
    let orderData = {
      price: data_price,
      trip: tripData,
      contact: contactData,
    };
    let createData = {
      prime: prime,
      order: orderData,
    };
    let response = await orderApiController.doPost(createData);
    if (response["success"]) {
      let data = response["message"]["data"];
      orderModel.orderNumber = data["number"];
      orderModel.orderStatus =
        data["payment"]["status"] === 0 ? "未付款" : "已付款";
    } else {
      console.log(response["message"]);
    }

    return orderModel.orderNumber;
  },

  addClickEvent: function () {
    orderModel.confirmButtonDOM.addEventListener("click", () => {
      onSubmit();
    });
  },
};

function init() {
  dialogController.init();
  navController.init();
  bookingController.init();
  orderController.init();
}

window.onload = function () {
  init();
};

//-------------------------------

function onSubmit(event) {
  // event.preventDefault();

  // 取得 TapPay Fields 的 status
  const tappayStatus = TPDirect.card.getTappayFieldsStatus();

  // 確認是否可以 getPrime
  if (tappayStatus.canGetPrime === false) {
    alert("can not get prime");
    return;
  }

  // Get prime
  TPDirect.card.getPrime(async (result) => {
    if (result.status !== 0) {
      alert("get prime error " + result.msg);
      return;
    }

    // send prime to your server, to pay with Pay by Prime API .
    // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
    let orderNumber = await orderController.createOrder(result.card.prime);

    document.location.assign("/thankyou?number=" + orderNumber);
  });
}
