CREATE TABLE "users"(
    "userid" INTEGER NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "users" ADD PRIMARY KEY("userid");
CREATE TABLE "audio_recordings"(
    "id" INTEGER NOT NULL,
    "userid" INTEGER NOT NULL,
    "filename" VARCHAR(255) NOT NULL,
    "filepath" VARCHAR(255) NOT NULL,
    "creation_date" DATE NOT NULL
);
ALTER TABLE
    "audio_recordings" ADD PRIMARY KEY("id");
ALTER TABLE
    "audio_recordings" ADD CONSTRAINT "audio_recordings_userid_foreign" FOREIGN KEY("userid") REFERENCES "users"("userid");