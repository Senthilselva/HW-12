var mysql = require('mysql');
var inquirer = require('inquirer');
require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "root", //Your password
    database: "Bamazon_db"
})

connection.connect(function(err) {
    if (err) throw err;
    //console.log("connected as id " + connection.threadId);
    start();
})

var start = function() {
	connection.query('SELECT * FROM Products', function(err, res) {
    	//console.log(res);
    	var table=[];
    	for(var i=0; i < res.length; i++){
    		var row = {};
    		row.itemId = res[i].itemId;
    		row.productName = res[i].productName;
    		row.price = res[i].price;
    		table.push(row)
    	}
    	console.table(table);

		inquirer.prompt([{
	            name: "choice",
	            type: "rawlist",
	            choices: function(value) {
	                var choiceArray = [];
	                for (var i = 0; i < res.length; i++) {
	                	var id = res[i].itemId.toString();
	  
	                	//console.log(id);
	                    choiceArray.push(id);
	                }
	               // console.log(choiceArray)
	                return choiceArray;
	            },
	            message: "What do you want to buy today ?"
	         
	        }, {
	        		name:"count",
	        		type:"input",
		        	message:"How many units do you want?",
		        	validate: function(value) {
			            if (isNaN(value) == false) {
			                return true;
			            } else {
			                return false;
			            }
			        }
	        	
	        }]).then(function(answer) {
	        	//console.log(answer);
	        	updateProducts(answer.choice , answer.count);
	        }); //inquirer for selecting the list

	    });//ending the query
}


var updateProducts = function(id,count){

	var query = 'SELECT * FROM Products where itemId = ?'
	connection.query(query, [id], function(err, res) {
		if(err) throw err;
		if(res[0].stockQuantity >= count){
			//console.log("update");
			var newStockQuantity = res[0].stockQuantity - count;
			newStockQuantity = parseInt(newStockQuantity);
			connection.query("UPDATE Products SET ? WHERE ?", [{
    			stockQuantity : newStockQuantity
			},{
				itemId : id
			}], function(err1, res1) {
				if (err1) throw err1;
				console.log("Total Cost " + res[0].price*count);
			});
		} else {
			console.log("Insufficient quantity!");
		}
	});//query
}



