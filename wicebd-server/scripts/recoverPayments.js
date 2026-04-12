/**
 * Recovery script — processes temp_registrations whose payment succeeded
 * but whose final INSERT into registrations/olympiad_registrations failed
 * (e.g. due to the "amount is not defined" bug).
 *
 * Usage (from wicebd-server/):
 *   node scripts/recoverPayments.js          — dry run (shows what would be inserted)
 *   node scripts/recoverPayments.js --commit  — actually inserts + cleans up
 *
 * Requires Cloud SQL proxy running on 3307 and .env loaded.
 */

require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { getTransactionStatus } = require('../utils/paystation');

const DRY_RUN = !process.argv.includes('--commit');

async function main() {
  console.log(DRY_RUN
    ? '🔍  DRY RUN — no changes will be made (pass --commit to apply)\n'
    : '🚀  COMMIT mode — will insert missing registrations\n');

  // 1. Find stuck temp_registrations:
  //    - bkash_payment_id IS NOT NULL (payment was initiated)
  //    - not already in registrations (paymentID = bkash_payment_id) or olympiad_registrations
  const [stuck] = await db.query(`
    SELECT t.*
    FROM temp_registrations t
    WHERE t.bkash_payment_id IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM registrations r WHERE r.paymentID = t.bkash_payment_id
      )
      AND NOT EXISTS (
        SELECT 1 FROM olympiad_registrations o WHERE o.registration_id LIKE 'OLY-%'
          AND EXISTS (
            SELECT 1 FROM temp_registrations t2
            WHERE t2.bkash_payment_id = t.bkash_payment_id
              AND t2.leaderEmail = o.email
          )
      )
  `);

  if (stuck.length === 0) {
    console.log('✅  No stuck registrations found. All payments are accounted for.');
    process.exit(0);
  }

  console.log(`Found ${stuck.length} stuck temp registration(s):\n`);

  for (const reg of stuck) {
    const invoiceNumber = reg.bkash_payment_id;
    const cat = (reg.competitionCategory || '').toLowerCase();
    console.log(`── Invoice: ${invoiceNumber}`);
    console.log(`   Category: ${reg.competitionCategory}  |  Leader: ${reg.leader}  |  Email: ${reg.leaderEmail}`);

    // 2. Verify with PayStation
    let statusResult;
    try {
      statusResult = await getTransactionStatus(invoiceNumber);
    } catch (e) {
      console.log(`   ❌  PayStation check failed: ${e.message} — skipping\n`);
      continue;
    }

    const trxStatus = (statusResult?.data?.trx_status || '').toLowerCase();
    const verified  = statusResult?.status_code === '200' &&
                      (trxStatus === 'successful' || trxStatus === 'success');

    if (!verified) {
      console.log(`   ⚠️  PayStation status: ${trxStatus || 'unknown'} — payment not verified, skipping\n`);
      continue;
    }

    const verifiedTrxId = statusResult.data.trx_id;
    const amount = parseFloat(statusResult.data.request_amount || 0);
    console.log(`   ✅  PayStation verified. TrxID: ${verifiedTrxId}  Amount: ${amount} BDT`);

    if (DRY_RUN) {
      console.log(`   🔸  [DRY RUN] Would insert into ${cat === 'olympiad' ? 'olympiad_registrations' : 'registrations'}\n`);
      continue;
    }

    // 3. Insert into final table
    try {
      if (cat === 'olympiad') {
        // Check duplicate by email
        const [existingOly] = await db.query(
          'SELECT id FROM olympiad_registrations WHERE email = ?', [reg.leaderEmail]
        );
        if (existingOly.length > 0) {
          console.log(`   ℹ️  Olympiad registration for ${reg.leaderEmail} already exists — skipping\n`);
          continue;
        }

        let verified_user_id = null;
        if (reg.user_id) {
          const [ur] = await db.query('SELECT id FROM users WHERE id = ?', [reg.user_id]);
          if (ur.length > 0) verified_user_id = reg.user_id;
        }

        const registrationId = `OLY-${uuidv4().substring(0, 8).toUpperCase()}`;
        await db.query(
          `INSERT INTO olympiad_registrations (
            registration_id, user_id, full_name, email, phone,
            address, institution, cr_reference, ca_code, club_code, promo_code, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            registrationId, verified_user_id, reg.leader, reg.leaderEmail, reg.leaderPhone,
            reg.projectTitle, reg.institution, reg.crReference || '',
            reg.ca_code || null, reg.club_code || null, reg.promo_code || null,
            'registered',
          ]
        );
        console.log(`   ✅  Inserted olympiad_registrations  registrationId=${registrationId}`);
      } else {
        // Check duplicate by paymentID
        const [existingReg] = await db.query(
          'SELECT id FROM registrations WHERE paymentID = ?', [invoiceNumber]
        );
        if (existingReg.length > 0) {
          console.log(`   ℹ️  Registration for invoice ${invoiceNumber} already exists — skipping\n`);
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
            reg.infoSource, invoiceNumber, verifiedTrxId,
            amount,
            reg.ca_code || null, reg.club_code || null, reg.promo_code || null,
          ]
        );
        console.log(`   ✅  Inserted into registrations  paymentID=${invoiceNumber}`);
      }

      // 4. Clean up temp
      await db.query('DELETE FROM temp_registrations WHERE bkash_payment_id = ?', [invoiceNumber]);
      console.log(`   🗑️  Removed from temp_registrations\n`);
    } catch (insertErr) {
      console.error(`   ❌  Insert failed: ${insertErr.message}\n`);
    }
  }

  console.log('Done.');
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
