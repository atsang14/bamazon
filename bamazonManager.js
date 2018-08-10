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


    // * View Products for Sale
    
    // * View Low Inventory
    
    // * Add to Inventory
    
    // * Add New Product

inquirer.prompt([
	{
		type: 'list',
		message: 'Menu options, select one!',
		choices: ['View Products for Sale','View Low Inventory',
		'Add to Inventory','Add New Product'],
		name: 'menu'
	}
	]).then(function(inquireResponse) {
		console.log(inquireResponse.menu);
		runOption(inquireResponse.menu);
});

function runOption(userResponse) {
	if(userResponse == 'View Products for Sale') {

		viewProducts();

	} else if (userResponse == 'View Low Inventory') {
		
		viewLowInventory();

	}else if (userResponse == 'Add to Inventory') {

		addToInventory();

	}else if (userResponse == 'Add New Product') {
		console.log('hi');
	}
}

// * If a manager selects `View Products for Sale`, 
// the app should list every available item: the item IDs, names, prices, and quantities.

// this function will run a query to view all the products available.
function viewProducts() {
	
	connection.query('SELECT item_id, product_name, department_name, price, stock_quantity '+
	'FROM products', function(err,res) {
		if(err) throw err;
		console.log('----------- Current Items -----------')
		console.log(res);
		connection.end();
	});
}

  
// this function will run a query to get all the Low in inventory
function viewLowInventory() {

	connection.query('SELECT * FROM products WHERE stock_quantity <= 200', function(err,res) {
		if(err) throw err;
		console.log('----------- Current Items Low in Inventory -----------')
		console.log(res);
		connection.end();	
	});
}

// This function allows the user to add the ID of the item
// they wish to add to.
function addToInventory() {

	connection.query('SELECT * FROM products', function(err,res){

		if(err) throw err;
		console.log(res);
		inquirer.prompt([
			{
				type: 'input',
				message: 'enter the Item Id you would like to add more to.',
				name: 'addInvId'
			}
			]).then(function(inquireResponse) {
				
				var id = inquireResponse.addInvId
				idValidCheck(id);

			});

	});
	
}

// this function checks whether or not the Id input was a valid input
// If the Id is invalid, then we bring the user back to prior prompt
// If it was a valid input then Ask how much would they like to add
function idValidCheck(responseId) {

	connection.query('SELECT stock_quantity, product_name, price FROM products WHERE item_id = '
	 + responseId,
	 	function(err,res) {
	 			
	 			if(res == '' || res == null) {
	 				
	 				inquirer.prompt([
						{
							type: 'input',
							message: 'You entered an invalid Id number.'+
							' Enter anything to re-submit an Id number. Or Type "exit" to exit',
							name: 'addInvId'
						}
						]).then(function(response) {
							
							if(response.addInvId == 'exit') {
								
								connection.end();

							} else {
								
								addToInventory();

							}
							
						})

				} else if (res != '') {
					console.log('=====================');
					inquirer.prompt([
						{
							type: 'input',
							message: 'How much '+res[0].product_name+' would you like to add?',
							name: 'amount'
						}
						]).then(function(inquireResponse){
							
							var amount = parseInt(inquireResponse.amount);
							var id     = responseId;
							var stock  = parseInt(res[0].stock_quantity);
							stock = amount + stock;

							updateProduct(responseId, stock);
							
						})
				}
	 	});
}

// this is the update function. This will actually update the table
// based on the item_id and amount wished to be updated.
function updateProduct(itemId,amount) {

	connection.query('UPDATE products SET stock_quantity = '+amount+
		' WHERE item_id = ' + itemId ,function(err,res) {

			if(err) throw err;
			console.log('=====================');
			console.log('Update Successful!');
			connection.end();	
		})
}

function addNewProduct() {

}	



	



	



	



	