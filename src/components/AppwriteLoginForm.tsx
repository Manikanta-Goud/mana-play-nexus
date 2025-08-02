import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Gamepad2, User, Lock, Mail, UserPlus, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AppwriteLoginForm = () => {
  const { login, register, isLoading } = useAuth();
  const [isFlipped, setIsFlipped] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Login form states
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form states
  const [registerData, setRegisterData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!loginData.email || !loginData.password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      await login(loginData.email, loginData.password);
      setSuccess("Login successful!");
    } catch (error: any) {
      setError(error.message || "Login failed. Please check your credentials.");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!registerData.name || !registerData.username || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (registerData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      await register(registerData.email, registerData.password, registerData.name, registerData.username);
      setSuccess("Registration successful! Welcome to MANA Gaming!");
    } catch (error: any) {
      setError(error.message || "Registration failed. Please try again.");
    }
  };

  const flipToRegister = () => {
    setIsFlipped(true);
    setError('');
    setSuccess('');
  };

  const flipToLogin = () => {
    setIsFlipped(false);
    setError('');
    setSuccess('');
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

        {/* Error/Success Messages */}
        {error && (
          <Alert className="mb-4 border-red-500 bg-red-950 text-red-200">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-4 border-green-500 bg-green-950 text-green-200">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Flip Card Container */}
        <div className="relative w-full h-auto">
          <div className={`relative w-full perspective-1000 ${isFlipped ? 'flipped' : ''}`}>
            {/* Login Card (Front) */}
            <div className={`transition-all duration-500 ${isFlipped ? 'opacity-0 pointer-events-none absolute inset-0' : 'opacity-100'}`} style={{
              backfaceVisibility: 'hidden',
              transform: isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)'
            }}>
              <Card className="bg-gray-800 border-purple-500/30">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-white">Welcome Back</CardTitle>
                  <CardDescription className="text-gray-400">
                    Sign in to your gaming account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={loginData.email}
                          onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                          className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-300">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={loginData.password}
                          onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                          className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </form>
                  <div className="mt-6 text-center">
                    <p className="text-gray-400">
                      Don't have an account?{' '}
                      <button 
                        onClick={flipToRegister}
                        className="text-purple-400 hover:text-purple-300 font-semibold"
                        disabled={isLoading}
                      >
                        Sign up here
                      </button>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Register Card (Back) */}
            <div className={`transition-all duration-500 ${!isFlipped ? 'opacity-0 pointer-events-none absolute inset-0' : 'opacity-100'}`} style={{
              backfaceVisibility: 'hidden',
              transform: !isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}>
              <Card className="bg-gray-800 border-purple-500/30">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-white">Join the Arena</CardTitle>
                  <CardDescription className="text-gray-400">
                    Create your gaming account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={registerData.name}
                          onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                          className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-gray-300">Username</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="username"
                          type="text"
                          placeholder="Choose a username"
                          value={registerData.username}
                          onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                          className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-gray-300">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="Enter your email"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                          className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-gray-300">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="Create a password"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                          className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-gray-300">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Confirm your password"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                          className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Create Account
                        </>
                      )}
                    </Button>
                  </form>
                  <div className="mt-6 text-center">
                    <p className="text-gray-400">
                      Already have an account?{' '}
                      <button 
                        onClick={flipToLogin}
                        className="text-purple-400 hover:text-purple-300 font-semibold"
                        disabled={isLoading}
                      >
                        Sign in here
                      </button>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppwriteLoginForm;
