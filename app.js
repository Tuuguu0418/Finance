// Delgetstei ajillah controller
var uiControler = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    incomeList: ".income__list",
    expenseList: ".expenses__list",
    tusuwLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    containerDiv: ".container",
    expencePercentageLabel: ".item__percentage",
    dateLabel: ".budget__title--month",
  };

  var nodeListForEach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  var formatMoney = function (too, type) {
    too = "" + too;
    var x = too.split("").reverse().join("");
    var y = "";
    var count = 1;

    for (var i = 0; i < x.length; i++) {
      y = y + x[i];
      if (count % 3 === 0) y = y + ",";
      count++;
    }

    var z = y.split("").reverse().join("");
    if (z[0] === ",") z = z.substr(1, z.length - 1);

    if (type === "inc") z = "+ " + z;
    else z = "- " + z;
    return z;
  };

  return {
    displayDate: function () {
      var today = new Date();

      document.querySelector(DOMstrings.dateLabel).textContent =
        today.getFullYear() + " оны " + today.getMonth() + " сарын ";
    },

    changeType: function () {
      var fields = document.querySelectorAll(
        DOMstrings.inputType +
          ", " +
          DOMstrings.inputDescription +
          ", " +
          DOMstrings.inputValue
      );

      nodeListForEach(fields, function (el) {
        el.classList.toggle("red-focus");
      });

      document.querySelector(DOMstrings.addBtn).classList.toggle("red");
    },

    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // exp inc
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseInt(document.querySelector(DOMstrings.inputValue).value),
      };
    },

    displayPercentages: function (allPercentages) {
      var elements = document.querySelectorAll(
        DOMstrings.expencePercentageLabel
      );

      nodeListForEach(elements, function (el, index) {
        el.textContent = allPercentages[index];
      });
    },

    getDOMStrings: function () {
      return DOMstrings;
    },

    clearFields: function () {
      var fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );

      // Convert List to Array
      // slice function ni array iig array ruu horwuuldg c list iig array luu ingj horwuulj boldg
      var fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function (el, index, array) {
        el.value = "";
      });

      fieldsArr[0].focus();
      // for (var i = 0; i < fieldsArr.length; i++) {
      //   fieldsArr[i].value = "";
      // }
    },

    tuswiigUzuuleh: function (tusuw) {
      var type;
      if (tusuw.tusuw > 0) type = "inc";
      else type = "exp";
      document.querySelector(DOMstrings.tusuwLabel).textContent = formatMoney(
        tusuw.tusuw,
        type
      );
      document.querySelector(DOMstrings.incomeLabel).textContent = formatMoney(
        tusuw.totalInc,
        "inc"
      );
      document.querySelector(DOMstrings.expenseLabel).textContent = formatMoney(
        tusuw.totalExp,
        "exp"
      );

      if (tusuw.huwi !== 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          tusuw.huwi + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          tusuw.huwi;
      }
    },

    deleteListItem: function (id) {
      var el = document.getElementById(id);
      el.parentNode.removeChild(el);
    },

    addListItem: function (item, type) {
      // Orlogo zarlagin elementiig aguulsn html beldene.
      var html, list;
      if (type === "inc") {
        list = DOMstrings.incomeList;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">%Value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        list = DOMstrings.expenseList;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">%Value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      // Ter html dotroo orlogo zarlagin utguudiig Replace ashiglaj oorclono
      html = html.replace("%id%", item.id);
      html = html.replace("%DESCRIPTION%", item.description);
      html = html.replace("%Value%", formatMoney(item.value, type));
      // Beltgesen html ee dom ruu hiij ogno.
      document.querySelector(list).insertAdjacentHTML("beforeend", html);
    },
  };
})();

// Sanhuutei ajillah controller
// Private Data
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

  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0)
      this.percentage = Math.round((this.value / totalIncome) * 100);
    else this.percentage = 0;
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
      inc: 1000,
      exp: 500,
    },

    tusuw: 0,
    huwi: 0,
  };

  return {
    tusuwTootsooloh: function () {
      // Niit orlogiin niilberig tootsoolno
      calculateTotal("inc");
      calculateTotal("exp");

      // Toswiig shineer tootsoolno
      data.tusuw = data.totals.inc - data.totals.exp;

      // Orlogo zarlagin huwig tootsoolno
      if (data.totals.inc > 0)
        data.huwi = Math.round((data.totals.exp / data.totals.inc) * 100);
      else data.huwi = 0;
    },

    calculatePercentages: function () {
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

    tuswiigAvah: function () {
      return {
        tusuw: data.tusuw,
        huwi: data.huwi,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
      };
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
    addItem: function (type, desc, val) {
      var item, id;

      if (data.items[type].length === 0) id = 1;
      else {
        id = data.items[type][data.items[type].length - 1].id + 1;
      }

      if (type === "inc") {
        item = new Income(id, desc, val);
      } else {
        item = new Expense(id, desc, val);
      }
      data.items[type].push(item);

      return item;
    },

    seeData: function () {
      return data;
    },
  };
})();

// Programmiin holbogc controller
var appControler = (function (uiCtrl, fnCtrl) {
  var ctrlAddItem = function () {
    var input = uiControler.getInput();

    if (input.description !== "" && input.value !== "") {
      var item = financeControler.addItem(
        input.type,
        input.description,
        input.value
      );

      uiControler.addListItem(item, input.type);
      uiControler.clearFields();

      updateTusuw();
    }
  };

  var updateTusuw = function () {
    financeControler.tusuwTootsooloh();

    var tusuw = financeControler.tuswiigAvah();

    uiControler.tuswiigUzuuleh(tusuw);

    financeControler.calculatePercentages();

    var allPercentages = financeControler.getPercentages();

    uiControler.displayPercentages(allPercentages);
  };

  var setupEventListeners = function () {
    var DOM = uiControler.getDOMStrings();
    document.querySelector(DOM.addBtn).addEventListener("click", function () {
      ctrlAddItem();
    });

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document
      .querySelector(DOM.inputType)
      .addEventListener("change", uiControler.changeType);

    document
      .querySelector(DOM.containerDiv)
      .addEventListener("click", function (event) {
        var id = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (id) {
          var arr = id.split("-");
          var type = arr[0];
          var itemId = parseInt(arr[1]);

          // console.log(type + " : " + itemId);
          financeControler.deleteItem(type, itemId);

          uiControler.deleteListItem(id);

          updateTusuw();
        }
      });
  };

  return {
    init: function () {
      console.log("Application started...");
      uiControler.displayDate();
      uiControler.tuswiigUzuuleh({
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
