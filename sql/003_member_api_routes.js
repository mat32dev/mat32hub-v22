// ── Rutas para Digger Radar ──────────────────────────────────
// Añadir a ~/apps/mat32-api/index.js en el VPS
// Requiere: npm install bcryptjs (en mat32-api)

const bcrypt = require('bcryptjs');

// ── MEMBER AUTH ──────────────────────────────────────────────
app.post('/auth/member-login', async (req, res) => {
  try {
    const { email, pass } = req.body;
    const r = await pool.query('SELECT * FROM members WHERE email = $1 AND status = $2', [email, 'active']);
    if (r.rows.length === 0) return res.json({ ok: false });
    const member = r.rows[0];
    const valid = await bcrypt.compare(pass, member.password_hash);
    if (!valid) return res.json({ ok: false });
    const token = jwt.sign({ id: member.id, role: 'MEMBER', email: member.email }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ ok: true, member: { id: member.id, name: member.name, email: member.email }, token });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── MEMBERS CRUD (admin only) ────────────────────────────────
app.get('/members', requireAuth, async (req, res) => {
  const r = await pool.query('SELECT id, name, email, phone, max_price, min_condition, platforms, status, created_at FROM members ORDER BY created_at DESC');
  res.json(r.rows);
});

app.post('/members', requireAuth, async (req, res) => {
  const { name, email, password, phone, max_price, min_condition, platforms, status } = req.body;
  const hash = await bcrypt.hash(password || 'mat32radar', 10);
  const r = await pool.query(
    `INSERT INTO members (name, email, password_hash, phone, max_price, min_condition, platforms, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [name, email, hash, phone || null, max_price || 50, min_condition || 'VG', JSON.stringify(platforms || ['discogs','ebay','wallapop','todocoleccion']), status || 'active']
  );
  res.json(r.rows[0]);
});

app.patch('/members/:id', requireAuth, async (req, res) => {
  const { name, email, phone, max_price, min_condition, platforms, status } = req.body;
  const sets = [];
  const vals = [];
  let i = 1;
  if (name !== undefined) { sets.push(`name=$${i++}`); vals.push(name); }
  if (email !== undefined) { sets.push(`email=$${i++}`); vals.push(email); }
  if (phone !== undefined) { sets.push(`phone=$${i++}`); vals.push(phone); }
  if (max_price !== undefined) { sets.push(`max_price=$${i++}`); vals.push(max_price); }
  if (min_condition !== undefined) { sets.push(`min_condition=$${i++}`); vals.push(min_condition); }
  if (platforms !== undefined) { sets.push(`platforms=$${i++}`); vals.push(JSON.stringify(platforms)); }
  if (status !== undefined) { sets.push(`status=$${i++}`); vals.push(status); }
  if (sets.length === 0) return res.json({});
  vals.push(req.params.id);
  const r = await pool.query(`UPDATE members SET ${sets.join(',')} WHERE id=$${i} RETURNING *`, vals);
  res.json(r.rows[0]);
});

app.delete('/members/:id', requireAuth, async (req, res) => {
  await pool.query('DELETE FROM members WHERE id=$1', [req.params.id]);
  res.json({ ok: true });
});

// ── WANTLIST (member or admin) ───────────────────────────────
app.get('/members/:mid/wantlist', requireAuth, async (req, res) => {
  const r = await pool.query('SELECT * FROM member_wantlist WHERE member_id=$1 ORDER BY created_at DESC', [req.params.mid]);
  res.json(r.rows);
});

app.post('/members/:mid/wantlist', requireAuth, async (req, res) => {
  const { artist, title, notes, max_price } = req.body;
  const r = await pool.query(
    'INSERT INTO member_wantlist (member_id, artist, title, notes, max_price) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [req.params.mid, artist, title, notes || null, max_price || null]
  );
  res.json(r.rows[0]);
});

app.patch('/members/:mid/wantlist/:id', requireAuth, async (req, res) => {
  const { artist, title, notes, max_price } = req.body;
  const r = await pool.query(
    'UPDATE member_wantlist SET artist=COALESCE($1,artist), title=COALESCE($2,title), notes=COALESCE($3,notes), max_price=COALESCE($4,max_price) WHERE id=$5 AND member_id=$6 RETURNING *',
    [artist, title, notes, max_price, req.params.id, req.params.mid]
  );
  res.json(r.rows[0]);
});

app.delete('/members/:mid/wantlist/:id', requireAuth, async (req, res) => {
  await pool.query('DELETE FROM member_wantlist WHERE id=$1 AND member_id=$2', [req.params.id, req.params.mid]);
  res.json({ ok: true });
});

// ── DEALS (member or admin) ─────────────────────────────────
app.get('/members/:mid/deals', requireAuth, async (req, res) => {
  const r = await pool.query('SELECT * FROM member_deals WHERE member_id=$1 ORDER BY found_at DESC', [req.params.mid]);
  res.json(r.rows);
});

app.patch('/members/:mid/deals/:id', requireAuth, async (req, res) => {
  const { status } = req.body;
  const r = await pool.query(
    'UPDATE member_deals SET status=$1 WHERE id=$2 AND member_id=$3 RETURNING *',
    [status, req.params.id, req.params.mid]
  );
  res.json(r.rows[0]);
});
