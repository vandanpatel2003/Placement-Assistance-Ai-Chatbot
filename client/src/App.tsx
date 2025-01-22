import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthComponent from './components/AuthComponent';
import ChatPage from './components/ChatPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import './services/gemini.ts'

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/auth" />;
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/auth" element={<AuthComponent />} />
                        <Route
                            path="/chat"
                            element={
                                <PrivateRoute>
                                    <ChatPage />
                                </PrivateRoute>
                            }
                        />
                        <Route path="/" element={<Navigate to="/auth" />} />
                    </Routes>
                </Router>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;