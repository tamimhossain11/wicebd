import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { motion } from 'framer-motion';
import axios from 'axios';

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

  const handleReset = () => {
    setScanResult(null);
    setError(null);
    setScannerReady(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-blue-200 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-600 p-8 text-white text-center">
          <h1 className="text-4xl font-extrabold">🎫 QR Code Verification</h1>
          <p className="mt-2 text-lg opacity-90">Scan participant QR codes to verify registration</p>
        </div>

        <div className="p-6 space-y-6">
          {!scannerReady && !scanResult && (
            <button
              onClick={() => setScannerReady(true)}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold text-lg rounded-xl shadow-md hover:shadow-lg transition"
            >
              🚀 Start QR Scanner
            </button>
          )}

          {scannerReady && !scanResult && (
            <div className="relative border-4 border-blue-400 rounded-2xl overflow-hidden shadow-inner bg-black p-3">
              <div id="qr-reader" className="w-full aspect-square" />
            </div>
          )}

          {scanResult && (
            <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-100 border border-indigo-200 rounded-2xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">{scanResult.projectTitle}</h2>

              {scanResult.memberName && (
                <div className="mb-4">
                  <span className="text-sm text-white bg-green-500 px-3 py-1 rounded-full font-semibold inline-block mb-2">
                    ✅ Team Member
                  </span>
                  <p><strong>Name:</strong> {scanResult.memberName}</p>
                  <p><strong>Institution:</strong> {scanResult.memberInstitution}</p>
                </div>
              )}

              <div className="border-t pt-4 mt-4">
                <span className="text-sm text-white bg-blue-500 px-3 py-1 rounded-full font-semibold inline-block mb-2">
                  👤 Team Leader
                </span>
                <p><strong>Name:</strong> {scanResult.leader}</p>
                <p><strong>Institution:</strong> {scanResult.institution}</p>
                <p><strong>Phone:</strong> {scanResult.leaderPhone}</p>
                <p><strong>Email:</strong> {scanResult.leaderEmail}</p>
              </div>
            </div>
          )}

          {(scanResult || error) && (
            <button
              onClick={handleReset}
              className="w-full mt-4 py-3 bg-gradient-to-r from-pink-500 to-red-600 text-white font-semibold text-lg rounded-xl shadow-md hover:shadow-lg transition"
            >
              🔁 Reset Scanner
            </button>
          )}

          {error && (
            <div className="p-4 mt-4 bg-red-50 border-l-4 border-red-600 text-red-700 rounded-md shadow">
              ⚠️ {error}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
