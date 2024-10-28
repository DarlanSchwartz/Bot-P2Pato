DROP  TABLE if exists payments;
 DROP TABLE  if exists users;
CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL UNIQUE,
  telegram_id INTEGER UNIQUE NOT NULL
);
CREATE TABLE payments (
  id SERIAL PRIMARY KEY NOT NULL UNIQUE,
  status INTEGER NOT NULL DEFAULT 0,
  user_id INTEGER NOT NULL REFERENCES users(id),
  wallet_address TEXT NOT NULL,
  chat_id TEXT NOT NULL,
  amount_in_cents INTEGER NOT NULL DEFAULT 0,
  transaction_id TEXT UNIQUE NOT NULL
);
