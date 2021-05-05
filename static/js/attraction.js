//import js file
let newscript = document.createElement("script");
newscript.setAttribute("type", "text/javascript");
newscript.setAttribute("src", "../static/js/index.js");
let head = document.getElementsByTagName("head")[0];
head.appendChild(newscript);
