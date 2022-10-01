DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS menu_item_tags;
DROP TABLE IF EXISTS leaderboard_entry;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS menu_item;
DROP TABLE IF EXISTS tables;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS tag;

CREATE TABLE tag (
  id serial NOT null,
  name varchar(100) unique NOT null,
  PRIMARY KEY (id)
);

CREATE TABLE category (
  id serial NOT null,
  name varchar(100) unique NOT null,
  display_order int NOT null,
  visible bool NOT null,
  PRIMARY KEY (id)
);

CREATE TABLE tables (
  id serial NOT null,
  num int unique NOT null check (num > 0),
  budget float check (budget > 0),
  needs_assistance bool NOT null default false,
  occupied bool NOT null default false,
  PRIMARY KEY (id)
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

CREATE TABLE menu_item (
  id serial NOT null,
  name varchar(100) unique NOT null,
  description varchar(200) NOT null,
  ingredients varchar(150) NOT null,
  cost float NOT null check (cost > 0),
  display_order int NOT null,
  category int NOT null,
  image varchar(200),
  visible bool NOT null,
  PRIMARY KEY (id),
  FOREIGN KEY (category) REFERENCES category(id)
);

CREATE TABLE leaderboard_entry (
  id serial NOT null,
  email varchar(100) unique NOT null CHECK(email LIKE '%@%'),
  score int NOT null,
  time_played date NOT null,
  PRIMARY KEY (id)
);

CREATE TABLE menu_item_tags (
  menu_item int NOT null, 
  tag int NOT null,
  PRIMARY KEY (menu_item, tag),
  FOREIGN KEY (menu_item) REFERENCES menu_item (id),
  FOREIGN KEY (tag) REFERENCES tag (id)
);

CREATE TABLE orders (
  id serial NOT null,
  time_ordered timestamp NOT null,
  menu_item int NOT null,
  table_num int NOT null,
  status varchar(10) NOT null check (status in ('ordered', 'cooking', 'prepared', 'completed')),
  PRIMARY KEY (id),
  FOREIGN KEY (menu_item) REFERENCES menu_item (id),
  FOREIGN KEY (table_num) REFERENCES tables (id)
);