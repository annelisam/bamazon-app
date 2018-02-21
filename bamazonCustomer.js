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
    displayInventory();
});

function userPurchase() {
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
    
        });
    });
}

function displayInventory() {


	queryStr = 'SELECT * FROM products';

	connection.query(queryStr, function(err, data) {
		if (err) throw err;

		console.log('Existing Inventory: ');
		console.log('...................\n');

		var strOut = '';
		for (var i = 0; i < data.length; i++) {
			strOut = '';
			strOut += 'Item ID: ' + data[i].item_id + '  ||  ';
			strOut += 'Product Name: ' + data[i].product_name + '  ||  ';
			strOut += 'Department: ' + data[i].department_name + '  ||  ';
			strOut += 'Price: $' + data[i].price + '\n';

			console.log(strOut);
		}

          console.log("---------------------------------------------------------------------\n");
        
          userPurchase();


	})
}


function runBamazon() {

    displayInventory();
}

