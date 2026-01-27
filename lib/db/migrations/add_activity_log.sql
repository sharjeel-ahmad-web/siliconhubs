-- Activity Log Table Migration
-- Implements Requirements 18.10, 24.4, 24.5

-- Activity Log Table
-- Tracks all user actions in the admin dashboard
CREATE TABLE IF NOT EXISTS activity_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id INTEGER,
  details JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_action ON activity_log(action);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_log_resource ON activity_log(resource_type, resource_id);

-- Comments for documentation
COMMENT ON TABLE activity_log IS 'Tracks all user actions in the admin dashboard (Req 18.10, 24.4, 24.5)';
COMMENT ON COLUMN activity_log.action IS 'Action performed (e.g., login, create_page, update_user, delete_project)';
COMMENT ON COLUMN activity_log.resource_type IS 'Type of resource affected (e.g., page, user, project, service)';
COMMENT ON COLUMN activity_log.resource_id IS 'ID of the affected resource';
COMMENT ON COLUMN activity_log.details IS 'Additional details about the action in JSON format';
