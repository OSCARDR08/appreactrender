import React from 'react'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import Gestareas from './components/Gestareas';
import Mantotareas from './components/Mantotareas';

const App = () => {
  return (
    <div>
      <ToastContainer></ToastContainer>
      <Router>
        <Routes>
          <Route path="/" element={<Gestareas/>}/>
          <Route path="/manto:id" element={<Mantotareas/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
