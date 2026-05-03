// Menu API routes — add to index.js
// GET /menu — public (no auth)
// POST /menu/categories — admin
// PATCH /menu/categories/:id — admin
// DELETE /menu/categories/:id — admin
// POST /menu/items — admin
// PATCH /menu/items/:id — admin
// DELETE /menu/items/:id — admin
// PUT /menu/reorder — admin (bulk reorder)

module.exports = function(app, pool, requireAuth) {

  // ── PUBLIC: get full menu ──────────────────────────────────────
  app.get('/menu', async (req, res) => {
    try {
      const cats = await pool.query('SELECT * FROM menu_categories ORDER BY sort_order');
      const items = await pool.query('SELECT * FROM menu_items ORDER BY sort_order');
      const menu = cats.rows.map(c => ({
        ...c,
        items: items.rows.filter(i => i.category_id === c.id)
      }));
      res.json(menu);
    } catch (err) {
      console.error('GET /menu error:', err);
      res.status(500).json({ error: 'Failed to load menu' });
    }
  });

  // ── CATEGORIES ─────────────────────────────────────────────────
  app.post('/menu/categories', requireAuth, async (req, res) => {
    try {
      const { title, sort_order } = req.body;
      const id = 'cat_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
      const r = await pool.query(
        'INSERT INTO menu_categories (id, title, sort_order) VALUES ($1, $2, $3) RETURNING *',
        [id, title, sort_order ?? 0]
      );
      res.json(r.rows[0]);
    } catch (err) {
      console.error('POST /menu/categories error:', err);
      res.status(500).json({ error: 'Failed to create category' });
    }
  });

  app.patch('/menu/categories/:id', requireAuth, async (req, res) => {
    try {
      const sets = [];
      const vals = [];
      let idx = 1;
      for (const key of ['title', 'sort_order']) {
        if (req.body[key] !== undefined) {
          sets.push(`${key} = $${idx++}`);
          vals.push(req.body[key]);
        }
      }
      if (!sets.length) return res.json({ ok: true });
      vals.push(req.params.id);
      const r = await pool.query(
        `UPDATE menu_categories SET ${sets.join(', ')} WHERE id = $${idx} RETURNING *`,
        vals
      );
      res.json(r.rows[0]);
    } catch (err) {
      console.error('PATCH /menu/categories error:', err);
      res.status(500).json({ error: 'Failed to update category' });
    }
  });

  app.delete('/menu/categories/:id', requireAuth, async (req, res) => {
    try {
      await pool.query('DELETE FROM menu_categories WHERE id = $1', [req.params.id]);
      res.json({ ok: true });
    } catch (err) {
      console.error('DELETE /menu/categories error:', err);
      res.status(500).json({ error: 'Failed to delete category' });
    }
  });

  // ── ITEMS ──────────────────────────────────────────────────────
  app.post('/menu/items', requireAuth, async (req, res) => {
    try {
      const { category_id, name, price, description, highlight, sort_order } = req.body;
      const id = 'mi_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
      const r = await pool.query(
        'INSERT INTO menu_items (id, category_id, name, price, description, highlight, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [id, category_id, name, price, description || null, highlight || false, sort_order ?? 0]
      );
      res.json(r.rows[0]);
    } catch (err) {
      console.error('POST /menu/items error:', err);
      res.status(500).json({ error: 'Failed to create item' });
    }
  });

  app.patch('/menu/items/:id', requireAuth, async (req, res) => {
    try {
      const sets = [];
      const vals = [];
      let idx = 1;
      for (const key of ['name', 'price', 'description', 'highlight', 'sort_order', 'category_id']) {
        if (req.body[key] !== undefined) {
          sets.push(`${key} = $${idx++}`);
          vals.push(req.body[key]);
        }
      }
      if (!sets.length) return res.json({ ok: true });
      vals.push(req.params.id);
      const r = await pool.query(
        `UPDATE menu_items SET ${sets.join(', ')} WHERE id = $${idx} RETURNING *`,
        vals
      );
      res.json(r.rows[0]);
    } catch (err) {
      console.error('PATCH /menu/items error:', err);
      res.status(500).json({ error: 'Failed to update item' });
    }
  });

  app.delete('/menu/items/:id', requireAuth, async (req, res) => {
    try {
      await pool.query('DELETE FROM menu_items WHERE id = $1', [req.params.id]);
      res.json({ ok: true });
    } catch (err) {
      console.error('DELETE /menu/items error:', err);
      res.status(500).json({ error: 'Failed to delete item' });
    }
  });

  // ── BULK REORDER ───────────────────────────────────────────────
  app.put('/menu/reorder', requireAuth, async (req, res) => {
    const client = await pool.connect();
    try {
      const { categories, items } = req.body;
      await client.query('BEGIN');
      if (categories) {
        for (const { id, sort_order } of categories) {
          await client.query('UPDATE menu_categories SET sort_order = $1 WHERE id = $2', [sort_order, id]);
        }
      }
      if (items) {
        for (const { id, sort_order, category_id } of items) {
          const sets = ['sort_order = $1'];
          const vals = [sort_order, id];
          if (category_id) { sets.push('category_id = $3'); vals.push(category_id); }
          await client.query(`UPDATE menu_items SET ${sets.join(', ')} WHERE id = $2`, vals);
        }
      }
      await client.query('COMMIT');
      res.json({ ok: true });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('PUT /menu/reorder error:', err);
      res.status(500).json({ error: 'Failed to reorder' });
    } finally {
      client.release();
    }
  });
};
