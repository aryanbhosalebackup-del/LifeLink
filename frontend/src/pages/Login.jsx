import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, LogIn, Globe, ChevronDown, Activity, Shield, Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useTranslation } from 'react-i18next';
import ThemeToggle from '../components/ThemeToggle';

export default function Login() {
    const navigate = useNavigate();
    const [smartId, setSmartId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const loadingToast = toast.loading('Verifying credentials...');

        try {
            const response = await api.post('/auth/login', {
                smart_id: smartId,
                password: password
            });

            const { access_token, role } = response.data;

            localStorage.setItem('token', access_token);
            localStorage.setItem('role', role);

            toast.success('Welcome back!', { id: loadingToast });

            // Redirect based on role
            switch (role) {
                case 'patient':
                case 'donor':
                    navigate('/dashboard/patient');
                    break;
                case 'hospital':
                    navigate('/dashboard/hospital');
                    break;
                case 'clinic':
                    navigate('/dashboard/clinic');
                    break;
                case 'bloodbank':
                    navigate('/dashboard/blood-bank');
                    break;
                default:
                    navigate('/landing');
            }

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.detail || 'Login failed. Please check your credentials.', { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-sans mb-10">
            {/* Top Navigation */}
            <header className="w-full px-4 md:px-6 py-4 flex justify-between items-center bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-primary cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/')}>
                    <Activity className="w-8 h-8" />
                    <h1 className="text-slate-900 dark:text-slate-100 text-xl font-bold tracking-tight hidden sm:block">{t('app.title')}</h1>
                </div>
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <div className="relative group">
                        <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium">
                            <Globe className="w-4 h-4" />
                            <span className="hidden sm:inline">{i18n.language === 'en' ? 'English' : i18n.language === 'hi' ? 'Hindi' : 'Marathi'}</span>
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        {/* Dropdown Menu */}
                        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <ul className="py-2">
                                <li>
                                    <button onClick={() => changeLanguage('en')} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors">
                                        English
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => changeLanguage('hi')} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors">
                                        Hindi
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => changeLanguage('mr')} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors">
                                        Marathi
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
                {/* Background Illustration Decor */}
                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none flex items-center justify-center">
                    <img className="w-full max-w-4xl object-contain grayscale"
                        alt="Abstract medical pattern"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAi-Su2AXmkzekdmszIiY696Rq3ROdwCx8Jz4Gvk1X2ilSB-vz9AjEM9L3hNLIArDj1KEx6yV0W7FG85mVSPSVvTyzklB-QSfKk8Q4a2CcCG2_m2ftsyPnzMbGfEVUnkTQaP5arYnEuyyyZF7Q-lp9U62Kw8nO18wrMfFzB4VzrYfEPbVKaO6JqFqyyF3EP1rDJmpeiQN5bi8ofW2fVeHWK5Vo1rryEy_jsewmJ0oW8Zne3ceRkQtwAqziB5WymuXn8NcjDTNwBlg1K" />
                </div>

                <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
                    {/* Left Side: Illustration & Branding - Hidden on mobile */}
                    <div className="hidden lg:flex flex-col gap-6 animate-in slide-in-from-left-5 duration-500">
                        <div className="rounded-3xl overflow-hidden bg-primary/5 p-8 border border-primary/10 shadow-inner group">
                            <img className="w-full h-auto rounded-xl shadow-lg transform group-hover:scale-[1.02] transition-transform duration-500"
                                alt="Modern medical professional"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBF6u9lDVRZIQm5mY9Z5kpcLzOTX3PjHm0j46nk0-o0RU1LtJxBaB9MJ8JyE5yYGbV36LTD77ZuY49FBUEnaPU6rktpH1iJPQI46C-EhE1boVdUBMTxFN8p31meLhQ1xIeAX1A3lzWGrQaoB-rCBrqoTlv_GBuCZ4r3Twv_P4zvJGl8UGfkf8KvzWRRkLg3ZEAJd4ghPrW6LLstp9eHNvfcwp-tA-Jukq0aJbIJ-CVuGz4QJ7ELjdQ6FTVfTTtAoKCd0wUwMaKs_q3J" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Unified Care Management</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                                Access patient records, schedule consultations, and manage prescriptions in one secure environment.
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Login Card */}
                    <div className="flex justify-center w-full">
                        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-primary/10 p-6 md:p-8 border-t-4 border-primary animate-in slide-in-from-bottom-5 duration-500">
                            <div className="mb-8 text-center md:text-left">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">{t('auth.login_title')}</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">{t('auth.login_subtitle')}</p>
                            </div>

                            <form className="space-y-5" onSubmit={handleLogin}>
                                {/* Smart Identifier Field */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        {t('auth.smart_id')}
                                    </label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                                        <input
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-sm"
                                            placeholder="Phone Number or Institutional Email"
                                            type="text"
                                            value={smartId}
                                            onChange={(e) => setSmartId(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            {t('auth.password')}
                                        </label>
                                        <a className="text-xs font-medium text-primary hover:underline cursor-pointer" onClick={() => toast('Please contact support to reset your password.')}>
                                            Forgot Password?
                                        </a>
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                                        <input
                                            className="w-full pl-10 pr-12 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-sm"
                                            placeholder="••••••••"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-2 space-y-4">
                                    <button
                                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
                                        type="submit"
                                        disabled={loading}>
                                        <LogIn className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                                        {loading ? 'Logging in...' : t('auth.login_button')}
                                    </button>

                                    <div className="flex items-center gap-4 py-2">
                                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
                                        <span className="text-xs text-slate-400 font-medium uppercase tracking-widest">or</span>
                                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
                                    </div>

                                    <button
                                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                                        type="button"
                                        onClick={() => toast('SSO integration coming soon!')}>
                                        <img className="w-5 h-5" alt="Google logo icon" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc7bjULp7n5ZHaNgsGctEIMBciAQGPGcrNEKTEUCqmyPGDveMqK35xulC4h63wsoSLW0tIEPQm_r7SrcJ6KO1hDsF2dm0UH9eNHDvYaKb-66L9-ZRY6XiAPjC_hpscfBqE-IABpkId0PFNNpVyjLDri1-TR3qqDj-6SOlAAMes1ypsw2xpR0MqkyrG4TXGrlQJJYnkgRqwuoFTxLi286_NMZX1SGH0X0pGcexfCPSro2fsWoHOjDyO7gndDJ7NrfiXAm3-cfskZ13R" />
                                        {t('auth.institution_login')}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                                <p className="text-slate-600 dark:text-slate-400 text-sm">
                                    {t('auth.no_account')}
                                    <Link to="/register" className="text-primary font-bold hover:underline ml-1">{t('auth.register_button')}</Link>
                                </p>
                            </div>

                            {/* Alert/Emergency Note */}
                            <div className="mt-6 p-3 rounded-lg bg-accent-red/5 border border-accent-red/10 flex gap-3 items-start">
                                <Shield className="w-5 h-5 text-accent-red shrink-0" />
                                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                                    <span className="text-accent-red font-bold">Emergency Notice:</span> If this is a
                                    life-threatening medical emergency, please call your local emergency services immediately.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="w-full py-6 px-4 md:px-6 text-center text-slate-400 dark:text-slate-600 text-xs mt-auto">
                <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-2">
                    <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
                    <a className="hover:text-primary transition-colors" href="#">HIPAA Compliance</a>
                    <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
                </div>
                <p>© 2024 {t('app.title')} Medical Systems. All rights reserved. Secure 256-bit SSL Encrypted.</p>
            </footer>
        </div>
    );
}
