/**
 * Direct recovery for payments confirmed by GCP logs but not inserted into DB.
 * TrxIDs and amounts are taken from the Cloud Run server logs.
 *
 * Usage:
 *   node scripts/recoverConfirmed.js            — dry run
 *   node scripts/recoverConfirmed.js --commit    — apply
 */

require('dotenv').config({ path: '.env.live' });
const db = require('../db');

const DRY_RUN = !process.argv.includes('--commit');

// Confirmed from GCP logs — PayStation returned trx_status: successful
const CONFIRMED = [
  { invoice: '1776014428040963', trxId: 'DDC34FA6Y9', amount: 999 },
  { invoice: '1776012788493483', trxId: 'DDC74EHAO3', amount: 399 },
];

async function main() {
  console.log(DRY_RUN
    ? '🔍  DRY RUN — pass --commit to apply\n'
    : '🚀  COMMIT mode\n');

  for (const { invoice, trxId, amount } of CONFIRMED) {
    console.log(`── Invoice: ${invoice}  TrxID: ${trxId}  Amount: ${amount} BDT`);

    // Load temp registration
    const [tempRows] = await db.query(
      'SELECT * FROM temp_registrations WHERE bkash_payment_id = ?', [invoice]
    );
    if (tempRows.length === 0) {
      console.log('   ⚠️  Not found in temp_registrations — already recovered or cleaned up\n');
      continue;
    }
    const reg = tempRows[0];
    const cat = (reg.competitionCategory || '').toLowerCase();
    console.log(`   Category: ${reg.competitionCategory}  |  Leader: ${reg.leader}  |  Email: ${reg.leaderEmail}`);

    // Duplicate check
    const [existingReg] = await db.query(
      'SELECT id FROM registrations WHERE paymentID = ?', [invoice]
    );
    if (existingReg.length > 0) {
      console.log('   ℹ️  Already in registrations — skipping\n');
      continue;
    }

    if (DRY_RUN) {
      console.log(`   🔸  Would INSERT into registrations (${cat})\n`);
      continue;
    }

    await db.query(
      `INSERT INTO registrations (
        user_id, competitionCategory,
        projectSubcategory, categories, crReference,
        leader, institution, leaderPhone, leaderWhatsApp,
        leaderEmail, tshirtSizeLeader,
        member2, institution2, tshirtSize2,
        member3, institution3, tshirtSize3,
        member4, institution4, tshirtSize4,
        member5, institution5, tshirtSize5,
        projectTitle, projectCategory, participatedBefore,
        previousCompetition, socialMedia, infoSource,
        paymentID, bkashTrxId, amount, ca_code, club_code, promo_code
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        reg.user_id || null,
        reg.competitionCategory, reg.projectSubcategory,
        reg.categories, reg.crReference, reg.leader,
        reg.institution, reg.leaderPhone, reg.leaderWhatsApp,
        reg.leaderEmail, reg.tshirtSizeLeader,
        reg.member2 || null, reg.institution2 || null, reg.tshirtSize2 || null,
        reg.member3 || null, reg.institution3 || null, reg.tshirtSize3 || null,
        reg.member4 || null, reg.institution4 || null, reg.tshirtSize4 || null,
        reg.member5 || null, reg.institution5 || null, reg.tshirtSize5 || null,
        reg.projectTitle, reg.projectCategory, reg.participatedBefore,
        reg.previousCompetition, reg.socialMedia,
        reg.infoSource, invoice, trxId,
        amount,
        reg.ca_code || null, reg.club_code || null, reg.promo_code || null,
      ]
    );
    console.log('   ✅  Inserted into registrations');

    await db.query('DELETE FROM temp_registrations WHERE bkash_payment_id = ?', [invoice]);
    console.log('   🗑️  Removed from temp_registrations\n');
  }

  console.log('Done.');
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
