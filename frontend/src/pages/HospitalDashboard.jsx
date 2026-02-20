import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
    LayoutDashboard,
    Activity,
    Package,
    Users,
    Menu,
    X,
    Droplet,
    TrendingDown,
    UserPlus,
    AlertCircle,
    QrCode,
    BarChart3,
    Clock,
    CheckCircle2,
    Truck,
    Search,
    Bell,
    Plus,
    ChevronRight,
    LogOut,
    Calendar,
    FileText
} from 'lucide-react';
import api from '../api/axios';

export default function HospitalDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [inventory, setInventory] = useState([]);
    const [myRequests, setMyRequests] = useState([]);

    // Request Modal State
    const [requestModalOpen, setRequestModalOpen] = useState(false);
    const [requestData, setRequestData] = useState({
        blood_group: 'A+',
        units: 1,
        hospital: 'City General Hospital', // Default
        urgency: 'Critical'
    });
    const [requestLoading, setRequestLoading] = useState(false);

    // QR Modal State
    const [qrModalOpen, setQrModalOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, invRes, reqRes] = await Promise.all([
                    api.get('/auth/me'),
                    api.get('/inventory'),
                    api.get('/requests/my-requests')
                ]);
                setUserData(userRes.data);
                setInventory(invRes.data);
                setMyRequests(reqRes.data);
                // Pre-fill hospital name if available in user profile
                if (userRes.data.full_name) {
                    setRequestData(prev => ({ ...prev, hospital: userRes.data.full_name }));
                }
            } catch (err) {
                console.error("Failed to fetch data", err);
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        toast.success('Logged out successfully');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        setRequestLoading(true);
        const loadingToast = toast.loading('Broadcasting emergency request...');
        try {
            const res = await api.post('/requests/create', requestData);
            toast.success(`Request ${res.data.status}!`, { id: loadingToast });
            setRequestModalOpen(false);

            // Refresh requests
            const reqRes = await api.get('/requests/my-requests');
            setMyRequests(reqRes.data);
            setActiveTab('requests');
        } catch (err) {
            console.error(err);
            toast.error('Failed to create request.', { id: loadingToast });
        } finally {
            setRequestLoading(false);
        }
    };

    // Derived State for KPIs
    const totalRequests = myRequests.length;
    const pendingRequests = myRequests.filter(r => r.status === 'Pending').length;
    const fulfilledRequests = myRequests.filter(r => r.status === 'Fulfilled' || r.status === 'Approved').length;

    const renderDashboard = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Hospital Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage blood supply and emergency requests.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={() => setQrModalOpen(true)} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 text-sm">
                        <QrCode className="w-4 h-4" />
                        Check-In QR
                    </button>
                    <button onClick={() => setRequestModalOpen(true)} className="flex-1 sm:flex-none bg-red-600 text-white px-4 py-2.5 rounded-lg font-bold shadow-lg shadow-red-500/20 hover:bg-red-700 transition-all flex items-center justify-center gap-2 text-sm">
                        <Plus className="w-5 h-5" />
                        New Request
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
                            <Activity className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
                            Active
                        </span>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{pendingRequests}</h3>
                        <p className="text-sm text-slate-500">Pending Emergencies</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{fulfilledRequests}</h3>
                        <p className="text-sm text-slate-500">Fulfilled Requests</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                            <FileText className="w-6 h-6" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{totalRequests}</h3>
                        <p className="text-sm text-slate-500">Total Cases Logged</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4 overflow-hidden relative">
                    <div className="absolute right-0 top-0 opacity-10">
                        <Package className="w-32 h-32 transform rotate-12 translate-x-10 -translate-y-5" />
                    </div>
                    <div className="flex justify-between items-start z-10">
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-400">
                            <Package className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="z-10">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Stock Check</h3>
                        <button onClick={() => setActiveTab('inventory')} className="text-sm text-primary font-bold hover:underline">View Central Inventory &rarr;</button>
                    </div>
                </div>
            </div>

            {/* Live Feed Mock */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Recent Activity</h3>
                    <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-bold border border-green-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Live
                    </span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    <div className="p-4 flex gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                            <Truck className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Shipment Arrived</p>
                            <p className="text-xs text-slate-500">5 Units of A+ Blood received from Central Bank.</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">2 hours ago</span>
                        </div>
                    </div>
                    <div className="p-4 flex gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Emergency Request Created</p>
                            <p className="text-xs text-slate-500">Urgent request for 2 Units of O- logged by Dr. Smith.</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">5 hours ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderRequests = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Emergency Requests</h2>
                <button onClick={() => setRequestModalOpen(true)} className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-red-700 transition-all flex items-center gap-2 text-sm">
                    <Plus className="w-4 h-4" />
                    New Request
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Blood Group</th>
                                <th className="px-6 py-4">Units</th>
                                <th className="px-6 py-4">Urgency</th>
                                <th className="px-6 py-4">Created Time</th>
                                <th className="px-6 py-4">Fulfilled By</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {myRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-slate-500">
                                        No active requests found.
                                    </td>
                                </tr>
                            ) : (
                                myRequests.map(req => (
                                    <tr key={req._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${req.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' :
                                                    req.status === 'Fulfilled' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                        'bg-yellow-100 text-yellow-700 border-yellow-200'
                                                }`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                                            <span className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-xs">
                                                {req.blood_group}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{req.units_needed} Units</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-bold uppercase ${req.urgency === 'Critical' ? 'text-red-600' : 'text-slate-500'}`}>
                                                {req.urgency}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-xs">
                                            {new Date(req.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-xs">
                                            {req.fulfilled_by ? (
                                                <span className="flex items-center gap-1 text-green-600 font-bold">
                                                    <CheckCircle2 className="w-3 h-3" /> {req.fulfilled_by}
                                                </span>
                                            ) : '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderInventory = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Central Blood Bank Inventory</h2>
                    <p className="text-slate-500">Real-time availability at central shortage.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4">Blood Group</th>
                                <th className="px-6 py-4">ISBT-128 ID</th>
                                <th className="px-6 py-4">Expiry Date</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {inventory.filter(u => u.status === 'Available').length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-10 text-center text-slate-500">
                                        No available units in Central Bank.
                                    </td>
                                </tr>
                            ) : (
                                inventory.filter(u => u.status === 'Available').map(unit => (
                                    <tr key={unit._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs text-white shadow-sm ${unit.blood_group.includes('+') ? 'bg-red-500' : 'bg-red-600'
                                                }`}>
                                                {unit.blood_group}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{unit.isbt_id}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-xs">
                                            {new Date(unit.expiry_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-100 text-green-700 border border-green-200">
                                                Available
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderDonors = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Registered Donors</h2>
                <p className="text-slate-500">Recent donors who fulfilled requests.</p>
            </div>
            {/* Mock Data based on fulfilled requests for now */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {myRequests.filter(r => r.fulfilled_by).length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                        No donor history available yet.
                    </div>
                ) : (
                    myRequests.filter(r => r.fulfilled_by).map(req => (
                        <div key={req._id} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white">{req.fulfilled_by}</h4>
                                <p className="text-xs text-slate-500">Donated for Request: {req.blood_group}</p>
                                <p className="text-[10px] text-green-600 font-bold mt-1">Verified Donor</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex overflow-hidden font-sans">
            {/* Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity" onClick={() => setSidebarOpen(false)}></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 bg-white dark:bg-slate-900 w-64 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static flex flex-col`}>
                <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 gap-3">
                    <div className="bg-primary/10 p-1.5 rounded-lg">
                        <Activity className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight leading-none">LifeLink</h1>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Hospital Admin</span>
                    </div>
                    <button className="ml-auto lg:hidden text-slate-500" onClick={() => setSidebarOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-4 space-y-1 flex-1">
                    <button onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false) }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left ${activeTab === 'dashboard' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                        <LayoutDashboard className="w-5 h-5" />
                        Overview
                    </button>
                    <button onClick={() => { setActiveTab('requests'); setSidebarOpen(false) }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left ${activeTab === 'requests' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                        <Activity className="w-5 h-5" />
                        Requests
                    </button>
                    <button onClick={() => { setActiveTab('inventory'); setSidebarOpen(false) }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left ${activeTab === 'inventory' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                        <Package className="w-5 h-5" />
                        Inventory
                    </button>
                    <button onClick={() => { setActiveTab('donors'); setSidebarOpen(false) }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left ${activeTab === 'donors' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                        <Users className="w-5 h-5" />
                        Donors
                    </button>
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium transition-colors text-left">
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 z-30 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden text-slate-500" onClick={() => setSidebarOpen(true)}>
                            <Menu className="w-6 h-6" />
                        </button>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white hidden sm:block">
                            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-200">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-xs font-bold uppercase hidden sm:inline">System Operational</span>
                        </div>
                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col text-right hidden sm:block">
                                <span className="text-sm font-bold text-slate-900 dark:text-white">{userData?.full_name || 'Hospital Admin'}</span>
                                <span className="text-xs text-slate-500">Administrator</span>
                            </div>
                            <span className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold border-2 border-white dark:border-slate-600 shadow-sm">
                                {userData?.full_name?.charAt(0) || 'H'}
                            </span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 lg:space-y-8 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'dashboard' && renderDashboard()}
                            {activeTab === 'requests' && renderRequests()}
                            {activeTab === 'inventory' && renderInventory()}
                            {activeTab === 'donors' && renderDonors()}
                        </>
                    )}
                </div>
            </main>

            {/* Request Modal */}
            {requestModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-red-500" />
                                New Emergency Request
                            </h3>
                            <button onClick={() => setRequestModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleRequestSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Blood Group Needed</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                                    value={requestData.blood_group}
                                    onChange={(e) => setRequestData({ ...requestData, blood_group: e.target.value })}
                                >
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                        <option key={bg} value={bg}>{bg}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Units Required</label>
                                <input
                                    type="number" min="1" max="50"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                                    value={requestData.units}
                                    onChange={(e) => setRequestData({ ...requestData, units: parseInt(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Urgency Level</label>
                                <div className="flex gap-2">
                                    {['Standard', 'Urgent', 'Critical'].map(level => (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() => setRequestData({ ...requestData, urgency: level })}
                                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${requestData.urgency === level
                                                ? (level === 'Critical' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-slate-900 text-white')
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                                }`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={requestLoading}
                                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                {requestLoading ? 'Broadcasting...' : 'Broadcast Emergency'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* QR Modal */}
            {qrModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 p-8 text-center">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Hospital Check-In</h3>
                        <p className="text-sm text-slate-500 mb-6">Scan to register arrival</p>
                        <div className="bg-white p-4 rounded-xl shadow-inner border border-slate-100 inline-block">
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=HOSPITAL_CHECKIN_${userData?._id || 'demo'}`} alt="QR Code" className="w-48 h-48" />
                        </div>
                        <button onClick={() => setQrModalOpen(false)} className="mt-8 text-slate-500 hover:text-slate-800 font-bold text-sm">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
