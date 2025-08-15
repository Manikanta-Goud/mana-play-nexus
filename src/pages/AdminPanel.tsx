import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AntiCheatSystem from "@/components/AntiCheatSystem";
import UserProtectionSystem from "@/components/UserProtectionSystem";
import { 
  Shield, 
  Users, 
  Calendar, 
  Target, 
  AlertTriangle, 
  Ban, 
  Eye, 
  Settings, 
  TrendingUp,
  UserX,
  UserCheck,
  Clock,
  DollarSign,
  Activity,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  MessageSquare,
  FileText,
  BarChart3,
  ArrowLeft,
  Home,
  LogOut,
  Wallet,
  CreditCard,
  Trophy,
  Crown
} from "lucide-react";

interface AdminPanelProps {
  onLogout: () => void;
  onBackToDashboard: () => void;
  username: string;
}

// Admin role definitions
const ADMIN_ROLES = {
  'superadmin': {
    level: 'Super Administrator',
    color: 'bg-red-600/20 text-red-300 border-red-500/50',
    permissions: ['all']
  },
  'admin': {
    level: 'Administrator', 
    color: 'bg-blue-600/20 text-blue-300 border-blue-500/50',
    permissions: ['user_management', 'game_scheduling', 'security', 'reports']
  },
  'moderator': {
    level: 'Moderator',
    color: 'bg-green-600/20 text-green-300 border-green-500/50', 
    permissions: ['user_management', 'security']
  }
};

interface User {
  id: string;
  username: string;
  email: string;
  freeFireUID: string;
  status: 'active' | 'banned' | 'suspended';
  joinDate: string;
  lastActive: string;
  gamesPlayed: number;
  wins: number;
  kills: number;
  winRate: number;
  suspiciousActivity: number;
  investmentAmount: number;
  walletBalance: number;
  totalEarnings: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  level: number;
  rank: string;
  bio: string;
}

interface GameSchedule {
  id: string;
  gameName: string;
  mode: string;
  map: string;
  startTime: string;
  endTime: string;
  prizePool: number;
  maxPlayers: number;
  registeredPlayers: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
}

interface SuspiciousActivity {
  id: string;
  userId: string;
  username: string;
  activityType: 'aimbot' | 'wallhack' | 'speedhack' | 'unusual_stats' | 'multiple_accounts';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  evidenceFile?: string;
}

