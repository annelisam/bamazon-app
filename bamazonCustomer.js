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
    displayInventory();
});

function userPurchase() {
    inquirer
    .prompt ([
    {
        name: 'item_id',
        type: 'input',
        message: 'What would you like to buy? (Product ID)',
        filter: Number
    },
    {
        name: 'quantity',
        type: 'input',
        message: 'Please specify a quantity',
        filter: Number
    }
    ]).then(function(input) 
    {
        var item = input.item_id;
        var quantity = input.quantity;

        var queryString = 'SELECT * FROM products WHERE?';

        connection.query(queryString, {item_id: item}, function(err,data) {
            if (err) throw err;

            if (data.length === 0) {
                console.log('***ERROR*** Invalid Item ID. Please try again.');
                displayInventory();
            }

            else {
                var productInfo = data [0];

                if (quantity <= productInfo.stock_quantity) {
                    console.log('We have ' + productInfo.stock_quantity + ' in stock! Placing an order now.');

                    var updateQuery = 'UPDATE products SET stock_quantity = ' + (productInfo.stock_quantity - quantity) + ' WHERE item_id = ' + item;
                    // console.log(updateQuery);

                    connection.query(updateQuery, function (err, data){
                        if(err) throw err;

                        console.log('Your total is $' + productInfo.price * quantity + '. Thanks for shopping with us!');
                        connection.end();

                    })
                }
                else {
                    console.log ('Oh bloody hell...it\'s out of stock.');
                    displayInventory();
                }
            }

        }



    );

    });
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

          console.log("---------------------------------------------------------------------\n");
        
          userPurchase();


	})
}


function runBamazon() {

    displayInventory();
}

