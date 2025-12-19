
import React, { useState, useRef } from 'react';
import { API_BASE_URL } from '../config';

interface Prediction {
  id: string;
  url: string;
  label: string;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<string | null>(null);
  const [history, setHistory] = useState<Prediction[]>([]);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setSelectedImage(e.target?.result as string);
    reader.readAsDataURL(file);
    setPredictionResult(null);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const runPrediction = async () => {
    if (!selectedFile || !selectedImage) return;

    setIsPredicting(true);
    setPredictionResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.statusText}`);
      }

      const data = await response.json();
      const label = data.label || "Unknown";
      const confidence = data.confidence ? (data.confidence * 100).toFixed(1) + '%' : 'N/A';

      const resultString = `Class: ${label} | Confidence: ${confidence}`;
      setPredictionResult(resultString);

      const newPrediction: Prediction = {
        id: Date.now().toString(),
        url: selectedImage,
        label: resultString,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setHistory(prev => [newPrediction, ...prev]);

      // Optional: Clear selection after success? 
      // setSelectedImage(null); 
      // setSelectedFile(null);

    } catch (error) {
      console.error("Prediction error:", error);
      setPredictionResult(`ERROR: ${error instanceof Error ? error.message : 'Analysis Failed'}`);
    } finally {
      setIsPredicting(false);
    }
  };

  const displayedHistory = showAllHistory ? history : history.slice(0, 3);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-sans">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-black italic tracking-tighter mb-2 text-gray-900">
          OBJECT <span className="text-[#116dff]">DETECTOR</span>
        </h1>
        <p className="text-gray-500 uppercase tracking-[0.6em] text-[10px] font-bold">Advanced AI Vision Console</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Prediction Interface */}
        <div className="lg:col-span-2 space-y-6">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`bg-white rounded-3xl p-8 border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${selectedImage ? 'border-[#116dff]/40' : 'border-gray-300 hover:border-[#116dff] hover:bg-blue-50/10'}`}
          >
            {!selectedImage ? (
              <div className="text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#116dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                </div>
                <h3 className="text-lg font-bold mb-1 text-gray-900">Upload Source Image</h3>
                <p className="text-gray-400 text-xs uppercase tracking-widest">Drag and drop or click to browse</p>
              </div>
            ) : (
              <div className="w-full relative group">
                <img src={selectedImage} alt="Upload" className="w-full h-[400px] object-contain rounded-xl" />

                {isPredicting && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="relative w-full">
                      <div className="h-1 bg-[#116dff] absolute w-full animate-[bounce_2s_infinite] opacity-50 shadow-[0_0_15px_#116dff]"></div>
                      <p className="text-[#116dff] font-black text-center uppercase tracking-[0.3em] mt-4">Analyzing Pixels...</p>
                    </div>
                  </div>
                )}

                {!isPredicting && (
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-red-50 hover:text-red-500 text-gray-600 transition-colors shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                )}
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" accept="image/*" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={runPrediction}
              disabled={!selectedImage || isPredicting}
              className="flex-grow py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-xl bg-[#116dff] text-white hover:bg-blue-600 shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isPredicting ? 'Processing...' : 'Predict'}
            </button>

            {predictionResult && (
              <div className="sm:w-1/3 bg-white border border-[#116dff]/20 rounded-2xl flex items-center justify-center px-4 animate-in fade-in zoom-in duration-500 shadow-lg">
                <p className="text-[#116dff] font-black text-xs tracking-widest uppercase">{predictionResult}</p>
              </div>
            )}
          </div>
        </div>

        {/* History Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#116dff]">Scan History</h2>
            <div className="h-px flex-grow mx-4 bg-[#116dff]/10"></div>
            <span className="text-gray-400 text-[10px] font-bold">{history.length} ITEMS</span>
          </div>

          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
                <p className="text-gray-400 text-[10px] uppercase tracking-widest italic">No data records found</p>
              </div>
            ) : (
              <>
                {displayedHistory.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl p-4 flex gap-4 items-center border border-gray-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 animate-in slide-in-from-right-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <img src={item.url} alt="History" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <p className="text-[10px] text-[#116dff] font-black tracking-widest">{item.label}</p>
                        <p className="text-[8px] text-gray-400 font-bold">{item.timestamp}</p>
                      </div>
                      <p className="text-gray-400 text-[10px] uppercase mt-1">Verification Code: {item.id.slice(-6)}</p>
                    </div>
                  </div>
                ))}

                {history.length > 3 && (
                  <button
                    onClick={() => setShowAllHistory(!showAllHistory)}
                    className="w-full py-3 text-gray-500 hover:text-[#116dff] text-[10px] font-black uppercase tracking-[0.3em] border border-gray-200 rounded-xl transition-all hover:bg-white hover:shadow-md"
                  >
                    {showAllHistory ? 'Compress List' : `See ${history.length - 3} More Predictions`}
                  </button>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
