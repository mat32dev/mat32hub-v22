-- Menu / Carta management
CREATE TABLE IF NOT EXISTS menu_categories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  description TEXT,
  highlight BOOLEAN DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed con la carta actual
INSERT INTO menu_categories (id, title, sort_order) VALUES
  ('cat_signature', 'SIGNATURE DRINKS', 0),
  ('cat_classic', 'CLASSIC SELECTION', 1),
  ('cat_wine', 'WINE & BEER', 2),
  ('cat_snacks', 'HI-FI SNACKS', 3)
ON CONFLICT DO NOTHING;

INSERT INTO menu_items (id, category_id, name, price, description, highlight, sort_order) VALUES
  ('mi_1', 'cat_signature', 'MARTINI 32', '14,00', 'Ginebra Premium y esencia cítrica de Valencia.', true, 0),
  ('mi_2', 'cat_signature', 'NEGRONI RUZAFA', '12,50', 'El clásico equilibrado para largas sesiones de escucha.', true, 1),
  ('mi_3', 'cat_signature', 'ANALOG OLD FASHIONED', '13,50', 'Borbón, bitters de cacao y piel de naranja ahumada.', false, 2),
  ('mi_4', 'cat_classic', 'GIN TONIC PREMIUM', '11,00', 'Selección de botánicos según la vibración de la noche.', false, 0),
  ('mi_5', 'cat_classic', 'MOSCOW MULE', '10,50', 'Ginger beer artesanal y toque de lima fresca.', false, 1),
  ('mi_6', 'cat_classic', 'MEZCAL MARGARITA', '13,00', 'Toque ahumado y sal de gusano.', false, 2),
  ('mi_7', 'cat_wine', 'TINTO VALENCIA (COPA)', '4,50', 'Bobal seleccionado de pequeños productores locales.', false, 0),
  ('mi_8', 'cat_wine', 'BLANCO MARINA ALTA (COPA)', '4,00', 'Seco, afrutado y fresco.', false, 1),
  ('mi_9', 'cat_wine', 'CRAFT BEER MAT32', '5,50', 'IPA de edición limitada para el local.', false, 2),
  ('mi_10', 'cat_wine', 'CERVEZA DE GRIFO', '3,50', 'Fría y directa.', false, 3),
  ('mi_11', 'cat_snacks', 'TABLA DE QUESOS CURADOS', '15,00', 'Selección de quesos nacionales y frutos secos.', false, 0),
  ('mi_12', 'cat_snacks', 'OLIVAS RUZAFA', '3,50', 'Aliño secreto de la casa.', false, 1)
ON CONFLICT DO NOTHING;
