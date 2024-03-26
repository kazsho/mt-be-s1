DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS tokens;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS languages CASCADE;
DROP TABLE IF EXISTS audios CASCADE;
DROP TABLE IF EXISTS transcripts CASCADE;

CREATE TABLE profiles (
    account_id INT GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password CHAR(60) NOT NULL,
    PRIMARY KEY (account_id)
);

CREATE TABLE tokens (
    token_id INT GENERATED ALWAYS AS IDENTITY,
    account_id INT NOT NULL,
    token CHAR(36) UNIQUE NOT NULL,
    PRIMARY KEY (token_id),
    FOREIGN KEY (account_id) REFERENCES profiles("account_id")
);

CREATE TABLE conversations (
    conversation_id INT GENERATED ALWAYS AS IDENTITY,
    account_id INT NOT NULL,
    conversation_title VARCHAR(255) NOT NULL,
    language VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    PRIMARY KEY (conversation_id),
    FOREIGN KEY (account_id) REFERENCES profiles("account_id")
);

CREATE TABLE languages (
    language_id INT GENERATED ALWAYS AS IDENTITY,
    language_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE audios (
    audio_id INT GENERATED ALWAYS AS IDENTITY,
    conversation_id INT NOT NULL,
    audio_data BYTEA, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (audio_id),
    FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id)
);

CREATE TABLE transcripts (
    transcript_id INT GENERATED ALWAYS AS IDENTITY,
    conversation_id INT NOT NULL,
    transcript TEXT NOT NULL,
    audio_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (transcript_id),
    FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id),
    FOREIGN KEY (audio_id) REFERENCES audios(audio_id)
);

INSERT INTO profiles (name, email, password)
VALUES ('demo', 'demo@demo.com', crypt('demo', gen_salt('bf', 10)));


INSERT INTO conversations (account_id, conversation_title, language, timestamp)
VALUES
(1, 'Conversation 1', 'Gujarati', NOW()),
(1, 'Conversation 2', 'Urdu', NOW() - INTERVAL '1 day'),
(1, 'Conversation 3', 'Yorùbá', NOW() - INTERVAL '2 days'),
(1, 'Conversation 4', 'Swahili', NOW() - INTERVAL '3 days'),
(1, 'Conversation 5', 'Korean', NOW() - INTERVAL '4 days'),
(1, 'Conversation 6', 'Amazigh', NOW() - INTERVAL '5 days'),
(1, 'Conversation 7', 'Chinese', NOW() - INTERVAL '6 days'),
(1, 'Conversation 8', 'Japanese', NOW() - INTERVAL '7 days'),
(1, 'Conversation 9', 'Korean', NOW() - INTERVAL '8 days'),
(1, 'Conversation 10', 'Tamil', NOW() - INTERVAL '9 days'),
(1, 'Conversation 11', 'Russian', NOW() - INTERVAL '10 days'),
(1, 'Conversation 12', 'Hindi', NOW() - INTERVAL '11 days'),
(1, 'Conversation 13', 'Bengali', NOW() - INTERVAL '12 days'),
(1, 'Conversation 14', 'Punjabi', NOW() - INTERVAL '13 days'),
(1, 'Conversation 15', 'Turkish', NOW() - INTERVAL '14 days'),
(1, 'Conversation 16', 'Dutch', NOW() - INTERVAL '15 days'),
(1, 'Conversation 17', 'Swedish', NOW() - INTERVAL '16 days'),
(1, 'Conversation 18', 'Polish', NOW() - INTERVAL '17 days'),
(1, 'Conversation 19', 'Greek', NOW() - INTERVAL '18 days'),
(1, 'Conversation 20', 'Finnish', NOW() - INTERVAL '19 days');