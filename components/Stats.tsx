import React from 'react';

const Stats: React.FC = () => {
    // Mock data for user statistics
    const metrics = [
        { label: 'Total Predictions', val: '1,248', change: '+12%', color: '#116dff' },
        { label: 'Training Sessions', val: '42', change: '+5', color: '#116dff' },
        { label: 'Avg. Accuracy', val: '94.2%', change: '+0.8%', color: '#116dff' },
        { label: 'Cloud Storage', val: '8.4 GB', change: 'Stable', color: '#116dff' }
    ];

    const weeklyActivity = [40, 65, 30, 85, 45, 70, 90]; // Mock height percentages

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-sans">
            <div className="mb-12 text-center">
                <h1 className="text-5xl font-black italic tracking-tighter mb-2 text-gray-900">
                    ANALYTICS <span className="text-[#116dff]">DASHBOARD</span>
                </h1>
                <p className="text-gray-500 uppercase tracking-[0.6em] text-[10px] font-bold">Neural Utilization Metrics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {metrics.map((m) => (
                    <div key={m.label} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500 group">
                        <p className="text-gray-400 text-[8px] font-black uppercase tracking-widest mb-1">{m.label}</p>
                        <div className="flex items-baseline justify-between">
                            <h3 className="text-2xl font-black tracking-tighter text-gray-900">{m.val}</h3>
                            <span className="text-[10px] text-[#116dff] font-bold opacity-0 group-hover:opacity-100 transition-opacity">{m.change}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Chart */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#116dff]">Compute Activity</h2>
                        <span className="text-[8px] text-gray-400 font-bold uppercase bg-gray-50 px-2 py-1 rounded-full">Last 7 Days</span>
                    </div>

                    <div className="h-48 flex items-end justify-between gap-2 px-4 relative">
                        {/* Professional Grid Background */}
                        <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none z-0">
                            {/* Technical Grid Pattern */}
                            <div className="absolute inset-0 opacity-[0.15]"
                                style={{
                                    backgroundImage: 'linear-gradient(#111827 1px, transparent 1px), linear-gradient(90deg, #111827 1px, transparent 1px)',
                                    backgroundSize: '20px 20px'
                                }}>
                            </div>
                            {/* Horizontal Axis Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                {[0, 1, 2, 3].map(i => (
                                    <div key={i} className="w-full h-px bg-gray-300 flex items-center">
                                        <div className="w-2 h-px bg-gray-400"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {weeklyActivity.map((height, i) => (
                            <div key={i} className="flex-grow flex flex-col items-center group z-10">
                                <div
                                    className="w-full bg-blue-50 rounded-t-lg group-hover:bg-[#116dff]/10 transition-all duration-500 relative overflow-hidden"
                                    style={{ height: `${height}%` }}
                                >
                                    <div className="absolute bottom-0 left-0 w-full bg-[#116dff] h-1 opacity-50 group-hover:h-full group-hover:opacity-20 transition-all duration-500"></div>
                                </div>
                                <span className="text-[8px] text-gray-400 mt-2 font-black">DAY {i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Health / Recent Events */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#116dff]">Neural Status</h2>

                    <div className="space-y-4">
                        {[
                            { name: 'Model Optimization', status: 'Optimal', load: '14%' },
                            { name: 'GPU Latency', status: '32ms', load: 'Low' },
                            { name: 'Dataset Integrity', status: 'Verified', load: '100%' }
                        ].map((stat) => (
                            <div key={stat.name} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 hover:pl-2 transition-all">
                                <div>
                                    <p className="text-[10px] text-gray-900 font-bold uppercase">{stat.name}</p>
                                    <p className="text-[8px] text-gray-400 font-bold uppercase">{stat.load} Load Factor</p>
                                </div>
                                <span className="text-[10px] text-[#116dff] font-black uppercase tracking-widest">{stat.status}</span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-gray-50">
                        <div className="bg-blue-50 rounded-2xl p-4 flex items-center gap-4">
                            <div className="w-2 h-2 bg-[#116dff] rounded-full animate-pulse shadow-[0_0_10px_#116dff]"></div>
                            <p className="text-[8px] text-gray-500 uppercase tracking-widest leading-relaxed">System backbone is operating at peak performance with zero spectral anomalies detected.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Stats;
