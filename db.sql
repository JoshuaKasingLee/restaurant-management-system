CREATE TABLE tag (
	id serial NOT null,
	name varchar(100) NOT null,
	PRIMARY KEY (id)
);

CREATE TABLE category (
	id serial NOT null,
	name varchar(100) NOT null,
	display_order int NOT null,
    visible bool NOT null,
	PRIMARY KEY (id)
);

CREATE TABLE menu_item (
	id serial NOT null,
	name varchar(100) unique NOT null,
	description varchar(200) NOT null,
	ingredients varchar(150) NOT null,
	cost float check (cost > 0),
	display_order int NOT null,
	category int NOT null,
    image varchar(200),
    visible bool NOT null,
	PRIMARY KEY (id),
	FOREIGN KEY (category) REFERENCES category(id)
);

CREATE TABLE staff (
	id serial NOT null,
	role varchar(20) unique NOT null,
	password varchar(100),
	PRIMARY KEY (id),
	check (role in ('wait', 'kitchen', 'manager')),
	check (password ~ '[0-9]'),
	check (password ~ '[A-Z]'),
	check(length(password) >= 10)
);

CREATE TABLE leaderboard_entry (
	id serial NOT null,
	email varchar(100) unique NOT null CHECK(email LIKE '%@%'),
	score int NOT null,
	time_played date NOT null,
	PRIMARY KEY (id)
);