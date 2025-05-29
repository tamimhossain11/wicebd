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
    if (scannerReady && !scannerRef.current) {
      const scanner = new Html5QrcodeScanner('qr-reader', {
        fps: 15,
        qrbox: { width: 250, height: 250 },
      });

      scannerRef.current = scanner;

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
            scanner.clear().then(() => (scannerRef.current = null));
          } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to scan QR code');
          }
        },
        (err) => {
          console.warn('QR Scan Error:', err);
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, [scannerReady]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-6 font-sans flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-blue-100"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">QR Verification Portal</h1>
          <p className="mt-2 text-lg opacity-90">Scan participant QR codes to confirm identity</p>
        </div>

        {/* Content Area */}
        <div className="p-8 space-y-6">
          {!scannerReady && !scanResult && (
            <div className="flex justify-center">
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.03 }}
                onClick={() => {
                  setError(null);
                  setScannerReady(true);
                }}
                className="px-6 py-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl font-semibold rounded-2xl shadow-lg hover:shadow-indigo-400/70 transition-all flex items-center justify-center gap-3"
              >
                <ScanLine size={24} />
                Start Scanning
              </motion.button>
            </div>
          )}

          {/* Scanner Section */}
          {scannerReady && !scanResult && (
            <>
              <div className="flex justify-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-4 border-blue-500 rounded-xl bg-black p-4 shadow-lg w-full max-w-sm"
                >
                  <div id="qr-reader" className="aspect-square w-full" />
                </motion.div>
              </div>
              <p className="text-center text-blue-700 text-sm mt-2 animate-pulse">
                Scanner is active... hold QR code in front of the camera
              </p>
            </>
          )}

          {/* Success Result */}
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

              {/* Reset Button */}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => {
                    setScanResult(null);
                    setError(null);
                    setScannerReady(true);
                  }}
                  className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full transition-all"
                >
                  Scan Another QR
                </button>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
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
