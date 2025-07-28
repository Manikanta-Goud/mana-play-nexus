import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2, User, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onLogin: (username: string) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Login Failed",
        description: "Please enter both username and password",
        variant: "destructive"
      });
      return;
    }

    // Simple validation - in real app you'd validate against backend
    if (password.length >= 6) {
      onLogin(username);
      toast({
        title: "Welcome to MANA GAMING!",
        description: "Login successful. Ready to dominate the battlefield?",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gaming-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="flex items-center justify-center mb-4">
            <Gamepad2 className="h-12 w-12 text-gaming-purple mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              MANA GAMING
            </h1>
          </div>
          <p className="text-muted-foreground">Enter the Arena. Claim Victory.</p>
        </div>

        {/* Login Card */}
        <Card className="bg-gradient-card border-gaming-purple/30 shadow-glow-primary animate-slide-up">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">Welcome Back</CardTitle>
            <CardDescription>Sign in to access your gaming dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-gaming-card border-gaming-purple/30 focus:border-gaming-purple"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-gaming-card border-gaming-purple/30 focus:border-gaming-purple"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                variant="gaming" 
                className="w-full text-lg py-6"
              >
                Enter the Arena
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-muted-foreground text-sm">
            Don't have an account? <span className="text-gaming-purple cursor-pointer hover:underline">Register now</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;