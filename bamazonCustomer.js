var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost", 
    port: 3306,

    user: "root",

    password: "Franklin09",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    runBamazon();
});

function runBamazon() {
    inquirer
    .prompt ({
        name: "action",
        type: "input",
        message: "What would you like to buy? (Product ID)"
    }).then(function(answer) {
        console.log(answer.action);
        var query = "SELECT item_id, product_name, department_name FROM products WHERE ?";
        connection.query(query, {action: answer.item_id}, function(err, res) {

                console.log("ITEM ID: " + res[1].item_id + " || Name: " + res[1].product_name);
        
        runBamazon();
    
        });
    });
}
