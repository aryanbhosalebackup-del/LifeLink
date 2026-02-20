import React from 'react';
import { ArrowLeft, CloudUpload, ArrowRight, User, Calendar, MapPin } from 'lucide-react';

export default function PrescriptionUpload() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-sans">
            {/* Header */}
            <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <button className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="font-bold text-lg text-slate-900 dark:text-white">Upload Prescription</h1>
                </div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Step 1 of 3</div>
            </header>
            <main className="flex-1 max-w-2xl mx-auto w-full p-6 space-y-8 pb-24">
                {/* Upload Zone */}
                <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-900 dark:text-white">Prescription Image</label>
                    <div className="w-full aspect-[4/3] bg-white dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center p-8 text-center hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer group relative overflow-hidden">
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative z-10">
                            <CloudUpload className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-1 relative z-10">Click to upload or drag and drop</h3>
                        <p className="text-sm text-slate-500 max-w-xs relative z-10">SVG, PNG, JPG or PDF (max. 10MB)</p>
                    </div>
                </div>
                {/* Manual Entry Form */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Patient Details</h2>
                        <button className="text-sm font-bold text-primary hover:underline">Auto-fill from Profile</button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 align-middle">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input type="text" className="w-full pl-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Enter patient's full name" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Age</label>
                                <input type="number" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Age" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Gender</label>
                                <select className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none">
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {/* Requirement Details */}
                    <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Requirement</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Blood Group</label>
                                <select className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                                    <option>A+</option>
                                    <option>A-</option>
                                    <option>B+</option>
                                    <option>B-</option>
                                    <option>O+</option>
                                    <option>O-</option>
                                    <option>AB+</option>
                                    <option>AB-</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Units Required</label>
                                <input type="number" defaultValue="1" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Hospital / Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input type="text" className="w-full pl-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Search hospital..." />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            {/* Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 shadow-2xl z-50">
                <div className="max-w-2xl mx-auto flex gap-4">
                    <button className="flex-1 py-3.5 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
                    <button className="flex-[2] py-3.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95">
                        Submit Request
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
