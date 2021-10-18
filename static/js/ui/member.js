import { changeText } from "./utils.js";
// 會員系統: nav & dialog & api

let dialogModel = {
  dialogDOM: null,
  closeIconDOM: null,
  dialogContentDOMs: null,
  dialogMessageDOM: null,
  dialogMaskDOM: null,
  contentDOMsEnum: [
    "title", //0
    "name", //1
    "email", //2
    "password", //3
    "button", //4
    "loginRegister", //5
  ],
  dialogState: ["login", "register"],
  currentState: null,
  contentList: [
    [
      "登入會員帳號",
      "",
      "輸入電子信箱",
      "輸入密碼",
      "登入帳戶",
      "還沒有帳戶？點此註冊",
    ],
    [
      "註冊會員帳號",
      "輸入姓名",
      "輸入電子郵件",
      "輸入密碼",
      "註冊新帳戶",
      "已經有帳戶了？點此登入",
    ],
  ],
  init: function () {
    let index_login = this.getStateIndex("login");
    this.currentState = this.dialogState[index_login];
    this.getDOM();
  },
  getDOM: function () {
    this.dialogContentDOMs = document.getElementsByClassName("dialogContent");
    this.closeIconDOM = document.getElementById("closeIcon");
    this.dialogDOM = document.getElementById("dialog");
    this.dialogMessageDOM = document.getElementById("dialogMessage");
    this.dialogMaskDOM = document.getElementById("dialogMask");
  },
  getEnumIndex: function (item = "") {
    return this.contentDOMsEnum.indexOf(item);
  },
  getStateIndex: function (item = "") {
    return this.dialogState.indexOf(item);
  },
};

let dialogView = {
  showNameInput: function (isShow = true, index_name) {
    if (isShow) {
      dialogModel.dialogContentDOMs[index_name].style.display = "none";
    } else {
      dialogModel.dialogContentDOMs[index_name].style.display = "block";
    }
  },
};

