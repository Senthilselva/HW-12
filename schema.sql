-- Creates the "Bamazon_db" database --
CREATE DATABASE Bamazon_db;

-- Makes it so all of the following code will affect Bamazon_db --
USE Bamazon_db;

-- Creates the table "Products" within additional_favorites_db --
CREATE TABLE Products (
	-- Creates a numeric column called "itemId" which will automatically increment its default value as we create new rows --
	itemId INTEGER(11) AUTO_INCREMENT NOT NULL,
	-- Makes a string column called "productName" which cannot contain null --
    productName VARCHAR(30) NOT NULL,
    -- Makes a string column called "departmentName" which cannot contain null --
    departmentName VARCHAR(30) NOT NULL,
	-- Makes an numeric column called "price" --
    price DECIMAL(10,2),
	-- Makes an numeric column called "stockQuantity" --
    stockQuantity DECIMAL(10,2),
    -- Sets itemId as this table's primary key which means all data contained within it will be unique --
    PRIMARY KEY (itemId)

);


