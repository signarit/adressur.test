create table zip_codes (
	id int NOT NULL AUTO_INCREMENT,
	municipality_id int NOT NULL,
	zip_code int NOT NULL,
	name varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
	PRIMARY KEY(id, municipality_id)
);

create table municipalities (
	id int NOT NULL AUTO_INCREMENT,
	municipality_id int NOT NULL,
	name varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
	PRIMARY KEY(id, municipality_id)
);

create table roads (
	id int NOT NULL AUTO_INCREMENT,
 	road_id int NOT NULL, 
	municipality_id int NOT NULL, 
	zip_code_id int NOT NULL, 
	name varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL, 
	x decimal(9,2) NOT NULL, 
	y decimal(9,2) NOT NULL, 
	PRIMARY KEY (id, road_id, municipality_id, zip_code_id)
);

create table addresses (
	id int NOT NULL AUTO_INCREMENT,
	address_id int NOT NULL,
	road_id int NOT NULL,
	zip_code_id int NOT NULL,
	municipality_id int NOT NULL,
	x decimal(9,2) NOT NULL,
	y decimal(9,2) NOT NULL,
	house_number int,
	house_letter varchar(255),
	house_name varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
	PRIMARY KEY(id, address_id, road_id, zip_code_id, municipality_id)
);