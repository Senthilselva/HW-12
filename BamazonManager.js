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
	inquirer.prompt({
	    name: "choice",
	    type: "list",
	    choices:[ "View Products for Sale",
				"View Low Inventory",
				"Add to Inventory",
				"Add New Product" ],
		message:"Select one of the following :"
		}).then (function(answer) {
			//console.log(answer);
			switch (answer.choice){
				case "View Products for Sale":
					productsForSale();
					break;
				case "View Low Inventory":
					lowInventory();
					break;
				case "Add to Inventory":
					addToInventory();
					break;
				case "Add New Product":
					addNewProduct();
					break;
			}
		}); //choice inquirer
}//Start function



var productsForSale = function(){
	console.log("productsForSale");
	connection.query('SELECT * FROM Products', function(err, res) {
    	//console.log(res);
    	var table=[];
    	for(var i=0; i < res.length; i++){
    		var row = {};
    		row.itemId = res[i].itemId;
    		row.productName = res[i].productName;
    		row.price = res[i].price;
    		row.stockQuantity = res[i].stockQuantity;
    		table.push(row)
    	}
    	console.table(table);
    	doYouWantToContinue();
    }); //query
}


var lowInventory = function(){
	console.log("lowInventory");
	connection.query('SELECT * FROM Products where stockQuantity < 50', function(err, res) {
    	//console.log(res);
    	var table=[];
    	for(var i=0; i < res.length; i++){
    		var row = {};
    		row.itemId = res[i].itemId;
    		row.productName = res[i].productName;
    		row.price = res[i].price;
    		row.stockQuantity = res[i].stockQuantity;
    		table.push(row)
    	}
    	console.table(table);
    	doYouWantToContinue();
    }); //query
}


var addToInventory = function(){
	console.log("addToInventory");
	connection.query('SELECT * FROM Products', function(err, res) {
		var table = [];
		for(var i=0; i < res.length; i++){
    		var row;
    		row= res[i].itemId +": "+res[i].productName;
    		table.push(row);
    	}

    inquirer.prompt([{
	    name: "choice",
	    type: "list",
	    choices: table,
	    message: "What do you want to add today?"
	}, {
	    name:"count",
	    type:"input",
		message:"How many units do you want to add?",
		validate: function(value) {
			if (isNaN(value) == false) {
			    return true;
			} else {
			    return false;
			}
		}
	        	
	}]).then (function(answer){
		var id = answer.choice.split(":")[0];
		console.log(id);
		updateInventory(id,answer.count);

	})//inquirer
	})//end query
}

var updateInventory = function(id,count){
	//console.log("updateInventory");

	var query = 'SELECT * FROM Products where itemId = ?'
	connection.query(query, [id], function(err, res) {
		if(err) throw err;
		var newStockQuantity = parseInt(res[0].stockQuantity) + parseInt(count);
		//newStockQuantity = parseInt(newStockQuantity);
		//id = id.parseInt();
		console.log("id "+ id + "newStockQuantity  "+ newStockQuantity )
			connection.query("UPDATE Products SET ? WHERE ?", [{
		    	stockQuantity : newStockQuantity
			},{
				itemId : id
			}], function(err1, res1) {
				if (err1) throw err1;
				//console.log(res);
				doYouWantToContinue();
			});//Update Query

	});//select Query
}

var doYouWantToContinue = function(){
	inquirer.prompt({
		name:"isContinue",
	    type:"input",
		message:"Enter Y or y if you want to continue:",
		validate: function(value) {
			if (value) {
                return true;
	        } else {
			    return false;
			}
	    }
	}).then(function(answer){
		if(answer.isContinue == "Y" || answer.isContinue =="y"){
			start();
		} else{
			return false;
		}
	});
}


var addNewProduct =function(){
	//console.log("addNewProduct");
	//Get all the Value
	inquirer.prompt([{
		name: "newProductName",
		type:"input",
		message:"Enter Product Name",
		validate:function(value){
			if (value) {
			    return true;
			} else {
			    return false;
			}
		}
	}, {
		name: "newDepartmentName",
		type:"input",
		message:"Enter Department Name",
		validate:function(value){
			if (value) {
			    return true;
			} else {
			    return false;
			}
		}

	}, {
		name: "newPrice",
		type:"input",
		message:"Enter Price",
		validate: function(value){
			if (isNaN(value) == false) {
		        return true;
			} else {
			    return false;
			}
		}
	}, {
		name: "newStockQuantity",
		type: "input",
		message:"Enter Quantity",
		validate: function(value){
			if (isNaN(value) == false) {
		        return true;
			} else {
			    return false;
			}
		}
	}]).then(function(answer){
		console.log(answer);
		var query = "INSERT INTO Products SET ?"
	//(productName,departmentName,price,stockQuantity)

		connection.query(query, {
			productName:answer.newProductName,
			departmentName:answer.newDepartmentName,
			price:answer.newPrice,
			stockQuantity:answer.newStockQuantity
            
        }, function(err, res) {
        	if(err) throw err;
            console.log(answer.newProductName+ " has been added");
            doYouWantToContinue();
        });

	});
}