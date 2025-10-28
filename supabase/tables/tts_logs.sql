CREATE TABLE tts_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    text TEXT NOT NULL,
    voice TEXT NOT NULL,
    duration FLOAT NOT NULL,
    tokens INTEGER,
    cost NUMERIC(10,6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);