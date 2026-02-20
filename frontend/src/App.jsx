import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import Registration from './pages/Registration';
import PatientDashboard from './pages/PatientDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import ClinicDashboard from './pages/ClinicDashboard';
import BloodBankDashboard from './pages/BloodBankDashboard';
import PrescriptionUpload from './pages/PrescriptionUpload';
import ActiveTracking from './pages/ActiveTracking';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Redirect the base URL directly to Login for your demo */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/landing" element={<LandingPage />} />

        {/* Protected Dashboard Routes (Add protection logic later) */}
        <Route path="/dashboard/patient" element={<PatientDashboard />} />
        <Route path="/dashboard/hospital" element={<HospitalDashboard />} />
        <Route path="/dashboard/clinic" element={<ClinicDashboard />} />
        <Route path="/dashboard/blood-bank" element={<BloodBankDashboard />} />

        {/* Feature Routes */}
        <Route path="/upload-prescription" element={<PrescriptionUpload />} />
        <Route path="/tracking" element={<ActiveTracking />} />

      </Routes>
    </Router>
  );
}

export default App;