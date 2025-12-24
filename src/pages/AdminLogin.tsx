import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CircleCheck, Loader2, ShieldCheck, User, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { login, isAuthenticated } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import {baseURL} from '../content/url';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Admin from './Admin';


const AdminLogin = () => {
  interface FormData {
    username: string;
    password: string;
  }
  const [formData, setformData] = useState({
    username:'',
    password:''

  })
  const queryClient = useQueryClient();
  const [isRobotVerified, setIsRobotVerified] = useState(false);
  const [isAdmin, setisAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast(); 
  
  const { mutate: loginMutation, isPending, isError } = useMutation({
    mutationFn: async (formData: FormData) => {
      const { username, password } = formData;
      const res = await fetch(`${baseURL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include", // 👈 REQUIRED
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      console.log(res)
      if (!res.ok) {

        throw new Error(data.error || 'Something went wrong');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      toast({
        title: "Success",
        description: "Login successful",
      });
      navigate('/admin');
      setisAdmin(true);
    },
    onError: (error: any) => {
      setError(error.message || 'Invalid username or password');
      toast({
        title: "Error",
        description: error.message || 'Invalid username or password',
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      return;
    }

    if (!isRobotVerified) {
      setError('Please verify that you are not a robot');
      return;
    }

    setError(null);
    loginMutation(formData);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
  
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-housing-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-housing-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      <Card className="w-full max-w-md shadow-2xl border-0 backdrop-blur-sm bg-white/95 relative z-10">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')} 
              className="hover:bg-housing-50 transition-colors"
              aria-label="Back to home"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="w-12 h-12 bg-gradient-to-br from-housing-600 to-housing-800 rounded-full flex items-center justify-center shadow-lg">
              <ShieldCheck className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-housing-700 to-housing-900 bg-clip-text text-transparent">
              Admin Login
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Enter your credentials to access the admin panel
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-4">
              <CircleCheck className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold text-gray-700">
                Username
              </Label>
              <div className="relative group">
                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-housing-600" aria-hidden="true" />
                <Input
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="pl-11 h-12 border-2 focus:border-housing-600 focus:ring-2 focus:ring-housing-200 transition-all"
                  autoComplete="username"
                  required
                  aria-required="true"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-housing-600" aria-hidden="true" />
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-11 h-12 border-2 focus:border-housing-600 focus:ring-2 focus:ring-housing-200 transition-all"
                  autoComplete="current-password"
                  required
                  aria-required="true"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3 pt-2 p-4 rounded-lg bg-housing-50/50 border border-housing-200">
              <Checkbox 
                id="robot" 
                checked={isRobotVerified}
                onCheckedChange={(checked) => setIsRobotVerified(checked === true)}
                className="data-[state=checked]:bg-housing-600 data-[state=checked]:border-housing-600"
              />
              <Label 
                htmlFor="robot" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4 mr-2 text-housing-600" aria-hidden="true" />
                I am not a robot
              </Label>
            </div>
            
            <Button 
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-housing-600 to-housing-800 hover:from-housing-700 hover:to-housing-900 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed" 
              disabled={isPending}
              aria-label="Login to admin panel"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
