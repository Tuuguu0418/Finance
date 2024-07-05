// Delgetstei ajillah controller
var uiControler = (function () {})();

// Sanhuutei ajillah controller
var financeControler = (function () {})();

// Programmiin holbogc controller
var appControler = (function (uiCtrl, fnCtrl) {
  var ctrlAddItem = function () {
    console.log("delgetsees ogogdloo awah heseg");
  };

  document.querySelector(".add__btn").addEventListener("click", function () {
    ctrlAddItem();
  });

  document.addEventListener("keypress", function (event) {
    if (event.keyCode === 13) {
      ctrlAddItem();
    }
  });
})(uiControler, financeControler);