const AdminPanel = ({ onLogout, onBackToDashboard, username }: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showGameModal, setShowGameModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [banReason, setBanReason] = useState('');
  const [suspensionDays, setSuspensionDays] = useState(7);
  const [creditAmount, setCreditAmount] = useState(0);
  const [creditReason, setCreditReason] = useState('');

  // Get admin role and permissions
  const adminRole = ADMIN_ROLES[username as keyof typeof ADMIN_ROLES] || ADMIN_ROLES['moderator'];
  const hasPermission = (permission: string) => {
    return adminRole.permissions.includes('all') || adminRole.permissions.includes(permission);
  };

  // Mock data - replace with actual API calls
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      username: 'Player123',
      email: 'player123@example.com',
      freeFireUID: '2847583921',
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2024-07-31',
      gamesPlayed: 156,
      wins: 70,
      kills: 2456,
      winRate: 45.2,
      suspiciousActivity: 0,
      investmentAmount: 2500,
      walletBalance: 850,
      totalEarnings: 3200,
      riskLevel: 'low',
      level: 42,
      rank: 'Heroic',
      bio: 'Competitive Free Fire player with tactical gameplay style'
    },
    {
      id: '2',
      username: 'SuspiciousGamer',
      email: 'suspicious@example.com',
      freeFireUID: '1234567890',
      status: 'active',
      joinDate: '2024-07-20',
      lastActive: '2024-08-01',
      gamesPlayed: 50,
      wins: 47,
      kills: 1890,
      winRate: 94.5,
      suspiciousActivity: 8,
      investmentAmount: 500,
      walletBalance: 120,
      totalEarnings: 2100,
      riskLevel: 'high',
      level: 28,
      rank: 'Elite',
      bio: 'New player with exceptional performance'
    },
    {
      id: '3',
      username: 'BannedUser',
      email: 'banned@example.com',
      freeFireUID: '9876543210',
      status: 'banned',
      joinDate: '2024-06-10',
      lastActive: '2024-07-25',
      gamesPlayed: 23,
      wins: 23,
      kills: 950,
      winRate: 98.2,
      suspiciousActivity: 15,
      investmentAmount: 150,
      walletBalance: 0,
      totalEarnings: 1200,
      riskLevel: 'critical',
      level: 15,
      rank: 'Pro',
      bio: 'Account banned for suspicious activity'
    },
    {
      id: '4',
      username: 'RegularPlayer',
      email: 'regular@example.com',
      freeFireUID: '5647382910',
      status: 'active',
      joinDate: '2024-03-10',
      lastActive: '2024-08-01',
      gamesPlayed: 89,
      wins: 32,
      kills: 1120,
      winRate: 36.0,
      suspiciousActivity: 2,
      investmentAmount: 800,
      walletBalance: 450,
      totalEarnings: 1800,
      riskLevel: 'low',
      level: 35,
      rank: 'Gold',
      bio: 'Casual player enjoying Free Fire battles'
    },
    {
      id: '5',
      username: 'ProGamer2024',
      email: 'pro@example.com',
      freeFireUID: '1928374650',
      status: 'active',
      joinDate: '2024-01-05',
      lastActive: '2024-08-01',
      gamesPlayed: 245,
      wins: 156,
      kills: 4820,
      winRate: 63.7,
      suspiciousActivity: 1,
      investmentAmount: 5500,
      walletBalance: 2200,
      totalEarnings: 8900,
      riskLevel: 'medium',
      level: 78,
      rank: 'Grandmaster',
      bio: 'Professional esports player and tournament winner'
    }
  ]);

  const [gameSchedules, setGameSchedules] = useState<GameSchedule[]>([
    {
      id: '1',
      gameName: 'Free Fire',
      mode: 'Battle Royale',
      map: 'Bermuda',
      startTime: '2024-08-01T14:30:00',
      endTime: '2024-08-01T15:00:00',
      prizePool: 5000,
      maxPlayers: 50,
      registeredPlayers: 42,
      status: 'scheduled'
    },
    {
      id: '2',
      gameName: 'Free Fire',
      mode: 'Clash Squad',
      map: 'Factory',
      startTime: '2024-08-01T16:00:00',
      endTime: '2024-08-01T16:30:00',
      prizePool: 3000,
      maxPlayers: 8,
      registeredPlayers: 8,
      status: 'active'
    }
  ]);

  const [suspiciousActivities, setSuspiciousActivities] = useState<SuspiciousActivity[]>([
    {
      id: '1',
      userId: '2',
      username: 'SuspiciousGamer',
      activityType: 'aimbot',
      severity: 'high',
      description: 'Abnormally high headshot ratio (98%) detected in last 10 matches',
      timestamp: '2024-08-01T10:30:00'
    },
    {
      id: '2',
      userId: '3',
      username: 'BannedUser',
      activityType: 'wallhack',
      severity: 'critical',
      description: 'Player consistently tracking enemies through walls',
      timestamp: '2024-07-31T18:45:00'
    }
  ]);

  const handleBanUser = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: 'banned' as const }
        : user
    ));
    setShowUserModal(false);
  };

  const handleSuspendUser = (userId: string, days: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: 'suspended' as const }
        : user
    ));
    setShowUserModal(false);
  };

  const handleUnbanUser = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: 'active' as const }
        : user
    ));
  };

  const handleAddCredits = (userId: string, amount: number, reason: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            walletBalance: user.walletBalance + amount,
            totalEarnings: user.totalEarnings + amount
          }
        : user
    ));
    // Log the transaction
    console.log(`Added ${amount} credits to ${userId}: ${reason}`);
    setShowCreditModal(false);
    setCreditAmount(0);
    setCreditReason('');
  };

  const handleRemoveCredits = (userId: string, amount: number, reason: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            walletBalance: Math.max(0, user.walletBalance - amount)
          }
        : user
    ));
    // Log the transaction
    console.log(`Removed ${amount} credits from ${userId}: ${reason}`);
    setShowCreditModal(false);
    setCreditAmount(0);
    setCreditReason('');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-600/20 text-green-300 border-green-500/50';
      case 'medium': return 'bg-yellow-600/20 text-yellow-300 border-yellow-500/50';
      case 'high': return 'bg-orange-600/20 text-orange-300 border-orange-500/50';
      case 'critical': return 'bg-red-600/20 text-red-300 border-red-500/50';
      default: return 'bg-gray-600/20 text-gray-300 border-gray-500/50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gaming-dark via-slate-900 to-gaming-dark">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-gaming-card via-slate-800 to-gaming-card border-b-4 border-blue-500/30 p-8 shadow-2xl shadow-blue-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                size="lg"
                onClick={onBackToDashboard}
                className="mr-4 hover:bg-blue-500/20 text-blue-400 hover:text-white border-2 border-blue-500/30 hover:border-blue-400 transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Button>
              <div className="border-l-2 border-blue-500/50 h-12"></div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-lg opacity-50"></div>
                <div className="relative bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-4 rounded-2xl border-2 border-blue-500/30">
                  <Shield className="h-12 w-12 text-blue-400" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent tracking-wider">
                  ADMIN CONTROL PANEL
                </h1>
                <p className="text-lg text-blue-300 font-medium">Mana Play Nexus Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right bg-gaming-card/50 px-6 py-3 rounded-lg border-2 border-blue-500/30">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="relative">
                    <Shield className="h-6 w-6 text-blue-400" />
                    <div className="absolute inset-0 h-6 w-6 bg-blue-400/20 rounded-full animate-pulse"></div>
                  </div>
                  <Badge className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-2 border-blue-500/50 text-sm font-bold">
                    {adminRole.level}
                  </Badge>
                </div>
                <p className="text-sm text-gray-300 font-medium">User: <span className="text-white font-bold">{username}</span></p>
              </div>
              <Button 
                variant="outline" 
                size="lg"
                onClick={onLogout}
                className="border-2 border-red-500/50 text-red-300 hover:bg-red-500/20 hover:text-white hover:border-red-400 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/30"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
          
          {/* Centered Admin Title */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="relative">
                <Shield className="h-16 w-16 text-blue-400 animate-pulse" />
                <div className="absolute inset-0 h-16 w-16 bg-blue-400/20 rounded-full animate-ping"></div>
              </div>
              <h2 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent tracking-wider">
                ADMIN NEXUS
              </h2>
              <div className="relative">
                <Settings className="h-16 w-16 text-cyan-400 animate-pulse" />
                <div className="absolute inset-0 h-16 w-16 bg-cyan-400/20 rounded-full animate-ping"></div>
              </div>
            </div>
            <p className="text-xl text-gray-300 font-semibold mb-4">
              Total System Control & Management
            </p>
            <div className="w-full max-w-md mx-auto h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full h-16 bg-gradient-to-r from-gaming-card/80 via-slate-800/80 to-gaming-card/80 backdrop-blur-sm border-2 border-blue-500/30 p-2 rounded-2xl shadow-2xl shadow-blue-500/10 flex justify-between items-center gap-1">
            <TabsTrigger value="dashboard" className="flex-1 h-12 flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white text-blue-300 hover:text-white transition-all duration-300 rounded-xl font-semibold hover:bg-blue-500/20 text-sm">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            {hasPermission('user_management') && (
              <TabsTrigger value="users" className="flex-1 h-12 flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white text-blue-300 hover:text-white transition-all duration-300 rounded-xl font-semibold hover:bg-blue-500/20 text-sm">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
            )}
            {hasPermission('game_scheduling') && (
              <TabsTrigger value="games" className="flex-1 h-12 flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white text-blue-300 hover:text-white transition-all duration-300 rounded-xl font-semibold hover:bg-blue-500/20 text-sm">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Games</span>
              </TabsTrigger>
            )}
            {hasPermission('security') && (
              <TabsTrigger value="security" className="flex-1 h-12 flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white text-blue-300 hover:text-white transition-all duration-300 rounded-xl font-semibold hover:bg-blue-500/20 text-sm">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
            )}
            {hasPermission('all') && (
              <TabsTrigger value="protection" className="flex-1 h-12 flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white text-blue-300 hover:text-white transition-all duration-300 rounded-xl font-semibold hover:bg-blue-500/20 text-sm">
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Protection</span>
              </TabsTrigger>
            )}
            {(hasPermission('reports') || hasPermission('all')) && (
              <TabsTrigger value="reports" className="flex-1 h-12 flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white text-blue-300 hover:text-white transition-all duration-300 rounded-xl font-semibold hover:bg-blue-500/20 text-sm">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Reports</span>
              </TabsTrigger>
            )}
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-8 mt-8">
            {/* Role-specific welcome message */}
            <div className="bg-gradient-to-r from-gaming-card/80 via-slate-800/60 to-gaming-card/80 border-2 border-blue-500/30 rounded-2xl p-8 backdrop-blur-sm shadow-2xl shadow-blue-500/10">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-lg opacity-50"></div>
                  <div className="relative p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl border-2 border-blue-500/30">
                    <Shield className="h-12 w-12 text-blue-400" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent tracking-wider">
                    Welcome, {adminRole.level}!
                  </h2>
                  <p className="text-gray-300 mt-2 text-lg font-medium">
                    {adminRole.permissions.includes('all') 
                      ? '🔥 You have FULL administrative access to all platform features.'
                      : `🎯 Access granted to: ${adminRole.permissions.join(', ').replace(/_/g, ' ')}`
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="gaming-card-enhanced bg-gradient-to-br from-gaming-card/80 via-slate-800/60 to-gaming-card/80 border-2 border-blue-500/30 backdrop-blur-sm shadow-2xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-bold text-blue-300 uppercase tracking-wider">Total Users</CardTitle>
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-md"></div>
                    <div className="relative p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full border border-blue-500/50">
                      <Users className="h-6 w-6 text-blue-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black text-white mb-2">{users.length}</div>
                  <p className="text-sm text-blue-400 font-semibold flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    {users.filter(u => u.status === 'active').length} active players
                  </p>
                </CardContent>
              </Card>

              <Card className="gaming-card-enhanced bg-gradient-to-br from-gaming-card/80 via-slate-800/60 to-gaming-card/80 border-2 border-cyan-500/30 backdrop-blur-sm shadow-2xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-bold text-cyan-300 uppercase tracking-wider">Active Games</CardTitle>
                  <div className="relative">
                    <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-md"></div>
                    <div className="relative p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full border border-cyan-500/50">
                      <Target className="h-6 w-6 text-cyan-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black text-white mb-2">
                    {gameSchedules.filter(g => g.status === 'active').length}
                  </div>
                  <p className="text-sm text-cyan-400 font-semibold flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    {gameSchedules.filter(g => g.status === 'scheduled').length} scheduled
                  </p>
                </CardContent>
              </Card>

              <Card className="gaming-card-enhanced bg-gradient-to-br from-gaming-card/80 via-slate-800/60 to-gaming-card/80 border-2 border-red-500/30 backdrop-blur-sm shadow-2xl hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500 hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-bold text-red-300 uppercase tracking-wider">Security Alerts</CardTitle>
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-500/30 rounded-full blur-md"></div>
                    <div className="relative p-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full border border-red-500/50">
                      <AlertTriangle className="h-6 w-6 text-red-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black text-red-400 mb-2">
                    {suspiciousActivities.filter(a => a.severity === 'high' || a.severity === 'critical').length}
                  </div>
                  <p className="text-sm text-red-300 font-semibold flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    High/Critical threats
                  </p>
                </CardContent>
              </Card>

              <Card className="gaming-card-enhanced bg-gradient-to-br from-gaming-card/80 via-slate-800/60 to-gaming-card/80 border-2 border-green-500/30 backdrop-blur-sm shadow-2xl hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-bold text-green-300 uppercase tracking-wider">Revenue</CardTitle>
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500/30 rounded-full blur-md"></div>
                    <div className="relative p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/50">
                      <DollarSign className="h-6 w-6 text-green-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black text-white mb-2">
                    ₹{users.reduce((sum, user) => sum + user.investmentAmount, 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-green-400 font-semibold flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Total investments
                  </p>
                  {hasPermission('all') && (
                    <div className="mt-2 text-sm">
                      <span className="text-green-400 font-bold">↗ +12.5%</span> <span className="text-gray-400">from last month</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Enhanced dashboard for superadmin */}
            {hasPermission('all') && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-red-500/50 bg-gradient-to-br from-red-900/30 to-gray-900/50 backdrop-blur-sm shadow-2xl hover:shadow-red-500/10 transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-red-400 text-xl font-bold flex items-center">
                      <AlertTriangle className="h-6 w-6 mr-3" />
                      🚨 Critical Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                        <span className="text-sm font-semibold text-gray-200">Banned Users:</span>
                        <span className="font-bold text-xl text-red-400 bg-red-500/20 px-3 py-1 rounded-full">
                          {users.filter(u => u.status === 'banned').length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-500/50 bg-gradient-to-br from-green-900/30 to-gray-900/50 backdrop-blur-sm shadow-2xl hover:shadow-green-500/10 transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-green-400 text-xl font-bold flex items-center">
                      <DollarSign className="h-6 w-6 mr-3" />
                      💰 Financial Control
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                        <span className="text-sm font-semibold text-gray-200">Total Revenue:</span>
                        <span className="font-bold text-xl text-green-400 bg-green-500/20 px-3 py-1 rounded-full">
                          ₹{users.reduce((sum, user) => sum + user.investmentAmount, 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                        <span className="text-sm font-semibold text-gray-200">Prize Pools:</span>
                        <span className="font-bold text-xl text-green-400 bg-green-500/20 px-3 py-1 rounded-full">
                          ₹{gameSchedules.reduce((sum, game) => sum + game.prizePool, 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                        <span className="text-sm font-semibold text-gray-200">Profit Margin:</span>
                        <span className="font-bold text-xl text-green-400 bg-green-500/20 px-3 py-1 rounded-full">23.4%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-500/50 bg-gradient-to-br from-blue-900/30 to-gray-900/50 backdrop-blur-sm shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-blue-400 text-xl font-bold flex items-center">
                      <Activity className="h-6 w-6 mr-3" />
                      ⚡ System Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                        <span className="text-sm font-semibold text-gray-200">Server Uptime:</span>
                        <span className="font-bold text-xl text-blue-400 bg-blue-500/20 px-3 py-1 rounded-full">99.8%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                        <span className="text-sm font-semibold text-gray-200">Active Sessions:</span>
                        <span className="font-bold text-xl text-blue-400 bg-blue-500/20 px-3 py-1 rounded-full">
                          {users.filter(u => u.status === 'active').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                        <span className="text-sm font-semibold text-gray-200">Anti-Cheat Accuracy:</span>
                        <span className="font-bold text-xl text-blue-400 bg-blue-500/20 px-3 py-1 rounded-full">94.2%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-gray-900/50 to-purple-900/30 border border-purple-500/30 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="text-purple-400 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Recent Security Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {suspiciousActivities.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                        <div>
                          <p className="font-medium text-white">{activity.username}</p>
                          <p className="text-sm text-gray-300">{activity.description}</p>
                        </div>
                        <Badge className={`${
                          activity.severity === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/50' :
                          activity.severity === 'high' ? 'bg-orange-500/20 text-orange-400 border-orange-500/50' :
                          'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                        }`}>
                          {activity.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900/50 to-blue-900/30 border border-blue-500/30 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Upcoming Games
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {gameSchedules.filter(g => g.status === 'scheduled').map((game) => (
                      <div key={game.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                        <div>
                          <p className="font-medium text-white">{game.gameName} - {game.mode}</p>
                          <p className="text-sm text-gray-300">
                            {new Date(game.startTime).toLocaleString()} • ₹{game.prizePool}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-blue-400 border-blue-500/50">
                          {game.registeredPlayers}/{game.maxPlayers}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Management Tab */}
          {hasPermission('user_management') && (
            <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">User Management</h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card className="bg-black border-gray-600">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800 border-b border-gray-600">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Games</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Win Rate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Credits</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Risk</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-black divide-y divide-gray-700">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-900 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-white">{user.username}</div>
                              <div className="text-sm text-gray-300">{user.email}</div>
                              <div className="text-xs text-gray-400">UID: {user.freeFireUID}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={
                              user.status === 'active' ? 'bg-green-600/20 text-green-300 border-green-500/50' :
                              user.status === 'banned' ? 'bg-red-600/20 text-red-300 border-red-500/50' :
                              'bg-yellow-600/20 text-yellow-300 border-yellow-500/50'
                            }>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="text-white">{user.gamesPlayed} played</div>
                            <div className="text-green-400">{user.wins} wins</div>
                            <div className="text-red-400">{user.kills} kills</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                            {user.winRate}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="text-green-400 font-bold">{user.walletBalance} Credits</div>
                            <div className="text-gray-400 text-xs">Total: {user.totalEarnings}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getRiskBadgeColor(user.riskLevel)}>
                              {user.riskLevel}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowUserProfileModal(true);
                                }}
                                className="border-blue-600 text-blue-400 hover:bg-blue-800"
                                title="View Profile"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  console.log('Credit modal button clicked for user:', user.username);
                                  setSelectedUser(user);
                                  setShowCreditModal(true);
                                  console.log('Modal state set to true');
                                }}
                                className="border-green-600 text-green-400 hover:bg-green-800"
                                title="Manage Credits"
                              >
                                <Wallet className="h-4 w-4" />
                              </Button>
                              {user.status === 'active' && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setShowUserModal(true);
                                  }}
                                  title="Ban User"
                                >
                                  <Ban className="h-4 w-4" />
                                </Button>
                              )}
                              {user.status === 'banned' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUnbanUser(user.id)}
                                  className="border-gray-600 text-white hover:bg-gray-800"
                                  title="Unban User"
                                >
                                  <UserCheck className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          )}

          {/* Game Scheduling Tab */}
          {hasPermission('game_scheduling') && (
            <TabsContent value="games" className="space-y-6">
              {/* Enhanced header for superadmin */}
              <div className="bg-black border border-gray-600 rounded-lg p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <Calendar className="h-6 w-6 mr-3 text-purple-400" />
                      Game Scheduling Management
                    </h2>
                    <p className="text-gray-300 mt-2">
                      {hasPermission('all') 
                        ? 'Full control over tournament scheduling and prize pool management'
                        : 'Schedule and manage gaming tournaments'
                      }
                    </p>
                  </div>
                  <Button 
                    onClick={() => setShowGameModal(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule New Game
                  </Button>
                </div>
              </div>

              {/* Superadmin stats */}
              {hasPermission('all') && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="border-gray-600 bg-black">
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-600/20 rounded-full border border-green-500/50">
                          <Target className="h-4 w-4 text-green-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-300">Active Games</p>
                          <p className="text-lg font-bold text-white">
                            {gameSchedules.filter(g => g.status === 'active').length}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-600 bg-black">
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-600/20 rounded-full border border-blue-500/50">
                          <Clock className="h-4 w-4 text-blue-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-300">Scheduled</p>
                          <p className="text-lg font-bold text-white">
                            {gameSchedules.filter(g => g.status === 'scheduled').length}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-600 bg-black">
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-yellow-600/20 rounded-full border border-yellow-500/50">
                          <Users className="h-4 w-4 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-300">Total Players</p>
                          <p className="text-lg font-bold text-white">
                            {gameSchedules.reduce((sum, g) => sum + g.registeredPlayers, 0)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-600 bg-black">
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-600/20 rounded-full border border-purple-500/50">
                          <DollarSign className="h-4 w-4 text-purple-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-300">Prize Pools</p>
                          <p className="text-lg font-bold text-white">
                            ₹{gameSchedules.reduce((sum, g) => sum + g.prizePool, 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Enhanced game cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {gameSchedules.map((game) => (
                  <Card key={game.id} className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-purple-500 border-gray-600 bg-black">
                    <CardHeader className="bg-black">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white flex items-center">
                            <Target className="h-5 w-5 mr-2" />
                            {game.gameName} - {game.mode}
                          </CardTitle>
                          <CardDescription className="text-gray-300">
                            🗺️ Map: {game.map}
                          </CardDescription>
                        </div>
                        <Badge className={
                          game.status === 'active' ? 'bg-green-600/20 text-green-300 border-green-500/50' :
                          game.status === 'scheduled' ? 'bg-blue-600/20 text-blue-300 border-blue-500/50' :
                          game.status === 'completed' ? 'bg-gray-600/20 text-gray-300 border-gray-500/50' :
                          'bg-red-600/20 text-red-300 border-red-500/50'
                        }>
                          {game.status === 'active' ? '🟢 LIVE' :
                           game.status === 'scheduled' ? '🔵 SCHEDULED' :
                           game.status === 'completed' ? '⚪ COMPLETED' :
                           '🔴 CANCELLED'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-800 rounded-lg border border-gray-600">
                          <span className="text-sm font-medium text-white">⏰ Start Time:</span>
                          <span className="text-sm font-bold text-blue-400">
                            {new Date(game.startTime).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-800 rounded-lg border border-gray-600">
                          <span className="text-sm font-medium text-white">💰 Prize Pool:</span>
                          <span className="text-sm font-bold text-green-400">
                            ₹{game.prizePool.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-800 rounded-lg border border-gray-600">
                          <span className="text-sm font-medium text-white">👥 Players:</span>
                          <span className="text-sm font-bold text-purple-400">
                            {game.registeredPlayers}/{game.maxPlayers}
                            <span className="ml-2 text-xs">
                              ({Math.round((game.registeredPlayers / game.maxPlayers) * 100)}% full)
                            </span>
                          </span>
                        </div>
                        
                        {/* Progress bar for player registration */}
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${(game.registeredPlayers / game.maxPlayers) * 100}%` }}
                          ></div>
                        </div>

                        <div className="flex space-x-2 mt-4 pt-2 border-t border-gray-600">
                          <Button size="sm" variant="outline" className="hover:bg-gray-800 hover:border-blue-300 border-gray-600 text-white">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="hover:bg-gray-800 hover:border-green-300 border-gray-600 text-white">
                            <Eye className="h-4 w-4 mr-2" />
                            View Players
                          </Button>
                          {game.status === 'scheduled' && (
                            <Button size="sm" variant="destructive" className="hover:bg-red-700 bg-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                          )}
                          {hasPermission('all') && (
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                              <Settings className="h-4 w-4 mr-2" />
                              Manage
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
          )}

          {/* Anti-Cheat Tab */}
          {hasPermission('security') && (
            <TabsContent value="security" className="space-y-6">
            <AntiCheatSystem 
              onBanUser={(userId, reason) => {
                setUsers(users.map(user => 
                  user.id === userId 
                    ? { ...user, status: 'banned' as const }
                    : user
                ));
              }}
              onFlagUser={(userId, reason) => {
                // Handle flagging user for further review
                console.log(`Flagged user ${userId}: ${reason}`);
              }}
            />
          </TabsContent>
          )}

          {/* User Protection Tab */}
          {hasPermission('all') && (
            <TabsContent value="protection" className="space-y-6">
            <UserProtectionSystem 
              users={users}
              onRefundApproval={(requestId, approved) => {
                // Handle refund approval logic
                console.log(`Refund request ${requestId} ${approved ? 'approved' : 'rejected'}`);
              }}
              onProtectionUpdate={(userId, status) => {
                // Handle protection status update
                console.log(`Updated protection status for user ${userId} to ${status}`);
              }}
            />
          </TabsContent>
          )}

          {/* Reports Tab */}
          {(hasPermission('reports') || hasPermission('all')) && (
            <TabsContent value="reports" className="space-y-6">
            <h2 className="text-2xl font-bold">Reports & Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Users:</span>
                      <span className="font-medium">{users.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Users:</span>
                      <span className="font-medium text-green-600">
                        {users.filter(u => u.status === 'active').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Banned Users:</span>
                      <span className="font-medium text-red-600">
                        {users.filter(u => u.status === 'banned').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>High Risk Users:</span>
                      <span className="font-medium text-orange-600">
                        {users.filter(u => u.riskLevel === 'high').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Investments:</span>
                      <span className="font-medium">
                        ₹{users.reduce((sum, user) => sum + user.investmentAmount, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Investment:</span>
                      <span className="font-medium">
                        ₹{Math.round(users.reduce((sum, user) => sum + user.investmentAmount, 0) / users.length).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prize Pools (Today):</span>
                      <span className="font-medium">
                        ₹{gameSchedules.reduce((sum, game) => sum + game.prizePool, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          )}
        </Tabs>
      </div>

      {/* User Details Modal */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details & Actions</DialogTitle>
            <DialogDescription>
              Manage user account and take administrative actions
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Username</Label>
                  <p className="font-medium">{selectedUser.username}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={
                    selectedUser.status === 'active' ? 'bg-green-600/20 text-green-300 border-green-500/50' :
                    selectedUser.status === 'banned' ? 'bg-red-600/20 text-red-300 border-red-500/50' :
                    'bg-yellow-600/20 text-yellow-300 border-yellow-500/50'
                  }>
                    {selectedUser.status}
                  </Badge>
                </div>
                <div>
                  <Label>Games Played</Label>
                  <p className="font-medium">{selectedUser.gamesPlayed}</p>
                </div>
                <div>
                  <Label>Win Rate</Label>
                  <p className="font-medium">{selectedUser.winRate}%</p>
                </div>
                <div>
                  <Label>Investment Amount</Label>
                  <p className="font-medium">₹{selectedUser.investmentAmount.toLocaleString()}</p>
                </div>
                <div>
                  <Label>Risk Level</Label>
                  <Badge className={getRiskBadgeColor(selectedUser.riskLevel)}>
                    {selectedUser.riskLevel}
                  </Badge>
                </div>
              </div>

              {selectedUser.status === 'active' && (
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-medium">Administrative Actions</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="ban-reason">Ban Reason</Label>
                      <Textarea
                        id="ban-reason"
                        placeholder="Enter reason for banning this user..."
                        value={banReason}
                        onChange={(e) => setBanReason(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="destructive"
                        onClick={() => handleBanUser(selectedUser.id)}
                        disabled={!banReason.trim()}
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        Permanent Ban
                      </Button>
                      
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={suspensionDays}
                          onChange={(e) => setSuspensionDays(Number(e.target.value))}
                          className="w-20"
                          min="1"
                          max="365"
                        />
                        <Button
                          variant="outline"
                          onClick={() => handleSuspendUser(selectedUser.id, suspensionDays)}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          Suspend for {suspensionDays} days
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Game Scheduling Modal */}
      <Dialog open={showGameModal} onOpenChange={setShowGameModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule New Game</DialogTitle>
            <DialogDescription>
              Create a new game session for players
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Game Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select game" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="freefire">Free Fire</SelectItem>
                  <SelectItem value="pubg">PUBG Mobile</SelectItem>
                  <SelectItem value="codm">Call of Duty Mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Game Mode</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="br">Battle Royale</SelectItem>
                  <SelectItem value="cs">Clash Squad</SelectItem>
                  <SelectItem value="lonewolf">Lone Wolf</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time</Label>
                <Input type="datetime-local" />
              </div>
              <div>
                <Label>Max Players</Label>
                <Input type="number" placeholder="50" />
              </div>
            </div>

            <div>
              <Label>Prize Pool (₹)</Label>
              <Input type="number" placeholder="5000" />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowGameModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowGameModal(false)}>
                Schedule Game
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* User Profile Modal */}
      <Dialog open={showUserProfileModal} onOpenChange={setShowUserProfileModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gaming-dark border-gaming-purple/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gaming-purple to-gaming-cyan bg-clip-text text-transparent">
              USER PROFILE - {selectedUser?.username}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Complete user profile information and statistics
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="bg-gradient-card border border-gaming-purple/30 rounded-lg p-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-gaming-purple to-gaming-cyan rounded-full blur-lg opacity-50"></div>
                    <div className="relative bg-gaming-dark/80 rounded-full p-6">
                      <Users className="h-16 w-16 text-gaming-cyan" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className="text-3xl font-bold text-foreground">{selectedUser.username}</h2>
                      <Badge className="bg-gaming-purple/20 text-gaming-purple border-gaming-purple/30">
                        Level {selectedUser.level}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Free Fire UID</p>
                        <p className="text-lg font-bold text-gaming-cyan">{selectedUser.freeFireUID}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Current Rank</p>
                        <div className="flex items-center space-x-2">
                          <Crown className="h-5 w-5 text-yellow-400" />
                          <p className="text-lg font-bold text-yellow-400">{selectedUser.rank}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground italic">{selectedUser.bio}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={
                      selectedUser.status === 'active' ? 'bg-green-600/20 text-green-300 border-green-500/50' :
                      selectedUser.status === 'banned' ? 'bg-red-600/20 text-red-300 border-red-500/50' :
                      'bg-yellow-600/20 text-yellow-300 border-yellow-500/50'
                    }>
                      {selectedUser.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-card border-gaming-purple/30">
                  <CardContent className="p-4 text-center">
                    <Trophy className="h-8 w-8 text-gaming-cyan mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{selectedUser.wins}</p>
                    <p className="text-sm text-muted-foreground">Total Wins</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-card border-gaming-purple/30">
                  <CardContent className="p-4 text-center">
                    <Target className="h-8 w-8 text-red-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{selectedUser.kills}</p>
                    <p className="text-sm text-muted-foreground">Total Kills</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-card border-gaming-purple/30">
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-8 w-8 text-gaming-purple mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{selectedUser.gamesPlayed}</p>
                    <p className="text-sm text-muted-foreground">Games Played</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-card border-gaming-purple/30">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{selectedUser.winRate}%</p>
                    <p className="text-sm text-muted-foreground">Win Rate</p>
                  </CardContent>
                </Card>
              </div>

              {/* Financial Information */}
              <div className="bg-gradient-to-r from-gaming-purple/20 to-gaming-cyan/20 border border-gaming-purple/30 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Wallet className="h-8 w-8 text-gaming-cyan" />
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Financial Overview</h3>
                      <p className="text-sm text-muted-foreground">Current wallet and earnings information</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gaming-dark/30 rounded-lg border border-gaming-cyan/20">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Current Balance:</span>
                      <span className="text-2xl font-bold text-gaming-cyan">{selectedUser.walletBalance} Credits</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gaming-dark/30 rounded-lg border border-green-500/20">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Earnings:</span>
                      <span className="text-2xl font-bold text-green-400">{selectedUser.totalEarnings} Credits</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gaming-dark/30 rounded-lg border border-blue-500/20">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Investment:</span>
                      <span className="text-2xl font-bold text-blue-400">₹{selectedUser.investmentAmount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-card border-gaming-purple/30">
                  <CardHeader>
                    <CardTitle className="text-gaming-cyan">Account Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="text-foreground font-medium">{selectedUser.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Join Date:</span>
                      <span className="text-foreground font-medium">{selectedUser.joinDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Active:</span>
                      <span className="text-foreground font-medium">{selectedUser.lastActive}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Risk Level:</span>
                      <Badge className={getRiskBadgeColor(selectedUser.riskLevel)}>
                        {selectedUser.riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card border-gaming-purple/30">
                  <CardHeader>
                    <CardTitle className="text-gaming-purple">Security Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Suspicious Activities:</span>
                      <span className={`font-bold ${
                        selectedUser.suspiciousActivity > 5 ? 'text-red-400' :
                        selectedUser.suspiciousActivity > 2 ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {selectedUser.suspiciousActivity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account Status:</span>
                      <Badge className={
                        selectedUser.status === 'active' ? 'bg-green-600/20 text-green-300 border-green-500/50' :
                        selectedUser.status === 'banned' ? 'bg-red-600/20 text-red-300 border-red-500/50' :
                        'bg-yellow-600/20 text-yellow-300 border-yellow-500/50'
                      }>
                        {selectedUser.status.toUpperCase()}
                      </Badge>
                    </div>
                    <Alert className={
                      selectedUser.riskLevel === 'critical' ? 'border-red-500/50 bg-red-900/20' :
                      selectedUser.riskLevel === 'high' ? 'border-orange-500/50 bg-orange-900/20' :
                      'border-green-500/50 bg-green-900/20'
                    }>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        {selectedUser.riskLevel === 'critical' ? 'High risk user - requires immediate attention' :
                         selectedUser.riskLevel === 'high' ? 'Medium risk user - monitor closely' :
                         'Low risk user - normal monitoring'}
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>

              {/* Admin Actions */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gaming-purple/30">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowUserProfileModal(false);
                    setShowCreditModal(true);
                  }}
                  className="border-green-600 text-green-400 hover:bg-green-800"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Manage Credits
                </Button>
                <Button variant="outline" onClick={() => setShowUserProfileModal(false)}>
                  Close Profile
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Credit Management Modal */}
      <Dialog open={showCreditModal} onOpenChange={(open) => {
        console.log('Dialog state change:', open);
        setShowCreditModal(open);
      }}>
        <DialogContent className="max-w-2xl bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-400">
              Credit Management - {selectedUser?.username}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Add or remove credits from user's wallet. Document the reason for transaction tracking.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {/* Current Balance Display */}
              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">Current Wallet Balance</h3>
                    <p className="text-sm text-gray-400">Available credits for matches and tournaments</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-400">{selectedUser.walletBalance} Credits</p>
                    <p className="text-sm text-gray-400">Total Earned: {selectedUser.totalEarnings}</p>
                  </div>
                </div>
              </div>

              {/* Credit Transaction Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="credit-amount" className="text-white">Credit Amount</Label>
                  <Input
                    id="credit-amount"
                    type="number"
                    placeholder="Enter amount (e.g., 100)"
                    value={creditAmount || ''}
                    onChange={(e) => setCreditAmount(Number(e.target.value))}
                    className="bg-gray-800 border-gray-600 text-white mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="credit-reason" className="text-white">Reason for Transaction</Label>
                  <Textarea
                    id="credit-reason"
                    placeholder="Enter reason (e.g., 'Match completion bonus: 10 kills in BR mode', 'Tournament prize', 'Admin adjustment', etc.)"
                    value={creditReason}
                    onChange={(e) => setCreditReason(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white mt-2"
                    rows={3}
                  />
                </div>

                {/* Quick Action Buttons */}
                <div className="border border-gray-600 rounded-lg p-4 bg-gray-800">
                  <h4 className="text-sm font-bold text-blue-400 mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setCreditAmount(50);
                        setCreditReason('Match completion bonus - 5+ kills');
                      }}
                      className="border-green-500/50 text-green-400 hover:bg-green-500/10 h-auto py-3 flex flex-col items-center"
                    >
                      <span className="text-lg font-bold">+50</span>
                      <span className="text-xs">5+ Kills</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setCreditAmount(100);
                        setCreditReason('Match completion bonus - 10+ kills');
                      }}
                      className="border-green-500/50 text-green-400 hover:bg-green-500/10 h-auto py-3 flex flex-col items-center"
                    >
                      <span className="text-lg font-bold">+100</span>
                      <span className="text-xs">10+ Kills</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setCreditAmount(200);
                        setCreditReason('Victory bonus - 1st place finish');
                      }}
                      className="border-green-500/50 text-green-400 hover:bg-green-500/10 h-auto py-3 flex flex-col items-center"
                    >
                      <span className="text-lg font-bold">+200</span>
                      <span className="text-xs">Victory</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setCreditAmount(500);
                        setCreditReason('Tournament prize payout');
                      }}
                      className="border-green-500/50 text-green-400 hover:bg-green-500/10 h-auto py-3 flex flex-col items-center"
                    >
                      <span className="text-lg font-bold">+500</span>
                      <span className="text-xs">Tournament</span>
                    </Button>
                  </div>
                </div>

                {/* Transaction Preview */}
                {creditAmount > 0 && creditReason && (
                  <div className="bg-gray-800 border border-blue-500/30 rounded-lg p-4">
                    <h4 className="text-sm font-bold text-blue-400 mb-2">Transaction Preview</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current Balance:</span>
                        <span className="text-white">{selectedUser.walletBalance} Credits</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Transaction Amount:</span>
                        <span className="text-green-400 font-bold">+{creditAmount} Credits</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-600 pt-2">
                        <span className="text-gray-400">New Balance:</span>
                        <span className="text-green-400 font-bold">{selectedUser.walletBalance + creditAmount} Credits</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        <strong>Reason:</strong> {creditReason}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-600">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreditModal(false);
                    setCreditAmount(0);
                    setCreditReason('');
                  }}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleRemoveCredits(selectedUser.id, creditAmount, creditReason)}
                  disabled={!creditAmount || !creditReason.trim() || creditAmount > selectedUser.walletBalance}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Remove Credits
                </Button>
                <Button
                  onClick={() => handleAddCredits(selectedUser.id, creditAmount, creditReason)}
                  disabled={!creditAmount || !creditReason.trim()}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Add Credits
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