let dialogController = {
  contentList: null,
  index_login: dialogModel.getStateIndex("login"),
  index_register: dialogModel.getStateIndex("register"),
  index_name: dialogModel.getEnumIndex("name"),
  index_email: dialogModel.getEnumIndex("email"),
  index_password: dialogModel.getEnumIndex("password"),
  index_loginRegister: dialogModel.getEnumIndex("loginRegister"),
  index_button: dialogModel.getEnumIndex("button"),
  init: function () {
    dialogModel.init();
    this.addClickEvent();
    this.fillContent();
  },
  addClickEvent: function () {
    this.clickEvent_closeDialog();
    this.clickEvent_loginRegisterButton();
    this.clickEvent_changeNavLoginRegister();
    this.clickEvent_hideDialogMessage();
  },
  switchDialogState: function () {
    switch (dialogModel.currentState) {
      case dialogModel.dialogState[this.index_login]:
        dialogModel.currentState = dialogModel.dialogState[this.index_register];
        break;
      case dialogModel.dialogState[this.index_register]:
        dialogModel.currentState = dialogModel.dialogState[this.index_login];
        break;
    }
  },
  fillContent: function () {
    let isLogin = true;
    if (
      dialogModel.currentState === dialogModel.dialogState[this.index_login]
    ) {
      //login
      this.contentList = dialogModel.contentList[0];
    } else {
      this.contentList = dialogModel.contentList[1];
      isLogin = false;
    }
    for (let i = 0; i < this.contentList.length; i++) {
      switch (i) {
        case this.index_name:
        case this.index_email:
        case this.index_password:
          dialogModel.dialogContentDOMs[i].value = "";
          break;
        case this.index_button:
          dialogModel.dialogContentDOMs[i].value = this.contentList[i];

        default:
          changeText(dialogModel.dialogContentDOMs[i], this.contentList[i]);
          break;
      }
    }
    dialogView.showNameInput(isLogin, this.index_name);
  },
  clickEvent_closeDialog: function () {
    //close dialog
    dialogModel.closeIconDOM.addEventListener("click", function () {
      dialogModel.dialogDOM.style.display = "none";
    });
    dialogModel.dialogMaskDOM.addEventListener("click", function () {
      dialogModel.dialogDOM.style.display = "none";
    });
  },
  clickEvent_loginRegisterButton: function () {
    // login or register button
    dialogModel.dialogContentDOMs[this.index_button].addEventListener(
      "click",
      async (e) => {
        let isLogin =
          dialogModel.currentState ===
          dialogModel.dialogState[this.index_login];
        if (isLogin) {
          let data = {
            email: dialogModel.dialogContentDOMs[this.index_email].value,
            password: dialogModel.dialogContentDOMs[this.index_password].value,
          };

          //check form input is empty
          let empty = document
            .getElementById("dialogForm")
            .querySelectorAll("[required]");
          empty = Array.from(empty).filter((item) => {
            return item.value === "" && item.style.display !== "none";
          });
          if (empty.length === 0) {
            e.preventDefault();
            let parsedData = await userApiController.doPatch(data);
            if (parsedData["ok"]) {
              dialogModel.dialogMessageDOM.style.display = "block";
              dialogModel.dialogMessageDOM.style.color = "#32cd32";
              changeText(dialogModel.dialogMessageDOM, "登入成功");
              navController.checkUserLogin();
              location.reload();
            } else if (parsedData["error"]) {
              dialogModel.dialogMessageDOM.style.display = "block";
              dialogModel.dialogMessageDOM.style.color = "#ff0000";
              changeText(dialogModel.dialogMessageDOM, parsedData["message"]);
            } else {
              console.log(
                "Oh No! Something went wrong with the server or at the 'doPatch' state"
              );
            }
          }
        } else {
          let data = {
            name: dialogModel.dialogContentDOMs[this.index_name].value,
            email: dialogModel.dialogContentDOMs[this.index_email].value,
            password: dialogModel.dialogContentDOMs[this.index_password].value,
          };
          //check input is empty
          let empty = document
            .getElementById("dialogForm")
            .querySelectorAll("[required]");
          empty = Array.from(empty).filter((item) => {
            return item.value === "" && item.style.display !== "none";
          });
          if (empty.length === 0) {
            e.preventDefault();
            let parsedData = await userApiController.doPost(data);
            if (parsedData["ok"]) {
              dialogModel.dialogMessageDOM.style.display = "block";
              dialogModel.dialogMessageDOM.style.color = "#32cd32";
              changeText(dialogModel.dialogMessageDOM, "註冊成功");
            } else if (parsedData["error"]) {
              dialogModel.dialogMessageDOM.style.display = "block";
              dialogModel.dialogMessageDOM.style.color = "#ff0000";
              changeText(dialogModel.dialogMessageDOM, parsedData["message"]);
            } else {
              console.log(
                "Oh No! Something went wrong with the server or at the 'doPost' state"
              );
            }
          }
        }
      }
    );
  },
  clickEvent_changeNavLoginRegister: function () {
    //change nav button text to login/register
    dialogModel.dialogContentDOMs[this.index_loginRegister].addEventListener(
      "click",
      () => {
        this.switchDialogState();
        this.fillContent();
      }
    );
  },
  clickEvent_hideDialogMessage: function () {
    //click to hide dialogMessage
    let doms = [
      dialogModel.dialogContentDOMs[this.index_name],
      dialogModel.dialogContentDOMs[this.index_email],
      dialogModel.dialogContentDOMs[this.index_password],
      dialogModel.dialogContentDOMs[this.index_loginRegister],
    ];
    doms.forEach(function (dom) {
      dom.addEventListener("click", function () {
        dialogModel.dialogMessageDOM.style.display = "none";
      });
    });
  },
};

let userModel = {
  userName: null,
  userEmail: null,
};

//api
let userApiModel = {
  data: null,
  parsedData: null,
  apiRoute: "/api/user",
  requestParameters: {
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "user-agent": "Mozilla/4.0 MDN Example",
      "content-type": "application/json",
    },
    mode: "cors",
    redirect: "follow",
    referrer: "no-referrer",
  },
  apiGet: function () {
    let parameters = { mode: "cors" };
    let method = { method: "GET" };
    parameters = Object.assign(parameters, method);
    return fetch(this.apiRoute, parameters)
      .then((response) => {
        return response.text();
      })
      .then((result) => {
        this.data = result;
      });
  },
  apiPost: function (data = {}) {
    let parameters = JSON.parse(JSON.stringify(this.requestParameters)); //deep copy
    let method = {
      method: "POST",
    };
    parameters = { body: JSON.stringify(data), ...method, ...parameters };
    return fetch(this.apiRoute, parameters)
      .then((response) => {
        return response.text();
      })
      .then((result) => {
        this.data = result;
      });
  },
  apiPatch: function (data = {}) {
    let parameters = JSON.parse(JSON.stringify(this.requestParameters)); //deep copy
    let method = { method: "PATCH" };
    parameters = { body: JSON.stringify(data), ...method, ...parameters };

    return fetch(this.apiRoute, parameters)
      .then((response) => {
        return response.text();
      })
      .then((result) => {
        this.data = result;
      });
  },
  apiDelete: function () {
    let parameters = { mode: "cors" };
    let method = { method: "DELETE" };
    parameters = Object.assign(parameters, method);
    return fetch(this.apiRoute, parameters)
      .then((response) => {
        return response.text();
      })
      .then((result) => {
        this.data = result;
      });
  },

  parseGetData: function () {
    //Get user's data
    if (this.data === "") return;
    let jsonData = JSON.parse(this.data);
    let dataDic = jsonData.data;
    if (dataDic === null) this.parsedData = null;
    else {
      this.parsedData = [dataDic.id, dataDic.name, dataDic.email];
      userModel.userName = dataDic.name;
      userModel.userEmail = dataDic.email;
    }
  },
  parsePostData: function () {
    if (this.data === "") return;
    this.parsedData = JSON.parse(this.data);
  },
  parsePatchData: function () {
    if (this.data === "") return;
    this.parsedData = JSON.parse(this.data);
  },
  parseDeleteData: function () {
    if (this.data === "") return;
    this.parsedData = JSON.parse(this.data);
  },
};

