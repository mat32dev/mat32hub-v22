-- Digger Radar: membresía + wantlist + deals
-- Ejecutar en mat32db (PostgreSQL VPS)

CREATE TABLE IF NOT EXISTS members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  max_price NUMERIC(8,2) DEFAULT 50,
  min_condition VARCHAR(5) DEFAULT 'VG',
  platforms JSONB DEFAULT '["discogs","ebay","wallapop","todocoleccion"]',
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS member_wantlist (
  id SERIAL PRIMARY KEY,
  member_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
  artist VARCHAR(200) NOT NULL,
  title VARCHAR(200) NOT NULL,
  notes TEXT,
  max_price NUMERIC(8,2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS member_deals (
  id SERIAL PRIMARY KEY,
  member_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
  wantlist_id INTEGER REFERENCES member_wantlist(id) ON DELETE SET NULL,
  artist VARCHAR(200),
  title VARCHAR(200),
  platform VARCHAR(50),
  seller VARCHAR(200),
  price NUMERIC(8,2),
  shipping NUMERIC(8,2) DEFAULT 0,
  condition VARCHAR(10),
  url TEXT,
  found_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'new'
);

CREATE INDEX idx_member_wantlist_member ON member_wantlist(member_id);
CREATE INDEX idx_member_deals_member ON member_deals(member_id);
CREATE INDEX idx_member_deals_status ON member_deals(member_id, status);
