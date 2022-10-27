DELETE FROM orders;
DELETE FROM menu_item_tags;
DELETE FROM leaderboard_entry;
DELETE FROM staff;
DELETE FROM menu_item;
DELETE FROM tables;
DELETE FROM category;
DELETE FROM tag;

INSERT INTO staff(id, role, password) values (1, 'wait', 'waiterA0five'), (2, 'kitchen', 'kitchenA0five'),
(3, 'manager', 'managerA0five');

INSERT INTO leaderboard_entry(id, email, score, time_played) values (1, 'monkey@gmail.com', 20),
(2, 'koala@gmail.com', 50), (3, 'tiger@gmail.com', 100);

INSERT INTO category(name, visible, display_order) values ('Unassigned', FALSE, 1);
INSERT INTO category(name, visible, display_order) values ('Noodle', TRUE, 2);
INSERT INTO category(name, visible, display_order) values ('Rice bowl', TRUE, 3);
INSERT INTO category(name, visible, display_order) values ('Dessert', TRUE, 4);
INSERT INTO category(name, visible, display_order) values ('Sashimi', TRUE, 5);

INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Ahi', 'Tuna (raw)', 'Tuna', 5, 1, (SELECT id from category WHERE name = 'Sashimi'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Aji', 'Spanish Mackerel (raw)', 'Mackerel', 6, 2, (SELECT id from category WHERE name = 'Sashimi'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Amaebi', 'Sweet Shrimp (raw)', 'Shrimp', 5, 3, (SELECT id from category WHERE name = 'Sashimi'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Anago', 'Saltwater Eel — usually deep-fried or boiled', 'Eel', 6.5, 4, (SELECT id from category WHERE name = 'Sashimi'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Aoyagi', 'Round Clam (raw)', 'Round Clam', 7, 5, (SELECT id from category WHERE name = 'Sashimi'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Bincho', 'Albacore White Tuna (raw)', 'Tuna', 8, 6, (SELECT id from category WHERE name = 'Sashimi'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Katsuo', 'Skipjack Tuna (raw)', 'Tuna', 6.5, 7, (SELECT id from category WHERE name = 'Sashimi'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Ebi', 'Tiger Shrimp (cooked)', 'Tiger Shrimp', 6.5, 8, (SELECT id from category WHERE name = 'Sashimi'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Escolar', 'Butterfish (raw)', 'Butterfish', 5, 9, (SELECT id from category WHERE name = 'Sashimi'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Hamachi', 'Yellow Tail (raw)', 'Yellow Tail', 5.5, 10, (SELECT id from category WHERE name = 'Sashimi'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Hamachi Toro', 'Yellowtail Belly (raw)', 'Yellowtail Belly', 8, 11, (SELECT id from category WHERE name = 'Sashimi'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Hirame', 'Halibut (raw)', 'Halibut', 5, 12, (SELECT id from category WHERE name = 'Sashimi'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Hokigai', 'Surf Clam (cooked)', 'Surf Clam', 6, 13, (SELECT id from category WHERE name = 'Sashimi'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Hotate', 'Scallop (raw)', 'Scallop', 8, 14, (SELECT id from category WHERE name = 'Sashimi'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Ika', 'Squid (the body is served raw, the tentacles are cooked)', 'Squid', 5.5, 15, (SELECT id from category WHERE name = 'Sashimi'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Ikura', 'Salmon Roe (fish eggs)', 'Salmon Roe', 4.5, 16, (SELECT id from category WHERE name = 'Sashimi'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Iwashi', 'Sardine (raw)', 'Sardine', 6, 17, (SELECT id from category WHERE name = 'Sashimi'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Kani', 'Crab Meat (cooked)', 'Crab Meat', 7, 18, (SELECT id from category WHERE name = 'Sashimi'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Kanpachi', 'Amberjack (raw)', 'Amberjack', 4, 19, (SELECT id from category WHERE name = 'Sashimi'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Maguro', 'Tuna (raw)', 'Tuna', 7, 20, (SELECT id from category WHERE name = 'Sashimi'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Saba', 'Mackerel (raw)', 'Mackerel', 6.5, 21, (SELECT id from category WHERE name = 'Sashimi'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Sake', 'Salmon (raw)', 'Salmon', 5, 22, (SELECT id from category WHERE name = 'Sashimi'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Sake Toro', 'Salmon Belly (raw)', 'Salmon Belly', 4, 23, (SELECT id from category WHERE name = 'Sashimi'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Tai', 'Red Snapper (raw)', 'Red Snapper', 5.5, 24, (SELECT id from category WHERE name = 'Sashimi'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Tako', 'Octopus (cooked)', 'Octopus', 6.5, 25, (SELECT id from category WHERE name = 'Sashimi'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Tamago', 'Sweet Egg Omelet (cooked)', 'Egg', 8.5, 26, (SELECT id from category WHERE name = 'Sashimi'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Toro', 'Blue Fin Belly (raw)', 'Blue Fin Belly', 6, 27, (SELECT id from category WHERE name = 'Sashimi'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Tsubugai', 'Whelk Clam (raw)', 'Whelk Clam', 4.5, 28, (SELECT id from category WHERE name = 'Sashimi'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Umi Masu', 'Ocean Trout (raw)', 'Ocean Trout', 8.5, 29, (SELECT id from category WHERE name = 'Sashimi'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Unagi', 'Barbequed Freshwater Eel', 'Eel', 7, 30, (SELECT id from category WHERE name = 'Sashimi'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Uni', 'Sea Urchin (raw)', 'Sea Urchin', 4, 31, (SELECT id from category WHERE name = 'Sashimi'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Champon', 'Noodle dish from Japanese-Chinese cuisine', 'Pork, Oyster, Prawn, Cabbage, Mushroom, Onion, Bean sprout, Lard, Chicken stock', 12.5, 32, (SELECT id from category WHERE name = 'Noodle'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Hoto', 'Japanese noodle soup dish', 'Pork, Chicken, Tofu, Vegetables, Kabocha squaash, Carrot, Negi (long green onion) or leek or green onion, Daikon radish, Potato, Napa cabbage, Any seasonal vegetables', 12, 33, (SELECT id from category WHERE name = 'Noodle'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Okinawa soba', 'Type of Japanese noodle', 'Wheat noodles, Konbu, Fish cakes, Pork, Sliced scallion, Soki, Koregusu', 18.5, 34, (SELECT id from category WHERE name = 'Noodle'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Ramen', 'Japanese dish of wheat noodles in a meat or fish broth', 'Garlic, Ginger, Shallot, Pork, Sesame oil, Miso, Sake, Chicken broth, Ramen, Bean sprout, Egg, Nori, Green onion', 12.5, 35, (SELECT id from category WHERE name = 'Noodle'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Shirataki noodles', 'Type of Japanese noodles made from konjac yam', 'Shirataki noodles, Tahini, Soy sauce, Rice vinegar, Red pepper flakes, Shredded cabbage', 13, 36, (SELECT id from category WHERE name = 'Noodle'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Sara udon', 'Japanese noodle dish topped with vegetables', 'Pork belly, Shrimp, Squid, Sake, Soy sauce, Mushrooms, Quail eggs, Fish cake, Onion, Carrot, Napa cabbage, Mushrooms, Snow peas', 18.5, 37, (SELECT id from category WHERE name = 'Noodle'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Udon', 'Thick Japanese noodle made from wheat flour', 'Rib eye, Udon noodles, Noodle soup base, Fish cakes, Soy sauce', 15.5, 38, (SELECT id from category WHERE name = 'Noodle'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Somen', 'Type of East Asian noodles', 'Egg, Chicken, Tofu, Ham, Cherry tomatoes, Cucumber, Blanched okra, Shiitake mushrooms, Sesame seeds, Seaweed', 13.5, 39, (SELECT id from category WHERE name = 'Noodle'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Tensoba', 'Japanese noodle dish', 'Soba noodles, Soy sauce, Tempura, Kombu kelp, Tiger prawns, Shiitake mushrooms', 13, 40, (SELECT id from category WHERE name = 'Noodle'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Toshikoshi soba', 'Noodle dish eaten in Japan on New Year Eve', 'Soba noodles, Noodle soup base, Fish cake, Soy sauce, Prawn, Shichimi togarashi', 15.5, 41, (SELECT id from category WHERE name = 'Noodle'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Tsukemen', 'Japanese noodle dish', 'Pork belly, Ramen noodles, Soup base, Soy sauce, Egg, Sesame oil, Bonito flakes', 14, 42, (SELECT id from category WHERE name = 'Noodle'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Yaki udon', 'Japanese fried noodle dish', 'Udon noodles, Oyster sauce, Dark oyster sauce, Noodle soup base, Cabbage', 16.5, 43, (SELECT id from category WHERE name = 'Noodle'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Yakisoba', 'Japanese fried noodle dish', 'Pork belly, Cabbage, Carrot, Beans, Yakisoba noodles, Soy sauce, Boneless chicken, Worcestershire', 17.5, 44, (SELECT id from category WHERE name = 'Noodle'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Oyakodon (Chicken and Egg bowl)', 'A play on the chicken-and-egg combination, this protein-filled home style dish wins for its simplicity. Its hearty yet nutritious, making it a favorite meal to start the week.', 'Rice, Egg, Chicken, Chives', 12.5, 45, (SELECT id from category WHERE name = 'Rice bowl'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Gyudon (Beef Bowl)', 'Thinly sliced beef simmered with onion in a savory-sweet sauce, Gyudon (beef bowl) is probably one of the most popular types of donburi in Japan.', 'Rice, Beef, Onion, Ginger, Scallion', 9.5, 46, (SELECT id from category WHERE name = 'Rice bowl'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Chicken Katsudon', 'Chicken Katsudon (Chicken Cutlet Rice Bowl) features crispy chicken katsu that has been simmered in savory dashi sauce with thinly sliced onion and a scrambled egg.', 'Chicken, Rice, Egg, Onion, Dashi sauce', 11, 47, (SELECT id from category WHERE name = 'Rice bowl'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Soy-Glazed Eggplant Donburi', 'Thinly sliced eggplant seared till golden brown, coated with sweet soy sauce, and served over a warm bowl of rice. ', 'Eggplant, Rice, Sesame seeds, Chives, Soy sauce', 12.5, 48, (SELECT id from category WHERE name = 'Rice bowl'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Mapo Tofu', 'Silken tofu with ground pork mixture cooked in an intensely flavorful sauce and served in rice bowl style', 'Tofu, Ground pork, Rice, Green onions, Chilli, Mushrooms', 9, 49, (SELECT id from category WHERE name = 'Rice bowl'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Pork Curry Donburi', 'Your classic pork curry donburi made from flavorful ingredients.', 'Rice, Pork, Green onions, Soy sauce', 12, 50, (SELECT id from category WHERE name = 'Rice bowl'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Banana Sushi', 'This Japanese-inspired dessert combines bananas, chocolate, and pistachios to make one heavenly bite. It may not be authentic wagashi, but it sure is yummy.', 'Bananas, Chocolate', 17.5, 51, (SELECT id from category WHERE name = 'Dessert'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Purin', 'Purin is the Japanese version of crème caramel. It is rich, creamy, and impossible to resist.', 'Purin, Flan, Pudding, Crème Caramel', 14.5, 52, (SELECT id from category WHERE name = 'Dessert'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Coffee Jelly', 'Cubes of coffee-flavored jelly swimming in thick sweetened cream: that is what I call the perfect combination.', 'Coffee, Jelly, Cream', 16, 53, (SELECT id from category WHERE name = 'Dessert'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Green Tea Cookies', 'Crisp and buttery with a distinct matcha flavor, green tea cookies are to die for!', 'Matcha powder, cookie', 18, 54, (SELECT id from category WHERE name = 'Dessert'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Green Tea Icecream', 'This ice cream is subtly sweet with bitter and smoky undertones. It is an excellent treat for those who cannot stand overly sweet and rich desserts! ', 'Matcha powder, Ice cream', 18, 55, (SELECT id from category WHERE name = 'Dessert'), null, TRUE);
INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Rice Krispies Candy Sushi', 'Here is another sweet sushi: rice gummy candies and Rice Krispies topped wrapped in fruit roll-ups. ', 'Rice gummy candies, Fruit roll-up', 16, 56, (SELECT id from category WHERE name = 'Dessert'), null, TRUE);

INSERT INTO tag(name) values ('vegetarian');
INSERT INTO tag(name) values ('vegan');
INSERT INTO tag(name) values ('pescatarian');
INSERT INTO tag(name) values ('gluten free');
INSERT INTO tag(name) values ('nut free');
INSERT INTO tag(name) values ('dairy free');
INSERT INTO tag(name) values ('chef recommended');

INSERT INTO tables(num, budget, needs_assistance, occupied) values (1, null, False, False), (2, 99.99, False, True), (3, 500, True, True);

INSERT INTO menu_item_tags(menu_item, tag) values ((SELECT id from menu_item WHERE name = 'Banana Sushi'), (SELECT id from tag WHERE name = 'vegetarian'));
INSERT INTO menu_item_tags(menu_item, tag) values ((SELECT id from menu_item WHERE name = 'Banana Sushi'), (SELECT id from tag WHERE name = 'vegan'));
INSERT INTO menu_item_tags(menu_item, tag) values ((SELECT id from menu_item WHERE name = 'Banana Sushi'), (SELECT id from tag WHERE name = 'pescatarian'));
INSERT INTO menu_item_tags(menu_item, tag) values ((SELECT id from menu_item WHERE name = 'Green Tea Icecream'), (SELECT id from tag WHERE name = 'gluten free'));
INSERT INTO menu_item_tags(menu_item, tag) values ((SELECT id from menu_item WHERE name = 'Ahi'), (SELECT id from tag WHERE name = 'pescatarian'));
INSERT INTO menu_item_tags(menu_item, tag) values ((SELECT id from menu_item WHERE name = 'Ebi'), (SELECT id from tag WHERE name = 'pescatarian'));

INSERT INTO orders(menu_item, table_num, status) values ((SELECT id from menu_item WHERE name = 'Ahi'), (SELECT id from tables WHERE num = 2), 'ordered');
INSERT INTO orders(menu_item, table_num, status) values ((SELECT id from menu_item WHERE name = 'Ebi'), (SELECT id from tables WHERE num = 2), 'cooking');
INSERT INTO orders(menu_item, table_num, status) values ((SELECT id from menu_item WHERE name = 'Tai'), (SELECT id from tables WHERE num = 2), 'ordered');
INSERT INTO orders(menu_item, table_num, status) values ((SELECT id from menu_item WHERE name = 'Udon'), (SELECT id from tables WHERE num = 2), 'completed');
INSERT INTO orders(menu_item, table_num, status) values ((SELECT id from menu_item WHERE name = 'Banana Sushi'), (SELECT id from tables WHERE num = 3), 'completed');
INSERT INTO orders(menu_item, table_num, status) values ((SELECT id from menu_item WHERE name = 'Banana Sushi'), (SELECT id from tables WHERE num = 3), 'ordered');