let userApiController = {
  doGet: async function () {
    let isGet = false;
    await userApiModel.apiGet().then(() => {
      userApiModel.parseGetData();

      let parsedData = userApiModel.parsedData;
      isGet = parsedData !== null;
    });
    return isGet;
  },
  doPost: async function (data = {}) {
    await userApiModel.apiPost(data).then(function () {
      userApiModel.parsePostData();
    });
    return userApiModel.parsedData;
  },
  doPatch: async function (data = {}) {
    await userApiModel.apiPatch(data).then(function () {
      userApiModel.parsePatchData();
    });
    return userApiModel.parsedData;
  },
  doDelete: async function () {
    await userApiModel.apiDelete().then(function () {
      userApiModel.parseDeleteData();
    });
    return userApiModel.parsedData;
  },
};

//nav
let navModel = {
  navUserStateDOM: null,
  navDivTextDOM: null,
  navBookingDOM: null,
  isUserLogin: false,
  userStateTexts: ["登入/註冊", "登出系統"],
  init: function () {
    this.getDom();
  },
  getDom: function () {
    // 新舊相容: 有 Web Component 版 和 document.write版

    /* logo */
    const navDivTextRoot = document.querySelector("my-logo");
    this.navDivTextDOM =
      navDivTextRoot === null
        ? document.querySelector("#navDiv-logo")
        : navDivTextRoot.shadowRoot.querySelector("#navDiv-logo");

    /* navBooking */
    const navBookingRoot = document.querySelectorAll("my-button")[0];
    this.navBookingDOM =
      navBookingRoot === undefined
        ? document.querySelector("#navBooking")
        : navBookingRoot.shadowRoot.querySelector("#navBooking");

    /* userState */
    const navUserStateRoot = document.querySelectorAll("my-button")[1];
    this.navUserStateDOM =
      navUserStateRoot === undefined
        ? document.querySelector("#userState")
        : navUserStateRoot.shadowRoot.querySelector("#userState");
  },
};

let navController = {
  init: function () {
    navModel.init();
    this.addClickEvent();
  },
  checkUserLogin: async function () {
    let isGet = await userApiController.doGet();
    navModel.isUserLogin = isGet;

    //change navbar user state
    let index = isGet ? 1 : 0;
    changeText(navModel.navUserStateDOM, navModel.userStateTexts[index]);
  },
  addClickEvent: function () {
    this.clickEvent_logout();
    this.clickEvent_navBooking();
    this.clickEvent_logo();
  },
  clickEvent_logout: function () {
    navModel.navUserStateDOM.addEventListener("click", async () => {
      if (navModel.isUserLogin === false) {
        dialogModel.dialogDOM.style.display = "block";
      } else {
        //logout
        let parsedData = await userApiController.doDelete();
        if (parsedData["ok"]) {
          location.reload();
        } else {
          console.log(
            "Oh No! Something went wrong with the server or at the 'doDelete' state"
          );
        }

        navController.checkUserLogin();
      }
      dialogModel.dialogMessageDOM.style.display = "none";
    });
  },
  clickEvent_navBooking: function () {
    navModel.navBookingDOM.addEventListener("click", function () {
      if (navModel.isUserLogin === false) {
        dialogModel.dialogDOM.style.display = "block";
        dialogModel.dialogMessageDOM.style.display = "none";
      } else {
        document.location.assign("/booking");
      }
    });
  },
  clickEvent_logo: function () {
    navModel.navDivTextDOM.addEventListener("click", () => {
      document.location.assign("/");
    });
  },
};

let getData = {
  getUserName: function () {
    return userModel.userName;
  },
  getUserEmail: function () {
    return userModel.userEmail;
  },
  getIsUserLogin: function () {
    return navModel.isUserLogin;
  },
  getDialogDOMs: function () {
    return {
      dialogDOM: dialogModel.dialogDOM,
      dialogMessageDOM: dialogModel.dialogMessageDOM,
    };
  },
};

export { dialogController, navController, getData };
