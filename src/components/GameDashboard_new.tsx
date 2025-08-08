import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Gamepad2, Target, Users, Crown, Clock, LogOut, Zap, Flame, ArrowLeft, ChevronRight, User, Trophy, History, Settings, Star, Edit, MapPin } from "lucide-react";

interface GameDashboardProps {
  username: string;
  onLogout: () => void;
}

const GameDashboard = ({ username, onLogout }: GameDashboardProps) => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedMap, setSelectedMap] = useState<string | null>(null);
  const [showModeModal, setShowModeModal] = useState(false);
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [showModeSelectionPage, setShowModeSelectionPage] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [selectedTeamMode, setSelectedTeamMode] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [showCombatStyleModal, setShowCombatStyleModal] = useState(false);

  // User Profile Data
  const userProfile = {
    name: username,
    freeFireUID: "2847583921",
    bio: "Professional Free Fire player | Battle Royale enthusiast | Clutch master",
    level: 65,
    rank: "Heroic",
    wins: 342,
    kills: 15670,
    matches: 1240
  };

  const recentMatches = [
    {
      id: 1,
      mode: 'BR-MODE',
      map: 'BERMUDA',
      result: 'Victory',
      position: 1,
      kills: 12,
      damage: 2450,
      time: '2 hours ago',
      prize: '₹150'
    },
    {
      id: 2,
      mode: 'CS-MODE',
      map: 'PURGATORY',
      result: 'Defeat',
      position: 3,
      kills: 8,
      damage: 1850,
      time: '5 hours ago',
      prize: '₹0'
    },
    {
      id: 3,
      mode: 'LONE WOLF-MODE',
      map: 'KALAHARI',
      result: 'Victory',
      position: 1,
      kills: 15,
      damage: 3200,
      time: '1 day ago',
      prize: '₹300'
    }
  ];

  const registeredMatches = [
    {
      id: 1,
      mode: 'BR-MODE',
      map: 'BERMUDA',
      time: '6:00 PM',
      date: 'Today',
      entry: '₹50',
      prize: '₹300',
      team: 'SQUAD',
      status: 'Upcoming'
    },
    {
      id: 2,
      mode: 'CS-MODE',
      map: 'PURGATORY',
      time: '8:30 PM',
      date: 'Today',
      entry: '₹30',
      prize: '₹150',
      team: '4v4',
      status: 'Upcoming'
    },
    {
      id: 3,
      mode: 'LONE WOLF-MODE',
      map: 'BERMUDA',
      time: '2:00 PM',
      date: 'Tomorrow',
      entry: '₹100',
      prize: '₹600',
      team: 'SOLO',
      status: 'Registered'
    }
  ];

  const maps = [
    {
      id: 'bermuda',
      name: 'BERMUDA',
      description: 'Classic Battle Royale map with diverse terrains and iconic locations.',
      status: 'active',
      theme: 'tropical',
      playerCount: '50 Players',
      difficulty: 'Medium'
    },
    {
      id: 'purgatory',
      name: 'PURGATORY',
      description: 'Desert-themed map with intense close-quarters combat zones.',
      status: 'active',
      theme: 'desert',
      playerCount: '50 Players',
      difficulty: 'Hard'
    },
    {
      id: 'kalahari',
      name: 'KALAHARI',
      description: 'African-inspired landscape with unique tactical opportunities.',
      status: 'active',
      theme: 'savanna',
      playerCount: '50 Players',
      difficulty: 'Medium'
    },
    {
      id: 'nexterra',
      name: 'NEXTERRA',
      description: 'Futuristic map with advanced technology and modern warfare.',
      status: 'coming-soon',
      theme: 'futuristic',
      playerCount: '50 Players',
      difficulty: 'Hard'
    },
    {
      id: 'academy',
      name: 'ACADEMY',
      description: 'Training ground for new recruits and skill development.',
      status: 'active',
      theme: 'training',
      playerCount: '12 Players',
      difficulty: 'Easy'
    }
  ];

  const gameModes = [
    {
      id: 'br',
      name: 'BR-MODE',
      description: 'Battle Royale - 50 players fight to be the last one standing',
      icon: Target,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      teamModes: ['SOLO', 'DUO', 'SQUAD'],
      playerLimits: { 'SOLO': 50, 'DUO': 25, 'SQUAD': 12 }
    },
    {
      id: 'cs',
      name: 'CS-MODE',
      description: 'Clash Squad - Intense 4v4 tactical combat',
      icon: Users,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
      teamModes: ['4v4'],
      playerLimits: { '4v4': 8 }
    },
    {
      id: 'lone-wolf',
      name: 'LONE WOLF-MODE',
      description: 'Solo survival challenge in hostile territory',
      icon: Crown,
      color: 'text-blue-600',
      bgColor: 'bg-blue-600/10',
      borderColor: 'border-blue-600/30',
      teamModes: ['SOLO'],
      playerLimits: { 'SOLO': 12 }
    }
  ];

  const timeSlots = [
    { id: '6pm', time: '6:00 PM', available: true },
    { id: '7pm', time: '7:00 PM', available: true },
    { id: '8pm', time: '8:00 PM', available: false },
    { id: '9pm', time: '9:00 PM', available: true },
    { id: '10pm', time: '10:00 PM', available: true }
  ];

  const getMapThemeColors = (theme: string) => {
    switch (theme) {
      case 'tropical':
        return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' };
      case 'desert':
        return { bg: 'bg-blue-600/10', border: 'border-blue-600/30', text: 'text-blue-500' };
      case 'savanna':
        return { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' };
      case 'snow':
        return { bg: 'bg-blue-400/10', border: 'border-blue-400/30', text: 'text-blue-300' };
      case 'futuristic':
        return { bg: 'bg-blue-700/10', border: 'border-blue-700/30', text: 'text-blue-600' };
      case 'training':
        return { bg: 'bg-cyan-600/10', border: 'border-cyan-600/30', text: 'text-cyan-500' };
      default:
        return { bg: 'bg-primary/10', border: 'border-primary/30', text: 'text-primary' };
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-blue-400';
      case 'Medium':
        return 'text-cyan-400';
      case 'Hard':
        return 'text-blue-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const handleMapClick = (mapId: string) => {
    setSelectedMap(mapId);
    setShowModeSelectionPage(true);
  };

  if (showProfilePage) {
    return (
      <div className="min-h-screen bg-gaming-dark">
        {/* Profile Header */}
        <header className="bg-gradient-card border-b border-gaming-purple/30 p-6">
          <div className="container mx-auto">
            {/* Back Button and User Info */}
            <div className="flex justify-between items-center mb-4">
              <Button 
                variant="outline" 
                onClick={() => setShowProfilePage(false)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Welcome back</p>
                  <p className="font-semibold text-foreground">{username}</p>
                </div>
                <Button variant="outline" size="sm" onClick={onLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
            
            {/* Centered Title */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <User className="h-10 w-10 text-gaming-purple" />
                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gaming-purple via-gaming-cyan to-gaming-purple bg-clip-text text-transparent tracking-wider">
                  USER PROFILE
                </h1>
                <User className="h-10 w-10 text-gaming-cyan" />
              </div>
              <p className="text-lg text-muted-foreground font-medium">
                Gaming Statistics & Match History
              </p>
            </div>
          </div>
        </header>

        {/* Profile Content */}
        <div className="container mx-auto p-6 space-y-8">
          {/* Profile Header Card */}
          <div className="bg-gradient-card border border-gaming-purple/30 rounded-lg p-8">
            <div className="flex items-center space-x-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gaming-purple to-gaming-cyan rounded-full blur-lg opacity-50"></div>
                <div className="relative bg-gaming-dark/80 rounded-full p-8">
                  <User className="h-20 w-20 text-gaming-cyan" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <h2 className="text-4xl font-bold text-foreground">{userProfile.name}</h2>
                  <Badge className="bg-gaming-purple/20 text-gaming-purple border-gaming-purple/30 text-lg px-4 py-2">
                    Level {userProfile.level}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Free Fire UID</p>
                    <p className="text-xl font-bold text-gaming-cyan">{userProfile.freeFireUID}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Rank</p>
                    <div className="flex items-center space-x-2">
                      <Crown className="h-6 w-6 text-yellow-400" />
                      <p className="text-xl font-bold text-yellow-400">{userProfile.rank}</p>
                    </div>
                  </div>
                </div>
                <p className="text-lg text-muted-foreground italic">{userProfile.bio}</p>
              </div>
              <Button variant="outline" size="lg">
                <Edit className="h-5 w-5 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-card border-gaming-purple/30">
              <CardContent className="p-6 text-center">
                <Trophy className="h-12 w-12 text-gaming-cyan mx-auto mb-3" />
                <p className="text-3xl font-bold text-foreground">{userProfile.wins}</p>
                <p className="text-sm text-muted-foreground">Total Wins</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card border-gaming-purple/30">
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 text-red-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-foreground">{userProfile.kills}</p>
                <p className="text-sm text-muted-foreground">Total Kills</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card border-gaming-purple/30">
              <CardContent className="p-6 text-center">
                <Gamepad2 className="h-12 w-12 text-gaming-purple mx-auto mb-3" />
                <p className="text-3xl font-bold text-foreground">{userProfile.matches}</p>
                <p className="text-sm text-muted-foreground">Matches Played</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card border-gaming-purple/30">
              <CardContent className="p-6 text-center">
                <Star className="h-12 w-12 text-yellow-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-foreground">{Math.round((userProfile.wins / userProfile.matches) * 100)}%</p>
                <p className="text-sm text-muted-foreground">Win Rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Matches Content */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Matches */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <History className="h-8 w-8 text-gaming-cyan" />
                <h3 className="text-3xl font-bold text-foreground">Recent Matches</h3>
              </div>
              <div className="space-y-4">
                {recentMatches.map((match) => (
                  <Card key={match.id} className="bg-gradient-card border-gaming-purple/30 hover:border-gaming-cyan transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                            match.result === 'Victory' ? 'bg-green-500/20 text-green-400' :
                            match.result === 'Defeat' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {match.result}
                          </div>
                          <Badge variant="outline" className="bg-gaming-purple/10 border-gaming-purple/30 text-gaming-purple text-sm">
                            {match.mode}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{match.time}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-muted-foreground">Map: <span className="text-foreground font-semibold">{match.map}</span></p>
                          <p className="text-muted-foreground">Position: <span className="text-gaming-cyan font-semibold">#{match.position}</span></p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Kills: <span className="text-red-400 font-semibold">{match.kills}</span></p>
                          <p className="text-muted-foreground">Prize: <span className="text-green-400 font-semibold">{match.prize}</span></p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Registered Matches */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Clock className="h-8 w-8 text-gaming-purple" />
                <h3 className="text-3xl font-bold text-foreground">Registered Matches</h3>
              </div>
              <div className="space-y-4">
                {registeredMatches.map((match) => (
                  <Card key={match.id} className="bg-gradient-card border-gaming-purple/30 hover:border-gaming-cyan transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className="bg-gaming-cyan/10 border-gaming-cyan/30 text-gaming-cyan text-sm">
                            {match.mode}
                          </Badge>
                          <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                            match.status === 'Upcoming' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {match.status}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{match.date}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-muted-foreground">Map: <span className="text-foreground font-semibold">{match.map}</span></p>
                          <p className="text-muted-foreground">Time: <span className="text-gaming-cyan font-semibold">{match.time}</span></p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Team: <span className="text-gaming-purple font-semibold">{match.team}</span></p>
                          <p className="text-muted-foreground">Entry: <span className="text-red-400 font-semibold">{match.entry}</span></p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mode Selection Page
  if (showModeSelectionPage) {
    const currentMap = maps.find(m => m.id === selectedMap);
    return (
      <div className="min-h-screen bg-gaming-dark">
        {/* Mode Selection Header */}
        <header className="bg-gradient-card border-b border-blue-500/30 p-6">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowModeSelectionPage(false)}
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Maps
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <MapPin className="h-7 w-7 text-blue-400" />
                    {currentMap?.name || 'MAP SELECTION'}
                  </h1>
                  <p className="text-gray-400 mt-1">{currentMap?.description}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto p-6">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Left Side - Game Modes */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-400" />
                GAME MODES
              </h2>
              
              {gameModes.map((mode) => {
                const IconComponent = mode.icon;
                const isSelected = selectedMode === mode.id;
                return (
                  <Card
                    key={mode.id}
                    className={`cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? 'bg-blue-500/20 border-blue-500 shadow-glow-blue'
                        : 'bg-gaming-dark/80 border-blue-500/30 hover:border-blue-500/50 hover:bg-blue-500/10'
                    }`}
                    onClick={() => setSelectedMode(mode.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <IconComponent className={`h-5 w-5 ${mode.color}`} />
                        <h3 className="font-semibold text-white text-sm">{mode.name}</h3>
                      </div>
                      <p className="text-gray-400 text-xs mb-3">{mode.description}</p>
                      
                      {/* Team Mode Selection */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-blue-400">Team Options:</h4>
                        <div className="flex flex-wrap gap-1">
                          {mode.teamModes.map((teamMode) => (
                            <Badge
                              key={teamMode}
                              variant={selectedTeamMode === teamMode ? "default" : "outline"}
                              className={`text-xs cursor-pointer ${
                                selectedTeamMode === teamMode
                                  ? 'bg-blue-500 text-white'
                                  : 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTeamMode(teamMode);
                              }}
                            >
                              {teamMode} ({mode.playerLimits[teamMode]})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Right Side - Time Slots and Match Details */}
            <div className="lg:col-span-3 space-y-6">
              {selectedMode && (
                <>
                  {/* Time Slot Selection */}
                  <Card className="bg-gaming-dark/80 border-blue-500/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-400" />
                        SELECT TIME SLOT
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Choose your preferred match time for {gameModes.find(m => m.id === selectedMode)?.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot.id}
                            variant={selectedTimeSlot === slot.id ? "default" : "outline"}
                            disabled={!slot.available}
                            className={`${
                              selectedTimeSlot === slot.id
                                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                : slot.available
                                ? 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400'
                                : 'border-gray-600 text-gray-500 cursor-not-allowed'
                            }`}
                            onClick={() => setSelectedTimeSlot(slot.id)}
                          >
                            {slot.time}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Match Summary */}
                  {selectedMode && selectedTeamMode && selectedTimeSlot && (
                    <Card className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-blue-500/50">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Zap className="h-5 w-5 text-blue-400" />
                          MATCH SUMMARY
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <p className="text-blue-400 text-sm font-medium">MAP</p>
                            <p className="text-white font-bold">{currentMap?.name}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-blue-400 text-sm font-medium">MODE</p>
                            <p className="text-white font-bold">{gameModes.find(m => m.id === selectedMode)?.name}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-blue-400 text-sm font-medium">TEAM</p>
                            <p className="text-white font-bold">{selectedTeamMode}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-blue-400 text-sm font-medium">TIME</p>
                            <p className="text-white font-bold">{timeSlots.find(t => t.id === selectedTimeSlot)?.time}</p>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-blue-500/30">
                          <Button 
                            size="lg" 
                            className="w-full drop-button text-lg font-bold"
                            onClick={() => setShowCombatStyleModal(true)}
                          >
                            <Target className="h-5 w-5 mr-2" />
                            DROP HERE
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}

              {/* Instructions */}
              {!selectedMode && (
                <Card className="bg-gaming-dark/50 border-blue-500/20">
                  <CardContent className="p-8 text-center">
                    <Target className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Select a Game Mode</h3>
                    <p className="text-gray-400">
                      Choose from BR-MODE, CS-MODE, or LONE WOLF-MODE to start your battle experience
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard - This would contain all the existing dashboard content
  return (
    <div className="min-h-screen bg-gradient-to-br from-gaming-dark via-slate-900 to-gaming-dark">
      {/* Header */}
      <header className="bg-gradient-to-r from-gaming-card via-slate-800 to-gaming-card border-b-2 border-blue-500/30 p-8 shadow-2xl shadow-blue-500/10">
        <div className="container mx-auto">
          {/* User Info and Logout - Top Right */}
          <div className="flex justify-end items-center mb-6">
            <div className="flex items-center space-x-6">
              <div className="text-right bg-gaming-card/50 px-4 py-2 rounded-lg border border-blue-500/20">
                <p className="text-sm text-blue-400 font-medium">Welcome back</p>
                <p className="font-bold text-white text-lg">{username}</p>
              </div>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={onLogout}
                className="border-2 border-blue-500/50 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
          
          {/* Centered Title */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="relative">
                <Gamepad2 className="h-16 w-16 text-blue-400 animate-pulse" />
                <div className="absolute inset-0 h-16 w-16 bg-blue-400/20 rounded-full animate-ping"></div>
              </div>
              <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent tracking-wider title-glow">
                MANA GAMING
              </h1>
              <div className="relative">
                <Gamepad2 className="h-16 w-16 text-cyan-400 animate-pulse" />
                <div className="absolute inset-0 h-16 w-16 bg-cyan-400/20 rounded-full animate-ping"></div>
              </div>
            </div>
            <p className="text-xl text-gray-300 font-semibold mb-4">
              Ultimate Battle Arena
            </p>
            <div className="w-full max-w-md mx-auto h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-8">
        {/* Game Selection Section */}
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-8">
            <div className="relative">
              <Zap className="h-10 w-10 text-blue-400" />
              <div className="absolute inset-0 h-10 w-10 bg-blue-400/20 rounded-full animate-pulse"></div>
            </div>
            <h2 className="text-3xl font-bold text-white">
              Select Your Game
            </h2>
            <div className="flex-1 h-1 bg-gradient-to-r from-blue-500/50 to-transparent"></div>
          </div>
          
          {/* Free Fire Game Box - Enhanced */}
          <div className="max-w-2xl mb-12">
            <Card className="gaming-card-enhanced hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20">
              <CardContent className="p-8">
                <div className="flex items-center space-x-6 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-50"></div>
                    <div className="relative bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-6 rounded-2xl border-2 border-blue-500/30">
                      <Gamepad2 className="h-12 w-12 text-blue-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-black text-white mb-2">FREE FIRE</h3>
                    <p className="text-lg text-blue-300 font-medium">Battle Royale Arena</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 text-green-400 mb-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-lg font-bold">Online</span>
                    </div>
                    <p className="text-sm text-gray-400">2,847 Active Players</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div className="bg-gaming-dark/50 p-4 rounded-lg border border-blue-500/20">
                    <p className="text-2xl font-bold text-blue-400">324</p>
                    <p className="text-gray-400 font-medium">In Queue</p>
                  </div>
                  <div className="bg-gaming-dark/50 p-4 rounded-lg border border-cyan-500/20">
                    <p className="text-2xl font-bold text-cyan-400">156</p>
                    <p className="text-gray-400 font-medium">In Match</p>
                  </div>
                  <div className="bg-gaming-dark/50 p-4 rounded-lg border border-blue-600/20">
                    <p className="text-2xl font-bold text-blue-600">12</p>
                    <p className="text-gray-400 font-medium">Tournaments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Maps Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-8">
            <div className="relative">
              <Target className="h-10 w-10 text-blue-400" />
              <div className="absolute inset-0 h-10 w-10 bg-blue-400/20 rounded-full animate-pulse"></div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              FREE FIRE MAPS
            </h2>
            <div className="flex-1 h-1 bg-gradient-to-r from-blue-500/50 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {maps.map((map, index) => {
              const themeColors = getMapThemeColors(map.theme);
              return (
                <Card 
                  key={map.id} 
                  className={`map-card cursor-pointer hover:shadow-2xl transition-all duration-500 gaming-card-enhanced group h-80 w-full hover:scale-105 hover:-translate-y-2`}
                  onClick={() => handleMapClick(map.id)}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: `slideInFromLeft 0.6s ease-out forwards`
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <CardTitle className="text-lg font-bold text-white">
                        <span className="truncate">{map.name}</span>
                      </CardTitle>
                      {map.status === 'coming-soon' ? (
                        <Badge variant="secondary" className="bg-gray-600/50 text-gray-300 text-sm px-3 py-1">
                          Soon
                        </Badge>
                      ) : (
                        <Badge className={`${themeColors.bg} ${themeColors.text} border-0 text-sm px-3 py-1 font-bold animate-pulse`}>
                          LIVE
                        </Badge>
                      )}
                    </div>
                    
                    {/* Map Stats */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-2 bg-gaming-dark/30 p-2 rounded">
                        <Users className="h-4 w-4 text-blue-400" />
                        <span className="text-gray-300 font-medium">{map.playerCount}</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-gaming-dark/30 p-2 rounded">
                        <Target className="h-4 w-4" />
                        <span className={`${getDifficultyColor(map.difficulty)} font-medium`}>{map.difficulty}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="px-4 pb-4">
                    {/* Theme Badge */}
                    <div className="mb-4">
                      <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${themeColors.bg} ${themeColors.text} border-2 ${themeColors.border}`}>
                        {map.theme.toUpperCase()}
                      </div>
                    </div>
                    
                    <CardDescription className="text-sm mb-6 text-gray-300 leading-relaxed line-clamp-3 group-hover:text-gray-100 transition-colors duration-300">
                      {map.description}
                    </CardDescription>
                    
                    <Button 
                      className={`w-full drop-button text-sm py-3 font-bold ${
                        map.status === 'coming-soon' 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:scale-105'
                      }`}
                      disabled={map.status === 'coming-soon'}
                      variant={map.status === 'coming-soon' ? 'outline' : 'default'}
                    >
                      {map.status === 'coming-soon' ? 'COMING SOON' : 'DROP HERE 🪂'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Enhanced Floating Profile Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-xl opacity-60 animate-pulse"></div>
          <Button
            size="lg"
            className="relative h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 hover:from-cyan-500 hover:via-blue-500 hover:to-cyan-600 shadow-2xl hover:shadow-glow-primary transition-all duration-500 border-4 border-blue-400/30 hover:border-cyan-400/50 hover:scale-110 group"
            onClick={() => setShowProfilePage(true)}
          >
            <User className="h-10 w-10 text-white group-hover:scale-110 transition-transform duration-300" />
          </Button>
          {/* Notification Badge */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce">
            3
          </div>
        </div>
      </div>

      {/* Combat Style Selection Modal */}
      <Dialog open={showCombatStyleModal} onOpenChange={setShowCombatStyleModal}>
        <DialogContent className="bg-gradient-to-br from-gaming-dark via-slate-900 to-gaming-dark border-4 border-blue-500/50 max-w-4xl shadow-2xl shadow-blue-500/20">
          <DialogHeader className="pb-8">
            <DialogTitle className="text-center text-3xl font-black text-white mb-4">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="relative">
                  <Target className="h-12 w-12 text-blue-400 animate-pulse" />
                  <div className="absolute inset-0 h-12 w-12 bg-blue-400/20 rounded-full animate-ping"></div>
                </div>
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent title-glow">
                  Choose Your Combat Style
                </span>
                <div className="relative">
                  <Target className="h-12 w-12 text-cyan-400 animate-pulse" />
                  <div className="absolute inset-0 h-12 w-12 bg-cyan-400/20 rounded-full animate-ping"></div>
                </div>
              </div>
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60"></div>
            </DialogTitle>
            <p className="text-center text-gray-300 text-lg font-medium">
              Select your preferred battle mode and dominate the battlefield
            </p>
          </DialogHeader>
          
          <div className="space-y-6 mt-8">
            {gameModes.map((mode, index) => {
              const IconComponent = mode.icon;
              return (
                <Card
                  key={mode.id}
                  className="cursor-pointer transition-all duration-500 bg-gradient-to-r from-gaming-dark/90 via-slate-900/80 to-gaming-dark/90 border-2 border-blue-500/30 hover:border-blue-400/80 hover:bg-gradient-to-r hover:from-blue-900/20 hover:via-cyan-900/10 hover:to-blue-900/20 hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 group transform"
                  onClick={() => {
                    setSelectedMode(mode.id);
                    setShowCombatStyleModal(false);
                    // You can add navigation logic here if needed
                  }}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: `slideInFromLeft 0.6s ease-out forwards`
                  }}
                >
                  <CardContent className="p-8">
                    <div className="flex items-center gap-6">
                      {/* Animated Icon Container */}
                      <div className="relative">
                        <div className={`absolute inset-0 ${mode.bgColor} rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300`}></div>
                        <div className={`relative p-6 rounded-full ${mode.bgColor} ${mode.borderColor} border-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                          <IconComponent className={`h-12 w-12 ${mode.color} group-hover:text-white transition-colors duration-300`} />
                        </div>
                        {/* Floating particles effect */}
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-300"></div>
                        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-300"></div>
                      </div>
                      
                      {/* Content Section */}
                      <div className="flex-1">
                        <div className="mb-4">
                          <h3 className="text-2xl font-black text-white mb-3 group-hover:text-blue-300 transition-colors duration-300 flex items-center gap-3">
                            {mode.name}
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                          </h3>
                          <p className="text-gray-300 text-base leading-relaxed group-hover:text-gray-100 transition-colors duration-300">
                            {mode.description}
                          </p>
                        </div>
                        
                        {/* Enhanced Team Options Display */}
                        <div className="space-y-3">
                          <h4 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Available Team Modes
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {mode.teamModes.map((teamMode) => (
                              <Badge
                                key={teamMode}
                                variant="outline"
                                className="border-2 border-blue-500/40 text-blue-300 text-sm px-4 py-2 font-semibold hover:bg-blue-500/20 hover:border-blue-400 hover:text-white transition-all duration-300 hover:scale-110"
                              >
                                <Crown className="h-3 w-3 mr-2" />
                                {teamMode} • {mode.playerLimits[teamMode]} players
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Arrow */}
                      <div className="flex flex-col items-center gap-2">
                        <ChevronRight className="h-8 w-8 text-blue-400 group-hover:translate-x-2 group-hover:text-cyan-300 transition-all duration-300" />
                        <span className="text-xs text-gray-500 group-hover:text-blue-400 transition-colors duration-300 font-medium">
                          SELECT
                        </span>
                      </div>
                    </div>
                    
                    {/* Bottom glow effect */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {/* Enhanced Cancel Button */}
          <div className="flex justify-center mt-10 pt-6 border-t border-blue-500/20">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowCombatStyleModal(false)}
              className="border-2 border-blue-500/50 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400 hover:text-white transition-all duration-300 px-8 py-3 text-lg font-semibold hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Cancel Selection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameDashboard;
