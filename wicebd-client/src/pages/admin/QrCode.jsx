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
          scanner.clear(); // Stop scanner on successful scan
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center">
          <h1 className="text-3xl font-bold">Participant Verification System</h1>
          <p className="opacity-90 mt-2">Scan participant QR codes to verify registration</p>
        </div>

        <div className="p-6 space-y-6">
          {!scannerReady && !scanResult && (
            <button
              onClick={() => setScannerReady(true)}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-medium text-lg"
            >
              Start QR Scanner
            </button>
          )}

          {scannerReady && !scanResult && (
            <div className="relative border-2 border-blue-300 rounded-xl overflow-hidden shadow-inner bg-black p-4">
              <div id="qr-reader" className="w-full aspect-square"></div>
            </div>
          )}

          {scanResult && (
            <div className="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-blue-50 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-blue-800">{scanResult.projectTitle}</h2>

              {scanResult.memberName ? (
                <div>
                  <h3 className="text-lg font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full inline-block mb-2">Team Member</h3>
                  <p><strong>Name:</strong> {scanResult.memberName}</p>
                  <p><strong>Institution:</strong> {scanResult.memberInstitution}</p>
                </div>
              ) : null}

              <div className="mt-4">
                <h3 className="text-lg font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full inline-block mb-2">Team Leader</h3>
                <p><strong>Name:</strong> {scanResult.leader}</p>
                <p><strong>Institution:</strong> {scanResult.institution}</p>
                <p><strong>Phone:</strong> {scanResult.leaderPhone}</p>
                <p><strong>Email:</strong> {scanResult.leaderEmail}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
              {error}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
