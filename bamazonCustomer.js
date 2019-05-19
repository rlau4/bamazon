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
    listInventory();
})

function listInventory() {
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
        .then(function(answer){
            switch (answer.action){
                case "See all products.":
                    allProducts();
                    break;

                case "I know my product ID numbers and would like to place an order.":
                    personalHygieneDepartmen();
                    break;

                case "exit":
                    connection.end();
                    break;
            }
        });
}

function allProducts() {
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res){
        for (var i = 0; i< res.length; i++){
            console.log(
                "ID: " + res[i].id +
                " || Product: " + res[i].product_name +
                " || Department: " + res[i].department_name +
                " || Price: $" + res[i].price
            );
        
        }
    })
}