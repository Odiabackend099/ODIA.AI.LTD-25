CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    plan TEXT DEFAULT 'free' CHECK (plan IN ('free',
    'pro',
    'enterprise')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);