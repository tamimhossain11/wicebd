require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const QRCode = require('qrcode');
const Jimp = require('jimp');
const db = require('./db');

// Output directory setup
const outputDir = path.join(__dirname, 'qrcodes');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateAllQRCodes() {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.ping();
    console.log('✅ Database connection successful');

    const [registrations] = await db.query(
      'SELECT id, member2, member3 FROM registrations'
    );

    console.log(`Found ${registrations.length} registrations to process`);

    for (const reg of registrations) {
      console.log(`Processing registration ID: ${reg.id}`);

      await generateQR(reg.id, 'leader');
      if (reg.member2) await generateQR(reg.id, 'member2');
      if (reg.member3) await generateQR(reg.id, 'member3');
    }

    console.log('✅ Successfully generated QR codes for all registrations');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) connection.release();
    db.end();
  }
}

async function generateQR(registrationId, memberType) {
  const token = uuidv4();
  const qrContent = JSON.stringify({
    registrationId,
    memberType,
    token
  });

  try {
    // Save to DB
    await db.query(
      'INSERT INTO qr_verification (registration_id, member_type, verification_hash) VALUES (?, ?, ?)',
      [registrationId, memberType, token]
    );

    // Generate QR buffer
    const qrBuffer = await QRCode.toBuffer(qrContent, {
      errorCorrectionLevel: 'H',
      type: 'png',
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    const qrImage = await Jimp.read(qrBuffer);
    const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    const label = `ID: ${registrationId} - ${memberType}`;
    const labelHeight = 24;

    const finalImage = new Jimp(
      qrImage.bitmap.width,
      qrImage.bitmap.height + labelHeight,
      '#FFFFFF'
    );

    finalImage.composite(qrImage, 0, 0);
    finalImage.print(
      font,
      0,
      qrImage.bitmap.height + 2,
      {
        text: label,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_TOP
      },
      qrImage.bitmap.width,
      labelHeight
    );

    const filePath = path.join(outputDir, `${registrationId}_${memberType}.png`);
    await finalImage.writeAsync(filePath);

    console.log(`✅ QR code saved: ${filePath}`);
    return qrContent;
  } catch (err) {
    console.error(`❌ Failed to generate QR for ${registrationId}-${memberType}:`, err.message);
    throw err;
  }
}


generateAllQRCodes()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
