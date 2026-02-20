import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Phone, Droplet, Lock, Eye, EyeOff, Globe, ChevronDown, Activity, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useTranslation } from 'react-i18next';
import ThemeToggle from '../components/ThemeToggle';

export default function Registration() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        full_name: '',
        smart_id: '',
        blood_group: '',
        password: '',
        role: 'patient' // Default role for public registration
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        const loadingToast = toast.loading('Creating account...');

        try {
            await api.post('/auth/register', formData);
            toast.success('Registration successful! Please login.', { id: loadingToast });
            navigate('/login');
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.detail || 'Registration failed. Please try again.', { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="font-sans bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-300">
            {/* Header / TopNavBar */}
            <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/')}>
                        <Activity className="w-8 h-8 text-primary" />
                        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white hidden sm:block transition-colors">{t('app.title')}</span>
                    </div>
                    {/* Language and Theme Toggle */}
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <div className="relative group">
                            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-semibold text-slate-700 dark:text-slate-300">
                                <Globe className="w-4 h-4" />
                                <span className="hidden sm:inline">{i18n.language === 'en' ? 'English' : i18n.language === 'hi' ? 'Hindi' : 'Marathi'}</span>
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                <ul className="py-1">
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
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center p-4 sm:p-6 md:p-12">
                <div className="w-full max-w-[520px] bg-white dark:bg-slate-900 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden animate-in slide-in-from-bottom-5 duration-500 transition-colors">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-200 dark:border-slate-800 transition-colors">
                        <button className="flex-1 py-4 text-sm font-bold border-b-2 border-primary text-primary bg-primary/5 transition-colors">
                            {t('auth.public_login')}
                        </button>
                        {/* This would be dynamic in a real app, here it shows the inactive state */}
                        <button className="flex-1 py-4 text-sm font-bold border-b-2 border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors" onClick={() => toast('Institution registration requires admin approval.')}>
                            {t('auth.institution_login')}
                        </button>
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">{t('auth.register_title')}</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">{t('auth.register_subtitle')}</p>
                        </div>

                        {/* Public Registration Form (Active) */}
                        <form className="space-y-5" onSubmit={handleRegister}>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 transition-colors">{t('auth.full_name')}</label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                                    <input
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                                        placeholder="John Doe"
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 transition-colors">{t('auth.phone')}</label>
                                <div className="relative group">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                                    <input
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 form-input"
                                        pattern="[0-9]{10}"
                                        placeholder="9876543210"
                                        type="tel"
                                        name="smart_id"
                                        value={formData.smart_id}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 transition-colors">{t('auth.select_role')}</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className={`cursor-pointer border rounded-lg p-3 flex items-center justify-center gap-2 transition-all ${formData.role === 'patient' ? 'bg-primary/10 border-primary text-primary' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="patient"
                                            checked={formData.role === 'patient'}
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                        <span className="font-bold">{t('roles.patient')}</span>
                                    </label>
                                    <label className={`cursor-pointer border rounded-lg p-3 flex items-center justify-center gap-2 transition-all ${formData.role === 'donor' ? 'bg-green-100 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="donor"
                                            checked={formData.role === 'donor'}
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                        <span className="font-bold">{t('roles.donor')}</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 transition-colors">{t('auth.blood_group')}</label>
                                <div className="relative group">
                                    <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-start transition-colors w-5 h-5" />
                                    <select
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                                        name="blood_group"
                                        value={formData.blood_group}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option disabled value="">Select blood group</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-5 h-5" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 transition-colors">{t('auth.password')}</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                                    <input
                                        className="w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                                        placeholder="••••••••"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
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

                            <button
                                className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all shadow-lg shadow-primary/20 mt-4 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Registering...' : t('auth.register_button')}
                                {!loading && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            <footer className="w-full py-8 px-4 flex flex-col items-center gap-6 mt-auto transition-colors">
                <p className="text-slate-600 dark:text-slate-400 text-sm transition-colors">
                    {t('auth.has_account')}
                    <Link to="/login" className="text-primary font-bold hover:underline ml-1">{t('nav.login')}</Link>
                </p>
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors">
                    <a className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors" href="#">Privacy Policy</a>
                    <a className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors" href="#">Terms of Service</a>
                    <a className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors" href="#">Support</a>
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-600 text-center transition-colors">
                    © 2024 {t('app.title')} Healthcare Network. Secure and encrypted.
                </div>
            </footer>
        </div>
    );
}
