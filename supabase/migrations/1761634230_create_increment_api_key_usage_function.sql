-- Migration: create_increment_api_key_usage_function
-- Created at: 1761634230

CREATE OR REPLACE FUNCTION increment_api_key_usage(key_value TEXT, seconds INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE api_keys
  SET usage = usage + seconds
  WHERE key = key_value AND active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;;