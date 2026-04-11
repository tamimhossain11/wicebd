/**
 * One-time migration: generate QR PNG for every existing id_cards row that
 * has no image_url, upload to GCS bucket, and update the DB record.
 *
 * Usage:
 *   GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json \
 *   node scripts/migrateIdCardsToGcs.js
 *
 * The script reads DB connection from .env (or .env.live if NODE_ENV=live).
 */

const envFile = process.env.NODE_ENV === 'live' ? '../.env.live' : '../.env';
require('dotenv').config({ path: require('path').resolve(__dirname, envFile) });

const db            = require('../db');
const QRCode        = require('qrcode');
const { uploadBuffer } = require('../utils/gcsStorage');

const VERIFY_BASE = process.env.BACKEND_API_URL
  ? `${process.env.BACKEND_API_URL}/api/id-card/verify`
  : 'https://api.wicebd.com/api/id-card/verify';

async function migrate() {
  const [cards] = await db.query(
    'SELECT id, card_uid, qr_data FROM id_cards WHERE image_url IS NULL ORDER BY id'
  );

  if (cards.length === 0) {
    console.log('✅ No cards to migrate.');
    process.exit(0);
  }

  console.log(`Found ${cards.length} card(s) to migrate…`);

  let ok = 0, fail = 0;

  for (const card of cards) {
    try {
      const verifyUrl = card.qr_data || `${VERIFY_BASE}/${card.card_uid}`;
      const qrBuffer = await QRCode.toBuffer(verifyUrl, {
        type: 'png', errorCorrectionLevel: 'H', margin: 2, width: 400,
      });
      const gcsUrl = await uploadBuffer(
        qrBuffer,
        `id-cards/${card.card_uid}.png`,
        'image/png'
      );
      await db.query('UPDATE id_cards SET image_url = ? WHERE id = ?', [gcsUrl, card.id]);
      console.log(`  ✅ [${card.id}] ${card.card_uid} → ${gcsUrl}`);
      ok++;
    } catch (err) {
      console.error(`  ❌ [${card.id}] ${card.card_uid} — ${err.message}`);
      fail++;
    }
  }

  console.log(`\nDone. ${ok} migrated, ${fail} failed.`);
  process.exit(fail > 0 ? 1 : 0);
}

migrate().catch(err => { console.error(err); process.exit(1); });
