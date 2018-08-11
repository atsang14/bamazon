var mysql 	   = require('mysql');
var inquirer   = require('inquirer');
let Table 	   = require('tty-table');
var chalk	   = require('chalk');

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

inquirer.prompt([
	{
		type: 'list',
		message: 'Would you like to view Product Sales or Create a new Department?',
		choices: ['View Product Sales by Department', 'Create New Department'],
		name: 'prompt'
	}
]).then(function(inquireResponse) {
	if(inquireResponse.prompt == 'View Product Sales by Department') viewProudctSales();
	else return;
})

// the function will run a query to view the product sales
function viewProudctSales() {
	connection.query('SELECT departments.department_id, departments.department_name, over_head_costs, SUM(product_sales), (SUM(product_sales) - over_head_costs) AS total_profit '
		+'FROM departments '
		+'LEFT JOIN products '
		+'ON departments.department_name = products.department_name '
		+'GROUP BY department_name, department_id'
		,function(err, res) {
			console.log(res);
			connection.end();
		}
	)
}






var header = [
  {
    value : "item",
    headerColor : "cyan",
    color: "white",
    align : "left",
    paddingLeft : 5,
    width : 30
  },
  {
    value : "price",
    color : "red", 
    width : 10,
    formatter : function(value){
      var str = "$" + value.toFixed(2);
      if(value > 5){
        str = chalk.underline.green(str);
      }
      return str;
    }
  },
  {
    alias : "Is organic?",  
    value : "organic",
    width : 15,
    formatter : function(value){
      
      //will convert an empty string to 0  
      //value = value * 1;
      
      if(value === 'yes'){
        value = chalk.black.bgGreen(value);
      }
      else{
        value = chalk.white.bgRed(value);
      }
      return value;
    }
  }
];

//Example with arrays as rows 
var rows = [
  ["hamburger",2.50,"no"],
  ["el jefe's special cream sauce",0.10,"yes"],
  ["two tacos, rice and beans topped with cheddar cheese",9.80,"no"],
  ["apple slices",1.00,"yes"],
  ["ham sandwich",1.50,"no"],
  ["macaroni, ham and peruvian mozzarella",3.75,"no"]
];

var footer = [
  "TOTAL",
  (function(){
    return rows.reduce(function(prev,curr){
      return prev+curr[1]
    },0)
  }()),
  (function(){
    var total = rows.reduce(function(prev,curr){
      return prev+((curr[2]==='yes') ? 1 : 0);
    },0);
    return (total/rows.length*100).toFixed(2) + "%";
  }())];

var t1 = Table(header,rows,footer,{
  borderStyle : 1,
  borderColor : "blue",
  paddingBottom : 0,
  headerAlign : "center",
  align : "center",
  color : "white",
  truncate: "..."
});

str1 = t1.render();
console.log(str1);


//Example with objects as rows 
var rows = [
  {
    item : "hamburger",
    price : 2.50,
    organic : "no"
  },
  {
    item : "el jefe's special cream sauce",
    price : 0.10,
    organic : "yes"
  },
  {
    item : "two tacos, rice and beans topped with cheddar cheese",
    price : 9.80,
    organic : "no"
  },
  {
    item : "apple slices",
    price : 1.00,
    organic : "yes"  
  },  
  {
    item : "ham sandwich",
    price : 1.50,
    organic : "no"
  },
  {
    item : "macaroni, ham and peruvian mozzarella",
    price : 3.75,
    organic : "no"
  }
];

var t2 = Table(header,rows,{
  borderStyle : 1,
  paddingBottom : 0,
  headerAlign : "center",
  align : "center",
  color : "white"
});

var str2 = t2.render();
console.log(str2);


//template literals
let header3 = [
  { value: 'name', width: 30, headerAlign: 'left' },
  { value: 'price', width: 30, headerAlign: 'left' }
];

const opts = {
  align: 'left'
};

const data = [
  [`apple ${chalk.red("mac")}`,92.50],
  ["ibm",120.15]
 ]

let t3 = Table(header3,data, opts);
console.log(t3.render()); 
















// SELECT departments.department_id, departments.department_name, over_head_costs, SUM(product_sales), (SUM(product_sales) - over_head_costs) AS total_profit
// FROM departments
// LEFT JOIN products
// ON departments.department_name = products.department_name
// GROUP BY department_name, department_id;



























