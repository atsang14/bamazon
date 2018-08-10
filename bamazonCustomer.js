var mysql 	 = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: "localhost",
  
  // Your port; if not 3306
  port: 3306,
  
  // Your username
  user: "root",
  
  // Your password
  password: "password",
  database: "bamazon"
});
 
connection.connect();
	// ids, names, and prices of products for sale.

// this runs the first query of prompting the user with all the avaialabel products
// After the query is run, we run teh slectPrompt function
connection.query('SELECT item_id, product_name, department_name, price, stock_quantity '+
	'FROM products', function(err,res) {
		if(err) throw err;
		console.log('----------- Current Items -----------')
		console.log(res);
		selectPrompt();
});

// Once the customer has placed the order, your application 
// should check if your store has enough of the product to meet the customer's request.

// The selectPrompt function prompts the user to
// enter an item id and the nhow many units of product they want
function selectPrompt() {
	inquirer.prompt([
		{
			type: 'input',
			message: 'Enter the Item ID of the product you would like to buy',
			name: 'idProduct'
		},
		{
			type: 'input',
			message: 'How many units of the product would you like to buy?',
			name: 'purchaseAmount'
		}
		]).then(function(inquirerResponse) {
			var id_product = inquirerResponse.idProduct;
			var purchase_amount = parseInt(inquirerResponse.purchaseAmount);
			checkStock(id_product, purchase_amount);
			
		})
} 


// the checkStock function check if your store 
// has enough of the product to meet the customer's request.
function checkStock(productId, purchaseAmount) {

	connection.query('SELECT stock_quantity, product_name, price FROM products WHERE item_id = '
	 + productId
	 ,function(err, res) {

	 	if(err) throw err;

	 	var stockQuantity = res[0].stock_quantity;
	 	var productName   = res[0].product_name;
	 	var price 		  = res[0].price;

	 	if(productId == '') {
	 		
	 		console.log('This is not a valid product Id');
	 	
	 	} else if(productId != '') {

	 		if(stockQuantity < purchaseAmount) {

	 			console.log('You requested '+purchaseAmount+' amount of '+productName+'.');
	 			console.log('Unfortunately we only posses ' + stockQuantity
	 				+ ' amount of '+productName+'.')

	 		} else if (stockQuantity == 0) {

	 			console.log('We do not have anymore of that product. Sorry!' + 
	 				' Check with us soon!');

	 		} else if (stockQuantity >= purchaseAmount) {

	 			var newQuantity = stockQuantity - purchaseAmount;
	 			var total 		= purchaseAmount * price;

	 			console.log('================');
	 			updateQuantity(productId, newQuantity);
	 			console.log('================');
	 			console.log('Thank you for your purchase!');
	 			console.log('Your total will be $' + total);

	 		} 
	 		
	 	} 
	 	else {
	 		
	 		console.log('something went wrong');

	 	}
	 })
}

function updateQuantity(rowId, newQuantity) {
	
	console.log('================');
	connection.query('UPDATE products SET stock_quantity = '
		+newQuantity+' WHERE item_id ='+rowId
		,function(err,res) {
			if(err) throw err;
			connection.end();
		})

}
























