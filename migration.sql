CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;
CREATE TABLE "Applications" (
    "Id" uuid NOT NULL,
    "ParentFirstName" character varying(50) NOT NULL,
    "ParentLastName" character varying(70) NOT NULL,
    "ParentEmail" character varying(50) NOT NULL,
    "ParentPhone" character varying(30) NOT NULL,
    "ChildName" character varying(50) NOT NULL,
    "ChildBirthDate" timestamp with time zone NOT NULL,
    "isReviewed" boolean NOT NULL,
    "isDeleted" boolean NOT NULL,
    CONSTRAINT "PK_Applications" PRIMARY KEY ("Id")
);

CREATE TABLE "Groups" (
    "Id" uuid NOT NULL,
    "GroupName" character varying(70) NOT NULL,
    "Description" character varying(300) NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "isActive" boolean NOT NULL,
    "isDeleted" boolean NOT NULL,
    CONSTRAINT "PK_Groups" PRIMARY KEY ("Id")
);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260129110411_initial', '10.0.2');

COMMIT;

START TRANSACTION;
INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260129111903_InitialTables', '10.0.2');

COMMIT;

