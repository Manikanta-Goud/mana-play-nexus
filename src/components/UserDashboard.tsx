import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/hooks/useUser';
import { User, Trophy, Target, Star, LogOut, Settings } from 'lucide-react';

const UserDashboard = () => {
  const { logout } = useAuth();
  const { 
    displayName, 
    username, 
    email, 
    stats, 
    rank, 
    level, 
    nextLevelProgress, 
    winRate, 
    isNewPlayer,
    incrementGamesPlayed 
  } = useUser();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const simulateGameWin = async () => {
    await incrementGamesPlayed(true);
  };

  const simulateGameLoss = async () => {
    await incrementGamesPlayed(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">MANA Gaming Dashboard</h1>
            <p className="text-gray-400">Welcome back, {displayName}!</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="text-gray-300 border-gray-600">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button onClick={handleLogout} variant="outline" className="text-red-400 border-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* User Profile Card */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">Display Name</p>
                <p className="text-white font-semibold">{displayName}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Username</p>
                <p className="text-white">@{username}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white">{email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Rank</p>
                <Badge variant="secondary" className="bg-purple-600 text-white">
                  {rank}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Level & Progress Card */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Level {level}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {stats.experience} XP earned
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progress to Level {level + 1}</span>
                  <span className="text-white">{Math.round(nextLevelProgress)}%</span>
                </div>
                <Progress value={nextLevelProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Game Stats Card */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Game Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Games Played</p>
                  <p className="text-white font-semibold text-xl">{stats.gamesPlayed}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Win Rate</p>
                  <p className="text-white font-semibold text-xl">{winRate.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Wins</p>
                  <p className="text-green-400 font-semibold text-xl">{stats.wins}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Losses</p>
                  <p className="text-red-400 font-semibold text-xl">{stats.losses}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message for New Players */}
        {isNewPlayer && (
          <Card className="bg-gradient-to-r from-purple-900 to-blue-900 border-purple-600 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Welcome to MANA Gaming!
              </CardTitle>
              <CardDescription className="text-purple-200">
                You're just getting started. Play your first game to begin earning experience!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-purple-100 mb-4">
                Complete games to earn XP, climb the ranks, and unlock new features. Good luck, gamer!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Game Simulation (for testing) */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Game Simulation</CardTitle>
            <CardDescription className="text-gray-400">
              Test the stats tracking system (for development purposes)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button 
                onClick={simulateGameWin}
                className="bg-green-600 hover:bg-green-700"
              >
                Simulate Win (+10 XP)
              </Button>
              <Button 
                onClick={simulateGameLoss}
                className="bg-red-600 hover:bg-red-700"
              >
                Simulate Loss (+5 XP)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
