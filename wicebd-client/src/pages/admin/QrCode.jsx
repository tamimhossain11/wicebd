import { useState, useRef } from 'react';
import QrScanner from 'react-qr-scanner';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';

// Sample QR data for testing
const sampleQRData = JSON.stringify({
  projectTitle: "Smart City Initiative",
  institution: "Tech University",
  leader: "Dr. Sarah Johnson",
  leaderPhone: "+1 (555) 123-4567",
  leaderEmail: "s.johnson@tech.edu",
  memberName: "Alex Chen",
  memberInstitution: "Tech University"
});

export default function AdminDashboard() {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const scannerRef = useRef(null);

  const handleScan = async (qrData) => {
    if (!qrData) return;
    
    setCameraActive(false);
    setError(null);
    
    try {
      // For demo purposes, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Parse the QR data directly for demo
      const result = JSON.parse(qrData);
      setScanResult(result);
      
    } catch (err) {
      setError(err.message || 'Verification failed');
      console.error('Scan error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-center"
          >
            Participant Verification System
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center opacity-90 mt-2"
          >
            Scan participant QR codes to verify registration
          </motion.p>
        </div>

        <div className="p-6">
          {/* Demo QR Code */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8 bg-blue-50 p-4 rounded-lg border border-blue-200"
          >
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Test QR Code</h2>
            <div className="flex flex-col items-center">
              <div className="p-2 bg-white rounded-lg mb-2">
                <QRCode 
                  value={sampleQRData} 
                  size={150}
                  level="H"
                />
              </div>
              <p className="text-sm text-gray-600">Scan this code for demo</p>
            </div>
          </motion.div>

          {/* Camera Section */}
          <div className="mb-8">
            {!cameraActive ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCameraActive(true)}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-medium text-lg"
              >
                Start QR Scanner
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-2 border-blue-300 rounded-xl overflow-hidden shadow-inner"
              >
                <QrScanner
                  ref={scannerRef}
                  onDecode={(result) => {
                    if (result) {
                      handleScan(result);
                    }
                  }}
                  onError={(error) => {
                    setError(error?.message || 'Camera error');
                    console.error('Camera error:', error);
                  }}
                  constraints={{
                    audio: false,
                    video: {
                      facingMode: 'environment',
                      width: { ideal: 1280 },
                      height: { ideal: 720 }
                    }
                  }}
                  className="w-full h-64 md:h-96 object-cover"
                />
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setCameraActive(false)}
                  className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium"
                >
                  Stop Scanner
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg"
              >
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Display */}
          <AnimatePresence>
            {scanResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-blue-50 shadow-sm"
              >
                <motion.h2 
                  className="text-2xl font-bold mb-4 text-blue-800"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {scanResult.projectTitle}
                </motion.h2>
                
                {/* Leader View */}
                {!scanResult.memberName ? (
                  <motion.div 
                    className="space-y-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-lg font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full inline-block">
                      Team Leader
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div className="bg-white p-3 rounded-lg shadow-xs">
                        <p className="font-semibold text-gray-600">Name:</p>
                        <p className="text-gray-800">{scanResult.leader}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-xs">
                        <p className="font-semibold text-gray-600">Institution:</p>
                        <p className="text-gray-800">{scanResult.institution}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-xs">
                        <p className="font-semibold text-gray-600">Phone:</p>
                        <p className="text-gray-800">{scanResult.leaderPhone}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-xs">
                        <p className="font-semibold text-gray-600">Email:</p>
                        <p className="text-gray-800">{scanResult.leaderEmail}</p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* Team Member View */
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="text-lg font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full inline-block">
                        Team Member
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div className="bg-white p-3 rounded-lg shadow-xs">
                          <p className="font-semibold text-gray-600">Name:</p>
                          <p className="text-gray-800">{scanResult.memberName}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-xs">
                          <p className="font-semibold text-gray-600">Institution:</p>
                          <p className="text-gray-800">{scanResult.memberInstitution}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full inline-block">
                        Team Leader
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div className="bg-white p-3 rounded-lg shadow-xs">
                          <p className="font-semibold text-gray-600">Name:</p>
                          <p className="text-gray-800">{scanResult.leader}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-xs">
                          <p className="font-semibold text-gray-600">Phone:</p>
                          <p className="text-gray-800">{scanResult.leaderPhone}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-xs">
                          <p className="font-semibold text-gray-600">Email:</p>
                          <p className="text-gray-800">{scanResult.leaderEmail}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <motion.div 
                  className="mt-4 text-sm text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Verified at: {new Date().toLocaleString()}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}