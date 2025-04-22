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
      navigate('/admin');
      setisAdmin(true)
      
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation(formData);
    if (!formData.username || !formData.password) {
          setError('Please enter both username and password');
          ;
        }
    
        if (!isRobotVerified) {
          setError('Please verify that you are not a robot');
          return;
        }
    
        setIsLoading(true);
        setError(null);
    
        const result = login(formData.username, formData.password, isRobotVerified);
        
        setIsLoading(false);
        
        if (result.success) {
          setSuccess(result.message);
          toast({
            title: "Success",
            description: result.message,
          });
          
          // Redirect to admin page after successful authentication
          setTimeout(() => navigate('/admin'), 1500);
        }
    
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
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
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange}
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
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
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
              >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
