//api
let webIP = "http://127.0.0.1:3000/";
let api_attractions = "api/attractions";
let api_attraction = "api/attraction";
let currentPage = 0;

//fetch
let nextPage = 0;
let isFetchFinished = false;
let fetchFinishedID;
let parsedData;
let isLoadFinished = false;

//scroll to bottom
let attractionGroup; //window element
let isBottom = false;
let loadNextID;

function IsScrollBottom() {
  let rect = attractionGroup.getBoundingClientRect();
  if (rect.bottom < window.innerHeight) {
    isBottom = true; //滾到最底
  }
}

function CheckAtTheBottom() {
  loadNextID = window.setInterval(LoadNextWhenAtTheBottom, 100);
}
function LoadNextWhenAtTheBottom() {
  if (isBottom === true && isLoadFinished === true) {
    window.clearInterval(loadNextID);
    isBottom = false;
    isLoadFinished = false;
    if (nextPage !== 0 && nextPage !== null) {
      currentPage = nextPage;
      GetAttractionsData(GetUrl(api_attractions, currentPage), undefined);
    }
  }
}

function CheckFetch() {
  fetchFinishedID = window.setInterval(FetchFinished, 100);
}
function FetchFinished() {
  if (isFetchFinished === true) {
    window.clearInterval(fetchFinishedID);
    createBoxes(parsedData[1]);
    isFetchFinished = false;
    isLoadFinished = true;
  }
}

function GetNextPage() {
  return nextPage;
}

function SetNextPage(next) {
  nextPage = next;
}

function DoKeywordSearch() {
  alert("DoKeywordSearch");
}

//透過 fetch 從 api 取得資料
function GetAttractionsData(url = "", keyword = "") {
  if (url === "") return;

  isFetchFinish = false;
  CheckFetch();
  CheckAtTheBottom();
  if (keyword !== "") {
    url += "&" + "keyword=" + keyword;
  }
  fetch(url, {
    mode: "cors",
  })
    .then((response) => {
      return response.text();
    })
    .then(function (result) {
      parsedData = ParseAttractionsData(result);
      isFetchFinished = true;
    });
}

//Get next page (int or null) and attraction datas (Array: [img, name, MRT, category])
function ParseAttractionsData(rawData = "") {
  if (rawData === "") return;

  let jsonData = JSON.parse(rawData);
  nextPage = jsonData.nextPage;

  let dataList = jsonData.data;
  let attractionsArr = [];

  // Get each data: img(the first url), name, MRT, category
  let dataListLen = dataList.length;
  for (let i = 0; i < dataListLen; i++) {
    let data = dataList[i];
    let img = data.images[0];
    let name = data.name;
    let mrt = data.mrt;
    let category = data.category;
    attractionsArr.push([img, name, mrt, category]);
  }
  return [nextPage, attractionsArr];
}

// create boxes (maximum quantity: 12)
function createBoxes(itemArr) {
  let itemArrLen = itemArr.length;
  for (let i = 0; i < itemArrLen; i++) {
    if (i >= itemArrLen) {
      break;
    }
    createBox(itemArr, i);
  }
}

// create a attraction box
function createBox(itemArr, index) {
  /*
    itemArr: 景點項目資料
    index: itemArr中的第幾個項目
  */

  // 取得容器
  let myAttractionGroup = document.getElementById("attractionGroup");

  // 1. 建立新的 <div> 母元素: attraction
  let newDivAttraction = createElementWithClassName(undefined, "attraction");

  // 2. 建立新的 <div> 子元素: att-img, attInfo
  let newDivAttImg = createElementWithClassName(undefined, "att-img");
  newDivAttImg.style.backgroundImage = "url(" + itemArr[index][0] + ")";

  let newDivAttInfo = createAttInfo(
    itemArr[index][1],
    itemArr[index][2],
    itemArr[index][3]
  );

  // 4. 把 子元素 都加入至 母元素
  newDivAttraction.appendChild(newDivAttImg);
  newDivAttraction.appendChild(newDivAttInfo);

  // 5. 把 box 加入至 myAttractionGroup
  myAttractionGroup.appendChild(newDivAttraction);
}

function createAttInfo(nameStr = "", mrtStr = "", categoryStr = "") {
  //1. 建立新的 <div> 母元素: attInfo
  let newDivAttInfo = createElementWithClassName(undefined, "attInfo");

  //2. 建立新的 <div> 子元素: att-name, att-MRT, att-category
  let newDivAttName = createElementWithClassName(undefined, "att-name");
  newDivAttName.appendChild(createParagraphWithText(nameStr));
  let newDivAttMRT = createElementWithClassName(undefined, "att-MRT");
  newDivAttMRT.appendChild(createParagraphWithText(mrtStr));
  let newDivAttCategory = createElementWithClassName(undefined, "att-category");
  newDivAttCategory.appendChild(createParagraphWithText(categoryStr));

  //3. 把 子元素 都加入至 母元素
  newDivAttInfo.appendChild(newDivAttName);
  newDivAttInfo.appendChild(newDivAttMRT);
  newDivAttInfo.appendChild(newDivAttCategory);

  return newDivAttInfo;
}

function createElementWithClassName(elementType = "div", className = "") {
  let newDiv = document.createElement(elementType);
  newDiv.className = className;
  return newDiv;
}

function createParagraphWithText(paragraphText = "") {
  let newParagraph = document.createElement("p");
  let textNode = document.createTextNode(paragraphText);
  newParagraph.appendChild(textNode);
  return newParagraph;
}

function GetUrl(api = "api/attractions", currentPage = 0) {
  let url = webIP + api + "?" + "page=" + currentPage;
  return url;
}
