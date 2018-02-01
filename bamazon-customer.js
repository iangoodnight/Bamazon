var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazonDB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

var customer = "";
var cart = [];

function start() {
	console.log("\n-- Hello and Welcome to bamazon! --", 
		"\n-- We are your one-stop shop for all things unecessary! --",
		"\n-- But first... --\n");
	inquirer
		.prompt([
			{
				name: "user",
				type: "input",
				message: "\n-- What is your name? --\n"
			}
		]).then(function(answer) {
			customer = answer.user;
			console.log("\n-- Well, cool beans " + customer + " It's a pleasure to meet you! --\n");
			dashboard();
	});
}

// Dashboard function (global)
// We'll return to this in between actions.
function dashboard() {
	inquirer
		.prompt([
			{
				name: "action",
				type: "list",
				message: "\n-- What can I do for you? --\n",
				choices: ["Shop", "View Cart"]
			}
		]).then(function(answer) {
			var answers = ["Shop", "View Cart"];
			if (answer.action === answers[0]) {
				shop();
			}
			if (answer.action === answers[1]) {
				viewCart();
			}
		});
}

//  Shop function (global scope)
function shop() {
	connection.query("SELECT * FROM products", function(err, results) {
		if (err) throw err;
		console.log("\n-- All right, " + customer + ".  Let's shop! --\n");
		//  List products
		inquirer
		    .prompt([
		  		{
		  			name: "choice",
		  			type: "list",
		  			choices: function () {
		  				var choiceArray = [];
						for (var i = 0; i < results.length; i++) {
            				choiceArray.push(results[i].product_name);
            			}
            			return choiceArray;
            		},
            		message:  "What would you like to see?"
		  		}
      		])
      		.then(function(answer) {
        		// get the information of the chosen item
        		var chosenItem;
        		for (var i = 0; i < results.length; i++) {
          			if (results[i].product_name === answer.choice) {
            		chosenItem = results[i];
          			}
        		}
        		console.log("Woah, I see you are checking out the " + chosenItem.product_name + ". \nGood eye!  That costs " + chosenItem.price);
        		inquirer
        			.prompt({
        				name: "details",
        				type: "list",
        				message: "What would you like to do?",
        				choices: ["Add to cart!", "Go back"]
        			})
        			.then(function(answer) {
        				var itemActions = ["Add to cart!", "Go back"];
        				if (answer.details === itemActions[0]) {
        					console.log("\n-- We have " + chosenItem.stock_quantity + " of the " + chosenItem.product_name + "(s) left on hand! --\n");
        					inquirer
        						.prompt({
        							name: "qty",
        							type: "input",
        							message: "How many would you like?"
        						})
        						.then(function(answer) {
        							if (chosenItem.stock_quantity >= parseInt(answer.qty)) {

        								
        								newQuantity = chosenItem.stock_quantity - parseInt(answer.qty);


        								connection.query(
      										"UPDATE products SET ? WHERE ?",
        									[
        										{
        											stock_quantity: newQuantity
        										},
        										{
        											item_id: chosenItem.item_id
        										}
											],
											function(error) {
												if (error) throw error;
												console.log("\n-- Added " + answer.qty + " " + chosenItem.product_name + "(s) successfully " + customer + "!");
												dashboard();
											}
										);
        								chosenItem.stock_quantity = parseInt(answer.qty);
										cart.push(chosenItem);
									} else {
										console.log("\n-- Sorry, " + customer + " but we don't seem to have enough on hand!  Try coming back later! --\n");
										dashboard();
									}
								});
						}
        				if (answer.details === itemActions[1]) {
        					shop();
        				}
        			});
        	});

    });
}

var viewCart = function() {
	var subtotal = 0;
	for (var i = 0; i < cart.length; i++) {
		console.log("\n-- " + cart[i].product_name + "(s) -- $" + (cart[i].stock_quantity * cart[i].price));
		subtotal += cart[i].stock_quantity * cart[i].price;
	}
	console.log("\n-- Your total is $" + subtotal + " right now. --\n");
	inquirer
		.prompt({
			name: "check_out",
			type: "confirm",
			message: "\n-- Would you like to check out?"
		})
		.then(function(answer) {
			if (answer.check_out === true) {
				checkout();
			} else {
				dashboard();
			}
		});
	
	var checkout = function() {
		console.log("\n-- All right! " + subtotal + " dollars! I'll just take down your... uh... hrm... -- \n-- Maybe you could bring it here as I haven't set up paypal yet and I could really use the cash! --\n");
		subtotal = 0;
		inquirer
			.prompt({
				name: "exit",
				type: "confirm",
				message: "Would you like to keep shopping?"
			})
			.then(function(answer) {
				if (answer.exit === true) {
					dashboard();
				} else {
					quit();
				}
			}
		);
	};

};

var quit = function() {
	inquirer
    	.prompt([
      		{
        		name: "quit",
        		type: "confirm",
        		message: "\n-- Are you sure you want to quit? (Y/N) --\n"
      		}
    	])
    	.then(function(answer) {
      		console.log(answer);
      		if (answer.quit === true) {
      			console.log("\n-- Thanks for shopping with us today " + customer + "! --\n-- Come back soon!");
        		connection.end();
      		} else {
        		dashboard();
      }
    });
};

