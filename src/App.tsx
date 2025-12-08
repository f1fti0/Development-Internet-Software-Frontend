import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AppNavbar from './components/Navbar';
import MigrationHomePage from './pages/MigrationsHomePage';
import MigrationMethodsPage from './pages/MigrationMethodsPage';
import MigrationDetailPage from './pages/MigrationDetailPage';
import EstimatesPage from './pages/EstimatesPage';
import MigrationRequestsPage from './pages/MigrationRequestsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {  
  const basename = import.meta.env.PROD 
    ? '/Development-Internet-Software-Frontend'
    : '/';

  return (
    <Router basename={basename}>
      <AppNavbar />
      <div className="App">
        <main className="">
          <Routes>
            <Route path="/" element={<MigrationHomePage />} />
            <Route path="/migration-methods/" element={<MigrationMethodsPage />} />
            <Route path="/migration-methods/:id/" element={<MigrationDetailPage />} />
            <Route path="/estimates/:id/" element={<EstimatesPage />} />
            <Route path="/migration-requests/" element={<MigrationRequestsPage />} />
            <Route path="/login/" element={<LoginPage />} />
            <Route path="/register/" element={<RegisterPage />} />
            <Route path="/profile/" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;