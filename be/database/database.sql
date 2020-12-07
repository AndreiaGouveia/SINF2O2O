BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "company" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"grant_type"	TEXT NOT NULL,
	"client_secret"	TEXT NOT NULL,
	"client_id"	TEXT NOT NULL,
	"scope"	TEXT NOT NULL,
	"token"	TEXT
);
CREATE TABLE IF NOT EXISTS "product" (
	"id1"	INTEGER NOT NULL UNIQUE,
	"id2"	INTEGER NOT NULL UNIQUE,
	"company1_id"	INTEGER NOT NULL,
	"company2_id"	INTEGER NOT NULL,
	PRIMARY KEY("id1","id2")
);
INSERT INTO "company" ("id","grant_type","client_secret","client_id","scope","token") VALUES (0,'client_credentials','0766a6e0-8bff-4c08-8ce0-615c2fed2668','DIFFER','application',NULL);
INSERT INTO "company" ("id","grant_type","client_secret","client_id","scope","token") VALUES (1,'client_credentials','b53799e9-5e2d-46bf-aa5c-3f383935d843','SINF-COMPANY','application',NULL);
COMMIT;
