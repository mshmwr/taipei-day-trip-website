// 會員系統: nav & dialog & api

let dialogModel = {
  dialogDOM: null,
  closeIconDOM: null,
  dialogContentDOMs: null,
  dialogMessageDOM: null,
  dialogMaskDOM: null,
  contentDOMsEnum: [
    "title",
    "name",
    "email",
    "password",
    "button",
    "loginRegister",
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
  showNameInput: function (isShow = true) {
    let index = dialogModel.getEnumIndex("name");
    if (isShow) {
      dialogModel.dialogContentDOMs[index].style.display = "none";
    } else {
      dialogModel.dialogContentDOMs[index].style.display = "block";
    }
  },
};

let dialogController = {
  contentList: null,
  index_login: dialogModel.getStateIndex("login"),
  index_name: dialogModel.getEnumIndex("name"),
  index_email: dialogModel.getEnumIndex("email"),
  index_password: dialogModel.getEnumIndex("password"),
  init: function () {
    dialogModel.init();
    this.addClickEvent();
    this.fillContent();
  },
  addClickEvent: function () {
    //get index
    let index_name = dialogModel.getEnumIndex("name");
    let index_email = dialogModel.getEnumIndex("email");
    let index_password = dialogModel.getEnumIndex("password");
    let index_button = dialogModel.getEnumIndex("button");
    let index_loginRegister = dialogModel.getEnumIndex("loginRegister");

    //close dialog
    dialogModel.closeIconDOM.addEventListener("click", function () {
      dialogModel.dialogDOM.style.display = "none";
    });
    dialogModel.dialogMaskDOM.addEventListener("click", function () {
      dialogModel.dialogDOM.style.display = "none";
    });

    // login or register button
    dialogModel.dialogContentDOMs[index_button].addEventListener(
      "click",
      () => {
        let index_login = dialogModel.getStateIndex("login");
        let isLogin =
          dialogModel.currentState === dialogModel.dialogState[index_login];
        if (isLogin) {
          let data = {
            email: dialogModel.dialogContentDOMs[index_email].value,
            password: dialogModel.dialogContentDOMs[index_password].value,
          };
          userApiController.doPatch(data);
        } else {
          let data = {
            name: dialogModel.dialogContentDOMs[index_name].value,
            email: dialogModel.dialogContentDOMs[index_email].value,
            password: dialogModel.dialogContentDOMs[index_password].value,
          };
          userApiController.doPost(data);
        }
      }
    );

    //change to login/register
    dialogModel.dialogContentDOMs[index_loginRegister].addEventListener(
      "click",
      () => {
        this.switchDialogState();
        this.fillContent();
      }
    );

    //click to hide dialogMessage

    let doms = [
      dialogModel.dialogContentDOMs[index_name],
      dialogModel.dialogContentDOMs[index_email],
      dialogModel.dialogContentDOMs[index_password],
      dialogModel.dialogContentDOMs[index_loginRegister],
    ];
    doms.forEach(function (dom) {
      dom.addEventListener("click", function () {
        dialogModel.dialogMessageDOM.style.display = "none";
      });
    });
  },
  switchDialogState: function () {
    let index_login = dialogModel.getStateIndex("login");
    let index_register = dialogModel.getStateIndex("register");
    switch (dialogModel.currentState) {
      case dialogModel.dialogState[index_login]:
        dialogModel.currentState = dialogModel.dialogState[index_register];
        break;
      case dialogModel.dialogState[index_register]:
        dialogModel.currentState = dialogModel.dialogState[index_login];
        break;
    }
  },
  fillContent: function () {
    let isLogin = true;
    let index_login = dialogModel.getStateIndex("login");
    let index_name = dialogModel.getEnumIndex("name");
    let index_email = dialogModel.getEnumIndex("email");
    let index_password = dialogModel.getEnumIndex("password");
    if (dialogModel.currentState === dialogModel.dialogState[index_login]) {
      //login
      this.contentList = dialogModel.contentList[0];
    } else {
      this.contentList = dialogModel.contentList[1];
      isLogin = false;
    }
    for (let i = 0; i < this.contentList.length; i++) {
      switch (i) {
        case index_name:
        case index_email:
        case index_password:
          dialogModel.dialogContentDOMs[i].value = "";
          break;

        default:
          changeText(dialogModel.dialogContentDOMs[i], this.contentList[i]);
          break;
      }
    }
    dialogView.showNameInput(isLogin);
  },
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
    return (
      fetch(this.apiRoute, parameters)
        // return fetch(this.apiRoute)
        .then((response) => {
          return response.text();
        })
        .then((result) => {
          this.data = result;
        })
    );
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
    console.log("parseDeleteData: ");
    console.log(this.parsedData);
  },
};

let userApiController = {
  doGet: function () {
    userApiModel.apiGet().then(function () {
      userApiModel.parseGetData();
      let parsedData = userApiModel.parsedData;
      let index = parsedData === null ? 0 : 1;
      if (parsedData === null) {
        navModel.isLogin = false;
        changeText(navModel.navUserStateDOM, navModel.userStateTexts[index]);
      } else {
        navModel.isLogin = true;
        changeText(navModel.navUserStateDOM, navModel.userStateTexts[index]);
      }
    });
  },
  doPost: function (data = {}) {
    userApiModel.apiPost(data).then(function () {
      userApiModel.parsePostData();
      let parsedData = userApiModel.parsedData;
      if (parsedData["ok"]) {
        console.log("fetch成功! apiPost");
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
    });
  },
  doPatch: function (data = {}) {
    userApiModel.apiPatch(data).then(function () {
      userApiModel.parsePatchData();
      let parsedData = userApiModel.parsedData;
      if (parsedData["ok"]) {
        console.log("fetch成功! apiPatch");
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
    });
  },
  doDelete: function () {
    userApiModel.apiDelete().then(function () {
      userApiModel.parseDeleteData();
      let parsedData = userApiModel.parsedData;
      console.log("doDelete: parsedData=");
      console.log(parsedData);
      if (parsedData["ok"]) {
        console.log("fetch成功! apiDelete");
        location.reload();
      } else {
        console.log(
          "Oh No! Something went wrong with the server or at the 'doDelete' state"
        );
      }
    });
  },
};

//nav
let navModel = {
  navUserStateDOM: null,
  navDivTextDOM: null,
  isUserLogin: true,
  userStateTexts: ["登入/註冊", "登出系統"],
  init: function () {
    this.getDom();
  },
  getDom: function () {
    this.navUserStateDOM = document.getElementById("userState");
    this.navDivTextDOM = document.getElementById("navDiv-text");
  },
};

let navController = {
  init: function () {
    navModel.init();
    this.addClickEvent();
  },
  checkUserLogin: function () {
    userApiController.doGet();
  },
  addClickEvent: function () {
    //nav: show dialog and hide dialogMessage
    navModel.navUserStateDOM.addEventListener("click", function () {
      if (navModel.isLogin === false) {
        dialogModel.dialogDOM.style.display = "block";
      } else {
        //logout
        userApiController.doDelete();
        navController.checkUserLogin();
      }
      dialogModel.dialogMessageDOM.style.display = "none";
    });

    navModel.navDivTextDOM.addEventListener("click", function () {
      document.location.assign("/");
    });
  },
};
