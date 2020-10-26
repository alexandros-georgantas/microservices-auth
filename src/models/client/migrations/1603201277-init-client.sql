CREATE TABLE clients (
  id UUID PRIMARY KEY,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  updated TIMESTAMP WITH TIME ZONE,
  client_secret_hash TEXT NOT NULL,
  type text not null
);
