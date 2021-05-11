//import js file
let newscript = document.createElement("script");
newscript.setAttribute("type", "text/javascript");
newscript.setAttribute("src", "../static/js/dataManager.js");
let head = document.getElementsByTagName("head")[0];
head.appendChild(newscript);

//api
let currentPage = 0;

//fetch
let nextPage = 0;
let isfetchFinished = false;
let fetchFinishedID;
// let parsedData = null;
let isLoadFinished = false;
let isLoading = false;

//scroll to bottom
let attractionGroup; //window element
let isBottom = false;
let loadNextID;

//keyword search
let searchBtn; //window element
let searchInput; //window element
let keyword = "";

let models = {
  data: null,
  parsedData: null,
  getAttractionsData: function (url = "", keyword = "") {
    //透過 fetch 從 api 取得資料
    if (url === "") return;
    if (keyword !== "" && keyword !== undefined) {
      url += "&" + "keyword=" + keyword;
    }
    return fetch(url, {
      mode: "cors",
    })
      .then((response) => {
        return response.text();
      })
      .then((result) => {
        this.data = result;
      });
  },
  parseAttractionsData: function () {
    //Get next page (int or null) and attraction datas (Array: [img, name, MRT, category])
    if (this.data === "") return;
    let jsonData = JSON.parse(this.data);
    let nextPage = jsonData.nextPage;

    let dataList = jsonData.data;
    let attractionsArr = [];

    // Get each data: img(the first url), name, MRT, category, id
    if (dataList === undefined) return [];

    let dataListLen = dataList.length;
    for (let i = 0; i < dataListLen; i++) {
      let data = dataList[i];
      let img = data.images[0];
      let name = data.name;
      let mrt = data.mrt;
      let category = data.category;
      let id = data.id;
      attractionsArr.push([img, name, mrt, category, id]);
    }
    this.parsedData = [nextPage, attractionsArr];
  },
};

let views = {
  renderAttractions: function (attsData = []) {
    // render attraction boxes (maximum quantity: 12)
    if (attsData.length === 0) {
      attractionGroup.appendChild(
        createParagraphWithText("沒有結果", "noResult")
      );
    } else {
      this.renderBoxes(attsData);
    }
  },
  removeChildElement: function (parentElement, childClassName = "") {
    if (parentElement === undefined) return;
    let childArr = parentElement.getElementsByClassName(childClassName);
    if (childArr.length === 0) return;
    for (let i = childArr.length - 1; i >= 0; i--) {
      parentElement.removeChild(childArr[i]);
    }
  },
  renderBoxes: function (itemArr = []) {
    //view
    let itemArrLen = itemArr.length;
    if (itemArrLen === 0) return;
    for (let i = 0; i < itemArrLen; i++) {
      if (i >= itemArrLen) {
        break;
      }
      attractionsViews.renderBox(itemArr, i);
    }
  },
};

let attractionsViews = {
  renderBox: function (itemArr = [], index = 0) {
    // create a attraction box
    /*
      itemArr: 景點項目資料
      index: itemArr中的第幾個項目
    */
    if (itemArr.length === 0) return;
    // 1. 建立新的 <div> 母元素: attraction
    let newDivAttraction = createElementWithClassName(undefined, "attraction");
    let id = itemArr[index][4];
    let link = route_attraction + id;
    newDivAttraction.onclick = function () {
      window.location.href = link.toString();
    };

    // 2. 建立新的 <div> 子元素: att-img, attInfo, att-border
    let newDivAttImg = createElementWithClassName(undefined, "att-img");
    newDivAttImg.style.backgroundImage = "url(" + itemArr[index][0] + ")"; //img(the first url)

    let newDivAttInfo = this.createAttInfo(
      itemArr[index][1], //name
      itemArr[index][2], //MRT
      itemArr[index][3] //category
    );
    let newDivAttBorder = createElementWithClassName(undefined, "att-border");

    // 4. 把 子元素 都加入至 母元素
    newDivAttraction.appendChild(newDivAttImg);
    newDivAttraction.appendChild(newDivAttInfo);
    newDivAttraction.appendChild(newDivAttBorder);

    // 5. 把 box 加入至 attractionGroup
    attractionGroup.appendChild(newDivAttraction);
  },

  createAttInfo: function (nameStr = "", mrtStr = "", categoryStr = "") {
    //1. 建立新的 <div> 母元素: attInfo
    let newDivAttInfo = createElementWithClassName(undefined, "attInfo");

    //2. 建立新的 <div> 子元素: att-name, att-MRT, att-category
    let newDivAttName = createElementWithClassName(undefined, "att-name");
    newDivAttName.appendChild(createParagraphWithText(nameStr, undefined));
    let newDivAttMRT = createElementWithClassName(undefined, "att-MRT");
    newDivAttMRT.appendChild(createParagraphWithText(mrtStr, undefined));
    let newDivAttCategory = createElementWithClassName(
      undefined,
      "att-category"
    );
    newDivAttCategory.appendChild(
      createParagraphWithText(categoryStr, undefined)
    );

    //3. 把 子元素 都加入至 母元素
    newDivAttInfo.appendChild(newDivAttName);
    newDivAttInfo.appendChild(newDivAttMRT);
    newDivAttInfo.appendChild(newDivAttCategory);

    return newDivAttInfo;
  },
};

