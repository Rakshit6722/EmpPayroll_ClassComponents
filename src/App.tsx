import React, { Suspense, lazy } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import AuthRoute from './components/AuthRoute';
import ProtectedRoutes from './components/ProtectedRoutes';

const Login = lazy(() => import('./pages/Login'));
const EmpRegForm = lazy(() => import('./pages/EmpRegForm'));
const EmpTable = lazy(() => import('./pages/EmpTable'));

const App = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/empRegister" element={<ProtectedRoutes><EmpRegForm /></ProtectedRoutes>} />
          <Route path="/empTable" element={<ProtectedRoutes><EmpTable /></ProtectedRoutes>} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
