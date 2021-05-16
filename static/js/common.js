//api
let route_attraction = "/attraction/";
let api_attractions = "/api/attractions?";
let api_attraction = "/api/attraction/";

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
