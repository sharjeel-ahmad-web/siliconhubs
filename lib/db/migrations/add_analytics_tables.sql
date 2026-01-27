-- Analytics Tables Migration
-- Implements Requirements 25.1-25.10

-- Analytics Events Table
-- Stores all tracked events from the client
CREATE TABLE IF NOT EXISTS analytics_events (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB NOT NULL,
  session_id VARCHAR(255),
  user_id INTEGER,
  device_type VARCHAR(50),
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_event_type (event_type),
  INDEX idx_timestamp (timestamp),
  INDEX idx_session_id (session_id)
);

-- Page Views Table
-- Tracks page views and navigation
CREATE TABLE IF NOT EXISTS analytics_page_views (
  id SERIAL PRIMARY KEY,
  page_name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  referrer TEXT,
  session_id VARCHAR(255),
  user_id INTEGER,
  device_type VARCHAR(50),
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_page_name (page_name),
  INDEX idx_timestamp (timestamp),
  INDEX idx_session_id (session_id)
);

-- Animation Interactions Table
-- Tracks user interactions with animations (Requirement 25.1)
CREATE TABLE IF NOT EXISTS analytics_animation_interactions (
  id SERIAL PRIMARY KEY,
  animation_type VARCHAR(100) NOT NULL,
  event_name VARCHAR(100) NOT NULL,
  event_data JSONB,
  session_id VARCHAR(255),
  user_id INTEGER,
  engagement_duration INTEGER, -- in milliseconds
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_animation_type (animation_type),
  INDEX idx_timestamp (timestamp),
  INDEX idx_session_id (session_id)
);

-- Scroll Depth Table
-- Tracks scroll depth milestones (Requirement 25.2)
CREATE TABLE IF NOT EXISTS analytics_scroll_depth (
  id SERIAL PRIMARY KEY,
  page_name VARCHAR(255) NOT NULL,
  depth_percentage INTEGER NOT NULL,
  session_id VARCHAR(255),
  user_id INTEGER,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_page_name (page_name),
  INDEX idx_depth (depth_percentage),
  INDEX idx_timestamp (timestamp),
  INDEX idx_session_id (session_id)
);

-- Form Submissions Table
-- Tracks form submissions with source attribution (Requirement 25.3)
CREATE TABLE IF NOT EXISTS analytics_form_submissions (
  id SERIAL PRIMARY KEY,
  form_name VARCHAR(100) NOT NULL,
  success BOOLEAN NOT NULL,
  source_attribution JSONB,
  session_id VARCHAR(255),
  user_id INTEGER,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_form_name (form_name),
  INDEX idx_success (success),
  INDEX idx_timestamp (timestamp),
  INDEX idx_session_id (session_id)
);

-- Performance Metrics Table
-- Tracks page performance metrics (Requirement 25.4)
CREATE TABLE IF NOT EXISTS analytics_performance (
  id SERIAL PRIMARY KEY,
  page_name VARCHAR(255) NOT NULL,
  load_time INTEGER NOT NULL, -- in milliseconds
  dom_content_loaded INTEGER,
  first_paint INTEGER,
  largest_contentful_paint INTEGER,
  first_input_delay DECIMAL(10, 2),
  cumulative_layout_shift DECIMAL(10, 4),
  device_type VARCHAR(50),
  connection_type VARCHAR(50),
  session_id VARCHAR(255),
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_page_name (page_name),
  INDEX idx_load_time (load_time),
  INDEX idx_timestamp (timestamp),
  INDEX idx_device_type (device_type)
);

-- Device Analytics Table
-- Tracks device-specific behavior (Requirement 25.5)
CREATE TABLE IF NOT EXISTS analytics_devices (
  id SERIAL PRIMARY KEY,
  device_type VARCHAR(50) NOT NULL,
  screen_width INTEGER,
  screen_height INTEGER,
  user_agent TEXT,
  session_id VARCHAR(255) UNIQUE,
  first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_device_type (device_type),
  INDEX idx_session_id (session_id)
);

-- Conversion Funnel Table
-- Tracks user progress through conversion funnel (Requirement 25.10)
CREATE TABLE IF NOT EXISTS analytics_funnel (
  id SERIAL PRIMARY KEY,
  stage VARCHAR(100) NOT NULL,
  metadata JSONB,
  session_id VARCHAR(255),
  user_id INTEGER,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_stage (stage),
  INDEX idx_timestamp (timestamp),
  INDEX idx_session_id (session_id)
);

-- Sessions Table
-- Aggregates session-level data
CREATE TABLE IF NOT EXISTS analytics_sessions (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) UNIQUE NOT NULL,
  user_id INTEGER,
  device_type VARCHAR(50),
  start_time BIGINT NOT NULL,
  end_time BIGINT,
  duration INTEGER, -- in seconds
  page_views INTEGER DEFAULT 0,
  interactions INTEGER DEFAULT 0,
  converted BOOLEAN DEFAULT FALSE,
  bounce BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_session_id (session_id),
  INDEX idx_start_time (start_time),
  INDEX idx_device_type (device_type),
  INDEX idx_converted (converted)
);

-- Aggregated Daily Stats Table
-- Pre-computed daily statistics for faster dashboard loading
CREATE TABLE IF NOT EXISTS analytics_daily_stats (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  total_visits INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0,
  avg_session_duration INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5, 2) DEFAULT 0,
  conversion_rate DECIMAL(5, 2) DEFAULT 0,
  desktop_percentage DECIMAL(5, 2) DEFAULT 0,
  tablet_percentage DECIMAL(5, 2) DEFAULT 0,
  mobile_percentage DECIMAL(5, 2) DEFAULT 0,
  avg_load_time INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_date (date)
);

-- Create function to update daily stats
CREATE OR REPLACE FUNCTION update_daily_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- This function would be called by a scheduled job
  -- to aggregate daily statistics
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE analytics_events IS 'Stores all tracked events from client-side analytics';
COMMENT ON TABLE analytics_animation_interactions IS 'Tracks user engagement with animations (Req 25.1)';
COMMENT ON TABLE analytics_scroll_depth IS 'Tracks scroll depth milestones (Req 25.2)';
COMMENT ON TABLE analytics_form_submissions IS 'Tracks form submissions with attribution (Req 25.3)';
COMMENT ON TABLE analytics_performance IS 'Tracks page performance metrics (Req 25.4)';
COMMENT ON TABLE analytics_devices IS 'Tracks device-specific behavior (Req 25.5)';
COMMENT ON TABLE analytics_funnel IS 'Tracks conversion funnel progress (Req 25.10)';
