import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import MigrationHomePage from './pages/MigrationsHomePage';
import MigrationMethodsPage from './pages/MigrationMethodsPage';
import MigrationDetailPage from './pages/MigrationDetailPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <AppNavbar />
      <div className="App">
        <main className="min-vh-100">
          <Routes>
            <Route path="/" element={<MigrationHomePage />} />
            <Route path="/migration-methods/" element={<MigrationMethodsPage />} />
            <Route path="/migration-methods/:id/" element={<MigrationDetailPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;