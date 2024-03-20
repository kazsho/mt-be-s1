CREATE TABLE "users" (
    "userid" INTEGER PRIMARY KEY NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL
);

CREATE TABLE "audio_recordings" (
    "id" INTEGER PRIMARY KEY NOT NULL,
    "userid" INTEGER NOT NULL,
    "filename" VARCHAR(255) NOT NULL,
    "filepath" VARCHAR(255) NOT NULL,
    "creation_date" DATE NOT NULL,
    "audio_data" BLOB, 
    FOREIGN KEY("userid") REFERENCES "users"("userid")
);

ALTER TABLE
    "audio_recordings" ADD PRIMARY KEY("id");
ALTER TABLE
    "audio_recordings" ADD CONSTRAINT "audio_recordings_userid_foreign" FOREIGN KEY("userid") REFERENCES "users"("userid");