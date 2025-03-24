import React from 'react'
import './App.css'
import EmpRegForm from './pages/EmpRegForm'
import EmpTable from './pages/EmpTable'
import { Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path={"/"} element={<EmpTable/>}/>
        <Route path={"/empRegister"} element={<EmpRegForm/>}/>
      </Routes>
    </div>
  )
}

export default App
