import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useActor } from './hooks/useActor';
import { useGetCallerUserProfile } from './hooks/useQueries';
import AppLayout from './components/layout/AppLayout';
import SignedOutHero from './components/marketing/SignedOutHero';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';
import DashboardPage from './pages/DashboardPage';
import EarnPage from './pages/EarnPage';
import WithdrawPage from './pages/WithdrawPage';
import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const [currentPage, setCurrentPage] = useState<'dashboard' | 'earn' | 'withdraw'>('dashboard');

  // Show profile setup dialog only when authenticated, profile is fetched, and no profile exists
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (!isAuthenticated) {
    return (
      <AppLayout>
        <SignedOutHero />
        <Toaster />
      </AppLayout>
    );
  }

  return (
    <AppLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {showProfileSetup && <ProfileSetupDialog />}
      {currentPage === 'dashboard' && <DashboardPage />}
      {currentPage === 'earn' && <EarnPage />}
      {currentPage === 'withdraw' && <WithdrawPage />}
      <Toaster />
    </AppLayout>
  );
}
