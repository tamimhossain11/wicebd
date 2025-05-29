import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { motion } from 'framer-motion';
import axios from 'axios';
import { CheckCircle, AlertCircle, ScanLine } from 'lucide-react';

export default function AdminDashboard() {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [scannerReady, setScannerReady] = useState(false);
  const scannerRef = useRef(null);

  const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  });

  useEffect(() => {
    if (scannerReady && !scanResult) {
      const scanner = new Html5QrcodeScanner("qr-reader", {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      });

      scanner.render(
        async (text) => {
          try {
            const url = new URL(text);
            const dataParam = url.searchParams.get('data');
            if (!dataParam) throw new Error("Missing 'data' in QR code");

            const decoded = decodeURIComponent(dataParam);
            const qrPayload = JSON.parse(decoded);

            const { registrationId, memberType, token } = qrPayload;

            const response = await api.post('/api/qr/verify-qr', {
              registrationId,
              memberType,
              token,
            });

            setScanResult(response.data);
            scanner.clear();
          } catch (err) {
            console.error(err);
            setError(err.message || "Failed to scan QR code");
          }
        },
        (err) => {
          console.warn("QR Scan Error:", err);
        }
      );
    }
  }, [scannerReady]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-blue-100"
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">QR Verification Portal</h1>
          <p className="mt-2 text-lg opacity-90">Scan participant QR codes to confirm identity</p>
        </div>

        <div className="p-8 space-y-6">
          {!scannerReady && !scanResult && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => setScannerReady(true)}
              className="w-full py-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl font-semibold rounded-2xl shadow-lg hover:shadow-indigo-400/70 transition-all flex items-center justify-center gap-3"
            >
              <ScanLine size={24} />
              Start Scanning
            </motion.button>
          )}

          {scannerReady && !scanResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative border-4 border-blue-400 rounded-xl overflow-hidden shadow-md bg-black p-4 flex justify-center"
            >
              <div id="qr-reader" className="w-full max-w-xs aspect-square neon-border"></div>
            </motion.div>
          )}

          {scanResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-300 rounded-xl p-6 bg-white shadow-md"
            >
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle size={28} className="text-green-600" />
                <h2 className="text-2xl font-bold text-gray-800">Verified Project</h2>
              </div>
              <h3 className="text-xl font-semibold text-blue-800">{scanResult.projectTitle}</h3>

              {scanResult.memberName && (
                <div className="mt-4">
                  <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium inline-block mb-2">
                    Team Member
                  </span>
                  <p><strong>Name:</strong> {scanResult.memberName}</p>
                  <p><strong>Institution:</strong> {scanResult.memberInstitution}</p>
                </div>
              )}

              <div className="mt-6">
                <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium inline-block mb-2">
                  Team Leader
                </span>
                <p><strong>Name:</strong> {scanResult.leader}</p>
                <p><strong>Institution:</strong> {scanResult.institution}</p>
                <p><strong>Phone:</strong> {scanResult.leaderPhone}</p>
                <p><strong>Email:</strong> {scanResult.leaderEmail}</p>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-3 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md"
            >
              <AlertCircle className="mt-1" />
              <div>
                <strong>Error:</strong> <span>{error}</span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
