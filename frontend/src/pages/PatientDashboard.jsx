import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
    LayoutDashboard,
    Activity,
    History,
    User,
    LogOut,
    Menu,
    X,
    Search,
    Bell,
    MapPin,
    Plus,
    Minus,
    Navigation,
    Calendar,
    AlertOctagon,
    ChevronRight,
    Droplet,
    Clock,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../api/axios';

// Fix Leaflet Default Icon 
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function PatientDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [userData, setUserData] = useState(null);
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch User Data and Requests
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, requestsRes] = await Promise.all([
                    api.get('/auth/me'),
                    api.get('/requests/my-requests')
                ]);
                setUserData(userRes.data);
                setMyRequests(requestsRes.data);
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

    const handleSOS = () => {
        toast.error('SOS Signal Broadcasted to nearby ambulances!', {
            duration: 5000,
            icon: '🚨',
            style: {
                fontWeight: 'bold',
                background: '#fee2e2',
                color: '#b91c1c',
            },
        });
    };

    const [requestModalOpen, setRequestModalOpen] = useState(false);
    const [requestData, setRequestData] = useState({
        blood_group: 'A+',
        units: 1,
        hospital: '',
        urgency: 'Standard'
    });
    const [requestLoading, setRequestLoading] = useState(false);
    const [broadcasts, setBroadcasts] = useState([]);
    const [donateLoading, setDonateLoading] = useState(null); // ID of request being donated to

    // Fetch User Data, Requests, and Broadcasts (if donor)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await api.get('/auth/me');
                setUserData(userRes.data);

                const requestsRes = await api.get('/requests/my-requests');
                setMyRequests(requestsRes.data);

                if (userRes.data.role === 'donor') {
                    const broadcastsRes = await api.get('/requests/broadcasts');
                    setBroadcasts(broadcastsRes.data);
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

    const handleDonate = async (reqId) => {
        setDonateLoading(reqId);
        const loadingToast = toast.loading('Processing donation offer...');
        try {
            await api.post(`/requests/${reqId}/donate`);
            toast.success('Thank you! Donation offer sent.', { id: loadingToast });

            // Remove from broadcasts list
            setBroadcasts(prev => prev.filter(req => req._id !== reqId));
        } catch (err) {
            console.error(err);
            toast.error('Failed to process donation.', { id: loadingToast });
        } finally {
            setDonateLoading(null);
        }
    };

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        setRequestLoading(true);
        const loadingToast = toast.loading('Broadcasting request...');
        try {
            const res = await api.post('/requests/create', requestData);
            toast.success(`Request ${res.data.status}!`, { id: loadingToast });
            setRequestModalOpen(false);
            setRequestData({ blood_group: 'A+', units: 1, hospital: '', urgency: 'Standard' });

            // Refresh requests
            const requestsRes = await api.get('/requests/my-requests');
            setMyRequests(requestsRes.data);
            setActiveTab('requests'); // Switch to requests tab

        } catch (err) {
            console.error(err);
            toast.error('Failed to create request.', { id: loadingToast });
        } finally {
            setRequestLoading(false);
        }
    };

    const handleFeature = (feature) => {
        if (feature === 'Request Blood') {
            setRequestModalOpen(true);
            return;
        }
        if (feature === 'New Request') {
            setRequestModalOpen(true);
            return;
        }
        // Map other features to tabs
        if (feature === 'Dashboard') { setActiveTab('dashboard'); setSidebarOpen(false); return; }
        if (feature === 'My Requests') { setActiveTab('requests'); setSidebarOpen(false); return; }
        if (feature === 'History') { setActiveTab('history'); setSidebarOpen(false); return; }
        if (feature === 'Profile') { setActiveTab('profile'); setSidebarOpen(false); return; }

        toast(feature + ' feature coming soon!', {
            icon: '🚧',
        });
        setSidebarOpen(false);
    };

    const renderDashboard = () => (
        <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Good Morning, {userData?.full_name?.split(' ')[0] || 'User'} 👋</h1>
                    <p className="text-slate-500 dark:text-slate-400">Here's what's happening near you today.</p>
                </div>
                <button onClick={() => setRequestModalOpen(true)} className="w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-lg font-bold shadow-lg hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2 text-sm group">
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    New Request
                </button>
            </div>

            {/* Urgent Broadcasts for Donors on Dashboard */}
            {userData?.role === 'donor' && broadcasts.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertOctagon className="w-6 h-6 text-red-600 animate-pulse" />
                        <h2 className="text-xl font-bold text-red-700 dark:text-red-400">Urgent Donation Requests Near You</h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {broadcasts.slice(0, 3).map(req => (
                            <div key={req._id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-red-100 dark:border-red-900/30 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full -mr-8 -mt-8"></div>
                                <div className="flex justify-between items-start mb-3">
                                    <span className="font-bold text-2xl text-red-600">{req.blood_group}</span>
                                    <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded uppercase">{req.urgency}</span>
                                </div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">{req.units_needed} Units Required</p>
                                <p className="text-xs text-slate-500 mb-4">at {req.hospital_name || 'Hospital'}</p>
                                <button
                                    onClick={() => handleDonate(req._id)}
                                    disabled={donateLoading === req._id}
                                    className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                                >
                                    {donateLoading === req._id ? 'Processing...' : 'I Can Donate'}
                                </button>
                            </div>
                        ))}
                        {broadcasts.length > 3 && (
                            <button onClick={() => setActiveTab('requests')} className="flex items-center justify-center text-red-600 font-bold text-sm hover:bg-red-50 rounded-xl transition-colors">
                                View All {broadcasts.length} Requests →
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Interactive Map Card */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[400px] lg:h-[500px]">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 z-10">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            <h3 className="font-bold text-slate-900 dark:text-white">Live Operations Map</h3>
                        </div>
                        <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-md text-xs font-bold border border-green-200">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Live Updates
                        </span>
                    </div>

                    <div className="flex-1 relative z-0">
                        <MapContainer
                            center={[19.0760, 72.8777]} // Default: Mumbai
                            zoom={12}
                            style={{ height: '100%', width: '100%' }}
                            zoomControl={false}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {/* Dummy Markers */}
                            <Marker position={[19.0760, 72.8777]}>
                                <Popup>You are here</Popup>
                            </Marker>
                            <Marker position={[19.0800, 72.8800]}>
                                <Popup>LifeLink General Hospital</Popup>
                            </Marker>
                            <Marker position={[19.0600, 72.8500]}>
                                <Popup>City Blood Bank (A+ Available)</Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </div>

                {/* Right Actions & Stats */}
                <div className="space-y-6 lg:h-[500px] flex flex-col">
                    {/* Urgent Action Card */}
                    <div onClick={() => setRequestModalOpen(true)} className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg shadow-red-500/20 relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                            <Droplet className="w-32 h-32" />
                        </div>
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm animate-pulse">
                                        <AlertOctagon className="w-5 h-5" />
                                    </span>
                                    <span className="font-bold text-sm tracking-wide text-red-100 uppercase">Urgent Request</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Request Blood</h3>
                                <p className="text-red-100 text-sm mb-6 max-w-[90%]">Broadcast an emergency request to nearby donors instantly.</p>
                            </div>
                            <button className="w-full bg-white text-red-600 py-3 rounded-lg font-bold shadow-md hover:bg-red-50 transition-colors flex items-center justify-center gap-2 group/btn">
                                Create Request
                                <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Schedule Donation */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-primary/50 transition-colors cursor-pointer flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Next Slot</span>
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Schedule Donation</h3>
                        <p className="text-slate-500 text-sm mb-4">You are eligible to donate. Book a slot at a nearby clinic.</p>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-green-500 rounded-full w-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                        </div>
                        <p className="text-[10px] text-green-600 font-bold text-right flex items-center justify-end gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            Eligibility: Ready
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderRequests = () => (
        <div className="animate-in fade-in duration-500 space-y-8">
            {/* Show Broadcasts Section First for Donors */}
            {userData?.role === 'donor' && (
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <AlertOctagon className="w-6 h-6 text-red-600" />
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Urgent Needs: Can You Help?</h2>
                    </div>
                    <div className="grid gap-4">
                        {broadcasts.length === 0 ? (
                            <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No urgent needs right now</h3>
                                <p className="text-slate-500">Thank you for being ready to save lives!</p>
                            </div>
                        ) : (
                            broadcasts.map(req => (
                                <div key={req._id} className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg bg-red-600 animate-pulse`}>
                                            {req.blood_group}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-slate-900 dark:text-white">{req.units_needed} Units Required - Urgent!</h3>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                Needed at {req.hospital_name || 'Hospital'} • {new Date(req.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDonate(req._id)}
                                        disabled={donateLoading === req._id}
                                        className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg shadow-red-500/30 transition-all flex items-center gap-2"
                                    >
                                        {donateLoading === req._id ? 'Processing...' : 'I Can Donate'}
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">My Blood Requests</h2>
                <div className="grid gap-4">
                    {myRequests.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                            <Droplet className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No requests active</h3>
                            <p className="text-slate-500">Create a new blood request to see it here.</p>
                        </div>
                    ) : (
                        myRequests.map((req) => (
                            <div key={req._id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg ${req.blood_group.includes('+') ? 'bg-red-500' : 'bg-red-600'}`}>
                                        {req.blood_group}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-slate-900 dark:text-white">{req.units_needed} Units Required</h3>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${req.urgency === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                }`}>{req.urgency}</span>
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            {new Date(req.created_at).toLocaleDateString()} at {new Date(req.created_at).toLocaleTimeString()}
                                        </p>
                                        {req.hospital_name && <p className="text-sm text-slate-600 font-medium mt-1">🏥 {req.hospital_name}</p>}
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                                    <span className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 ${req.status === 'Approved'
                                        ? 'bg-green-100 text-green-700 border border-green-200'
                                        : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                        }`}>
                                        {req.status === 'Approved' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                        {req.status}
                                    </span>
                                    {req.fulfilled_by && (
                                        <span className="text-xs text-green-600 font-medium">
                                            Fulfilled by: {req.fulfilled_by}
                                        </span>
                                    )}
                                    {req.status === 'Pending' && (
                                        <span className="text-xs text-yellow-600 font-medium">
                                            Broadcasted to {req.broadcasted_to?.length || 0} donors
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );

    const renderHistory = () => (
        <div className="animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Activity History</h2>
            {/* Mock History */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                {[1, 2, 3].map((item, idx) => (
                    <div key={idx} className="p-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Logged In</h4>
                            <p className="text-xs text-slate-500">Successful login to Patient Dashboard</p>
                        </div>
                        <span className="text-xs text-slate-400">2 hrs ago</span>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderProfile = () => (
        <div className="animate-in fade-in duration-500 max-w-2xl">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">My Profile</h2>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold border-4 border-white dark:border-slate-800 shadow-lg">
                        {userData?.full_name?.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{userData?.full_name}</h3>
                        <p className="text-slate-500">{userData?.smart_id}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20">
                            {userData?.role && userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                        </span>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Blood Group</label>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{userData?.blood_group || 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Account Created</label>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                            {userData?.created_at ? new Date(userData.created_at).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex overflow-hidden font-sans">
            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 bg-white dark:bg-slate-900 w-64 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block shadow-2xl lg:shadow-none`}>
                <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
                        <Activity className="w-8 h-8" />
                        <span>LifeLink</span>
                    </div>
                    <button className="ml-auto lg:hidden text-slate-500 hover:text-slate-700" onClick={() => setSidebarOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex flex-col h-[calc(100%-4rem)] justify-between">
                    <div className="p-4 space-y-1">
                        <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Menu</div>
                        <button
                            onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left ${activeTab === 'dashboard' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            Dashboard
                        </button>
                        <button
                            onClick={() => { setActiveTab('requests'); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left ${activeTab === 'requests' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                            <Activity className="w-5 h-5" />
                            My Requests
                        </button>
                        <button
                            onClick={() => { setActiveTab('history'); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left ${activeTab === 'history' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                            <History className="w-5 h-5" />
                            History
                        </button>
                        <button
                            onClick={() => { setActiveTab('profile'); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left ${activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                            <User className="w-5 h-5" />
                            Profile
                        </button>
                    </div>

                    <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded-lg font-medium transition-colors group text-left">
                            <LogOut className="w-5 h-5 group-hover:text-red-500 transition-colors" />
                            Logout
                        </button>

                        <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-4 border border-red-100 dark:border-red-900/20">
                            <button onClick={handleSOS} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 animate-pulse hover:animate-none transition-all active:scale-95">
                                <AlertOctagon className="w-5 h-5" />
                                Emergency SOS
                            </button>
                            <p className="text-[10px] text-red-600/80 dark:text-red-400 text-center mt-2 font-medium">
                                Press only in case of medical emergency
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 z-30 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200" onClick={() => setSidebarOpen(true)}>
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="relative hidden md:block group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search donors, hospitals..."
                                className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        <button onClick={() => toast('No new notifications', { icon: '🔔' })} className="relative p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        </button>
                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                        <div className="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" onClick={() => setActiveTab('profile')}>
                            <div className="flex flex-col text-right hidden sm:block">
                                <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{userData?.full_name || 'User'}</span>
                                <span className="text-xs text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded-full inline-flex items-center gap-1 justify-end mt-0.5">
                                    <Droplet className="w-3 h-3 fill-current" />
                                    {userData?.blood_group || 'O+'} {userData?.role || 'Patient'}
                                </span>
                            </div>
                            <img src={`https://ui-avatars.com/api/?name=${userData?.full_name || 'User'}&background=0D8ABC&color=fff`} alt="User" className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" />
                        </div>
                    </div>
                </header>

                {/* Dashboard Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 lg:space-y-8 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'dashboard' && renderDashboard()}
                            {activeTab === 'requests' && renderRequests()}
                            {activeTab === 'history' && renderHistory()}
                            {activeTab === 'profile' && renderProfile()}
                        </>
                    )}
                </div>
            </main>
            {/* Request Blood Modal */}
            {requestModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Droplet className="w-5 h-5 text-red-500" />
                                New Blood Request
                            </h3>
                            <button onClick={() => setRequestModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleRequestSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Blood Group Needed</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                                    type="number" min="1" max="10"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    value={requestData.units}
                                    onChange={(e) => setRequestData({ ...requestData, units: parseInt(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Hospital Name (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="e.g. City General Hospital"
                                    value={requestData.hospital}
                                    onChange={(e) => setRequestData({ ...requestData, hospital: e.target.value })}
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
                                                ? (level === 'Critical' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900')
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
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
                                className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
                            >
                                {requestLoading ? 'Broadcasting...' : 'Broadcast Request'}
                                <Activity className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
