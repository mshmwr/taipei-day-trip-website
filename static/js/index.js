//api
let currentPage = 0;

//fetch
let nextPage = 0;
let isfetchFinished = false;
let fetchFinishedID;
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
      navController.checkUserLogin();
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

window.onload = function () {
  attractionGroup = document.getElementById("attractionGroup");
  searchInput = document.getElementById("searchInput");
  searchBtn = document.getElementById("searchBtn");

  window.addEventListener("scroll", IsScrollBottom, true);
  searchBtn.addEventListener("click", DoKeywordSearch);

  //initial
  dataController.init();
  dialogController.init();
  navController.init();
};