function DoKeywordSearch() {
  //controller
  if (searchInput === undefined) return;
  keyword = searchInput.value;
  currentPage = 0;
  views.removeChildElement(attractionGroup, "attraction");
  views.removeChildElement(attractionGroup, "noResult");
  dataController.getAttractions(getUrl(api_attractions, currentPage), keyword);
}

function IsScrollBottom() {
  //controller
  let rect = attractionGroup.getBoundingClientRect();

  if (rect.bottom < window.innerHeight) {
    isBottom = true; //滾到最底
  }
}

function CheckAtTheBottom() {
  //controller (timer)
  loadNextID = window.setInterval(LoadNextWhenAtTheBottom, 100);
}
function LoadNextWhenAtTheBottom() {
  //controller
  if (isBottom === true && isLoadFinished === true) {
    isBottom = false;
    isLoadFinished = false;
    window.clearInterval(loadNextID);

    if (nextPage === currentPage) return;
    if (nextPage !== 0 && nextPage !== null) {
      currentPage = nextPage;
      dataController.getAttractions(
        getUrl(api_attractions, currentPage),
        keyword
      );
    }
  }
}

function checkFetch() {
  //controller (timer)
  fetchFinishedID = window.setInterval(fetchFinished, 100);
}
function fetchFinished() {
  //controller
  if (isfetchFinished === true) {
    window.clearInterval(fetchFinishedID);
    setNextPage(models.parsedData[0]);
    views.renderAttractions(models.parsedData[1]);

    isfetchFinished = false;
    isLoadFinished = true;
  }
}

let dataController = {
  init: function () {
    this.getAttractions(getUrl(api_attractions, currentPage), undefined);
  },
  getAttractions: function (url = "", keyword = "") {
    isfetchFinished = false;
    checkFetch();
    CheckAtTheBottom();
    models.getAttractionsData(url, keyword).then(function () {
      models.parseAttractionsData();
      isfetchFinished = true;
    });
  },
};

let dialogModel = {
  navLoginRegisterDOM: null,
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
    this.navLoginRegisterDOM = document.getElementById("loginRegister");
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

    //nav: show dialog
    dialogModel.navLoginRegisterDOM.addEventListener("click", function () {
      dialogModel.dialogDOM.style.display = "block";
    });

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
      dialogModel.navLoginRegisterDOM,
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
    let method = {
      method: "PATCH",
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
  apiDelete: function () {
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

  parseGetData: function () {
    //Get user's data
    if (this.data === "") return;
    let jsonData = JSON.parse(this.data);
    let dataDic = jsonData.data;
    this.parsedData = [dataDic.id, dataDic.name, data.email];
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
  doGet: function () {
    userApiModel.apiGet().then(function () {
      userApiModel.parseGetData();
      let parsedData = userApiModel.parsedData;
      console.log(
        "(id, name, email) = (" +
          parsedData.id +
          ", " +
          parsedData.name +
          ", " +
          parsedData.email +
          ")"
      );
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
      if (parsedData["ok"]) {
        console.log("fetch成功! apiDelete");
      } else {
        console.log(
          "Oh No! Something went wrong with the server or at the 'doDelete' state"
        );
      }
    });
  },
};

//some useful function

function createElementWithClassName(elementType = "div", className = "") {
  let newElement = document.createElement(elementType);
  newElement.className = className;
  return newElement;
}

function createParagraphWithText(paragraphText = "", className = "") {
  let newParagraph = document.createElement("p");
  newParagraph.className = className;
  let textNode = document.createTextNode(paragraphText);
  newParagraph.appendChild(textNode);
  return newParagraph;
}

function getNextPage() {
  return nextPage;
}

function setNextPage(next) {
  nextPage = next;
}
function getUrl(api = "/api/attractions?", currentPage = 0) {
  let url = api + "page=" + currentPage;
  return url;
}

//INNERTEXT與TEXTCONTENT的跨瀏覽器處理
function changeText(elem, changeValue = "") {
  let hasInnerText =
    document.getElementsByTagName("body")[0].innerText !== undefined
      ? true
      : false;

  if (!hasInnerText) {
    elem.textContent = changeValue;
  } else {
    elem.innerText = changeValue;
  }
}

window.onload = function () {
  attractionGroup = document.getElementById("attractionGroup");
  searchInput = document.getElementById("searchInput");
  searchBtn = document.getElementById("searchBtn");

  window.addEventListener("scroll", IsScrollBottom, true);
  searchBtn.addEventListener("click", DoKeywordSearch);

  //initial
  dataController.init();
  dialogController.init();
};
