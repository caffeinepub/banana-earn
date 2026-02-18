import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import LoginButton from '../auth/LoginButton';
import { Wallet, TrendingUp, DollarSign } from 'lucide-react';

interface TopNavProps {
  currentPage: 'dashboard' | 'earn' | 'withdraw';
  onNavigate: (page: 'dashboard' | 'earn' | 'withdraw') => void;
}

export default function TopNav({ currentPage, onNavigate }: TopNavProps) {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const displayName = userProfile?.name || (identity ? `${identity.getPrincipal().toString().slice(0, 8)}...` : 'Guest');

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Wallet },
    { id: 'earn' as const, label: 'Earn', icon: TrendingUp },
    { id: 'withdraw' as const, label: 'Withdraw', icon: DollarSign },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/generated/banana-earn-logo.dim_512x512.png" 
                alt="Banana Earn" 
                className="h-10 w-10 rounded-lg"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-600 via-yellow-500 to-amber-500 bg-clip-text text-transparent">
                Banana Earn
              </span>
            </div>

            {isAuthenticated && (
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/50 text-sm font-medium">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                {displayName}
              </div>
            )}
            <LoginButton />
          </div>
        </div>

        {isAuthenticated && (
          <nav className="md:hidden flex items-center gap-1 pb-3 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
