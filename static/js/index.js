//api

let indexModel = {
  data: null,
  parsedData: null,
  apiRoute: "/api/attractions?",
  boundingClientRect: null,
  isFirst: true,
  searchBtnDOM: null,
  searchInputDOM: null,
  keyword: "",
  attractionGroupDOM: null,
  nextPage: 0,
  currentPage: 0,
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
  init: function () {
    this.getDOM();
  },
  apiGet: function (keyword = "") {
    //透過 fetch 從 api 取得資料
    let url = this.apiRoute + "page=" + indexModel.currentPage;
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
  parseGetData: function () {
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
  getDOM: function () {
    this.searchBtnDOM = document.getElementById("searchBtn");
    this.searchInputDOM = document.getElementById("searchInput");
    this.attractionGroupDOM = document.getElementById("attractionGroup");
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

    // 5. 把 box 加入至 indexModel.attractionGroupDOM
    indexModel.attractionGroupDOM.appendChild(newDivAttraction);
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

let indexController = {
  init: function () {
    window.addEventListener("scroll", this.isScrollBottom, true);
    indexModel.init();
    this.addClickEvent();
    this.getAttractions(undefined);
  },
  getAttractions: async function (keyword = "") {
    await indexModel.apiGet(keyword).then(function () {
      indexModel.parseGetData();

      if (indexModel.isFirst) {
        indexModel.boundingClientRect =
          indexModel.attractionGroupDOM.getBoundingClientRect().bottom;
        indexModel.isFirst = false;
      }
      indexModel.nextPage = indexModel.parsedData[0];
      indexView.renderAttractions(indexModel.parsedData[1]);

      navController.checkUserLogin();
    });
  },
  addClickEvent: function () {
    indexModel.searchBtnDOM.addEventListener("click", this.doKeywordSearch);
  },
  doKeywordSearch: function () {
    if (indexModel.searchInputDOM === undefined) return;
    indexModel.keyword = indexModel.searchInputDOM.value;
    indexModel.currentPage = 0;
    indexView.removeChildElement(indexModel.attractionGroupDOM, "attraction");
    indexView.removeChildElement(indexModel.attractionGroupDOM, "noResult");
    indexController.getAttractions(indexModel.keyword);
  },
  isScrollBottom: function () {
    let rect = indexModel.attractionGroupDOM.getBoundingClientRect();
    if (rect.bottom === indexModel.boundingClientRect) return;
    if (rect.bottom < window.innerHeight) {
      //滾到最底
      indexModel.boundingClientRect = rect.bottom;

      if (indexModel.nextPage === indexModel.currentPage) return;
      if (indexModel.nextPage !== 0 && indexModel.nextPage !== null) {
        indexModel.currentPage = indexModel.nextPage;
        indexController.getAttractions(indexModel.keyword);
      }
    }
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

function init() {
  dialogController.init();
  navController.init();
  indexController.init();
}

window.onload = function () {
  init();
};
