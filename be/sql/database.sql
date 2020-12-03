-- Deletion of Tables

DROP TABLE IF EXISTS "product" CASCADE;
DROP TABLE IF EXISTS "company" CASCADE;
DROP TABLE IF EXISTS "warehouse" CASCADE;
DROP TABLE IF EXISTS "entity" CASCADE;
DROP TABLE IF EXISTS "transaction" CASCADE;

-- Creation of Tables

CREATE TABLE "product" (
  id1 INTEGER NOT NULL REFERENCES "company" (id) 
    ON UPDATE CASCADE ON DELETE CASCADE,
  id2 INTEGER NOT NULL REFERENCES "company" (id) 
    ON UPDATE CASCADE ON DELETE CASCADE,
  warehouse_id INTEGER NOT NULL REFERENCES "warehouse" (id) 
    ON UPDATE CASCADE ON DELETE CASCADE,
  product_name text NOT NULL,
  product_description text NOT NULL,
  category text NOT NULL
);

CREATE TABLE "company" (
  id SERIAL PRIMARY KEY,
  grant_type INTEGER NOT NULL, --Client credentials
  client_id INTEGER NOT NULL REFERENCES "entity" (id) --Company's application ID
    ON UPDATE CASCADE ON DELETE CASCADE,
  client_secret INTEGER NOT NULL, --Company's Secret key
  scope text NOT NULL, --Scope of the application
  company_role text NOT NULL  --Supplier or Provider
);

CREATE TABLE "warehouse" (
  id SERIAL PRIMARY KEY,
  warehouse_location text NOT NULL,
  max_capacity INTEGER NOT NULL,
  cur_capacity INTEGER NOT NULL
);

CREATE TABLE "entity" (
  id SERIAL PRIMARY KEY,
  vat INTEGER NOT NULL,
  phone_nr INTEGER NOT NULL,
  email text NOT NULL,
  entity_type text NOT NULL --Customer or Retailer
);

CREATE TABLE "transaction" (
  id SERIAL PRIMARY KEY,
  supplier_id INTEGER NOT NULL REFERENCES "entity" (id) 
    ON UPDATE CASCADE ON DELETE CASCADE,
  transaction_type text NOT NULL, --Buy or Sale
  transaction_value INTEGER NOT NULL,
  transaction_date TIMESTAMP NOT NULL DEFAULT now() 
    CONSTRAINT transaction_datetime_ck CHECK (transaction_date >= now())
  order text NOT NULL,
  purchase_status text NOT NULL
);
