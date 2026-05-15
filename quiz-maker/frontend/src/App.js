import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home       from './pages/Home';
import Login      from './pages/Login';
import Register   from './pages/Register';
import QuizList   from './pages/QuizList';
import TakeQuiz   from './pages/TakeQuiz';
import Results    from './pages/Results';
import CreateQuiz from './pages/CreateQuiz';
import EditQuiz   from './pages/EditQuiz';
import MyQuizzes  from './pages/MyQuizzes';
import Profile    from './pages/Profile';
import NotFound   from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/"            element={<Home />} />
              <Route path="/login"       element={<Login />} />
              <Route path="/register"    element={<Register />} />
              <Route path="/quizzes"     element={<QuizList />} />
              <Route path="/quiz/:id"    element={<TakeQuiz />} />
              <Route path="/results/:id" element={<Results />} />
              <Route path="/create"      element={<ProtectedRoute><CreateQuiz /></ProtectedRoute>} />
              <Route path="/edit/:id"    element={<ProtectedRoute><EditQuiz /></ProtectedRoute>} />
              <Route path="/my-quizzes"  element={<ProtectedRoute><MyQuizzes /></ProtectedRoute>} />
              <Route path="/profile"     element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="*"            element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--card2)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.9rem',
            },
            success: { iconTheme: { primary: 'var(--green)', secondary: 'var(--card2)' } },
            error:   { iconTheme: { primary: 'var(--red)',   secondary: 'var(--card2)' } },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
