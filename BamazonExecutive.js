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
	    choices:[ "View Product Sales by Department",
				"Create New Department" ],
		message:"Select one of the following :"
		}).then (function(answer) {
			console.log(answer);
			switch (answer.choice){
				case "View Product Sales by Department":
					productSalesDep();
					break;
				case "Create New Department":
					createNewDepartment();
					break;
			}
		}); //choice inquirer	


}



var productSalesDep = function(){
    connection.query('SELECT * FROM Departments', function(err, res) {
		//console.log(res);
		var table=[];
    	for(var i=0; i < res.length; i++){
    		var row = {};
    		row.departmentId = res[i].departmentId;
    		row.departmentName = res[i].departmentName;
    		row.overHeadCosts = res[i].overHeadCosts;
    		row.totalSales = res[i].totalSales;
    		row.Profit = res[i].totalSales - res[i].overHeadCosts;
    		table.push(row)
    	}
    	console.table(table);
        
        doYouWantToContinue();

	});
}

var createNewDepartment = function(){
	inquirer.prompt([{
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
		name: "newOverHeadCosts",
		type:"input",
		message:"Enter Over Head cost",
		validate: function(value){
			if (isNaN(value) == false) {
		        return true;
			} else {
			    return false;
			}
		}
	}]).then(function(answer){
		console.log(answer);
		var query = "INSERT INTO Departments SET ?"
	//(productName,departmentName,price,stockQuantity)

		connection.query(query, {
			departmentName:answer.newDepartmentName,
			overHeadCosts:answer.newOverHeadCosts,
			totalSales:0
            
        }, function(err, res) {
        	if(err) throw err;
            console.log(answer.newDepartmentName+ " has been added");
           doYouWantToContinue();
        });

	});
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