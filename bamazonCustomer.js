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

// List full inventory of available items for purchase.
function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "See all products.",
                "I know my product ID numbers and would like to place an order.",
                "exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "See all products.":
                    allProducts();
                    break;

                case "I know my product ID numbers and would like to place an order.":
                    makeOrder();
                    break;

                case "exit":
                    connection.end();
                    break;
            }
        });
}

// Shows all products customers can order
function allProducts() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(
                "ID: " + res[i].id +
                " || Product: " + res[i].product_name +
                " || Department: " + res[i].department_name +
                " || Price: $" + res[i].price
            );
        }
        makeOrder();
    })
};

// Lets customer order a product via ID number
function makeOrder() {
    inquirer
        .prompt([
            {
                name: "productIDinput",
                type: "input",
                message: "What is the ID of the item you would like to buy?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "numberToBeOrdered",
                type: "input",
                message: "How many would you like to buy?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            var query = "SELECT * FROM products WHERE ?"
            connection.query(query, { id: answer.productIDinput }, function (err, res) {
                console.log(res[0]);
                var priceOfOrder = res[0].price * answer.numberToBeOrdered
                //Checks if the number of products the customer wants to order is greater or less
                // than the number in stock
                if (answer.numberToBeOrdered <= res[0].stock_quantity) {

                    // Lists total cost of items purchased and decrements stock in database
                    var query = "UPDATE products SET stock_quantity = stock_quantity- ? WHERE id = ?";
                    connection.query(query, [answer.numberToBeOrdered, answer.productIDinput],
                        function (err, res) {
                            console.log("Your total is $" + priceOfOrder + "!")
                            start();
                        })

                } else {
                    console.log("Insufficient quantity!")
                    makeOrder();
                };
            });
        })
};