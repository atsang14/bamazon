var mysql 	   = require('mysql');
var inquirer   = require('inquirer');

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

// this runs the first query of prompting the user with all the avaialabel products
// After the query is run, we run teh slectPrompt function
connection.query('SELECT item_id, product_name, department_name, price, stock_quantity '+
	'FROM products', function(err,res) {
		if(err) throw err;
		console.log('----------- Current Items -----------')
		console.log(res);
		selectPrompt();
});

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
	connection.query('SELECT stock_quantity, product_name, price, product_sales FROM products WHERE item_id = '
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
	 			var newQuantity 	= stockQuantity - purchaseAmount;
	 			var total 			= purchaseAmount * price;
	 			var productSet 		= 'product_sales = product_sales + ' + total;
	 			var where			= 'item_id = ' + productId;
	 			var stockSet	    = 'stock_quantity = ' + newQuantity;

	 			updateProductSales(stockSet, where, false);
	 			updateProductSales(productSet, where, true);
	 			console.log('Thank you for your purchase!');
	 			console.log('Your total will be $' + total);
	 		} 
	 	} 
	 	else {
	 		console.log('something went wrong');

	 	}
	 })
}


// this function takes in 3 arguements.
// the first argument is used to specify the SET query
// the second argument is used to specify the WHERE query
// the 3rd argument used to see if we should still be connected after 
// calling this function.
function updateProductSales(setVariable, whereVariable, connect) {
	console.log('Line 125 is happening');
	connection.query('UPDATE products SET ' + setVariable + ' WHERE ' + whereVariable
		,function(err,res) {
			if(err) throw err;
			if(connect)connection.end();
		}
	)
}





// this function takes in 2 arguements.
// the first argument gets the specific item id in order to 
// target the correct row.
// the second argument takes in the price to update.
// function updateQuantity(rowId, newQuantity) {
// 	console.log('================');
// 	connection.query('UPDATE products SET stock_quantity = '
// 		+newQuantity+' WHERE item_id ='+rowId
// 		,function(err,res) {
// 			if(err) throw err;
// 			connection.end();
// 		}
// 	)
// }

// UPDATE products SET stock_quantity = '+newQuantity+' WHERE item_id ='+rowId';
// UPDATE products SET product_sales = product_sales + 5  WHERE item_id = 1010;














