import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useLoginMutation } from '../services/apiSlice';
import { loginSuccess, updateUser } from '../features/auth/authSlice';
import { toast } from '../hooks/use-toast';
import Cookies from 'js-cookie';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const [login, { isLoading: apiLoading, error: apiError }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await login({ email, password }).unwrap();
      Cookies.set('accessToken', result.accessToken, { secure: true, sameSite: 'strict' });
      Cookies.set('role', result.role, { secure: true, sameSite: 'strict' });
      dispatch(loginSuccess(result));
      toast({
        title: "Login Successful",
        description: `You are now logged in as ${result.role}`,
      });
      dispatch(updateUser({
        role: result.role,
        token: result.accessToken,
        isAuthenticated: true,
      }));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Demo credentials for easy testing
  const demoCredentials = [
    { email: 'admin@kyc.com', role: 'Global Admin' },
    { email: 'regional@kyc.com', role: 'Regional Admin' },
    { email: 'sender@kyc.com', role: 'Sending Partner' },
    { email: 'receiver@kyc.com', role: 'Receiving Partner' },
  ];

  const fillDemoCredentials = (email: string) => {
    setEmail(email);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">KYC Admin Portal</h1>
          <p className="text-muted-foreground mt-2">
            Multi-Region Compliance Dashboard
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {error || apiError ? (
                <Alert variant="destructive">
                  <AlertDescription>
                    {error || (typeof apiError === 'object' && 'data' in apiError && typeof apiError.data === 'string' ? apiError.data : 'Login failed.')}
                  </AlertDescription>
                </Alert>
              ) : null}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || apiLoading}
              >
                {isLoading || apiLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Demo Credentials</CardTitle>
            <CardDescription className="text-xs">
              Click any role to auto-fill credentials (password: password123)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {demoCredentials.map((cred) => (
                <Button
                  key={cred.email}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => fillDemoCredentials(cred.email)}
                >
                  {cred.role}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;