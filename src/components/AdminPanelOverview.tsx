import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Users, 
  DollarSign, 
  Target, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Lock,
  Eye,
  Activity,
  Zap,
  Clock
} from "lucide-react";

const AdminPanelOverview = () => {
  const features = [
    {
      icon: Shield,
      title: "User Investment Protection",
      description: "Comprehensive protection system for user investments",
      capabilities: [
        "Real-time monitoring of all gameplay",
        "Automatic fund protection during tournaments",
        "Instant refunds for cheat victims",
        "Insurance coverage up to ₹10,00,000 per user",
        "24/7 security monitoring"
      ],
      color: "text-green-600"
    },
    {
      icon: Target,
      title: "Advanced Anti-Cheat Detection",
      description: "AI-powered cheat detection with 94.2% accuracy",
      capabilities: [
        "Aimbot detection (impossible flick shots, inhuman accuracy)",
        "Wallhack detection (tracking through walls)",
        "Speed hack detection (movement violations)",
        "Statistical anomaly detection",
        "Evidence-based ban system"
      ],
      color: "text-red-600"
    },
    {
      icon: Users,
      title: "User Management System",
      description: "Comprehensive user monitoring and management",
      capabilities: [
        "Risk assessment and scoring",
        "Investment tracking and protection",
        "Ban and suspension management",
        "User behavior analysis",
        "Community reporting system"
      ],
      color: "text-blue-600"
    },
    {
      icon: DollarSign,
      title: "Financial Protection",
      description: "Secure financial operations with escrow system",
      capabilities: [
        "Escrow system for tournament funds",
        "Automatic refund processing",
        "Transparent transaction history",
        "Emergency compensation fund",
        "Regular financial audits"
      ],
      color: "text-yellow-600"
    }
  ];

  const stats = [
    { label: "Protected Investments", value: "₹3,15,000", icon: DollarSign, color: "text-green-600" },
    { label: "Banned Cheaters", value: "23", icon: Shield, color: "text-red-600" },
    { label: "Active Protections", value: "156", icon: Lock, color: "text-blue-600" },
    { label: "Detection Accuracy", value: "94.2%", icon: Target, color: "text-purple-600" }
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Shield className="h-12 w-12 text-blue-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Mana Play Nexus Admin Panel
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive admin system protecting user investments and ensuring fair play in Free Fire tournaments
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <IconComponent className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <Card key={index} className="h-full">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gray-100`}>
                    <IconComponent className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.capabilities.map((capability, capIndex) => (
                    <li key={capIndex} className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{capability}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Activity className="h-6 w-6 mr-3 text-blue-600" />
            How User Protection Works
          </CardTitle>
          <CardDescription>
            Step-by-step process of protecting user investments and ensuring fair play
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold">1. Real-Time Monitoring</h3>
              <p className="text-sm text-gray-600">
                AI systems continuously monitor all gameplay for suspicious activities during tournaments
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
                <Zap className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-semibold">2. Instant Detection</h3>
              <p className="text-sm text-gray-600">
                When cheats are detected, the system immediately flags the user and freezes their funds
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold">3. Protect & Refund</h3>
              <p className="text-sm text-gray-600">
                Innocent users are automatically refunded and protected from losses due to cheaters
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Access Information */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Lock className="h-6 w-6 mr-3 text-purple-600" />
            Admin Panel Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Demo Credentials</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center bg-white p-2 rounded">
                  <span className="font-medium">admin</span>
                  <Badge variant="outline">admin123</Badge>
                </div>
                <div className="flex justify-between items-center bg-white p-2 rounded">
                  <span className="font-medium">superadmin</span>
                  <Badge variant="outline">super123</Badge>
                </div>
                <div className="flex justify-between items-center bg-white p-2 rounded">
                  <span className="font-medium">moderator</span>
                  <Badge variant="outline">mod123</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Quick Access</h3>
              <div className="space-y-3">
                <Button className="w-full" asChild>
                  <a href="/admin">Access Admin Panel</a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/">Return to Main Dashboard</a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <TrendingUp className="h-6 w-6 mr-3 text-green-600" />
            Key Benefits for Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">✓ Investment Security</h4>
              <p className="text-sm text-gray-600">
                All investments are protected with insurance coverage and escrow systems
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-600">✓ Fair Play Guarantee</h4>
              <p className="text-sm text-gray-600">
                Zero tolerance for cheating ensures a level playing field for all users
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-purple-600">✓ Quick Resolution</h4>
              <p className="text-sm text-gray-600">
                24-48 hour processing for refund requests and dispute resolution
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-orange-600">✓ Transparent Process</h4>
              <p className="text-sm text-gray-600">
                Complete visibility into all protection measures and security actions
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-red-600">✓ 24/7 Monitoring</h4>
              <p className="text-sm text-gray-600">
                Round-the-clock surveillance and protection of all user activities
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-cyan-600">✓ Professional Support</h4>
              <p className="text-sm text-gray-600">
                Dedicated support team for all protection and security concerns
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanelOverview;
