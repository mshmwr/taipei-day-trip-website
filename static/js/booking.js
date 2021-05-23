import { changeText } from "./ui/utils.js";
import { bookingApiController } from "./api/bookingApi.js";
import {
  dialogController,
  navController,
  navModel,
  userModel,
} from "./ui/member.js";

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
    console.log(response["message"]);
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
  },
};

let bookingView = {
  renderBookingContent: async function () {
    await bookingModel.getBookingData().then(() => {
      let datas = bookingModel.bookingData["data"];
      changeText(bookingModel.userNameDOM, userModel.userName);

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
    if (navModel.isUserLogin === false) {
      document.location.assign("/");
    }
  },
  getBooking: function () {
    bookingView.renderBookingContent();
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
    console.log(response["message"]);
  },
};

function init() {
  dialogController.init();
  navController.init();
  bookingController.init();
}

window.onload = function () {
  init();
};
