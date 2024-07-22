var uiControler = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
  };

  var nodeListForeach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  var formatMoney = function (too, type) {
    too += "";
    var x = too.split("").reverse().join("");
    var y = "";
    var count = 1;
    for (var i = 0; i < x.length; i++) {
      y += x[i];
      if (count % 3 === 0) y += ",";
      count++;
    }

    var z = y.split("").reverse().join("");
    if (z[0] === ",") z = z.substr(1, z.length - 1);

    if (type === "inc") z = "+ " + z;
    else z = "- " + z;
    return z;
  };

  return {
    getDOMstrings: function () {
      return DOMstrings;
    },

    displayDate: function () {
      var today = new Date();
      document.querySelector(".budget__title--month").textContent =
        today.getFullYear() + " оны " + (today.getMonth() + 1) + " сарын ";
    },

    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseInt(document.querySelector(DOMstrings.inputValue).value),
      };
    },

    clearFields: function () {
      var fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );

      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function (el) {
        el.value = "";
      });

      fieldsArr[0].focus();
    },

    addListItem: function (type, item) {
      var list, html;
      if (type === "inc") {
        list = ".income__list";
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">%Value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        list = ".expenses__list";
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">%Value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      html = html.replace("%id%", item.id);
      html = html.replace("%DESCRIPTION%", item.description);
      html = html.replace("%Value%", formatMoney(item.value, type));

      document.querySelector(list).insertAdjacentHTML("beforeend", html);
    },

    changeType: function () {
      var fields = document.querySelectorAll(
        DOMstrings.inputType +
          ", " +
          DOMstrings.inputDescription +
          ", " +
          DOMstrings.inputValue
      );

      nodeListForeach(fields, function (el) {
        el.classList.toggle("red-focus");
      });

      document.querySelector(DOMstrings.addBtn).classList.toggle("red");
    },

    tuswiigUzuuleh: function (tusuw) {
      var type;
      if (tusuw.tusuw > 0) type = "inc";
      else type = "exp";
      document.querySelector(".budget__value").textContent = formatMoney(
        tusuw.tusuw,
        type
      );
      document.querySelector(".budget__income--value").textContent =
        formatMoney(tusuw.totalInc, "inc");
      document.querySelector(".budget__expenses--value").textContent =
        formatMoney(tusuw.totalExp, "exp");
      if (tusuw.huwi > 0)
        document.querySelector(".budget__expenses--percentage").textContent =
          tusuw.huwi + "%";
      else
        document.querySelector(".budget__expenses--percentage").textContent =
          tusuw.huwi;
    },

    displayPercentages: function (allPercentages) {
      var elements = document.querySelectorAll(".item__percentage");

      nodeListForeach(elements, function (el, index) {
        el.textContent = allPercentages[index];
      });
    },

    deleteListItem: function (id) {
      var el = document.getElementById(id);
      el.parentNode.removeChild(el);
    },
  };
})();

var financeControler = (function () {
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function (totalInc) {
    if (totalInc > 0) {
      this.percentage = Math.round((this.value / totalInc) * 100);
    } else this.percentage = 0;
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };

  var calculateTotal = function (type) {
    var sum = 0;
    data.items[type].forEach(function (el) {
      sum += el.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    items: {
      inc: [],
      exp: [],
    },
    totals: {
      inc: 0,
      exp: 0,
    },

    tusuw: 0,
    huwi: 0,
  };

  return {
    seeData: function () {
      return data;
    },

    addItem: function (type, description, value) {
      var item, id;
      if (data.items[type].length === 0) {
        id = 1;
      } else {
        id = data.items[type][data.items[type].length - 1].id + 1;
      }

      if (type === "inc") item = new Income(id, description, value);
      else item = new Expense(id, description, value);

      data.items[type].push(item);

      return item;
    },

    tuswiigTootsooloh: function () {
      calculateTotal("inc");
      calculateTotal("exp");

      data.tusuw = data.totals.inc - data.totals.exp;

      if (data.totals.inc > 0)
        data.huwi = Math.round((data.totals.exp / data.totals.inc) * 100);
    },

    tuswiigAwah: function () {
      return {
        tusuw: data.tusuw,
        huwi: data.huwi,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
      };
    },

    calcPercentages: function () {
      data.items.exp.forEach(function (el) {
        el.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function () {
      var allPercentages = data.items.exp.map(function (el) {
        return el.getPercentage();
      });

      return allPercentages;
    },

    deleteItem: function (type, id) {
      var ids = data.items[type].map(function (el) {
        return el.id;
      });

      var index = ids.indexOf(id);
      if (index !== -1) {
        data.items[type].splice(index, 1);
      }
    },
  };
})();

var appControler = (function (uiCtrl, fnCtrl) {
  var addCtrlItem = function () {
    var input = uiCtrl.getInput();
    if (input.description !== "" && input.value !== "") {
      var item = fnCtrl.addItem(input.type, input.description, input.value);
      uiCtrl.addListItem(input.type, item);
      uiCtrl.clearFields();
    }
    updateTusuw();
  };

  var updateTusuw = function () {
    fnCtrl.tuswiigTootsooloh();
    var tusuw = fnCtrl.tuswiigAwah();
    uiCtrl.tuswiigUzuuleh(tusuw);

    fnCtrl.calcPercentages();
    var allPercentages = fnCtrl.getPercentages();
    uiCtrl.displayPercentages(allPercentages);
  };

  var setupEventListeners = function () {
    var DOM = uiCtrl.getDOMstrings();

    document.querySelector(DOM.addBtn).addEventListener("click", function () {
      addCtrlItem();
    });

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        addCtrlItem();
      }
    });

    document
      .querySelector(DOM.inputType)
      .addEventListener("change", uiCtrl.changeType);

    document
      .querySelector(".container")
      .addEventListener("click", function (el) {
        var id = el.target.parentNode.parentNode.parentNode.parentNode.id;

        if (id) {
          var arr = id.split("-");
          var type = arr[0];
          var itemId = parseInt(arr[1]);

          fnCtrl.deleteItem(type, itemId);
          uiCtrl.deleteListItem(id);
          updateTusuw();
        }
      });
  };

  return {
    init: function () {
      console.log("App started...");
      uiCtrl.displayDate();
      uiCtrl.tuswiigUzuuleh({
        tusuw: 0,
        huwi: 0,
        totalInc: 0,
        totalExp: 0,
      });
      setupEventListeners();
    },
  };
})(uiControler, financeControler);

appControler.init();
