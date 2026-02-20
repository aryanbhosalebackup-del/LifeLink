import React, { useState } from 'react';
import { Menu, X, Phone, QrCode, Map } from 'lucide-react';

export default function ActiveTracking() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 h-screen flex overflow-hidden font-sans">
            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 bg-white dark:bg-slate-900 w-80 border-r border-slate-200 dark:border-slate-800 z-50 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block shadow-2xl lg:shadow-none`}>
                <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 shadow-sm relative z-10 justify-between lg:justify-start">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <h1 className="font-bold text-lg tracking-tight">Mission #9921</h1>
                    </div>
                    <button className="lg:hidden text-slate-500 hover:text-slate-700" onClick={() => setSidebarOpen(false)}>
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-auto p-4 space-y-6">
                    {/* Status Tracker */}
                    <div className="relative pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-8 py-2">
                        {/* Status Item 1: Completed */}
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-slate-900"></div>
                            <div className="opacity-50">
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Request Verified</h4>
                                <p className="text-xs text-slate-500">10:42 AM • Dr. Mehta</p>
                            </div>
                        </div>
                        {/* Status Item 2: Completed */}
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-slate-900"></div>
                            <div className="opacity-50">
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Dispatch Approved</h4>
                                <p className="text-xs text-slate-500">10:45 AM • City Blood Bank</p>
                            </div>
                        </div>
                        {/* Status Item 3: Active */}
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-primary border-2 border-white dark:border-slate-900 shadow-[0_0_0_4px_rgba(37,99,235,0.2)]"></div>
                            <div>
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white text-primary">In Transit</h4>
                                <p className="text-xs text-slate-500">Estimated Arrival: 11:20 AM</p>
                                <div className="mt-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                            RD
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-blue-900 dark:text-blue-100">Raju D. (Driver)</p>
                                            <p className="text-[10px] text-blue-700 dark:text-blue-300">MH-12-AB-1234</p>
                                        </div>
                                        <button className="ml-auto w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-sm hover:scale-105 transition-transform">
                                            <Phone className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Status Item 4: Pending */}
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900"></div>
                            <div className="opacity-40">
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Hospital Received</h4>
                                <p className="text-xs text-slate-500">Pending Arrival</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-black/20">
                    <button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors active:scale-95">
                        <QrCode className="w-5 h-5" />
                        Scan on Arrival
                    </button>
                </div>
            </aside>
            {/* Map Area */}
            <main className="flex-1 relative bg-slate-200 dark:bg-slate-800 map-gradient z-0">
                {/* Mobile Toggle */}
                <button className="lg:hidden absolute top-4 left-4 z-50 bg-white dark:bg-slate-900 p-2 rounded-lg shadow-lg text-slate-700 dark:text-slate-200" onClick={() => setSidebarOpen(true)}>
                    <Menu className="w-6 h-6" />
                </button>
                {/* Map Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center opacity-50">
                        <Map className="w-16 h-16 mx-auto mb-2 text-slate-400" />
                        <p className="font-bold text-slate-500">Interactive Map Component</p>
                    </div>
                </div>
                {/* ETA Overlay */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-slate-900/90 text-white px-6 py-3 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-4 border border-white/10">
                    <div className="text-center border-r border-white/20 pr-4">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ETA</p>
                        <p className="text-xl font-black">12 min</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Distance</p>
                        <p className="text-xl font-black">4.2 km</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
