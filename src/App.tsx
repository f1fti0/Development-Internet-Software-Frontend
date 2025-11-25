import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import MigrationHomePage from './pages/MigrationsHomePage';
import MigrationMethodsPage from './pages/MigrationMethodsPage';
import MigrationDetailPage from './pages/MigrationDetailPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { invoke } from "@tauri-apps/api/core";
import { useEffect } from 'react';

function App() {
  useEffect(()=>{
    invoke('tauri', {cmd:'create'})
      .then(() =>{console.log("Start")})
      .catch(() =>{console.log("Start Error")})
    return () =>{
      invoke('tauri', {cmd:'close'})
        .then(() =>{console.log("Close")})
        .catch(() =>{console.log("Close Error")})
    }
  }, [])

  return (
    <Router>
      <AppNavbar />
      <div className="App">
        <main className="">
          <Routes>
            <Route path="/" element={<MigrationHomePage />} />
            <Route path="/migration-methods/" element={<MigrationMethodsPage />} />
            <Route path="/migration-methods/:id/" element={<MigrationDetailPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;