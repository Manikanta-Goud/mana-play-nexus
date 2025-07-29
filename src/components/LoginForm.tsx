import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2, User, Lock, Mail, UserPlus } from "lucide-react";

interface LoginFormProps {
  onLogin: (username: string) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Register form states
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }

    // Simple validation - in real app you'd validate against backend
    if (password.length >= 6) {
      onLogin(username);
    } else {
      alert("Password must be at least 6 characters");
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerData.username || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (registerData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    // In a real app, you'd send this to your backend
    alert("Registration successful! You can now login.");
    setIsFlipped(false);
    setUsername(registerData.username);
    setRegisterData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const flipToRegister = () => {
    setIsFlipped(true);
  };

  const flipToLogin = () => {
    setIsFlipped(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Gamepad2 className="h-12 w-12 text-purple-500 mr-3" />
            <h1 className="text-4xl font-bold text-white">
              MANA GAMING
            </h1>
          </div>
          <p className="text-gray-400">Enter the Arena. Claim Victory.</p>
        </div>

        {/* Flip Card Container */}
        <div className="relative w-full h-auto">
          <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
            {/* Login Card (Front) */}
            <div className={`flip-card-front transition-all duration-500 ${isFlipped ? 'opacity-0 pointer-events-none absolute inset-0' : 'opacity-100'}`}>
              <Card className="bg-gray-800 border-purple-500/30">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-white">Welcome Back</CardTitle>
                  <CardDescription className="text-gray-400">Sign in to access your gaming dashboard</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-white">Username</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="username"
                          type="text"
                          placeholder="Enter your username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="pl-10 bg-gray-700 border-purple-500/30 focus:border-purple-500 text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 bg-gray-700 border-purple-500/30 focus:border-purple-500 text-white"
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full text-lg py-6 bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Enter the Arena
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="text-center mt-6">
                <p className="text-gray-400 text-sm">
                  Don't have an account? 
                  <span 
                    className="text-purple-500 cursor-pointer hover:underline ml-1"
                    onClick={flipToRegister}
                  >
                    Register now
                  </span>
                </p>
              </div>
            </div>

            {/* Register Card (Back) */}
            <div className={`flip-card-back transition-all duration-500 ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'}`}>
              <Card className="bg-gray-800 border-purple-500/30">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-white">Join the Arena</CardTitle>
                  <CardDescription className="text-gray-400">Create your gaming account to get started</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-username" className="text-white">Username</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="reg-username"
                          type="text"
                          placeholder="Choose a username"
                          value={registerData.username}
                          onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                          className="pl-10 bg-gray-700 border-purple-500/30 focus:border-purple-500 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reg-email" className="text-white">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="reg-email"
                          type="email"
                          placeholder="Enter your email"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                          className="pl-10 bg-gray-700 border-purple-500/30 focus:border-purple-500 text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reg-password" className="text-white">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="reg-password"
                          type="password"
                          placeholder="Create a password"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                          className="pl-10 bg-gray-700 border-purple-500/30 focus:border-purple-500 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reg-confirm-password" className="text-white">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="reg-confirm-password"
                          type="password"
                          placeholder="Confirm your password"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                          className="pl-10 bg-gray-700 border-purple-500/30 focus:border-purple-500 text-white"
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full text-lg py-6 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <UserPlus className="mr-2 h-5 w-5" />
                      Create Account
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="text-center mt-6">
                <p className="text-gray-400 text-sm">
                  Already have an account? 
                  <span 
                    className="text-purple-500 cursor-pointer hover:underline ml-1"
                    onClick={flipToLogin}
                  >
                    Sign in
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;