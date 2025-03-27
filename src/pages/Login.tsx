
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/contexts/AuthContext';
import { toast } from "sonner";

const portalInfo = {
  renter: {
    title: 'Renter Portal',
    description: 'Access your maintenance requests and property information',
  },
  landlord: {
    title: 'Landlord Portal',
    description: 'Manage properties and handle maintenance requests',
  },
  admin: {
    title: 'Admin Portal',
    description: 'Process maintenance requests and provide service bids',
  }
};

const Login = () => {
  const { portalType } = useParams<{ portalType: UserRole }>();
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validate portal type
  if (!portalType || !['renter', 'landlord', 'admin'].includes(portalType)) {
    navigate('/');
    return null;
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        await signup(email, password, name, portalType);
        navigate(`/${portalType}`);
      } else {
        await login(email, password, portalType);
        navigate(`/${portalType}`);
      }
    } catch (error) {
      console.error(error);
      // Error toast is already shown in auth context
    } finally {
      setIsLoading(false);
    }
  };

  const info = portalInfo[portalType];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 px-4 py-12">
      <div className="w-full max-w-md">
        <Link 
          to="/" 
          className="flex items-center justify-center mb-8 text-xl font-semibold hover:opacity-80 transition-opacity"
        >
          ResideSync
        </Link>

        <Card className="glass-card border-none shadow-lg animate-fade-in">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {isSignUp ? 'Create an account' : 'Sign in'}
            </CardTitle>
            <CardDescription className="text-center">
              {info.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button className="w-full" disabled={isLoading}>
                {isLoading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              {isSignUp ? (
                <p>
                  Already have an account?{' '}
                  <Button
                    variant="link"
                    className="p-0 h-auto font-normal"
                    onClick={() => setIsSignUp(false)}
                  >
                    Sign in
                  </Button>
                </p>
              ) : (
                <p>
                  Don't have an account?{' '}
                  <Button
                    variant="link"
                    className="p-0 h-auto font-normal"
                    onClick={() => setIsSignUp(true)}
                  >
                    Create one
                  </Button>
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-xs text-muted-foreground">
              For demo, use: {portalType}@example.com / password
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
