CREATE TABLE "movimientos" (
	"id"	INTEGER,
	"fecha"	TEXT NOT NULL,
	"hora"	TEXT NOT NULL,
	"concepto"	TEXT NOT NULL,
	"es_ingreso"	INTEGER,
	"cantidad"	REAL NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
)