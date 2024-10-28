ALTER DATABASE bee2p SET TIMEZONE TO 'America/Sao_Paulo';
DROP  TABLE if exists payments;
DROP TABLE  if exists users;
CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL UNIQUE,
  telegram_id TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE payments (
  id SERIAL PRIMARY KEY NOT NULL UNIQUE,
  status INTEGER NOT NULL DEFAULT 0,
  user_id INTEGER NOT NULL REFERENCES users(id),
  wallet_address TEXT NOT NULL,
  chat_id TEXT NOT NULL,
  amount_in_cents INTEGER NOT NULL DEFAULT 0,
  transaction_id TEXT UNIQUE NOT NULL,
  pix_copy_and_paste TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);