//api
let route_attraction = "/attraction/";
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
