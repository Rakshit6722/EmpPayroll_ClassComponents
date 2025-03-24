import React from 'react'
import './App.css'
import EmpRegForm from './pages/EmpRegForm'
import EmpTable from './pages/EmpTable'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import AuthRoute from './components/AuthRoute'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path={"/"} element={<AuthRoute><Login/></AuthRoute>}/>
        <Route path={"/empRegister"} element={<EmpRegForm/>}/>
        <Route path='/empTable' element={<EmpTable/>}/>
      </Routes>
    </div>
  )
}

export default App
