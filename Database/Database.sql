DROP TABLE IF EXISTS transcripts;
DROP TABLE IF EXISTS audios;
DROP TABLE IF EXISTS conversations;
DROP TABLE IF EXISTS tokens;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS languages;

CREATE TABLE languages (
    language_id SERIAL PRIMARY KEY,
    language_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255)
);

CREATE TABLE tokens (
    token_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expiration TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE conversations (
    conversation_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    language_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (language_id) REFERENCES languages(language_id)
);

CREATE TABLE audios (
    audio_id SERIAL PRIMARY KEY,
    conversation_id INT NOT NULL,
    audio_data BYTEA, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id)
);

CREATE TABLE transcripts (
    transcript_id SERIAL PRIMARY KEY,
    conversation_id INT NOT NULL,
    transcript TEXT NOT NULL,
    audio_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id),
    FOREIGN KEY (audio_id) REFERENCES audios(audio_id)
);
