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
  ingredients varchar(250) NOT null,
  cost float NOT null check (cost > 0),
  display_order int NOT null,
  category int NOT null,
  image varchar(1000),
  visible bool NOT null,
  PRIMARY KEY (id),
  FOREIGN KEY (category) REFERENCES category(id)
);

CREATE TABLE leaderboard_entry (
  id serial NOT null,
  name varchar(100) NOT null,
  email varchar(100) NOT null CHECK(email LIKE '%@%'),
  score int NOT null,
  ts TIMESTAMP,
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
  time_ordered timestamp NOT null default CURRENT_TIMESTAMP,
  menu_item int NOT null,
  table_num int NOT null,
  status varchar(10) NOT null check (status in ('ordered', 'cooking', 'prepared', 'completed')),
  PRIMARY KEY (id),
  FOREIGN KEY (menu_item) REFERENCES menu_item (id),
  FOREIGN KEY (table_num) REFERENCES tables (id)
);


INSERT INTO staff(id, role, password) values (1, 'wait', 'waiterA0five'), (2, 'kitchen', 'kitchenA0five'),
(3, 'manager', 'managerA0five');

INSERT INTO tag(name) values ('vegetarian');
INSERT INTO tag(name) values ('vegan');
INSERT INTO tag(name) values ('gluten free');
INSERT INTO tag(name) values ('nut free');
INSERT INTO tag(name) values ('dairy free');
INSERT INTO tag(name) values ('chef recommended');

INSERT INTO leaderboard_entry(name, email, score, ts) values ('monk', 'monkey@gmail.com', 20, '2020-10-25 20:02:30');

INSERT INTO tables(num, budget, needs_assistance, occupied) values (1, null, False, False), (2, 99.99, False, True), (3, 500, True, True);


INSERT INTO category(name, visible, display_order) values ('Sashimi', FALSE, 1);
INSERT INTO category(name, visible, display_order) values ('Noodle', TRUE, 2);
INSERT INTO category(name, visible, display_order) values ('Rice bowl', TRUE, 3);
INSERT INTO category(name, visible, display_order) values ('Dessert', TRUE, 4);
INSERT INTO category(name, visible, display_order) values ('Unassigned', TRUE, 5);

INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Ahi', 'Tuna (raw)', 'Tuna', 5, 1, (SELECT id from category WHERE name = 'Sashimi'), 'https://www.japan-guide.com/g8/2044_maguro.jpg', TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Aji', 'Spanish Mackerel (raw)', 'Mackerel', 6, 2, (SELECT id from category WHERE name = 'Sashimi'), 'https://www.japan-guide.com/g9/2044_sake.jpg', TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Amaebi', 'Sweet Shrimp (raw)', 'Shrimp', 5, 3, (SELECT id from category WHERE name = 'Sashimi'), 'https://www.japan-guide.com/g8/2044_tai.jpg', TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Anago', 'Saltwater Eel — usually deep-fried or boiled', 'Eel', 6.5, 4, (SELECT id from category WHERE name = 'Sashimi'), 'https://www.japan-guide.com/g8/2044_saba.jpg', TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Aoyagi', 'Round Clam (raw)', 'Round Clam', 7, 5, (SELECT id from category WHERE name = 'Sashimi'), 'https://www.japan-guide.com/g8/2044_katsuo.jpg', TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Bincho', 'Albacore White Tuna (raw)', 'Tuna', 8, 6, (SELECT id from category WHERE name = 'Sashimi'), 'https://www.japan-guide.com/g8/2044_kanpachi.jpg', TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Katsuo', 'Skipjack Tuna (raw)', 'Tuna', 6.5, 7, (SELECT id from category WHERE name = 'Sashimi'), 'https://www.japan-guide.com/g9/2044_buri.jpg', TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Ebi', 'Tiger Shrimp (cooked)', 'Tiger Shrimp', 6.5, 8, (SELECT id from category WHERE name = 'Sashimi'), 'https://www.japan-guide.com/g8/2044_ika.jpg', TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Escolar', 'Butterfish (raw)', 'Butterfish', 5, 9, (SELECT id from category WHERE name = 'Sashimi'), 'https://www.japan-guide.com/g9/2044_tako.jpg', TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Hamachi', 'Yellow Tail (raw)', 'Yellow Tail', 5.5, 10, (SELECT id from category WHERE name = 'Sashimi'), 'https://www.japan-guide.com/g8/2044_amaebi.jpg', TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Hamachi Toro', 'Yellowtail Belly (raw)', 'Yellowtail Belly', 8, 11, (SELECT id from category WHERE name = 'Sashimi'), 'https://www.japan-guide.com/g8/2044_hotate.jpg', TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Hirame', 'Halibut (raw)', 'Halibut', 5, 12, (SELECT id from category WHERE name = 'Sashimi'), 'https://www.japan-guide.com/g8/2044_akagai.jpg', TRUE);

INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Champon', 'Noodle dish from Japanese-Chinese cuisine', 'Pork, Oyster, Prawn, Cabbage, Mushroom, Onion, Bean sprout, Lard, Chicken stock', 12.5, 32, (SELECT id from category WHERE name = 'Noodle'), 'https://www.japan-guide.com/g9/105_tanuki.jpg', TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Hoto', 'Japanese noodle soup dish', 'Pork, Chicken, Tofu, Vegetables, Kabocha squaash, Carrot, Negi (long green onion) or leek or green onion, Daikon radish, Potato, Napa cabbage, Any seasonal vegetables', 12, 33, (SELECT id from category WHERE name = 'Noodle'), 'https://www.japan-guide.com/g9/105_kitsune.jpg', TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Okinawa soba', 'Type of Japanese noodle', 'Wheat noodles, Konbu, Fish cakes, Pork, Sliced scallion, Soki, Koregusu', 18.5, 34, (SELECT id from category WHERE name = 'Noodle'), 'https://www.japan-guide.com/g9/105_tsukimi.jpg', TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Ramen', 'Japanese dish of wheat noodles in a meat or fish broth', 'Garlic, Ginger, Shallot, Pork, Sesame oil, Miso, Sake, Chicken broth, Ramen, Bean sprout, Egg, Nori, Green onion', 12.5, 35, (SELECT id from category WHERE name = 'Noodle'), 'https://www.japan-guide.com/g9/105_tempura.jpg', TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Shirataki noodles', 'Type of Japanese noodles made from konjac yam', 'Shirataki noodles, Tahini, Soy sauce, Rice vinegar, Red pepper flakes, Shredded cabbage', 13, 36, (SELECT id from category WHERE name = 'Noodle'), 'https://www.japan-guide.com/g9/105_curry.jpg', TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Sara udon', 'Japanese noodle dish topped with vegetables', 'Pork belly, Shrimp, Squid, Sake, Soy sauce, Mushrooms, Quail eggs, Fish cake, Onion, Carrot, Napa cabbage, Mushrooms, Snow peas', 18.5, 37, (SELECT id from category WHERE name = 'Noodle'), 'https://www.japan-guide.com/g9/105_chikara.jpg', TRUE);

INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Oyakodon (Chicken and Egg bowl)', 'A play on the chicken-and-egg combination, this protein-filled home style dish wins for its simplicity. Its hearty yet nutritious, making it a favorite meal to start the week.', 'Rice, Egg, Chicken, Chives', 12.5, 45, (SELECT id from category WHERE name = 'Rice bowl'), 'https://www.japan-guide.com/g7/2043_omuraisu.jpg', TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Gyudon (Beef Bowl)', 'Thinly sliced beef simmered with onion in a savory-sweet sauce, Gyudon (beef bowl) is probably one of the most popular types of donburi in Japan.', 'Rice, Beef, Onion, Ginger, Scallion', 9.5, 46, (SELECT id from category WHERE name = 'Rice bowl'), 'https://www.japan-guide.com/g17/2035_01.jpg', TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Chicken Katsudon', 'Chicken Katsudon (Chicken Cutlet Rice Bowl) features crispy chicken katsu that has been simmered in savory dashi sauce with thinly sliced onion and a scrambled egg.', 'Chicken, Rice, Egg, Onion, Dashi sauce', 11, 47, (SELECT id from category WHERE name = 'Rice bowl'), 'https://www.japan-guide.com/g7/2043_donburi.jpg', TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Soy-Glazed Eggplant Donburi', 'Thinly sliced eggplant seared till golden brown, coated with sweet soy sauce, and served over a warm bowl of rice. ', 'Eggplant, Rice, Sesame seeds, Chives, Soy sauce', 12.5, 48, (SELECT id from category WHERE name = 'Rice bowl'), 'https://www.japan-guide.com/g17/2035_02.jpg', TRUE);

INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Banana Sushi', 'This Japanese-inspired dessert combines bananas, chocolate, and pistachios to make one heavenly bite. It may not be authentic wagashi, but it sure is yummy.', 'Bananas, Chocolate', 17.5, 51, (SELECT id from category WHERE name = 'Dessert'), 'https://img.kidspot.com.au/lkbyqOHX/kk/2015/03/5556-501533-1.jpg', TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Purin', 'Purin is the Japanese version of crème caramel. It is rich, creamy, and impossible to resist.', 'Purin, Flan, Pudding, Crème Caramel', 14.5, 52, (SELECT id from category WHERE name = 'Dessert'), 'https://asianinspirations.com.au/wp-content/uploads/2018/12/R00802_Japanese_Pudding-1024x683.jpg', TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Coffee Jelly', 'Cubes of coffee-flavored jelly swimming in thick sweetened cream: that is what I call the perfect combination.', 'Coffee, Jelly, Cream', 16, 53, (SELECT id from category WHERE name = 'Dessert'), 'https://thecoconutmama.com/wp-content/uploads/2021/10/coffee-jelly-recipe-featured.jpg', TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Green Tea Cookies', 'Crisp and buttery with a distinct matcha flavor, green tea cookies are to die for!', 'Matcha powder, cookie', 18, 54, (SELECT id from category WHERE name = 'Dessert'), 'https://www.justonecookbook.com/wp-content/uploads/2021/01/Green-Tea-Cookies-3651-I.jpg', TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Green Tea Icecream', 'This ice cream is subtly sweet with bitter and smoky undertones. It is an excellent treat for those who cannot stand overly sweet and rich desserts! ', 'Matcha powder, Ice cream', 18, 55, (SELECT id from category WHERE name = 'Dessert'), 'https://i0.wp.com/www.biggerbolderbaking.com/wp-content/uploads/2017/04/1C5A1057.jpg', TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Dango', 'Dango are chewy, small, steamed dumplings made of rice flour. They are typically served skewered three or four to a stick and topped with a sweet sauce or bean paste. ', 'Rice gummy candies, Fruit roll-up', 16, 56, (SELECT id from category WHERE name = 'Dessert'), 'https://www.japan-guide.com/g9/2312_dango.jpg', TRUE);

INSERT INTO menu_item_tags(menu_item, tag) values ((SELECT id from menu_item WHERE name = 'Banana Sushi'), (SELECT id from tag WHERE name = 'vegetarian'));
INSERT INTO menu_item_tags(menu_item, tag) values ((SELECT id from menu_item WHERE name = 'Banana Sushi'), (SELECT id from tag WHERE name = 'vegan'));
INSERT INTO menu_item_tags(menu_item, tag) values ((SELECT id from menu_item WHERE name = 'Banana Sushi'), (SELECT id from tag WHERE name = 'chef recommended'));
INSERT INTO menu_item_tags(menu_item, tag) values ((SELECT id from menu_item WHERE name = 'Green Tea Icecream'), (SELECT id from tag WHERE name = 'gluten free'));
INSERT INTO menu_item_tags(menu_item, tag) values ((SELECT id from menu_item WHERE name = 'Ahi'), (SELECT id from tag WHERE name = 'chef recommended'));
INSERT INTO menu_item_tags(menu_item, tag) values ((SELECT id from menu_item WHERE name = 'Ebi'), (SELECT id from tag WHERE name = 'chef recommended'));
