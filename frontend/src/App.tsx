import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ClientPage } from './pages/ClientPage';
import { AdminPage } from './pages/AdminPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<HomePage />} />

        {/* Customer Facing Booking Route */}
        <Route path="/reservar" element={<ClientPage />} />

        {/* Operator / Admin Facing Route */}
        <Route path="/admin" element={<AdminPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
