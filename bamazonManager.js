var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "Localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
})

function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    viewProducts();
                    break;

                case "View Low Inventory":
                    viewLowInventory();
                    break;

                case "Add to Inventory":
                    addInventory();
                    break;

                case "Add New Product":
                    addNewProduct();
                    break;

                case "exit":
                    connection.end();
                    break;
            }
        });
};

function viewProducts() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(
                "ID: " + res[i].id +
                " || Product: " + res[i].product_name +
                " || Department: " + res[i].department_name +
                " || Price: $" + res[i].price +
                " || Quantity: " + res[i].stock_quantity +
                '\n'
            );
        }
        start();
    })
};

function viewLowInventory() {
    var query = "SELECT * FROM products WHERE stock_quantity <= 5";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(
                "ID: " + res[i].id +
                " || Product: " + res[i].product_name +
                " || Department: " + res[i].department_name +
                " || Price: $" + res[i].price +
                " || Quantity: " + res[i].stock_quantity +
                " || INVENTORY LOW" +
                '\n' +
                '\n' +
                '\n'
            )
        }
        start();
    })
};

function addInventory() {
    inquirer
        .prompt([
            {
                name: "productIDinput",
                type: "input",
                message: "What is the ID of the item you would like to add inventory to?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "numberToBeAdded",
                type: "input",
                message: "How many would you like to add?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            var query = "UPDATE stock_quantity FROM products SET stock_quantity = ? WHERE ?;"
            connection.query(query, [stock_quantity + answer.numberToBeAdded, id = answer.productIDinput], function (err, res) {
                console.log(
                    "You added " + answer.numberToBeAdded +
                    " products."
                );

            })
            start();
        });
};

function addNewProduct() {
    inquirer
        .prompt([
            {
                name: "product",
                type: "input",
                message: "What is the product you would like to add?"
            },
            {
                name: "department",
                type: "input",
                message: "What department would you like to place your product in?"
            },
            {
                name: "price",
                type: "input",
                message: "What would you like your price to be?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "stock",
                type: "input",
                message: "What would you like your starting stock quantity to be?",
                validate: function(value) {
                  if (isNaN(value) === false) {
                    return true;
                  }
                  return false;
                }
              }
        ])
        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.product,
                    department_name: answer.department,
                    price: answer.price,
                    stock_quantity: answer.stock
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your product was added successfully!");
                    // re-prompt the user for if they want to bid or post
                    start();
                }
            );
        });
};