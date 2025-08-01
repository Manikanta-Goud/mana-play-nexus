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
  Home
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
    color: 'bg-red-100 text-red-800 border-red-200',
    permissions: ['all']
  },
  'admin': {
    level: 'Administrator', 
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    permissions: ['user_management', 'game_scheduling', 'security', 'reports']
  },
  'moderator': {
    level: 'Moderator',
    color: 'bg-green-100 text-green-800 border-green-200', 
    permissions: ['user_management', 'security']
  }
};

interface User {
  id: string;
  username: string;
  email: string;
  status: 'active' | 'banned' | 'suspended';
  joinDate: string;
  lastActive: string;
  gamesPlayed: number;
  winRate: number;
  suspiciousActivity: number;
  investmentAmount: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [banReason, setBanReason] = useState('');
  const [suspensionDays, setSuspensionDays] = useState(7);

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
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2024-07-31',
      gamesPlayed: 156,
      winRate: 45.2,
      suspiciousActivity: 0,
      investmentAmount: 2500,
      riskLevel: 'low'
    },
    {
      id: '2',
      username: 'SuspiciousGamer',
      email: 'suspicious@example.com',
      status: 'active',
      joinDate: '2024-07-20',
      lastActive: '2024-08-01',
      gamesPlayed: 50,
      winRate: 94.5,
      suspiciousActivity: 8,
      investmentAmount: 500,
      riskLevel: 'high'
    },
    {
      id: '3',
      username: 'BannedUser',
      email: 'banned@example.com',
      status: 'banned',
      joinDate: '2024-06-10',
      lastActive: '2024-07-25',
      gamesPlayed: 23,
      winRate: 98.2,
      suspiciousActivity: 15,
      investmentAmount: 150,
      riskLevel: 'critical'
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

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gaming-dark">
      {/* Header */}
      <div className="bg-gradient-card shadow-sm border-b border-gaming-purple/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToDashboard}
                className="mr-2 hover:bg-gaming-purple/20 text-gaming-cyan hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="border-l border-gaming-purple/30 h-6"></div>
              <Shield className="h-8 w-8 text-gaming-purple" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">Mana Play Nexus Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <Badge className={`px-3 py-1 bg-gaming-purple/20 text-gaming-purple border-gaming-purple/30`}>
                  <Shield className="h-3 w-3 mr-1" />
                  {adminRole.level}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">User: {username}</p>
              </div>
              <Button 
                variant="outline" 
                onClick={onLogout}
                className="hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 bg-gaming-card/50">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-gaming-purple data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            {hasPermission('user_management') && (
              <TabsTrigger value="users" className="flex items-center gap-2 data-[state=active]:bg-gaming-purple data-[state=active]:text-white">
                <Users className="h-4 w-4" />
                User Management
              </TabsTrigger>
            )}
            {hasPermission('game_scheduling') && (
              <TabsTrigger value="games" className="flex items-center gap-2 data-[state=active]:bg-gaming-purple data-[state=active]:text-white">
                <Calendar className="h-4 w-4" />
                Game Scheduling
              </TabsTrigger>
            )}
            {hasPermission('security') && (
              <TabsTrigger value="security" className="flex items-center gap-2 data-[state=active]:bg-gaming-purple data-[state=active]:text-white">
                <Shield className="h-4 w-4" />
                Anti-Cheat
              </TabsTrigger>
            )}
            {hasPermission('all') && (
              <TabsTrigger value="protection" className="flex items-center gap-2 data-[state=active]:bg-gaming-purple data-[state=active]:text-white">
                <DollarSign className="h-4 w-4" />
                User Protection
              </TabsTrigger>
            )}
            {(hasPermission('reports') || hasPermission('all')) && (
              <TabsTrigger value="reports" className="flex items-center gap-2 data-[state=active]:bg-gaming-purple data-[state=active]:text-white">
                <FileText className="h-4 w-4" />
                Reports
              </TabsTrigger>
            )}
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Role-specific welcome message */}
            <div className="bg-gradient-card border border-gaming-purple/30 rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-gaming-purple" />
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Welcome, {adminRole.level}!
                  </h2>
                  <p className="text-muted-foreground">
                    {adminRole.permissions.includes('all') 
                      ? 'You have full administrative access to all platform features.'
                      : `You have access to: ${adminRole.permissions.join(', ').replace(/_/g, ' ')}`
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-card border-gaming-purple/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-gaming-cyan" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{users.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {users.filter(u => u.status === 'active').length} active
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-gaming-purple/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Games</CardTitle>
                  <Target className="h-4 w-4 text-gaming-purple" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {gameSchedules.filter(g => g.status === 'active').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {gameSchedules.filter(g => g.status === 'scheduled').length} scheduled
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-gaming-purple/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Security Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-400">
                    {suspiciousActivities.filter(a => a.severity === 'high' || a.severity === 'critical').length}
                  </div>
                  <p className="text-xs text-muted-foreground">High/Critical alerts</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-gaming-purple/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    ₹{users.reduce((sum, user) => sum + user.investmentAmount, 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">Total user investments</p>
                  {hasPermission('all') && (
                    <div className="mt-2 text-xs">
                      <span className="text-green-400">↗ +12.5%</span> from last month
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Enhanced dashboard for superadmin */}
            {hasPermission('all') && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-red-500/30 bg-gradient-card shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-red-400 text-lg font-bold">🚨 Critical Alerts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 bg-gaming-dark/50 rounded-md border border-red-500/30">
                        <span className="text-sm font-semibold text-foreground">High-Risk Users:</span>
                        <span className="font-bold text-lg text-red-400 bg-red-500/20 px-2 py-1 rounded">
                          {users.filter(u => u.riskLevel === 'high' || u.riskLevel === 'critical').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gaming-dark/50 rounded-md border border-red-500/30">
                        <span className="text-sm font-semibold text-foreground">Security Threats:</span>
                        <span className="font-bold text-lg text-red-400 bg-red-500/20 px-2 py-1 rounded">
                          {suspiciousActivities.filter(a => a.severity === 'critical').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gaming-dark/50 rounded-md border border-red-500/30">
                        <span className="text-sm font-semibold text-foreground">Banned Users:</span>
                        <span className="font-bold text-lg text-red-400 bg-red-500/20 px-2 py-1 rounded">
                          {users.filter(u => u.status === 'banned').length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-500/30 bg-gradient-card shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-green-900 text-lg font-bold">💰 Financial Control</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 bg-white rounded-md border border-green-200">
                        <span className="text-sm font-semibold text-green-900">Total Revenue:</span>
                        <span className="font-bold text-lg text-green-700 bg-green-100 px-2 py-1 rounded">
                          ₹{users.reduce((sum, user) => sum + user.investmentAmount, 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded-md border border-green-200">
                        <span className="text-sm font-semibold text-green-900">Prize Pools:</span>
                        <span className="font-bold text-lg text-green-700 bg-green-100 px-2 py-1 rounded">
                          ₹{gameSchedules.reduce((sum, game) => sum + game.prizePool, 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded-md border border-green-200">
                        <span className="text-sm font-semibold text-green-900">Profit Margin:</span>
                        <span className="font-bold text-lg text-green-700 bg-green-100 px-2 py-1 rounded">23.4%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-300 bg-blue-50 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-blue-900 text-lg font-bold">⚡ System Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 bg-white rounded-md border border-blue-200">
                        <span className="text-sm font-semibold text-blue-900">Server Uptime:</span>
                        <span className="font-bold text-lg text-blue-700 bg-blue-100 px-2 py-1 rounded">99.8%</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded-md border border-blue-200">
                        <span className="text-sm font-semibold text-blue-900">Active Sessions:</span>
                        <span className="font-bold text-lg text-blue-700 bg-blue-100 px-2 py-1 rounded">
                          {users.filter(u => u.status === 'active').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded-md border border-blue-200">
                        <span className="text-sm font-semibold text-blue-900">Anti-Cheat Accuracy:</span>
                        <span className="font-bold text-lg text-blue-700 bg-blue-100 px-2 py-1 rounded">94.2%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Security Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {suspiciousActivities.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{activity.username}</p>
                          <p className="text-sm text-gray-500">{activity.description}</p>
                        </div>
                        <Badge className={`${
                          activity.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          activity.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {activity.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Games</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {gameSchedules.filter(g => g.status === 'scheduled').map((game) => (
                      <div key={game.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{game.gameName} - {game.mode}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(game.startTime).toLocaleString()} • ₹{game.prizePool}
                          </p>
                        </div>
                        <Badge variant="outline">
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

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Games</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Win Rate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.username}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={
                              user.status === 'active' ? 'bg-green-100 text-green-800' :
                              user.status === 'banned' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.gamesPlayed}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.winRate}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getRiskBadgeColor(user.riskLevel)}>
                              {user.riskLevel}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{user.investmentAmount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowUserModal(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {user.status === 'active' && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setShowUserModal(true);
                                  }}
                                >
                                  <Ban className="h-4 w-4" />
                                </Button>
                              )}
                              {user.status === 'banned' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUnbanUser(user.id)}
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
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <Calendar className="h-6 w-6 mr-3 text-purple-600" />
                      Game Scheduling Management
                    </h2>
                    <p className="text-purple-700 mt-2">
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
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-full">
                          <Target className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-green-900">Active Games</p>
                          <p className="text-lg font-bold text-green-700">
                            {gameSchedules.filter(g => g.status === 'active').length}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-blue-900">Scheduled</p>
                          <p className="text-lg font-bold text-blue-700">
                            {gameSchedules.filter(g => g.status === 'scheduled').length}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-full">
                          <Users className="h-4 w-4 text-yellow-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-yellow-900">Total Players</p>
                          <p className="text-lg font-bold text-yellow-700">
                            {gameSchedules.reduce((sum, g) => sum + g.registeredPlayers, 0)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200 bg-purple-50">
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-full">
                          <DollarSign className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-purple-900">Prize Pools</p>
                          <p className="text-lg font-bold text-purple-700">
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
                  <Card key={game.id} className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-purple-500">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-purple-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-purple-900 flex items-center">
                            <Target className="h-5 w-5 mr-2" />
                            {game.gameName} - {game.mode}
                          </CardTitle>
                          <CardDescription className="text-purple-700">
                            🗺️ Map: {game.map}
                          </CardDescription>
                        </div>
                        <Badge className={
                          game.status === 'active' ? 'bg-green-100 text-green-800 border-green-300' :
                          game.status === 'scheduled' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                          game.status === 'completed' ? 'bg-gray-100 text-gray-800 border-gray-300' :
                          'bg-red-100 text-red-800 border-red-300'
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
                        <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                          <span className="text-sm font-medium text-blue-900">⏰ Start Time:</span>
                          <span className="text-sm font-bold text-blue-700">
                            {new Date(game.startTime).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                          <span className="text-sm font-medium text-green-900">💰 Prize Pool:</span>
                          <span className="text-sm font-bold text-green-700">
                            ₹{game.prizePool.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                          <span className="text-sm font-medium text-purple-900">👥 Players:</span>
                          <span className="text-sm font-bold text-purple-700">
                            {game.registeredPlayers}/{game.maxPlayers}
                            <span className="ml-2 text-xs">
                              ({Math.round((game.registeredPlayers / game.maxPlayers) * 100)}% full)
                            </span>
                          </span>
                        </div>
                        
                        {/* Progress bar for player registration */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${(game.registeredPlayers / game.maxPlayers) * 100}%` }}
                          ></div>
                        </div>

                        <div className="flex space-x-2 mt-4 pt-2 border-t">
                          <Button size="sm" variant="outline" className="hover:bg-blue-50 hover:border-blue-300">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="hover:bg-green-50 hover:border-green-300">
                            <Eye className="h-4 w-4 mr-2" />
                            View Players
                          </Button>
                          {game.status === 'scheduled' && (
                            <Button size="sm" variant="destructive" className="hover:bg-red-100">
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
                    selectedUser.status === 'active' ? 'bg-green-100 text-green-800' :
                    selectedUser.status === 'banned' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
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
    </div>
  );
};

export default AdminPanel;
