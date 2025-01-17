import {
  createElementWithClassName,
  createParagraphWithText,
} from "./ui/utils.js";
import { indexApiController } from "./api/indexApi.js";
import { apiModel } from "./api/apiParameters.js";

import { dialogController, navController } from "./ui/member.js";

let indexModel = {
  data: null,
  boundingClientRect: null,
  isFirst: true,
  keyword: "",
  nextPage: 0,
  currentPage: 0,
  searchBtnDOM: null,
  searchInputDOM: null,
  attractionGroupDOM: null,
  loadingDOM: null,
  loadingMorePageDOM: null,
  init: function () {
    this.getDOM();
  },
  getDOM: function () {
    this.searchBtnDOM = document.getElementById("searchBtn");
    this.searchInputDOM = document.getElementById("searchInput");
    this.attractionGroupDOM = document.getElementById("attractionGroup");
    this.loadingDOM = document.getElementById("loading");
    this.loadingMorePageDOM = document.getElementById("loadingMorePage");
  },
};

let indexView = {
  renderAttractions: function (attsData = []) {
    // render attraction boxes (maximum quantity: 12)
    if (attsData.length === 0) {
      indexModel.attractionGroupDOM.appendChild(
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
    let link = apiModel.route_attraction + id;
    newDivAttraction.onclick = function () {
      window.location.href = link.toString();
    };

    // 2. 建立新的 <div> 子元素: att-img, attInfo
    let newDivAttImg = createElementWithClassName(undefined, "att-img");
    const imgUrl = itemArr[index][0].replace("http://", "https://");
    newDivAttImg.style.backgroundImage = "url(" + imgUrl + ")"; //img(the first url)

    let newDivAttInfo = this.createAttInfo(
      itemArr[index][1], //name
      itemArr[index][2], //MRT
      itemArr[index][3] //category
    );

    // 4. 把 子元素 都加入至 母元素
    newDivAttraction.appendChild(newDivAttImg);
    newDivAttraction.appendChild(newDivAttInfo);

    // 5. 把 box 加入至 indexModel.attractionGroupDOM
    indexModel.attractionGroupDOM.appendChild(newDivAttraction);
  },

  createAttInfo: function (nameStr = "", mrtStr = "", categoryStr = "") {
    //1. 建立新的 <div> 母元素: att__info
    let newDivAttInfo = createElementWithClassName(undefined, "att__info");

    //2. 建立新的 <div> 子元素: att__info__name, att__info__MRT, att__info__category
    let newDivAttName = createElementWithClassName(
      undefined,
      "common-text common-text-bold att__info__name"
    );
    newDivAttName.appendChild(createParagraphWithText(nameStr, undefined));
    let newDivAttMRT = createElementWithClassName(
      undefined,
      "common-text att__info__MRT"
    );
    newDivAttMRT.appendChild(createParagraphWithText(mrtStr, undefined));
    let newDivAttCategory = createElementWithClassName(
      undefined,
      "common-text att__info__category"
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

async function isScrollBottom() {
  let rect = indexModel.attractionGroupDOM.getBoundingClientRect();
  if (rect.bottom < window.innerHeight) {
    //滾到最底
    indexModel.boundingClientRect = rect.bottom;
    if (indexModel.nextPage === null) {
      window.removeEventListener("scroll", isScrollBottom, true);
      return;
    }
    if (indexModel.nextPage === indexModel.currentPage) return;
    if (indexModel.nextPage !== 0) {
      indexController.showLoadingMorePage(true);
      indexModel.currentPage = indexModel.nextPage;
      indexController.doRender(indexModel.currentPage, indexModel.keyword);
    }
  } else {
    indexController.showLoadingMorePage(false);
  }
}

let indexController = {
  init: function () {
    indexModel.init();
    window.addEventListener("scroll", isScrollBottom, true);
    this.addClickEvent();
    this.doRender(indexModel.currentPage, undefined);
    indexController.showLoadingMorePage(false);
  },
  doRender: async function (currentPage, keyword) {
    let response = await indexApiController.doGet(currentPage, keyword);
    if (indexModel.isFirst) {
      this.showLoading(false);
    }

    if (indexModel.isFirst) {
      indexModel.boundingClientRect =
        indexModel.attractionGroupDOM.getBoundingClientRect().bottom;
      indexModel.isFirst = false;
    }
    indexModel.nextPage = response[0];
    indexView.renderAttractions(response[1]);

    navController.checkUserLogin();
  },
  addClickEvent: function () {
    indexModel.searchBtnDOM.addEventListener("click", () => {
      this.doKeywordSearch();
      window.addEventListener("scroll", isScrollBottom, true);
    });
  },
  doKeywordSearch: async function () {
    if (indexModel.searchInputDOM === undefined) return;
    indexModel.keyword = indexModel.searchInputDOM.value;
    indexModel.currentPage = 0;
    indexView.removeChildElement(indexModel.attractionGroupDOM, "attraction");
    indexView.removeChildElement(indexModel.attractionGroupDOM, "noResult");
    this.doRender(indexModel.currentPage, indexModel.keyword);
  },
  showLoading: function (isShow) {
    if (isShow === true) {
      indexModel.attractionGroupDOM.style.display = "none";
      indexModel.loadingDOM.style.display = "block";
      return;
    }
    indexModel.attractionGroupDOM.style.display = "flex";
    indexModel.loadingDOM.style.display = "none";
  },
  showLoadingMorePage: function (isShow) {
    if (isShow === true) {
      indexModel.loadingMorePageDOM.style.display = "block";
      return;
    }
    indexModel.loadingMorePageDOM.style.display = "none";
  },
};

function init() {
  dialogController.init();
  navController.init();
  indexController.init();
}

window.onload = function () {
  init();
};
