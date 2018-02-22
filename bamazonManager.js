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
                    return 'sale';
                }
                else if (val === 'View Low Inventory') {
                    return 'viewLow';
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
            head: ['Item ID', 'Product Name', 'Category', 'Price', 'Stock Quantity'],
            style: {
                head: ['red'],
                compact: false,
            }
        });

        for (var i = 0; i < data.length; i++) {
            table.push(
                [data[i].item_id, data[i].product_name, data[i].department_name, data[i].price, data[i].stock_quantity]
            );
        
        }

        console.log(table.toString());

          console.log("---------------------------------------------------------------------");
          connection.end();


    })
}

function displayLow () {

    var queryStr = 'SELECT * FROM products WHERE stock_quantity < 5';

    connection.query(queryStr, function(err, data) {

        if (err) throw err;

        var table = new Table ({
            head: ['Item ID', 'Product Name', 'Stock Quantity'],
            style: {
                head: ['red'],
                compact: false,
            }

        });

        for (var i = 0; i < data.length; i++){
            table.push(
                [data[i].item_id, data[i].product_name, data[i].stock_quantity]
            );
        }
        console.log(table.toString());
        console.log("---------------------------------------------------------------------");

        connection.end();
    })
}

function addInventory () {
    inquirer
    .prompt([
        {
            name: "item_id",
            type: "input",
            message: "To add stock, please enter an Item ID.",
            filter: Number
        },
        {
            name: "quantity",
            type: "input",
            message: "Please enter an amount",
            filter: Number
        }
    ]).then(function(input){

        var productData = data[0];

        var item = input.item_id;
        console.log(input.item_id);
        var addQuantity = input.quantity;

        var updateStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity + addQuantity) + 'WHERE item_id = ' + item;

    connection.query(updateStr, {item_id: item}, function(err, data) {

        if (err) throw err;

        console.log('Stock count for Item ID ' + item + ' has been updated to ' + (productData.stock_quantity + addQuantity) + '.');
        console.log("---------------------------------------------------------------------");

        connection.end();
    })
})

}

