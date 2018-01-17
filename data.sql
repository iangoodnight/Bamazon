DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) default 0,
  stock_quantity INTEGER(11) default 0,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
	("Floo Powder", "Magic", 17.37, 43),
	("Magic Wands", "Magic", 139.99, 11),
	("Cheap Sunglasses", "Fashion", 1.99, 21),
	("Blue Suede Shoes", "Fashion", 89.79, 3),
	("Ninja Stars", "Weapons", 19.19, 9),
	("Brass Knuckles", "Weapons", 9.99, 4),
	("Bull Whip", "Weapons", 14.17, 8),
	("Bison Jerkey", "Food", 4.99, 14),
	("Cookies", "Food", 0.99, 10),
	("Dragon Egg", "Magic", 499.99, 1);
