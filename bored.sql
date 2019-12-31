CREATE TABLE IF NOT EXISTS bored(
id SERIAL PRIMARY KEY,
activity VARCHAR(255),
accessibility VARCHAR(255),
type VARCHAR(255),
participants VARCHAR(255),
price VARCHAR(255),
key VARCHAR(255),
username VARCHAR(255)
);


INSERT INTO bored (activity, accessibility, type, participants, price, key, username)
VALUES('Swimming', '5', 'athletic', '5', '5', '23454334', 'tom');



