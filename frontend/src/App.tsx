import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/dashboard/DashboardLayout';
import PositionsDashboard from './components/dashboard/PositionsDashboard';
import AddCandidate from './components/AddCandidateForm';
import PositionBoard from './components/PositionBoard/PositionBoard';

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/positions" replace />} />
        <Route path="positions" element={<PositionsDashboard />} />
        <Route path="positions/:id" element={<PositionBoard />} />
        <Route path="add-candidate" element={<AddCandidate />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
