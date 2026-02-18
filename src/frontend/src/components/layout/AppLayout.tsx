import TopNav from '../nav/TopNav';
import { SiCaffeine } from 'react-icons/si';
import { Heart } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  currentPage?: 'dashboard' | 'earn' | 'withdraw';
  onNavigate?: (page: 'dashboard' | 'earn' | 'withdraw') => void;
}

export default function AppLayout({ children, currentPage, onNavigate }: AppLayoutProps) {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(window.location.hostname || 'banana-earn');

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/5">
      {currentPage && onNavigate && <TopNav currentPage={currentPage} onNavigate={onNavigate} />}
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              © {currentYear} Banana Earn. All rights reserved.
            </p>
            <p className="flex items-center gap-2">
              Built with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-foreground transition-colors font-medium"
              >
                <SiCaffeine className="w-4 h-4" />
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
