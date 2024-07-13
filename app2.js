var Income = function (id, description, value) {
  this.id = id;
  this.description = description;
  this.value = value;
};

var Expense = function (id, description, value) {
  this.id = id;
  this.description = description;
  this.value = value;
};

var i1 = new Income(1, "Salary", 2500000);
var i2 = new Income(2, "Won a lottery", 25000000);

var incomes = [];

incomes.push(i1);
incomes.push(i2);

console.log(incomes[1].value);
