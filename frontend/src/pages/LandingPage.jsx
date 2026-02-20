import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Globe, User, Upload, Shield, Zap, FileText, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ThemeToggle from '../components/ThemeToggle';

export default function LandingPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setIsMenuOpen(false);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-sans transition-colors duration-300">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
                <div className="max-w-[1440px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity">
                            <div className="text-primary">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
                                        fill="currentColor"></path>
                                </svg>
                            </div>
                            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors">{t('app.title')}</h1>
                        </Link>
                    </div>

                    {/* Desktop and Tablet Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <nav className="flex items-center gap-4 lg:gap-6">
                            <button
                                onClick={() => changeLanguage('en')}
                                className={`text-sm font-semibold px-3 py-1 rounded-lg transition-colors ${i18n.language === 'en' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}>
                                English
                            </button>
                            <button
                                onClick={() => changeLanguage('hi')}
                                className={`text-sm font-medium px-3 py-1 rounded-lg transition-colors ${i18n.language === 'hi' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}>
                                Hindi
                            </button>
                            <button
                                onClick={() => changeLanguage('mr')}
                                className={`text-sm font-medium px-3 py-1 rounded-lg transition-colors ${i18n.language === 'mr' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}>
                                Marathi
                            </button>
                        </nav>
                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
                        <ThemeToggle />
                        <Link to="/login"
                            className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 hover:bg-primary/30 transition-all hover:scale-105 active:scale-95">
                            <User className="w-5 h-5 text-primary" />
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <ThemeToggle />
                        <Link to="/login"
                            className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 hover:bg-primary/30 transition-colors">
                            <User className="w-4 h-4 text-primary" />
                        </Link>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 shadow-lg animate-in slide-in-from-top-5 duration-200">
                        <nav className="flex flex-col gap-3">
                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <span className="font-medium text-slate-900 dark:text-slate-100">Language</span>
                                <span className="text-primary font-bold">{i18n.language.toUpperCase()}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <button onClick={() => changeLanguage('en')} className={`p-2 text-center text-sm font-medium rounded-md ${i18n.language === 'en' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Eng</button>
                                <button onClick={() => changeLanguage('hi')} className={`p-2 text-center text-sm font-medium rounded-md ${i18n.language === 'hi' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Hin</button>
                                <button onClick={() => changeLanguage('mr')} className={`p-2 text-center text-sm font-medium rounded-md ${i18n.language === 'mr' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Mar</button>
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            {/* Main Content Area */}
            <main className="flex-grow flex flex-col lg:flex-row max-w-[1440px] mx-auto w-full p-4 md:p-6 gap-8 lg:gap-12">
                {/* Left Side: Upload Zone */}
                <section className="flex-1 flex flex-col gap-6 md:gap-8">
                    <div className="space-y-3 md:space-y-4 text-center lg:text-left pt-4 lg:pt-8">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight transition-colors">
                            {t('hero.title')}
                        </h2>
                        <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed transition-colors">
                            {t('hero.description')}
                        </p>
                    </div>

                    <div className="flex-grow flex flex-col items-center justify-center border-3 md:border-4 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 rounded-xl md:rounded-2xl p-8 md:p-12 text-center group hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
                            <Upload className="w-10 h-10 md:w-12 md:h-12 text-primary" />
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2 max-w-xs mx-auto transition-colors">
                            Snap a photo of your handwritten prescription
                        </h3>
                        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto transition-colors">
                            Drag and drop files here or click to browse. Supports JPG, PNG, PDF up to 10MB.
                        </p>
                        <button className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transform hover:-translate-y-0.5 transition-all flex items-center gap-2 active:scale-95">
                            <Upload className="w-5 h-5" />
                            Upload File
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { icon: Shield, title: t('features.secure'), desc: t('features.secure_desc') },
                            { icon: Zap, title: t('features.fast'), desc: t('features.fast_desc') },
                            { icon: FileText, title: t('features.real_time'), desc: t('features.real_time_desc') }
                        ].map((item, idx) => (
                            <div key={idx} className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm hover:border-primary/30 transition-colors">
                                <item.icon className="w-6 h-6 text-primary" />
                                <div className="text-xs">
                                    <p className="font-bold text-slate-800 dark:text-slate-200 transition-colors">{item.title}</p>
                                    <p className="text-slate-500 transition-colors">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Right Side: AI Extraction Preview */}
                <aside className="w-full lg:w-[450px] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden mt-6 lg:mt-0 transition-colors">
                    <div className="p-5 md:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
                        <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100 transition-colors">
                            <Activity className="w-5 h-5 text-primary" />
                            AI Extraction Preview
                        </h2>
                        <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border border-primary/20">
                            Live Status
                        </span>
                    </div>

                    <div className="p-5 md:p-6 flex-grow space-y-6 md:space-y-8">
                        {/* Progress State */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white transition-colors">Processing prescription details...</p>
                                    <p className="text-xs text-slate-500 transition-colors">Scanning for medical terminology</p>
                                </div>
                                <span className="text-sm font-bold text-primary">74%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden transition-colors">
                                <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '74%' }}></div>
                            </div>
                        </div>

                        {/* Extracted Fields */}
                        <div className="space-y-4">
                            {[
                                { label: "Blood Component", value: "Packed Red Blood Cells" },
                                { label: "Units Required", value: "2 Units (800ml)" },
                                { label: "Patient Name (Auto-detected)", value: "Rahul Sharma" }
                            ].map((field, idx) => (
                                <div key={idx} className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 transition-colors">
                                        {field.label}
                                    </label>
                                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700 hover:border-slate-300 transition-colors group/input">
                                        <span className="font-medium text-slate-800 dark:text-slate-200 text-sm transition-colors">{field.value}</span>
                                        <button className="text-slate-400 group-hover/input:text-primary hover:bg-primary/10 p-1 rounded transition-colors">
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 transition-colors">
                                    Urgency Level
                                </label>
                                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900/30 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                        <span className="font-bold text-red-600 dark:text-red-400 text-sm transition-colors">STAT / EMERGENCY</span>
                                    </div>
                                    <button className="text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 p-1 rounded transition-colors">
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Note */}
                        <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30 flex gap-3 transition-colors">
                            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-xl font-variation-FILL">info</span>
                            <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed transition-colors">
                                Please verify all fields against your handwritten prescription. The AI might miss small handwritten details.
                            </p>
                        </div>
                    </div>

                    <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 transition-colors">
                        <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-[0.98]">
                            {t('hero.cta_request')}
                            <span className="material-symbols-outlined text-sm">send</span>
                        </button>
                    </div>
                </aside>
            </main>

            {/* Footer Meta */}
            <footer className="p-6 text-center border-t border-slate-100 dark:border-slate-800 mt-auto transition-colors">
                <p className="text-xs text-slate-400 dark:text-slate-600 font-medium">
                    © 2024 {t('app.title')} Clinical Systems. HIPAA Compliant &amp; Secure.
                </p>
            </footer>
        </div>
    );
}
