import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Wallet, DollarSign, Sparkles } from 'lucide-react';

export default function SignedOutHero() {
  const { login, isLoggingIn } = useInternetIdentity();

  const features = [
    {
      icon: TrendingUp,
      title: 'Complete Tasks',
      description: 'Earn rewards by completing simple tasks and activities',
    },
    {
      icon: Wallet,
      title: 'Track Balance',
      description: 'Monitor your earnings and watch your balance grow',
    },
    {
      icon: DollarSign,
      title: 'Request Withdrawals',
      description: 'Cash out your earnings whenever you want',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          Start Earning Today
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-600 via-yellow-500 to-amber-500 bg-clip-text text-transparent">
          Banana Earn
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Complete tasks, earn rewards, and grow your balance. It's that simple!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button size="lg" onClick={login} disabled={isLoggingIn} className="text-lg px-8 py-6">
            {isLoggingIn ? 'Connecting...' : 'Get Started'}
          </Button>
        </div>
      </div>

      <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl border border-border/50">
        <img
          src="/assets/generated/banana-earn-hero.dim_1600x600.png"
          alt="Banana Earn Hero"
          className="w-full h-auto"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
