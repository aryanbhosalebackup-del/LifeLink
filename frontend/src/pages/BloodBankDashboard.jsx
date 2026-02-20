import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import {
    Droplet,
    Package,
    Truck,
    History,
    Menu,
    X,
    Plus,
    AlertTriangle,
    Search,
    Trash2,
    Calendar,
    Filter,
    ClipboardList,
    CheckCircle,
    Send
} from 'lucide-react';

export default function BloodBankDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('inventory');
    const [inventory, setInventory] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGroup, setFilterGroup] = useState('All Groups');
    const [addModalOpen, setAddModalOpen] = useState(false);

    // New Unit Form State
    const [newUnit, setNewUnit] = useState({
        blood_group: 'A+',
        component_type: 'Whole Blood',
        quantity: 1
    });

    // Fetch Inventory
    const fetchInventory = async () => {
        try {
            const res = await api.get('/inventory');
            setInventory(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load inventory");
        } finally {
            setLoading(false);
        }
    };

    // Fetch Requests
    const fetchRequests = async () => {
        try {
            const res = await api.get('/requests/all');
            setRequests(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load requests");
        }
    };

    useEffect(() => {
        fetchInventory();
        fetchRequests();
    }, []);

    const handleAddUnit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Adding to inventory...');
        try {
            await api.post('/inventory/add', newUnit);
            toast.success(`Added ${newUnit.quantity} units of ${newUnit.blood_group}`, { id: loadingToast });
            setAddModalOpen(false);
            setNewUnit({ blood_group: 'A+', component_type: 'Whole Blood', quantity: 1 });
            fetchInventory(); // Refresh Inventory
            fetchRequests(); // Refresh Requests (Auto-Approval might have happened)
        } catch (err) {
            console.error(err);
            toast.error("Failed to add units", { id: loadingToast });
        }
    };

    const handleDeleteUnit = async (id) => {
        if (!window.confirm("Are you sure you want to remove this unit?")) return;

        try {
            await api.delete(`/inventory/${id}`);
            toast.success("Unit removed from inventory");
            // Optimistic update
            setInventory(prev => prev.filter(item => item._id !== id));
        } catch (err) {
            console.error(err);
            toast.error("Failed to remove unit");
        }
    };

    const handleApproveRequest = async (id) => {
        const loadingToast = toast.loading('Approving request...');
        try {
            await api.post(`/requests/${id}/fulfill`);
            toast.success("Request Approved!", { id: loadingToast });
            fetchRequests();
            fetchInventory(); // Inventory reduces
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.detail || "Failed to approve", { id: loadingToast });
        }
    };

    const handleDispatch = async (id) => {
        const loadingToast = toast.loading('Dispatching units...');
        try {
            await api.post(`/requests/${id}/dispatch`);
            toast.success("Units Dispatched!", { id: loadingToast });
            fetchRequests();
        } catch (err) {
            console.error(err);
            toast.error("Failed to dispatch", { id: loadingToast });
        }
    };

    // Derived State for KPIs
    // User Requirement: Show "Remaining" stock, so filter out Reserved/Dispatched
    const availableInventory = inventory.filter(u => u.status === 'Available');

    const totalUnits = availableInventory.length;

    const expiringSoon = availableInventory.filter(unit => {
        const expiry = new Date(unit.expiry_date);
        const now = new Date();
        const diffTime = expiry - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && diffDays >= 0;
    }).length;

    // Filter Logic
    const filteredInventory = availableInventory.filter(unit => {
        const matchesSearch = unit.isbt_id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGroup = filterGroup === 'All Groups' || unit.blood_group === filterGroup;
        return matchesSearch && matchesGroup;
    });

    return (
        <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen flex overflow-hidden font-sans">
            {/* Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 bg-white dark:bg-slate-900 w-64 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static flex flex-col`}>
                <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 justify-between lg:justify-start">
                    <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
                        <Droplet className="w-8 h-8 fill-current" />
                        <span>LifeLink</span>
                        <span className="text-xs font-normal text-slate-500 ml-1 self-end mb-1">Bank</span>
                    </div>
                    <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-4 space-y-1 flex-1">
                    <button onClick={() => setActiveTab('inventory')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left ${activeTab === 'inventory' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}>
                        <Package className="w-5 h-5" />
                        Inventory
                    </button>
                    <button onClick={() => setActiveTab('requests')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left ${activeTab === 'requests' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}>
                        <ClipboardList className="w-5 h-5" />
                        Requests
                    </button>
                    <button onClick={() => setActiveTab('distribution')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left ${activeTab === 'distribution' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}>
                        <Truck className="w-5 h-5" />
                        Distribution
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 z-30">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                            <Menu className="w-6 h-6" />
                        </button>
                        <h2 className="text-lg font-bold">
                            {activeTab === 'inventory' && 'Inventory Management'}
                            {activeTab === 'requests' && 'Blood Requests'}
                            {activeTab === 'distribution' && 'Distribution Logic'}
                        </h2>
                    </div>
                    {activeTab === 'inventory' && (
                        <button onClick={() => setAddModalOpen(true)} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg hover:bg-primary/90 transition-all active:scale-95">
                            <Plus className="w-5 h-5" />
                            Add Units
                        </button>
                    )}
                </header>

                <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">
                    {/* Render Content Based on Tab */}
                    {activeTab === 'inventory' && (
                        <>
                            {/* KPI Cards */}
                            <div className="grid sm:grid-cols-3 gap-4">
                                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                                    <div className="p-3 bg-red-100 text-red-600 rounded-full">
                                        <Droplet className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase">Total Units</p>
                                        <h3 className="text-2xl font-black">{totalUnits}</h3>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                                    <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full">
                                        <AlertTriangle className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase">Expiring Soon</p>
                                        <h3 className="text-2xl font-black">{expiringSoon}</h3>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                                    <div className="p-3 bg-green-100 text-green-600 rounded-full">
                                        <Truck className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase">Dispatched</p>
                                        <h3 className="text-2xl font-black">{requests.filter(r => r.status === 'Dispatched').length}</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Inventory Table & Controls */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 justify-between">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search ISBT-128 ID..."
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <select
                                        className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        value={filterGroup}
                                        onChange={(e) => setFilterGroup(e.target.value)}
                                    >
                                        <option>All Groups</option>
                                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                            <option key={bg} value={bg}>{bg}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                                            <tr>
                                                <th className="px-6 py-3">ISBT-128 ID</th>
                                                <th className="px-6 py-3">Group</th>
                                                <th className="px-6 py-3">Component</th>
                                                <th className="px-6 py-3">Expiry</th>
                                                <th className="px-6 py-3">Status</th>
                                                <th className="px-6 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                            {loading ? (
                                                <tr><td colSpan="6" className="text-center py-8">Loading inventory...</td></tr>
                                            ) : filteredInventory.length === 0 ? (
                                                <tr><td colSpan="6" className="text-center py-8 text-slate-500">No units found.</td></tr>
                                            ) : (
                                                filteredInventory.map(unit => (
                                                    <tr key={unit._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                                        <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-400">{unit.isbt_id}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-1 rounded font-bold text-xs ${unit.blood_group.includes('+') ? 'bg-red-100 text-red-700' : 'bg-red-50 text-red-600'
                                                                }`}>
                                                                {unit.blood_group}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">{unit.component_type}</td>
                                                        <td className="px-6 py-4">
                                                            {new Date(unit.expiry_date).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-1 rounded text-xs font-bold ${unit.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                                }`}>
                                                                {unit.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button
                                                                onClick={() => handleDeleteUnit(unit._id)}
                                                                className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded"
                                                                title="Remove Unit"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'requests' && (
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                                        <tr>
                                            <th className="px-6 py-3">Patient/Requester</th>
                                            <th className="px-6 py-3">Group</th>
                                            <th className="px-6 py-3">Units</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {requests.filter(r => r.status !== 'Dispatched').map(req => (
                                            <tr key={req._id}>
                                                <td className="px-6 py-4">{req.requester?.smart_id}</td>
                                                <td className="px-6 py-4 font-bold text-red-600">{req.blood_group}</td>
                                                <td className="px-6 py-4">{req.units_needed}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                        req.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100'
                                                        }`}>{req.status}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {req.status === 'Pending' && (
                                                        <button
                                                            onClick={() => handleApproveRequest(req._id)}
                                                            className="bg-green-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-green-700 transition-colors"
                                                        >
                                                            Manual Approve
                                                        </button>
                                                    )}
                                                    {req.status === 'Approved' && (
                                                        <span className="text-xs text-green-600 font-bold">Ready for Dispatch</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'distribution' && (
                        <div className="space-y-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800 flex items-center gap-3">
                                <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                <div>
                                    <h3 className="font-bold text-blue-900 dark:text-blue-100">Ready for Dispatch</h3>
                                    <p className="text-sm text-blue-700 dark:text-blue-300">Requests that have been approved and units reserved.</p>
                                </div>
                            </div>

                            {requests.filter(r => r.status === 'Approved').length === 0 && (
                                <p className="text-center text-slate-500 py-8">No approved requests waiting for dispatch.</p>
                            )}

                            {requests.filter(r => r.status === 'Approved').map(req => (
                                <div key={req._id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm">
                                    <div>
                                        <h4 className="font-bold text-lg">Dispatch to: {req.hospital_name || req.requester?.smart_id}</h4>
                                        <p className="text-sm text-slate-500">
                                            {req.units_needed} Units of <span className="font-bold text-red-600">{req.blood_group}</span>
                                        </p>
                                        <p className="text-xs text-green-600 mt-1">Approved by: {req.fulfilled_by}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDispatch(req._id)}
                                        className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-lg font-bold hover:opacity-90 transition-opacity"
                                    >
                                        <Send className="w-4 h-4" />
                                        Dispatch Now
                                    </button>
                                </div>
                            ))}

                            <h3 className="font-bold text-slate-500 mt-8 mb-4 uppercase tracking-wider text-xs">Dispatch History</h3>
                            {requests.filter(r => r.status === 'Dispatched').map(req => (
                                <div key={req._id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center opacity-75">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-100 text-green-600 p-2 rounded-full">
                                            <CheckCircle className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm">Dispatched to {req.hospital_name || req.requester?.smart_id}</h4>
                                            <p className="text-xs text-slate-500">{req.blood_group} &bull; {req.units_needed} Units</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-mono text-slate-400">ID: {req._id.slice(-6)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Add Unit Modal */}
            {addModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Plus className="w-5 h-5 text-primary" />
                                Add Inventory
                            </h3>
                            <button onClick={() => setAddModalOpen(false)}>
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleAddUnit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1">Blood Group</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                                    value={newUnit.blood_group}
                                    onChange={(e) => setNewUnit({ ...newUnit, blood_group: e.target.value })}
                                >
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                        <option key={bg} value={bg}>{bg}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">Component Type</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                                    value={newUnit.component_type}
                                    onChange={(e) => setNewUnit({ ...newUnit, component_type: e.target.value })}
                                >
                                    <option>Whole Blood</option>
                                    <option>Packed Red Cells</option>
                                    <option>Platelets</option>
                                    <option>Plasma</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">Quantity (Units)</label>
                                <input
                                    type="number" min="1" max="50"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                                    value={newUnit.quantity}
                                    onChange={(e) => setNewUnit({ ...newUnit, quantity: parseInt(e.target.value) })}
                                />
                            </div>
                            <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary/90 mt-2">
                                Add to Inventory
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
