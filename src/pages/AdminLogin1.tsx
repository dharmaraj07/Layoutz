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
import { useMutation } from '@tanstack/react-query';
import {baseURL} from '../content/url'


const AdminLogin1 = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formData, setformData] = useState({
    username:String,
    password:String

  })
  const [isRobotVerified, setIsRobotVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast(); 
  

  useEffect(() => {
    // If already authenticated, redirect to admin page
    if (isAuthenticated()) {
      navigate('/admin');
    }
  }, [navigate]);




  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    if (!isRobotVerified) {
      setError('Please verify that you are not a robot');
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = login(username, password, isRobotVerified);
    
    setIsLoading(false);
    
    if (result.success) {
      setSuccess(result.message);
      toast({
        title: "Success",
        description: result.message,
      });
      
      // Redirect to admin page after successful authentication
      setTimeout(() => navigate('/admin'), 1500);
    } else {
      setError(result.message);
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin panel
          </CardDescription>
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

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  autoComplete="username"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Hint: Username is Dharmaraj07
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  autoComplete="current-password"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Hint: Password is Amaravathi@1
              </p>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="robot" 
                checked={isRobotVerified}
                onCheckedChange={(checked) => setIsRobotVerified(checked === true)}
              />
              <Label 
                htmlFor="robot" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
              >
                <ShieldCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                I am not a robot
              </Label>
            </div>
            
            <Button 
              type="submit"
              className="w-full mt-4" 
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin1;
