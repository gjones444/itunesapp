CREATE TABLE itunes_bought_products (
user_id INT NOT NULL,
song_id INT NOT NULL,
FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
id SERIAL PRIMARY KEY
);

CREATE TABLE songs (
  id INT PRIMARY KEY,
  song_title varchar(255),
  song_artist varchar(255),
  price INT
)

CREATE TABLE users (
  user_id INT SERIAL UNQIUE PRIMARY KEY,
  username varchar(255),
  email varchar(255),
  password varchar(255)
)

INSERT INTO songs (id, song_title, song_artist, price)
	VALUES('105','Redemption Song', 'Bob Marley', '5');

INSERT INTO songs (id, song_title, song_artist, price)
	VALUES('106','Let Me Ride', 'DR. DRE', '5');

INSERT INTO songs (id, song_title, song_artist, price)
	VALUES('107','Purple Rain', 'Prince', '5');

INSERT INTO songs (id, song_title, song_artist, price)
	VALUES('108','Grover Washington Jr', 'Like That', '5');

INSERT INTO songs (id, song_title, song_artist, price)
	VALUES('109','Party All The Time', 'Eddie Murphy', '5')
