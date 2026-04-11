const { Storage } = require('@google-cloud/storage');

const BUCKET_NAME = process.env.GCS_BUCKET || 'w-test01';

// Initialise: uses GOOGLE_APPLICATION_CREDENTIALS env var (path to service-account JSON)
// or falls back to Application Default Credentials on GCP VMs / Cloud Run
const storageOptions = {};
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  storageOptions.keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;
}
if (process.env.GCP_PROJECT_ID) {
  storageOptions.projectId = process.env.GCP_PROJECT_ID;
}

const storage = new Storage(storageOptions);
const bucket  = storage.bucket(BUCKET_NAME);

/**
 * Upload a Buffer to GCS.
 * @param {Buffer} buffer       - File data
 * @param {string} destPath     - Destination path inside bucket, e.g. 'announcements/foo.jpg'
 * @param {string} contentType  - MIME type, e.g. 'image/jpeg'
 * @returns {Promise<string>}   - Public URL
 */
async function uploadBuffer(buffer, destPath, contentType = 'application/octet-stream') {
  const file = bucket.file(destPath);
  await file.save(buffer, {
    metadata: { contentType },
    resumable: false,
    // No per-object ACL — bucket uses uniform bucket-level access.
    // Public read is granted via bucket IAM: allUsers → storage.objectViewer
  });
  return `https://storage.googleapis.com/${BUCKET_NAME}/${destPath}`;
}

/**
 * Delete a file from GCS by its public URL or destination path.
 * @param {string} urlOrPath  - Full GCS URL or just the path
 */
async function deleteFile(urlOrPath) {
  try {
    let destPath = urlOrPath;
    const prefix = `https://storage.googleapis.com/${BUCKET_NAME}/`;
    if (urlOrPath.startsWith(prefix)) {
      destPath = urlOrPath.slice(prefix.length);
    }
    await bucket.file(destPath).delete();
  } catch (err) {
    // Non-critical — log but don't throw
    console.error('GCS delete error:', err.message);
  }
}

module.exports = { uploadBuffer, deleteFile, BUCKET_NAME };
