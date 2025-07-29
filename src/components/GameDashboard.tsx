import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Gamepad2, Target, Users, Crown, Clock, LogOut, Map, MapPin, Zap, Flame, ArrowLeft, ChevronRight, User, Trophy, History, Settings, Star, Edit, CreditCard, Wallet, HelpCircle, DollarSign, TrendingUp } from "lucide-react";

interface GameDashboardProps {
  username: string;
  onLogout: () => void;
}

const GameDashboard = ({ username, onLogout }: GameDashboardProps) => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedMap, setSelectedMap] = useState<string | null>(null);
  const [showModeModal, setShowModeModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState<string>('overview');
  const [showMatchHistoryModal, setShowMatchHistoryModal] = useState(false);
  const [showRegisteredMatchesModal, setShowRegisteredMatchesModal] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [selectedTeamMode, setSelectedTeamMode] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  const games = [
    {
      id: 'freefire',
      name: 'Free Fire',
      icon: Target,
      description: 'Battle Royale Mayhem',
      players: '2.1M',
      status: 'Live'
    }
  ];

  const freeFireModes = [
    {
      id: 'br',
      name: 'BR',
      fullName: 'Battle Royale',
      description: '50 players fight for survival on a shrinking map',
      icon: Crown,
      players: '50 Players',
      duration: '15-20 min'
    },
    {
      id: 'cs',
      name: 'CS',
      fullName: 'Clash Squad',
      description: '4v4 intense tactical combat',
      icon: Users,
      players: '8 Players',
      duration: '8-12 min'
    },
    {
      id: 'lonewolf',
      name: 'LONEWOLF',
      fullName: 'Lone Wolf',
      description: 'Solo survival challenge',
      icon: Target,
      players: '1 Player',
      duration: '10-15 min'
    }
  ];

  const upcomingMatches = [
    { time: '14:30', mode: 'BR', prize: '₹5000' },
    { time: '16:00', mode: 'CS', prize: '₹3000' },
    { time: '18:30', mode: 'LONEWOLF', prize: '₹2000' },
  ];

  const freeFireMaps = [
    {
      id: 'bermuda',
      name: 'BERMUDA',
      description: 'Classic battle royale map with diverse terrains',
      icon: Map,
      size: '50 Players',
      theme: 'Tropical Island',
      features: ['Clock Tower', 'Mars Electric', 'Pochinok'],
      status: 'Active'
    },
    {
      id: 'purgatory',
      name: 'PURGATORY',
      description: 'Desert wasteland with abandoned settlements',
      icon: Flame,
      size: '50 Players', 
      theme: 'Desert Apocalypse',
      features: ['Sanitarium', 'Forge', 'Downtown'],
      status: 'Active'
    },
    {
      id: 'kalahari',
      name: 'KALAHARI',
      description: 'African savanna with unique wildlife zones',
      icon: Target,
      size: '50 Players',
      theme: 'African Safari',
      features: ['Lumberyard', 'Refinery', 'Outpost'],
      status: 'Active'
    },
    {
      id: 'alpine',
      name: 'ALPINE',
      description: 'Snow-covered mountain terrain with extreme weather',
      icon: MapPin,
      size: '50 Players',
      theme: 'Snowy Mountains',
      features: ['Observatory', 'Mill', 'Crash'],
      status: 'Featured'
    }
  ];

  const teamModes = {
    br: [
      {
        id: 'squad',
        name: 'SQUAD',
        players: '4 Players',
        description: 'Team up with 3 friends',
        icon: Users,
        maxPlayers: 4
      },
      {
        id: 'duo',
        name: 'DUO', 
        players: '2 Players',
        description: 'Partner combat',
        icon: Target,
        maxPlayers: 2
      },
      {
        id: 'solo',
        name: 'SOLO',
        players: '1 Player', 
        description: 'Individual battle',
        icon: Crown,
        maxPlayers: 1
      }
    ],
    cs: [
      {
        id: '4v4',
        name: '4 VS 4',
        players: '8 Players',
        description: 'Classic clash squad battle',
        icon: Users,
        maxPlayers: 8
      },
      {
        id: '3v3',
        name: '3 VS 3',
        players: '6 Players',
        description: 'Tactical team combat',
        icon: Users,
        maxPlayers: 6
      },
      {
        id: '2v2',
        name: '2 VS 2',
        players: '4 Players',
        description: 'Duo team battle',
        icon: Target,
        maxPlayers: 4
      },
      {
        id: '1v1',
        name: '1 VS 1',
        players: '2 Players',
        description: 'Ultimate showdown',
        icon: Crown,
        maxPlayers: 2
      }
    ],
    lonewolf: [
      {
        id: 'duo',
        name: 'DUO',
        players: '2 Players',
        description: 'Partner survival',
        icon: Target,
        maxPlayers: 2
      },
      {
        id: 'solo',
        name: 'SOLO',
        players: '1 Player',
        description: 'Lone survivor',
        icon: Crown,
        maxPlayers: 1
      }
    ]
  };

  const generateTimeSlots = (modeType?: string, teamMode?: string) => {
    const slots = [];
    
    // Determine max players based on mode and team selection
    let maxPlayers = 50; // Default
    
    if (modeType === 'br') {
      if (teamMode === 'squad') {
        maxPlayers = 48; // 12 squads × 4 players
      } else if (teamMode === 'duo') {
        maxPlayers = 48; // 24 duos × 2 players
      } else if (teamMode === 'solo') {
        maxPlayers = 28; // 28 individual players
      }
    } else if (modeType === 'cs') {
      if (teamMode === '4v4') {
        maxPlayers = 8; // 4v4 = 8 players
      } else if (teamMode === '3v3') {
        maxPlayers = 6; // 3v3 = 6 players
      } else if (teamMode === '2v2') {
        maxPlayers = 4; // 2v2 = 4 players
      } else if (teamMode === '1v1') {
        maxPlayers = 2; // 1v1 = 2 players
      }
    } else if (modeType === 'lonewolf') {
      if (teamMode === 'duo') {
        maxPlayers = 2; // Duo survival
      } else if (teamMode === 'solo') {
        maxPlayers = 1; // Solo survival
      }
    }
    
    for (let hour = 10; hour <= 22; hour++) {
      const baseTime = hour;
      // 3 matches per hour with 5-min breaks
      const times = [
        { minutes: 0, match: 1 },
        { minutes: 20, match: 2 }, 
        { minutes: 40, match: 3 }
      ];
      
      times.forEach(({ minutes, match }) => {
        const timeString = `${baseTime.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        const period = baseTime >= 12 ? 'PM' : 'AM';
        const displayHour = baseTime > 12 ? baseTime - 12 : baseTime;
        const displayTime = `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
        
        slots.push({
          id: `${baseTime}-${minutes}`,
          time: timeString,
          displayTime,
          match,
          registeredPlayers: Math.floor(Math.random() * Math.min(maxPlayers - 2, 45)) + 2, // Random for demo but within limits
          maxPlayers
        });
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const entryFees = [
    { id: 'basic', amount: 10, prize: '₹50', slots: 50 },
    { id: 'silver', amount: 30, prize: '₹150', slots: 30 },
    { id: 'gold', amount: 50, prize: '₹300', slots: 20 },
    { id: 'diamond', amount: 100, prize: '₹600', slots: 10 }
  ];

  // User Profile Data
  const userProfile = {
    name: username,
    freeFireUID: "2847583921",
    bio: "Professional Free Fire player | Battle Royale enthusiast | Clutch master",
    level: 65,
    rank: "Heroic",
    wins: 342,
    kills: 15670,
    matches: 1240,
    walletBalance: 2580,
    totalEarnings: 15420
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
    },
    {
      id: 4,
      mode: 'BR-MODE',
      map: 'ALPINE',
      result: 'Top 5',
      position: 4,
      kills: 7,
      damage: 1920,
      time: '2 days ago',
      prize: '₹30'
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
      map: 'ALPINE',
      time: '2:00 PM',
      date: 'Tomorrow',
      entry: '₹100',
      prize: '₹600',
      team: 'SOLO',
      status: 'Registered'
    }
  ];

  const mapModes = {
    bermuda: [
      {
        id: 'br-bermuda',
        name: 'BR-MODE',
        fullName: 'Battle Royale - Bermuda',
        description: '50 players drop into the tropical island paradise',
        icon: Crown,
        players: '50 Players',
        duration: '15-20 min',
        features: ['Clock Tower Combat', 'Mars Electric Loot', 'Pochinok Battles']
      },
      {
        id: 'cs-bermuda',
        name: 'CS-MODE',
        fullName: 'Clash Squad - Bermuda',
        description: '4v4 tactical combat in Bermuda hotspots',
        icon: Users,
        players: '8 Players',
        duration: '8-12 min',
        features: ['Peak Battles', 'Nuketown Arena', 'Hangar Showdown']
      },
      {
        id: 'lonewolf-bermuda',
        name: 'LONE WOLF-MODE',
        fullName: 'Lone Wolf - Bermuda',
        description: 'Solo survival in the classic battleground',
        icon: Target,
        players: '1 Player',
        duration: '10-15 min',
        features: ['Stealth Mission', 'Resource Hunt', 'Survival Challenge']
      }
    ],
    purgatory: [
      {
        id: 'br-purgatory',
        name: 'BR-MODE',
        fullName: 'Battle Royale - Purgatory',
        description: '50 players battle in the desert wasteland',
        icon: Crown,
        players: '50 Players',
        duration: '15-20 min',
        features: ['Sanitarium Siege', 'Forge Battles', 'Downtown Chaos']
      },
      {
        id: 'cs-purgatory',
        name: 'CS-MODE',
        fullName: 'Clash Squad - Purgatory',
        description: '4v4 intense desert combat',
        icon: Users,
        players: '8 Players',
        duration: '8-12 min',
        features: ['Desert Storm', 'Outpost Defense', 'Canyon Wars']
      },
      {
        id: 'lonewolf-purgatory',
        name: 'LONE WOLF-MODE',
        fullName: 'Lone Wolf - Purgatory',
        description: 'Survive alone in the harsh desert',
        icon: Target,
        players: '1 Player',
        duration: '10-15 min',
        features: ['Desert Survival', 'Scavenger Hunt', 'Extreme Heat']
      }
    ],
    kalahari: [
      {
        id: 'br-kalahari',
        name: 'BR-MODE',
        fullName: 'Battle Royale - Kalahari',
        description: '50 players explore the African savanna',
        icon: Crown,
        players: '50 Players',
        duration: '15-20 min',
        features: ['Safari Adventure', 'Wildlife Encounters', 'Tribal Zones']
      },
      {
        id: 'cs-kalahari',
        name: 'CS-MODE',
        fullName: 'Clash Squad - Kalahari',
        description: '4v4 battles in the wild savanna',
        icon: Users,
        players: '8 Players',
        duration: '8-12 min',
        features: ['Watering Hole', 'Acacia Grove', 'Ranger Station']
      },
      {
        id: 'lonewolf-kalahari',
        name: 'LONE WOLF-MODE',
        fullName: 'Lone Wolf - Kalahari',
        description: 'Solo adventure in the African wilderness',
        icon: Target,
        players: '1 Player',
        duration: '10-15 min',
        features: ['Animal Tracking', 'Resource Gathering', 'Night Survival']
      }
    ],
    alpine: [
      {
        id: 'br-alpine',
        name: 'BR-MODE',
        fullName: 'Battle Royale - Alpine',
        description: '50 players face the frozen mountain challenge',
        icon: Crown,
        players: '50 Players',
        duration: '15-20 min',
        features: ['Avalanche Zone', 'Ice Cave Battles', 'Summit Assault']
      },
      {
        id: 'cs-alpine',
        name: 'CS-MODE',
        fullName: 'Clash Squad - Alpine',
        description: '4v4 tactical combat in snowy terrain',
        icon: Users,
        players: '8 Players',
        duration: '8-12 min',
        features: ['Frozen Lake', 'Mountain Base', 'Ski Lodge']
      },
      {
        id: 'lonewolf-alpine',
        name: 'LONE WOLF-MODE',
        fullName: 'Lone Wolf - Alpine',
        description: 'Survive alone in the deadly mountain cold',
        icon: Target,
        players: '1 Player',
        duration: '10-15 min',
        features: ['Extreme Cold', 'Ice Climbing', 'Blizzard Survival']
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gaming-dark">
      {/* Header */}
      <header className="bg-gradient-card border-b border-gaming-purple/30 p-6">
        <div className="container mx-auto">
          {/* User Info and Logout - Top Right */}
          <div className="flex justify-end items-center mb-4">
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
              <Gamepad2 className="h-10 w-10 text-gaming-purple" />
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gaming-purple via-gaming-cyan to-gaming-purple bg-clip-text text-transparent tracking-wider">
                MANA GAMING
              </h1>
              <Gamepad2 className="h-10 w-10 text-gaming-cyan" />
            </div>
            <p className="text-lg text-muted-foreground font-medium">
              Ultimate Battle Arena
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {selectedMap ? (
          // Map Detail View with Modes
          <div className="space-y-6">
            {/* Back Button */}
            <Button 
              variant="outline" 
              onClick={() => setSelectedMap(null)}
              className="mb-4"
            >
              ← Back to Maps
            </Button>

            {/* Map Detail Layout */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Side - Game Modes */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-card border border-gaming-purple/30 rounded-lg p-6 sticky top-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Crown className="h-6 w-6 text-gaming-purple" />
                    <h3 className="text-2xl font-bold text-foreground">GAME MODES</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {mapModes[selectedMap as keyof typeof mapModes]?.map((mode) => {
                      const IconComponent = mode.icon;
                      return (
                        <Card 
                          key={mode.id}
                          className="bg-gaming-dark/50 border-gaming-cyan/30 hover:border-gaming-cyan hover:shadow-glow-cyan transition-all duration-300 cursor-pointer group"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-gaming-purple to-gaming-cyan rounded-full blur-sm opacity-30 group-hover:opacity-60 transition-all duration-300"></div>
                                <div className="relative bg-gaming-dark rounded-full p-2">
                                  <IconComponent className="h-6 w-6 text-gaming-cyan" />
                                </div>
                              </div>
                              <div className="flex-1">
                                <h4 className="text-lg font-bold text-gaming-cyan group-hover:text-white transition-colors">
                                  {mode.name}
                                </h4>
                                <p className="text-xs text-muted-foreground">{mode.fullName}</p>
                              </div>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-3">{mode.description}</p>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Players:</span>
                                <span className="font-semibold text-gaming-cyan">{mode.players}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Duration:</span>
                                <span className="font-semibold text-foreground">{mode.duration}</span>
                              </div>
                            </div>

                            <div className="mb-4">
                              <p className="text-xs text-muted-foreground mb-2 font-semibold">Mode Features:</p>
                              <div className="flex flex-wrap gap-1">
                                {mode.features.map((feature, idx) => (
                                  <Badge 
                                    key={idx}
                                    variant="outline"
                                    className="text-xs bg-gaming-purple/10 border-gaming-purple/30 text-gaming-purple"
                                  >
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <Button 
                              variant="default"
                              size="sm"
                              className="w-full bg-gradient-to-r from-gaming-purple to-gaming-cyan hover:from-gaming-cyan hover:to-gaming-purple text-white font-bold"
                              onClick={() => {
                                setSelectedMode(mode.id);
                                setShowModeModal(true);
                              }}
                            >
                              <Target className="h-4 w-4 mr-2" />
                              JOIN {mode.name}
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Side - Map Information */}
              <div className="lg:col-span-2">
                {(() => {
                  const currentMap = freeFireMaps.find(map => map.id === selectedMap);
                  const MapIcon = currentMap?.icon || Map;
                  return (
                    <Card className="bg-gradient-card border-gaming-purple/30 h-fit">
                      <CardHeader className="text-center">
                        <div className="relative mb-6">
                          <div className="absolute inset-0 bg-gradient-to-r from-gaming-purple via-gaming-cyan to-yellow-400 rounded-full blur-xl opacity-30"></div>
                          <div className="relative bg-gaming-dark/80 rounded-full p-8 mx-auto w-fit">
                            <MapIcon className="h-16 w-16 text-gaming-cyan" />
                          </div>
                        </div>
                        <CardTitle className="text-4xl font-black bg-gradient-to-r from-gaming-purple to-gaming-cyan bg-clip-text text-transparent mb-2">
                          {currentMap?.name}
                        </CardTitle>
                        <CardDescription className="text-lg text-muted-foreground">
                          {currentMap?.description}
                        </CardDescription>
                        <div className="flex justify-center space-x-3 mt-4">
                          <Badge 
                            variant="secondary" 
                            className="bg-gaming-cyan/20 text-gaming-cyan text-sm px-4 py-2"
                          >
                            {currentMap?.size}
                          </Badge>
                          <Badge 
                            variant="secondary" 
                            className="bg-gaming-purple/20 text-gaming-purple text-sm px-4 py-2"
                          >
                            {currentMap?.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-6">
                        <div>
                          <h4 className="text-xl font-bold text-foreground mb-3 flex items-center">
                            <MapPin className="h-5 w-5 text-gaming-cyan mr-2" />
                            Map Theme: {currentMap?.theme}
                          </h4>
                          <p className="text-muted-foreground">
                            Experience the unique environment and challenges of {currentMap?.name}. Each location offers 
                            strategic advantages and exciting combat opportunities.
                          </p>
                        </div>

                        <div>
                          <h4 className="text-xl font-bold text-foreground mb-3">Key Locations</h4>
                          <div className="grid gap-3">
                            {currentMap?.features.map((feature, idx) => (
                              <div 
                                key={idx}
                                className="bg-gaming-dark/50 border border-gaming-purple/20 rounded-lg p-3 hover:border-gaming-cyan/50 transition-all duration-300"
                              >
                                <Badge 
                                  variant="outline"
                                  className="bg-gaming-purple/10 border-gaming-purple/30 text-gaming-purple"
                                >
                                  {feature}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-gaming-dark/30 border border-gaming-cyan/20 rounded-lg p-4">
                          <h4 className="text-lg font-bold text-gaming-cyan mb-2">Battle Statistics</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Max Players:</span>
                              <span className="font-semibold text-foreground">{currentMap?.size}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Map Type:</span>
                              <span className="font-semibold text-foreground">{currentMap?.theme}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Status:</span>
                              <span className="font-semibold text-gaming-cyan">{currentMap?.status}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })()}
              </div>
            </div>
          </div>
        ) : !selectedGame ? (
          <div className="space-y-8">
            {/* Games Section */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Gamepad2 className="h-8 w-8 text-gaming-purple" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gaming-purple to-gaming-cyan bg-clip-text text-transparent">
                  SELECT YOUR GAME
                </h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {games.map((game) => {
                  const IconComponent = game.icon;
                  return (
                    <Card 
                      key={game.id}
                      className="bg-gradient-card border-gaming-purple/30 hover:border-gaming-purple hover:shadow-glow-primary transition-all duration-300 cursor-pointer animate-slide-up"
                      onClick={() => setSelectedGame(game.id)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <IconComponent className="h-8 w-8 text-gaming-purple" />
                            <div>
                              <CardTitle className="text-xl text-foreground">{game.name}</CardTitle>
                              <CardDescription>{game.description}</CardDescription>
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-gaming-purple/20 text-gaming-purple">
                            {game.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Active Players</span>
                          <span className="font-semibold text-gaming-cyan">{game.players}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Free Fire Maps */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Map className="h-8 w-8 text-gaming-cyan" />
                <h3 className="text-3xl font-bold bg-gradient-to-r from-gaming-purple to-gaming-cyan bg-clip-text text-transparent">
                  FREE FIRE MAPS
                </h3>
                <Zap className="h-6 w-6 text-yellow-400 animate-pulse" />
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {freeFireMaps.map((map, index) => {
                  const IconComponent = map.icon;
                  return (
                    <Card 
                      key={map.id} 
                      className="bg-gradient-card border-gaming-purple/30 hover:border-gaming-cyan hover:shadow-glow-primary transition-all duration-300 animate-slide-up group cursor-pointer h-full flex flex-col"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardHeader className="text-center pb-2">
                        <div className="relative mb-3">
                          <div className="absolute inset-0 bg-gradient-to-r from-gaming-purple to-gaming-cyan rounded-full blur-lg opacity-30 group-hover:opacity-60 transition-all duration-300"></div>
                          <div className="relative bg-gaming-dark/80 rounded-full p-4 mx-auto w-fit">
                            <IconComponent className="h-8 w-8 text-gaming-cyan group-hover:text-white transition-colors duration-300" />
                          </div>
                        </div>
                        <CardTitle className="text-xl font-black text-gaming-cyan group-hover:text-white transition-colors">
                          {map.name}
                        </CardTitle>
                        <div className="flex justify-center space-x-2">
                          <Badge 
                            variant="secondary" 
                            className={map.status === 'Featured' ? 'bg-gaming-purple/30 text-gaming-purple' : 'bg-gaming-cyan/20 text-gaming-cyan'}
                          >
                            {map.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2 space-y-3 flex-1 flex flex-col">
                        <p className="text-sm text-muted-foreground text-center">{map.description}</p>
                        
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Players:</span>
                            <span className="font-semibold text-gaming-cyan">{map.size}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Theme:</span>
                            <span className="font-semibold text-foreground">{map.theme}</span>
                          </div>
                        </div>

                        <div className="pt-2 flex-1">
                          <p className="text-xs text-muted-foreground mb-2 font-semibold">Key Locations:</p>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {map.features.map((feature, idx) => (
                              <Badge 
                                key={idx}
                                variant="outline"
                                className="text-xs bg-gaming-dark/50 border-gaming-purple/30 text-gaming-purple hover:bg-gaming-purple/20"
                              >
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="mt-auto pt-4">
                          <Button 
                            variant="default"
                            size="sm"
                            className="w-full bg-gradient-to-r from-gaming-purple to-gaming-cyan hover:from-gaming-cyan hover:to-gaming-purple text-white font-bold border-0 shadow-lg hover:shadow-glow-primary transition-all duration-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMap(map.id);
                            }}
                          >
                            <Target className="h-4 w-4 mr-2" />
                            DROP HERE
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        ) : selectedGame ? (
          <div className="space-y-6">
            {/* Back Button */}
            <Button 
              variant="outline" 
              onClick={() => setSelectedGame(null)}
              className="mb-4"
            >
              ← Back to Games
            </Button>

            {/* Free Fire Modes */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Free Fire</h2>
              <p className="text-muted-foreground mb-6">Choose your battle mode</p>
              
              <div className="grid gap-6 md:grid-cols-3">
                {freeFireModes.map((mode) => {
                  const IconComponent = mode.icon;
                  return (
                    <Card 
                      key={mode.id}
                      className="bg-gradient-card border-gaming-purple/30 hover:border-gaming-purple hover:shadow-glow-primary transition-all duration-300 animate-slide-up"
                    >
                      <CardHeader className="text-center">
                        <IconComponent className="h-12 w-12 text-gaming-purple mx-auto mb-2" />
                        <CardTitle className="text-2xl text-foreground">{mode.name}</CardTitle>
                        <CardDescription className="text-lg font-semibold text-gaming-cyan">
                          {mode.fullName}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-center space-y-4">
                        <p className="text-muted-foreground">{mode.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Players:</span>
                            <span className="text-sm font-semibold text-foreground">{mode.players}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Duration:</span>
                            <span className="text-sm font-semibold text-foreground">{mode.duration}</span>
                          </div>
                        </div>

                        <Button 
                          variant="game-mode" 
                          className="w-full"
                        >
                          Join Match
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-center text-muted-foreground">Please select a game to continue.</p>
          </div>
        )}
      </div>

      {/* Match Registration Modal */}
      <Dialog open={showModeModal} onOpenChange={setShowModeModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gaming-dark border-gaming-purple/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gaming-purple to-gaming-cyan bg-clip-text text-transparent">
              {selectedMode?.toUpperCase()} MODE REGISTRATION
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {!selectedTeamMode ? (
              // Step 1: Team Mode Selection
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">Choose Team Mode</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {(() => {
                    // Get the game mode type from selectedMode (br, cs, lonewolf)
                    const modeType = selectedMode?.split('-')[0] as 'br' | 'cs' | 'lonewolf';
                    const availableTeamModes = teamModes[modeType] || [];
                    
                    return availableTeamModes.map((mode) => {
                      const IconComponent = mode.icon;
                      return (
                        <Card 
                          key={mode.id}
                          className="bg-gradient-card border-gaming-purple/30 hover:border-gaming-cyan hover:shadow-glow-primary transition-all duration-300 cursor-pointer group"
                          onClick={() => setSelectedTeamMode(mode.id)}
                        >
                          <CardHeader className="text-center">
                            <IconComponent className="h-12 w-12 text-gaming-purple mx-auto mb-2" />
                            <CardTitle className="text-xl text-gaming-cyan group-hover:text-white transition-colors">
                              {mode.name}
                            </CardTitle>
                            <CardDescription className="text-gaming-purple">
                              {mode.players}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="text-center">
                            <p className="text-sm text-muted-foreground">{mode.description}</p>
                            <ChevronRight className="h-5 w-5 text-gaming-cyan mx-auto mt-2" />
                          </CardContent>
                        </Card>
                      );
                    });
                  })()}
                </div>
              </div>
            ) : !selectedTimeSlot ? (
              // Step 2: Time Slot Selection
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-foreground">Select Time Slot</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedTeamMode(null)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </div>
                
                <div className="bg-gaming-card/50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong className="text-gaming-cyan">Schedule:</strong> 10:00 AM - 10:00 PM
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-gaming-cyan">Format:</strong> 3 matches every hour with 5-minute breaks
                  </p>
                </div>

                <div className="grid gap-3 max-h-96 overflow-y-auto">
                  {(() => {
                    // Generate dynamic time slots based on selected mode and team
                    const modeType = selectedMode?.split('-')[0];
                    const dynamicTimeSlots = generateTimeSlots(modeType, selectedTeamMode || undefined);
                    
                    return dynamicTimeSlots.map((slot) => (
                      <Card 
                        key={slot.id}
                        className="bg-gradient-card border-gaming-purple/30 hover:border-gaming-cyan cursor-pointer transition-all duration-300"
                        onClick={() => setSelectedTimeSlot(slot.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="bg-gaming-purple/20 rounded-lg p-3">
                                <Clock className="h-5 w-5 text-gaming-purple" />
                              </div>
                              <div>
                                <h4 className="font-bold text-foreground">{slot.displayTime}</h4>
                                <p className="text-sm text-muted-foreground">Match {slot.match} of the hour</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gaming-cyan">
                                {slot.registeredPlayers}/{slot.maxPlayers} players
                              </p>
                              <div className="w-20 bg-gaming-dark rounded-full h-2 mt-1">
                                <div 
                                  className="bg-gradient-to-r from-gaming-purple to-gaming-cyan h-2 rounded-full"
                                  style={{ width: `${(slot.registeredPlayers / slot.maxPlayers) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gaming-cyan" />
                          </div>
                        </CardContent>
                      </Card>
                    ));
                  })()}
                </div>
              </div>
            ) : (
              // Step 3: Entry Fee Selection
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-foreground">Choose Entry Fee</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedTimeSlot(null)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </div>

                {(() => {
                  const modeType = selectedMode?.split('-')[0] as 'br' | 'cs' | 'lonewolf';
                  const availableTeamModes = teamModes[modeType] || [];
                  const selectedTeam = availableTeamModes.find(mode => mode.id === selectedTeamMode);
                  
                  // Generate dynamic time slots to find the selected one
                  const dynamicTimeSlots = generateTimeSlots(modeType, selectedTeamMode || undefined);
                  const selectedSlot = dynamicTimeSlots.find(slot => slot.id === selectedTimeSlot);
                  
                  return (
                    <div className="bg-gaming-card/50 rounded-lg p-4 mb-6">
                      <h4 className="font-bold text-gaming-cyan mb-2">Match Details</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Mode:</span>
                          <span className="ml-2 text-foreground font-semibold">{selectedMode?.toUpperCase()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Team:</span>
                          <span className="ml-2 text-foreground font-semibold">{selectedTeam?.name}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Time:</span>
                          <span className="ml-2 text-foreground font-semibold">{selectedSlot?.displayTime}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Players:</span>
                          <span className="ml-2 text-foreground font-semibold">{selectedSlot?.registeredPlayers}/{selectedSlot?.maxPlayers}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {entryFees.map((fee) => (
                    <Card 
                      key={fee.id}
                      className="bg-gradient-card border-gaming-purple/30 hover:border-gaming-cyan hover:shadow-glow-primary transition-all duration-300 cursor-pointer group"
                    >
                      <CardHeader className="text-center">
                        <div className="bg-gaming-purple/20 rounded-full p-4 mx-auto w-fit mb-2">
                          <Crown className="h-8 w-8 text-gaming-purple" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gaming-cyan">
                          ₹{fee.amount}
                        </CardTitle>
                        <CardDescription className="text-gaming-purple">
                          {fee.id.charAt(0).toUpperCase() + fee.id.slice(1)} Tier
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-center space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Prize Pool:</span>
                            <span className="text-sm font-bold text-green-400">{fee.prize}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Available Slots:</span>
                            <span className="text-sm font-semibold text-gaming-cyan">{fee.slots}</span>
                          </div>
                        </div>
                        
                        <Button 
                          variant="default"
                          className="w-full bg-gradient-to-r from-gaming-purple to-gaming-cyan hover:from-gaming-cyan hover:to-gaming-purple text-white font-bold"
                          onClick={() => {
                            // Handle registration logic here
                            alert(`Registered for ₹${fee.amount} slot!`);
                            setShowModeModal(false);
                            setSelectedTeamMode(null);
                            setSelectedTimeSlot(null);
                            setSelectedMode(null);
                          }}
                        >
                          <Target className="h-4 w-4 mr-2" />
                          REGISTER ₹{fee.amount}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating Profile Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="h-16 w-16 rounded-full bg-gradient-to-r from-gaming-purple to-gaming-cyan hover:from-gaming-cyan hover:to-gaming-purple shadow-xl hover:shadow-glow-primary transition-all duration-300 border-2 border-gaming-purple/30"
          onClick={() => setShowProfileModal(true)}
        >
          <User className="h-8 w-8 text-white" />
        </Button>
      </div>

      {/* User Profile Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gaming-dark border-gaming-purple/30">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-gaming-purple to-gaming-cyan bg-clip-text text-transparent text-center">
              USER PROFILE
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-8">
            {/* Profile Header */}
            <div className="bg-gradient-card border border-gaming-purple/30 rounded-lg p-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-gaming-purple to-gaming-cyan rounded-full blur-lg opacity-50"></div>
                  <div className="relative bg-gaming-dark/80 rounded-full p-6">
                    <User className="h-16 w-16 text-gaming-cyan" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-3xl font-bold text-foreground">{userProfile.name}</h2>
                    <Badge className="bg-gaming-purple/20 text-gaming-purple border-gaming-purple/30">
                      Level {userProfile.level}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Free Fire UID</p>
                      <p className="text-lg font-bold text-gaming-cyan">{userProfile.freeFireUID}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Rank</p>
                      <div className="flex items-center space-x-2">
                        <Crown className="h-5 w-5 text-yellow-400" />
                        <p className="text-lg font-bold text-yellow-400">{userProfile.rank}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">{userProfile.bio}</p>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="bg-gradient-card border-gaming-purple/30">
                <CardContent className="p-4 text-center">
                  <Trophy className="h-8 w-8 text-gaming-cyan mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{userProfile.wins}</p>
                  <p className="text-sm text-muted-foreground">Total Wins</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-card border-gaming-purple/30">
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 text-red-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{userProfile.kills}</p>
                  <p className="text-sm text-muted-foreground">Total Kills</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-card border-gaming-purple/30">
                <CardContent className="p-4 text-center">
                  <Gamepad2 className="h-8 w-8 text-gaming-purple mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{userProfile.matches}</p>
                  <p className="text-sm text-muted-foreground">Matches Played</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-card border-gaming-purple/30">
                <CardContent className="p-4 text-center">
                  <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{Math.round((userProfile.wins / userProfile.matches) * 100)}%</p>
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Wallet Balance Section */}
            <div className="bg-gradient-to-r from-gaming-purple/20 to-gaming-cyan/20 border border-gaming-purple/30 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Wallet className="h-8 w-8 text-gaming-cyan" />
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Wallet Balance</h3>
                    <p className="text-sm text-muted-foreground">Available funds for tournaments</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gaming-cyan">₹{userProfile.walletBalance}</p>
                  <p className="text-sm text-green-400">Total Earnings: ₹{userProfile.totalEarnings}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* First Row - Match History and Registered */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="flex flex-col items-center space-y-2 h-24 border-gaming-purple/30 text-gaming-purple hover:bg-gaming-purple/10"
                  onClick={() => setShowMatchHistoryModal(true)}
                >
                  <History className="h-8 w-8" />
                  <span className="text-base font-medium">Match History</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex flex-col items-center space-y-2 h-24 border-gaming-cyan/30 text-gaming-cyan hover:bg-gaming-cyan/10"
                  onClick={() => setShowRegisteredMatchesModal(true)}
                >
                  <Clock className="h-8 w-8" />
                  <span className="text-base font-medium">Registered</span>
                </Button>
              </div>

              {/* Second Row - Deposit and Withdraw */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="flex flex-col items-center space-y-2 h-24 border-green-500/30 text-green-400 hover:bg-green-500/10 hover:text-green-300"
                  onClick={() => {
                    // Handle deposit logic
                    alert('Deposit functionality coming soon!');
                  }}
                >
                  <TrendingUp className="h-8 w-8" />
                  <span className="text-base font-medium">Deposit</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex flex-col items-center space-y-2 h-24 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300"
                  onClick={() => {
                    // Handle withdraw logic
                    alert('Withdraw functionality coming soon!');
                  }}
                >
                  <DollarSign className="h-8 w-8" />
                  <span className="text-base font-medium">Withdraw</span>
                </Button>
              </div>

              {/* Third Row - Help Center (Centered) */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  className="flex flex-col items-center space-y-2 h-24 w-64 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                  onClick={() => {
                    // Handle help center logic
                    alert('Help Center: Contact support at support@managaming.com or call +91-9876543210');
                  }}
                >
                  <HelpCircle className="h-8 w-8" />
                  <span className="text-base font-medium">Help Center</span>
                </Button>
              </div>
            </div>

          </div>
        </DialogContent>
      </Dialog>

      {/* Match History Modal */}
      <Dialog open={showMatchHistoryModal} onOpenChange={setShowMatchHistoryModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gaming-dark border-gaming-purple/30">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-gaming-purple to-gaming-cyan bg-clip-text text-transparent text-center">
              MATCH HISTORY
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <History className="h-8 w-8 text-gaming-cyan" />
              <h3 className="text-2xl font-bold text-foreground">Recent Matches</h3>
            </div>
            
            <div className="space-y-4">
              {recentMatches.map((match) => (
                <Card key={match.id} className="bg-gradient-card border-gaming-purple/30">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                          match.result === 'Victory' ? 'bg-green-500/20 text-green-400' :
                          match.result === 'Defeat' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {match.result}
                        </div>
                        <Badge variant="outline" className="bg-gaming-purple/10 border-gaming-purple/30 text-gaming-purple">
                          {match.mode}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{match.time}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Map</p>
                        <p className="text-foreground font-semibold">{match.map}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Position</p>
                        <p className="text-gaming-cyan font-semibold">#{match.position}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Kills</p>
                        <p className="text-red-400 font-semibold">{match.kills}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Prize</p>
                        <p className="text-green-400 font-semibold">{match.prize}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Registered Matches Modal */}
      <Dialog open={showRegisteredMatchesModal} onOpenChange={setShowRegisteredMatchesModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gaming-dark border-gaming-purple/30">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-gaming-purple to-gaming-cyan bg-clip-text text-transparent text-center">
              REGISTERED MATCHES
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Clock className="h-8 w-8 text-gaming-purple" />
              <h3 className="text-2xl font-bold text-foreground">Upcoming Matches</h3>
            </div>
            
            <div className="space-y-4">
              {registeredMatches.map((match) => (
                <Card key={match.id} className="bg-gradient-card border-gaming-purple/30">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className="bg-gaming-cyan/10 border-gaming-cyan/30 text-gaming-cyan">
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
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Map</p>
                        <p className="text-foreground font-semibold">{match.map}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Time</p>
                        <p className="text-gaming-cyan font-semibold">{match.time}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Team</p>
                        <p className="text-gaming-purple font-semibold">{match.team}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Entry Fee</p>
                        <p className="text-red-400 font-semibold">{match.entry}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gaming-purple/20">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-muted-foreground text-sm">Prize Pool</p>
                          <p className="text-green-400 font-bold text-lg">{match.prize}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          Cancel Registration
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameDashboard;