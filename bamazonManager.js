var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost", 
    port: 3306,

    user: "root",

    password: "Franklin09",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    welcomePrompt();
});

function welcomePrompt(){
    inquirer
    .prompt([
        {
            name: "option",
            type: "list",
            message: "What would you like to do?",
            choices: [
                'View Products for Sale',
                'View Low Inventory',
                'Add to Inventory',
                'Add New Product'
            ],
            filter: function (val) {
                if (val === 'View Products for Sale') {
                    return 'viewItems';
                }
                else if (val === 'View Low Inventory') {
                    return 'sale';
                }
                else if (val === 'Add to Inventory') {
                    return 'addInventory';
                }
                else if (val === 'Add New Product') {
                    return 'addItem';
                }
                else {
                    console.log('Error!');
                }    
            }
        }
    ]).then(function(input) {
        if (input.option === 'sale') {
            displayInventory();
        }
        else if (input.option === 'viewLow') {
            displayLow();
        }
        else if (input.option === 'addInventory') {
            addInventory();
        }
        else if (input.option === 'addItem') {
            addItem();
        }
        else {
            console.log('Error!');
        }
        })
}

function displayInventory() {


	queryStr = 'SELECT * FROM products';

	connection.query(queryStr, function(err, data) {
		if (err) throw err;

        var table = new Table({
            head: ['Item ID', 'Product Name', 'Price'],
            style: {
                head: ['red'],
                compact: false,
                colAligns: ['center'],
            }
        });

        for (var i = 0; i < data.length; i++) {
            table.push(
                [data[i].item_id, data[i].product_name, data[i].price]
            );
        
        }

        console.log(table.toString());

          console.log("---------------------------------------------------------------------");

    })
}
