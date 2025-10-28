-- Migration: create_rls_policies_for_new_tables
-- Created at: 1761633986

-- Enable RLS on new tables
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE tts_logs ENABLE ROW LEVEL SECURITY;

-- API Keys policies
CREATE POLICY "Users can view their own API keys" ON api_keys
  FOR SELECT USING (user_id = auth.uid() OR auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Users can insert their own API keys" ON api_keys
  FOR INSERT WITH CHECK (user_id = auth.uid() OR auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Users can update their own API keys" ON api_keys
  FOR UPDATE USING (user_id = auth.uid() OR auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Users can delete their own API keys" ON api_keys
  FOR DELETE USING (user_id = auth.uid() OR auth.role() IN ('anon', 'service_role'));

-- TTS Logs policies
CREATE POLICY "Users can view their own logs" ON tts_logs
  FOR SELECT USING (user_id = auth.uid() OR auth.role() IN ('anon', 'service_role'));

CREATE POLICY "System can insert logs" ON tts_logs
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));;