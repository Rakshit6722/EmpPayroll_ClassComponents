import React from 'react'
import './App.css'
import EmpRegForm from './pages/EmpRegForm'
import EmpTable from './pages/EmpTable'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import AuthRoute from './components/AuthRoute'
import ProtectedRoutes from './components/ProtectedRoutes'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path={"/"} element={<AuthRoute><Login/></AuthRoute>}/>
        <Route path={"/empRegister"} element={<ProtectedRoutes><EmpRegForm/></ProtectedRoutes>}/>
        <Route path='/empTable' element={<ProtectedRoutes><EmpTable/></ProtectedRoutes>}/>
      </Routes>
    </div>
  )
}

export default App
