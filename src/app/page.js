'use client';

import { useAuth } from '@/contexts/AuthContext';
import AuthForm from '@/components/AuthForm';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {user ? (
          <Dashboard />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <div className="text-center mb-12">
              <div className="text-6xl mb-6">🤫</div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Welcome to Quiet Hours Scheduler
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Schedule your focused study time and receive automated email reminders. 
                Stay productive with dedicated quiet hours and achieve your learning goals.
              </p>
              <div className="flex justify-center space-x-8 mt-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Schedule Study Blocks
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Email Reminders
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Overlap Prevention
                </div>
              </div>
            </div>
            <AuthForm />
          </div>
        )}
      </div>
    </div>
  );
}
