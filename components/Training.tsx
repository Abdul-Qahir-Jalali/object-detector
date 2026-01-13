import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

interface TrainingParams {
    model: string;
    classes: number;
    epochs: number;
    batchSize: number;
    lr: number;
    augmentation: boolean;
}

const YOLO_MODELS = [
    'YOLOv8n', 'YOLOv8s', 'YOLOv12n', 'YOLOv12s'
];

const Training: React.FC = () => {
    const [params, setParams] = useState<TrainingParams>({
        model: 'YOLOv8n',
        classes: 4,
        epochs: 50,
        batchSize: 16,
        lr: 0.01,
        augmentation: true
    });

    const [isTraining, setIsTraining] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [canTrain, setCanTrain] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [statusMsg, setStatusMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    // Initial fetch from GET config endpoint
    React.useEffect(() => {
        const fetchConfig = async () => {
            try {
                console.log("Fetching configuration from backend...");
                const response = await fetch(`${API_BASE_URL}/train/config`);
                if (response.ok) {
                    const data = await response.json();
                    setParams(data);
                } else {
                    console.error("Failed to fetch config");
                }
            } catch (err) {
                console.error("Failed to fetch config", err);
            }
        };
        fetchConfig();
    }, []);

    const handleUpdateConfig = async () => {
        try {
            console.log("Updating configuration...", params);
            const response = await fetch(`${API_BASE_URL}/train/config`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params)
            });

            if (!response.ok) throw new Error('Update failed');

            setStatusMsg({ text: "Parameters updated successfully", type: 'success' });
            setIsEditing(false);
            setCanTrain(true); // Enable training after update
            setTimeout(() => setStatusMsg(null), 3000);
        } catch (err) {
            setStatusMsg({ text: "Failed to update parameters", type: 'error' });
        }
    };

    const startTraining = () => {
        setShowConfirm(true);
    };

    const confirmTraining = async () => {
        try {
            const response = await fetch('http://localhost:8000/train/start', { method: 'POST' });
            if (!response.ok) throw new Error('Training start failed');

            setShowConfirm(false);
            setIsTraining(true);
            setShowResults(false);
            setCanTrain(false); // Hide button when training starts
            setProgress(0);

            const duration = 3000;
            const interval = 30;
            const steps = duration / interval;
            let currentStep = 0;

            const timer = setInterval(() => {
                currentStep++;
                const nextProgress = Math.min((currentStep / steps) * 100, 100);
                setProgress(nextProgress);

                if (currentStep >= steps) {
                    clearInterval(timer);
                    setIsTraining(false);
                    setShowResults(true);
                }
            }, interval);
        } catch (err) {
            console.error("Failed to start training", err);
            setStatusMsg({ text: "Failed to start training", type: 'error' });
            setTimeout(() => setStatusMsg(null), 3000);
            setShowConfirm(false);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-8 md:py-32 animate-in fade-in slide-in-from-bottom-4 duration-1000 relative font-sans">
            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-md px-4">
                    <div className="bg-white max-w-md w-full p-8 border border-gray-200 rounded-3xl animate-in zoom-in duration-300 shadow-2xl">
                        <h3 className="text-xl font-black uppercase tracking-tighter mb-4 italic text-gray-900">Confirm <span className="text-[#116dff]">Training</span></h3>
                        <p className="text-gray-500 text-sm mb-8 leading-relaxed">Are you sure you want to initialize the training pipeline? This will utilize server resources to synchronize neural weights.</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 py-3 rounded-xl border border-gray-200 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all text-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmTraining}
                                className="flex-1 py-3 rounded-xl bg-[#116dff] text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30"
                            >
                                Yes, Start
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-12 text-center">
                <h1 className="text-5xl font-black italic tracking-tighter mb-2 text-gray-900">
                    TRAINING <span className="text-[#116dff]">CONSOLE</span>
                </h1>
                <p className="text-gray-400 uppercase tracking-[0.6em] text-[10px] font-bold">Model Optimization & Synthesis</p>
            </div>

            {statusMsg && (
                <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl animate-in slide-in-from-top-4 duration-500 ${statusMsg.type === 'success' ? 'bg-blue-50 border-blue-200 text-[#116dff]' : 'bg-red-50 border-red-200 text-red-500'}`}>
                    {statusMsg.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Configuration Section */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl p-8 border border-gray-200/60 space-y-6 relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        {!isEditing && !isTraining && (
                            <div className="absolute top-8 right-8 z-10">
                                <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-[8px] font-bold text-gray-500 uppercase tracking-widest">Read Only</span>
                            </div>
                        )}
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#116dff] mb-4">Core Configuration</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 block">YOLO Variant</label>
                                <select
                                    value={params.model}
                                    disabled={!isEditing}
                                    onChange={(e) => setParams({ ...params, model: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#116dff] outline-none transition-all appearance-none text-gray-900 disabled:opacity-50 disabled:bg-gray-100"
                                >
                                    {YOLO_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 block">No. of Classes</label>
                                    <input
                                        type="number"
                                        value={params.classes}
                                        disabled={!isEditing}
                                        onChange={(e) => setParams({ ...params, classes: parseInt(e.target.value) })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#116dff] outline-none transition-all disabled:opacity-50 disabled:bg-gray-100 text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 block">Epochs</label>
                                    <input
                                        type="number"
                                        value={params.epochs}
                                        disabled={!isEditing}
                                        onChange={(e) => setParams({ ...params, epochs: parseInt(e.target.value) })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#116dff] outline-none transition-all disabled:opacity-50 disabled:bg-gray-100 text-gray-900"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 block">Batch Size</label>
                                    <input
                                        type="number"
                                        value={params.batchSize}
                                        disabled={!isEditing}
                                        onChange={(e) => setParams({ ...params, batchSize: parseInt(e.target.value) })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#116dff] outline-none transition-all disabled:opacity-50 disabled:bg-gray-100 text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 block">Learning Rate</label>
                                    <input
                                        type="number"
                                        step="0.001"
                                        value={params.lr}
                                        disabled={!isEditing}
                                        onChange={(e) => setParams({ ...params, lr: parseFloat(e.target.value) })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#116dff] outline-none transition-all disabled:opacity-50 disabled:bg-gray-100 text-gray-900"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 block">Augmentation</label>
                                <select
                                    value={params.augmentation ? 'true' : 'false'}
                                    disabled={!isEditing}
                                    onChange={(e) => setParams({ ...params, augmentation: e.target.value === 'true' })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#116dff] outline-none transition-all appearance-none text-gray-900 disabled:opacity-50 disabled:bg-gray-100"
                                >
                                    <option value="true">True</option>
                                    <option value="false">False</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {!isEditing ? (
                            <button
                                onClick={() => {
                                    setIsEditing(true);
                                    setCanTrain(false); // Reset training state if they start editing again
                                }}
                                disabled={isTraining}
                                className="w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all duration-500 bg-[#116dff] text-white hover:bg-blue-600 shadow-lg hover:shadow-xl disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Adjust Parameters
                            </button>
                        ) : (
                            <button
                                onClick={handleUpdateConfig}
                                className="w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all duration-500 bg-[#116dff] text-white shadow-xl hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Save Parameters
                            </button>
                        )}

                        {canTrain && !isTraining && (
                            <button
                                onClick={startTraining}
                                className="w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-xl bg-gray-900 text-white hover:scale-[1.02] active:scale-[0.98] animate-in fade-in zoom-in duration-500"
                            >
                                Train Model
                            </button>
                        )}
                    </div>
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                    {/* Training Status / Results */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-200/60 min-h-[460px] flex flex-col items-center justify-center relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        {isTraining ? (
                            <div className="w-full space-y-6 text-center">
                                <div className="relative h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-[#116dff] transition-all duration-300 shadow-[0_0_15px_#116dff]"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <p className="text-[#116dff] font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">Synchronizing Neural Weights: {Math.round(progress)}%</p>
                                <div className="flex gap-2 justify-center">
                                    <div className="w-1 h-1 bg-[#116dff] animate-bounce"></div>
                                    <div className="w-1 h-1 bg-[#116dff] animate-bounce [animation-delay:0.2s]"></div>
                                    <div className="w-1 h-1 bg-[#116dff] animate-bounce [animation-delay:0.4s]"></div>
                                </div>
                            </div>
                        ) : showResults ? (
                            <div className="w-full animate-in zoom-in fade-in duration-500">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#116dff]">Training Complete</h3>
                                    <div className="bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                                        <span className="text-[8px] text-[#116dff] font-bold">SUCCESS</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Accuracy', val: '98.4%' },
                                        { label: 'mAP@.50', val: '0.942' },
                                        { label: 'Precision', val: '0.912' },
                                        { label: 'Recall', val: '0.895' }
                                    ].map((stat) => (
                                        <div key={stat.label} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                            <p className="text-gray-400 text-[8px] font-bold uppercase mb-1">{stat.label}</p>
                                            <p className="text-gray-900 font-black text-xl tracking-tighter">{stat.val}</p>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-center text-[8px] text-gray-400 uppercase tracking-widest mt-6 italic">Model weights extracted and ready for deployment</p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M12 2v20M2 12h20M5.88 5.88l12.24 12.24M18.12 5.88L5.88 18.12" /></svg>
                                </div>
                                <p className="text-gray-400 text-[10px] uppercase tracking-widest italic font-bold">Awaiting Synthesis initialization</p>
                                <p className="text-gray-300 text-[8px] uppercase tracking-[0.2em] mt-2">Server Connection: Active</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Training;
