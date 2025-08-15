import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { ID } from 'appwrite';
import { Gamepad2, Target, Users, Crown, Clock, LogOut, Map, MapPin, Zap, Flame, ArrowLeft, ChevronRight, User, Trophy, History, Settings, Star, Edit, CreditCard, Wallet, HelpCircle, DollarSign, TrendingUp, Shield, Bell, BellRing, AlertTriangle, ArrowRight } from "lucide-react";

interface GameDashboardProps {
  username: string;
  onLogout: () => void;
}

const GameDashboard = ({ username, onLogout }: GameDashboardProps) => {
  const { user, deductMatchEntry, getWalletBalance } = useAuth();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedMap, setSelectedMap] = useState<string | null>(null);
  const [showModeModal, setShowModeModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState<string>('overview');
  const [showMatchHistoryModal, setShowMatchHistoryModal] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isRegistering, setIsRegistering] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState<any[]>([]);
  const [showInsufficientCreditsModal, setShowInsufficientCreditsModal] = useState(false);
  const [insufficientCreditsData, setInsufficientCreditsData] = useState<{
    required: number;
    available: number;
    shortfall: number;
    matchDetails: string;
  } | null>(null);

  // Fetch wallet balance when component mounts or user changes
  useEffect(() => {
    const fetchWalletData = async () => {
      if (user?.userData?.wallet?.balance !== undefined) {
        setWalletBalance(user.userData.wallet.balance);
        setTransactionHistory(user.userData.wallet.transactions || []);
      } else {
        // Fallback to API call if wallet data not available in user object
        try {
          const balance = await getWalletBalance();
          setWalletBalance(balance);
          // Note: Transaction history would need a separate API call in the auth service
          setTransactionHistory([]);
        } catch (error) {
          console.error('Error fetching wallet data:', error);
          setWalletBalance(0);
          setTransactionHistory([]);
        }
      }
    };

    fetchWalletData();
  }, [user, getWalletBalance]);
  const [showRegisteredMatchesModal, setShowRegisteredMatchesModal] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [selectedTeamMode, setSelectedTeamMode] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  // Notifications - real notifications will be loaded from backend
  const [notifications, setNotifications] = useState<any[]>([]);

  // Admin user detection - only these usernames can access admin panel
  const ADMIN_USERS = ['admin', 'superadmin', 'moderator'];
  const isAdminUser = ADMIN_USERS.includes(username.toLowerCase());

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleDismissNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const games = [
    {
      id: 'freefire',
      name: 'Free Fire',
      icon: Target,
      description: 'Battle Royale Mayhem',
      players: '2.1M',
      status: 'Live'
    },
    {
      id: 'pubg',
      name: 'PUBG Mobile',
      icon: Crown,
      description: 'Tactical Battle Arena',
      players: '1.8M',
      status: 'Coming Soon'
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
    { time: '14:30', mode: 'BR', prize: '5000 Credits' },
    { time: '16:00', mode: 'CS', prize: '3000 Credits' },
    { time: '18:30', mode: 'LONEWOLF', prize: '2000 Credits' },
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
    }
  ];

  const pubgMaps = [
    {
      id: 'erangel',
      name: 'ERANGEL',
      description: 'Classic PUBG battleground with diverse terrain',
      icon: Map,
      size: '100 Players',
      theme: 'Post-Soviet',
      features: ['School', 'Military Base', 'Pochinki'],
      status: 'Coming Soon'
    },
    {
      id: 'sanhok',
      name: 'SANHOK',
      description: 'Tropical paradise with intense close combat',
      icon: Target,
      size: '64 Players',
      theme: 'Tropical Jungle',
      features: ['Bootcamp', 'Paradise Resort', 'Ruins'],
      status: 'Coming Soon'
    },
    {
      id: 'miramar',
      name: 'MIRAMAR',
      description: 'Desert map with long-range combat focus',
      icon: Flame,
      size: '100 Players',
      theme: 'Desert Warfare',
      features: ['Pecado', 'Hacienda', 'Prison'],
      status: 'Coming Soon'
    }
  ];

  // Function to get maps based on selected game
  const getCurrentGameMaps = () => {
    switch (selectedGame) {
      case 'freefire':
        return freeFireMaps;
      case 'pubg':
        return pubgMaps;
      default:
        return [];
    }
  };

  // Get current game name
  const getCurrentGameName = () => {
    switch (selectedGame) {
      case 'freefire':
        return 'FREE FIRE';
      case 'pubg':
        return 'PUBG MOBILE';
      default:
        return '';
    }
  };

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
          registeredPlayers: 0, // Real data - start with 0 players
          maxPlayers
        });
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const entryFees = [
    { id: 'basic', amount: 10, prize: '50 Credits', slots: 50 },
    { id: 'silver', amount: 30, prize: '150 Credits', slots: 30 },
    { id: 'gold', amount: 50, prize: '300 Credits', slots: 20 },
    { id: 'diamond', amount: 100, prize: '600 Credits', slots: 10 }
  ];

  // User Profile Data - Using real data from authentication
  const userProfile = {
    name: username,
    freeFireUID: user?.userData?.username || "Not Set",
    bio: "Gaming enthusiast", // Static for now, can be made editable later
    level: user?.userData?.gameStats?.experience ? Math.floor(user.userData.gameStats.experience / 100) + 1 : 1,
    rank: user?.userData?.gameStats?.rank || "Unranked",
    wins: user?.userData?.gameStats?.wins || 0,
    kills: user?.userData?.gameStats?.experience || 0, // Using experience as kills proxy for now
    matches: user?.userData?.gameStats?.gamesPlayed || 0,
    walletBalance: walletBalance,
    totalEarnings: user?.userData?.wallet?.totalEarnings || 0
  };

  // Recent matches - will be populated from real match history when implemented
  const recentMatches: any[] = [];

  // Registered matches - will be populated from real data when implemented
  const registeredMatches: any[] = [];

  const mapModes = {
    // Free Fire Maps Modes
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
    // PUBG Maps Modes
    erangel: [
      {
        id: 'classic-erangel',
        name: 'CLASSIC MODE',
        fullName: 'Classic Battle Royale - Erangel',
        description: '100 players battle in the original PUBG battleground',
        icon: Crown,
        players: '100 Players',
        duration: '25-35 min',
        features: ['School Battles', 'Military Base', 'Bridge Warfare']
      },
      {
        id: 'arcade-erangel',
        name: 'ARCADE MODE',
        fullName: 'Quick Match - Erangel',
        description: 'Fast-paced 64 player battles',
        icon: Target,
        players: '64 Players',
        duration: '15-20 min',
        features: ['Quick Loot', 'Fast Zone', 'Action Packed']
      }
    ],
    sanhok: [
      {
        id: 'classic-sanhok',
        name: 'CLASSIC MODE',
        fullName: 'Classic Battle Royale - Sanhok',
        description: '64 players in intense jungle combat',
        icon: Crown,
        players: '64 Players',
        duration: '20-25 min',
        features: ['Bootcamp Drop', 'Cave Systems', 'River Combat']
      },
      {
        id: 'arcade-sanhok',
        name: 'ARCADE MODE',
        fullName: 'Quick Match - Sanhok',
        description: 'Fast jungle warfare',
        icon: Target,
        players: '40 Players',
        duration: '12-15 min',
        features: ['Dense Combat', 'Quick Rotations', 'Close Quarters']
      }
    ],
    miramar: [
      {
        id: 'classic-miramar',
        name: 'CLASSIC MODE',
        fullName: 'Classic Battle Royale - Miramar',
        description: '100 players in desert warfare',
        icon: Crown,
        players: '100 Players',
        duration: '25-35 min',
        features: ['Long Range Combat', 'Vehicle Focus', 'Desert Tactics']
      },
      {
        id: 'arcade-miramar',
        name: 'ARCADE MODE',
        fullName: 'Quick Match - Miramar',
        description: 'Fast desert combat',
        icon: Target,
        players: '64 Players',
        duration: '15-20 min',
        features: ['Sniper Battles', 'Vehicle Wars', 'Urban Combat']
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gaming-dark">
      {/* Header */}
      <header className="bg-gradient-card border-b border-gaming-purple/30 p-6">
        <div className="container mx-auto">
          {/* User Info and Notifications - Top Right */}
          <div className="flex justify-end items-center mb-4">
            {/* User Info and Notifications - Right Side */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Welcome back</p>
                <p className="font-semibold text-foreground">{username}</p>
              </div>
              {/* Only show Admin Panel button to admin users */}
              {isAdminUser && (
                <Button variant="outline" size="sm" asChild>
                  <a href="/admin" className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Admin Panel
                  </a>
                </Button>
              )}
              {/* Notification Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="relative">
                    {notifications.filter(n => !n.isRead).length > 0 ? (
                      <BellRing className="h-4 w-4" />
                    ) : (
                      <Bell className="h-4 w-4" />
                    )}
                    {notifications.filter(n => !n.isRead).length > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                        {notifications.filter(n => !n.isRead).length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
                  <div className="p-2">
                    <h3 className="font-semibold text-sm mb-2">Notifications</h3>
                    {notifications.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-4">No notifications</p>
                    ) : (
                      <div className="space-y-2">
                        {notifications.slice(0, 5).map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`p-2 rounded-md cursor-pointer hover:bg-gray-50 border-l-4 ${
                              notification.type === 'security' ? 'border-l-red-500' :
                              notification.type === 'maintenance' ? 'border-l-blue-500' :
                              notification.type === 'announcement' ? 'border-l-green-500' :
                              'border-l-yellow-500'
                            } ${!notification.isRead ? 'bg-blue-50' : 'bg-white'}`}
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="text-sm font-medium">{notification.title}</p>
                                <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{notification.timestamp}</p>
                              </div>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {notifications.length > 5 && (
                      <DropdownMenuSeparator />
                    )}
                    {notifications.length > 5 && (
                      <DropdownMenuItem className="text-center text-sm text-blue-600 cursor-pointer">
                        View all notifications
                      </DropdownMenuItem>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
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
                  const currentMap = getCurrentGameMaps().find(map => map.id === selectedMap);
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
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Game:</span>
                              <span className="font-semibold text-gaming-purple">{getCurrentGameName()}</span>
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
                      className={`bg-gradient-card border-gaming-purple/30 hover:border-gaming-purple hover:shadow-glow-primary transition-all duration-300 cursor-pointer animate-slide-up ${
                        game.status === 'Coming Soon' ? 'opacity-60' : ''
                      }`}
                      onClick={() => game.status === 'Live' ? setSelectedGame(game.id) : null}
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
                          <Badge 
                            variant="secondary" 
                            className={`${
                              game.status === 'Live' 
                                ? 'bg-gaming-purple/20 text-gaming-purple' 
                                : 'bg-yellow-500/20 text-yellow-500'
                            }`}
                          >
                            {game.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Active Players</span>
                          <span className="font-semibold text-gaming-cyan">{game.players}</span>
                        </div>
                        {game.status === 'Coming Soon' && (
                          <div className="mt-3 text-center">
                            <span className="text-sm text-yellow-500 font-medium">
                              🚀 Launching Soon!
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Instructions when no game is selected */}
            <div className="text-center py-12">
              <div className="bg-gradient-card border border-gaming-purple/30 rounded-lg p-8 max-w-2xl mx-auto">
                <Gamepad2 className="h-16 w-16 text-gaming-purple mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Welcome to Mana Gaming Arena!
                </h3>
                <p className="text-muted-foreground text-lg mb-4">
                  Select a game above to view available maps and start your battle experience.
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gaming-cyan">
                  <Zap className="h-4 w-4" />
                  <span>Maps will appear after game selection</span>
                </div>
              </div>
            </div>
          </div>
        ) : selectedGame ? (
          <div className="space-y-8">
            {/* Back Button */}
            <Button 
              variant="outline" 
              onClick={() => setSelectedGame(null)}
              className="mb-4"
            >
              ← Back to Games
            </Button>

            {/* Current Game Maps */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Map className="h-8 w-8 text-gaming-cyan" />
                <h3 className="text-3xl font-bold bg-gradient-to-r from-gaming-purple to-gaming-cyan bg-clip-text text-transparent">
                  {getCurrentGameName()} MAPS
                </h3>
                <Zap className="h-6 w-6 text-yellow-400 animate-pulse" />
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {getCurrentGameMaps().map((map, index) => {
                  const IconComponent = map.icon;
                  return (
                    <Card 
                      key={map.id} 
                      className={`bg-gradient-card border-gaming-purple/30 hover:border-gaming-cyan hover:shadow-glow-primary transition-all duration-300 animate-slide-up group cursor-pointer h-full flex flex-col ${
                        map.status === 'Coming Soon' ? 'opacity-60' : ''
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => map.status === 'Active' ? setSelectedMap(map.id) : null}
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
                            className={map.status === 'Active' ? 'bg-gaming-cyan/20 text-gaming-cyan' : 'bg-yellow-500/20 text-yellow-500'}
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
                            className={`w-full bg-gradient-to-r from-gaming-purple to-gaming-cyan hover:from-gaming-cyan hover:to-gaming-purple text-white font-bold border-0 shadow-lg hover:shadow-glow-primary transition-all duration-300 ${
                              map.status === 'Coming Soon' ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (map.status === 'Active') {
                                setSelectedMap(map.id);
                              }
                            }}
                            disabled={map.status === 'Coming Soon'}
                          >
                            <Target className="h-4 w-4 mr-2" />
                            {map.status === 'Coming Soon' ? 'COMING SOON' : 'DROP HERE'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {getCurrentGameMaps().length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-gradient-card border border-gaming-purple/30 rounded-lg p-8 max-w-2xl mx-auto">
                    <Map className="h-16 w-16 text-gaming-purple mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                      No Maps Available
                    </h3>
                    <p className="text-muted-foreground text-lg">
                      Maps for {getCurrentGameName()} are coming soon!
                    </p>
                  </div>
                </div>
              )}
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
        <DialogContent className="max-w-7xl w-[95vw] max-h-[90vh] overflow-y-auto bg-gaming-dark border-gaming-purple/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gaming-purple to-gaming-cyan bg-clip-text text-transparent">
              {selectedMode?.toUpperCase()} MODE REGISTRATION
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {!selectedTeamMode ? (
              // Step 1: Team Mode Selection
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4 text-center">Choose Team Mode</h3>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
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
                          <CardHeader className="text-center pb-4">
                            <IconComponent className="h-12 w-12 text-gaming-purple mx-auto mb-3" />
                            <CardTitle className="text-xl text-gaming-cyan group-hover:text-white transition-colors mb-2">
                              {mode.name}
                            </CardTitle>
                            <CardDescription className="text-gaming-purple font-semibold text-base">
                              {mode.players}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="text-center pt-0">
                            <p className="text-sm text-muted-foreground mb-3">{mode.description}</p>
                            <ChevronRight className="h-5 w-5 text-gaming-cyan mx-auto" />
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

                <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 max-h-96 overflow-y-auto">
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
                  <h3 className="text-xl font-bold text-foreground">Choose Entry Credits</h3>
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
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {entryFees.map((fee) => (
                    <Card 
                      key={fee.id}
                      className="relative bg-gradient-to-br from-gaming-dark/80 via-slate-900/60 to-gaming-card/80 border-2 border-gaming-purple/30 hover:border-gaming-cyan/60 hover:shadow-2xl hover:shadow-gaming-cyan/20 transition-all duration-500 cursor-pointer group hover:scale-105 backdrop-blur-sm overflow-hidden"
                    >
                      {/* Glowing background effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gaming-purple/10 via-gaming-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                      
                      {/* Animated border glow */}
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-gaming-purple via-gaming-cyan to-gaming-purple opacity-0 group-hover:opacity-20 blur-sm transition-all duration-500"></div>
                      
                      <CardHeader className="relative text-center pb-3">
                        {/* Tier Icon with Animation */}
                        <div className="relative mx-auto w-fit mb-3">
                          <div className="absolute inset-0 bg-gradient-to-r from-gaming-purple to-gaming-cyan rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-all duration-500 scale-110"></div>
                          <div className="relative bg-gradient-to-br from-gaming-purple/30 to-gaming-cyan/30 rounded-full p-3 border-2 border-gaming-purple/50 group-hover:border-gaming-cyan/70 transition-all duration-300">
                            <Crown className="h-8 w-8 text-gaming-cyan group-hover:text-white transition-all duration-300 group-hover:scale-110" />
                          </div>
                        </div>
                        
                        {/* Credits Amount with Glow Effect */}
                        <div className="relative">
                          <CardTitle className="text-2xl font-black text-transparent bg-gradient-to-r from-gaming-cyan via-white to-gaming-purple bg-clip-text group-hover:from-white group-hover:via-gaming-cyan group-hover:to-white transition-all duration-500">
                            {fee.amount} CREDITS
                          </CardTitle>
                          <div className="absolute inset-0 text-2xl font-black text-gaming-cyan/20 blur-sm group-hover:text-white/30 transition-all duration-500">
                            {fee.amount} CREDITS
                          </div>
                        </div>
                        
                        {/* Tier Badge */}
                        <div className="mt-2">
                          <span className="inline-block px-3 py-1 bg-gradient-to-r from-gaming-purple/20 to-gaming-cyan/20 text-gaming-purple group-hover:text-gaming-cyan border border-gaming-purple/50 group-hover:border-gaming-cyan/50 rounded-full text-xs font-semibold uppercase tracking-wide transition-all duration-300">
                            {fee.id.charAt(0).toUpperCase() + fee.id.slice(1)} Tier
                          </span>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="relative text-center space-y-3 pb-4">
                        {/* Prize and Slots Info */}
                        <div className="space-y-2 bg-gaming-dark/40 rounded-lg p-3 border border-gaming-purple/20 group-hover:border-gaming-cyan/30 transition-all duration-300">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-300 font-medium flex items-center">
                              <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                              Prize Pool:
                            </span>
                            <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/30">
                              {fee.prize}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-300 font-medium flex items-center">
                              <span className="w-1.5 h-1.5 bg-gaming-cyan rounded-full mr-2 animate-pulse"></span>
                              Available Slots:
                            </span>
                            <span className="text-xs font-semibold text-gaming-cyan bg-gaming-cyan/10 px-2 py-0.5 rounded-full border border-gaming-cyan/30">
                              {fee.slots} Spots
                            </span>
                          </div>
                        </div>
                        
                        {/* Enhanced Register Button */}
                        <div className="relative">
                          <Button 
                            variant="default"
                            disabled={isRegistering || userProfile.walletBalance < fee.amount}
                            className="w-full h-10 bg-gradient-to-r from-gaming-purple via-gaming-cyan to-gaming-purple bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-bold text-sm tracking-wide uppercase border-2 border-gaming-cyan/50 hover:border-white/70 shadow-xl hover:shadow-2xl hover:shadow-gaming-cyan/30 transition-all duration-500 group-hover:scale-105 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={async () => {
                              // Check if user has sufficient credits
                              if (userProfile.walletBalance >= fee.amount) {
                                try {
                                  setIsRegistering(true);
                                  
                                  // Create match details for transaction tracking
                                  const matchDetails = {
                                    matchId: ID.unique(),
                                    mode: selectedMode || 'Battle Royale',
                                    map: getCurrentGameMaps().find(m => m.id === selectedMap)?.name || 'Unknown',
                                    time: timeSlots.find(slot => slot.id === selectedTimeSlot)?.displayTime || 'Unknown'
                                  };
                                  
                                  // Deduct credits from user's wallet
                                  await deductMatchEntry(fee.amount, matchDetails);
                                  
                                  // Update local wallet balance
                                  setWalletBalance(prev => prev - fee.amount);
                                  
                                  // Add transaction to local history
                                  const newTransaction = {
                                    id: ID.unique(),
                                    type: 'match_entry' as const,
                                    amount: fee.amount,
                                    description: `Match entry fee - ${matchDetails.mode} ${matchDetails.map} at ${matchDetails.time}`,
                                    date: new Date().toISOString(),
                                    matchId: matchDetails.matchId
                                  };
                                  setTransactionHistory(prev => [newTransaction, ...prev]);
                                  
                                  // Show success message
                                  alert(`✅ Successfully registered for ${fee.amount} Credits slot!\n\nCredits deducted: ${fee.amount}\nRemaining Credits: ${userProfile.walletBalance - fee.amount}\n\nMatch ID: ${matchDetails.matchId}\nGood luck in your match! 🎮`);
                                  
                                  // Reset form
                                  setShowModeModal(false);
                                  setSelectedTeamMode(null);
                                  setSelectedTimeSlot(null);
                                  setSelectedMode(null);
                                } catch (error: any) {
                                  console.error('Registration failed:', error);
                                  alert(`❌ Registration Failed!\n\n${error.message || 'Unable to process registration. Please try again.'}`);
                                } finally {
                                  setIsRegistering(false);
                                }
                              } else {
                                // Insufficient credits - show modal instead of alert
                                const shortfall = fee.amount - userProfile.walletBalance;
                                const currentMap = getCurrentGameMaps().find(m => m.id === selectedMap);
                                const currentSlot = timeSlots.find(slot => slot.id === selectedTimeSlot);
                                
                                setInsufficientCreditsData({
                                  required: fee.amount,
                                  available: userProfile.walletBalance,
                                  shortfall: shortfall,
                                  matchDetails: `${selectedMode || 'Match'} - ${currentMap?.name || 'Unknown Map'} at ${currentSlot?.displayTime || 'Unknown Time'}`
                                });
                                setShowInsufficientCreditsModal(true);
                              }
                            }}
                          >
                            {/* Button background animation */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            
                            <div className="relative flex items-center justify-center space-x-3">
                              <Target className={`h-5 w-5 ${isRegistering ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`} />
                              <span>{isRegistering ? 'REGISTERING...' : `REGISTER ${fee.amount} CREDITS`}</span>
                              {!isRegistering && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                            </div>
                          </Button>
                          
                          {/* Credit Status Indicator */}
                          <div className="absolute -top-2 -right-2">
                            {userProfile.walletBalance >= fee.amount ? (
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                                <span className="text-white text-xs font-bold">✓</span>
                              </div>
                            ) : (
                              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                                <span className="text-white text-xs font-bold">!</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Credit Requirement Info */}
                        <div className={`text-xs rounded px-3 py-2 border ${
                          userProfile.walletBalance >= fee.amount 
                            ? 'bg-green-900/20 border-green-700 text-green-400'
                            : 'bg-red-900/20 border-red-700 text-red-400'
                        }`}>
                          {userProfile.walletBalance >= fee.amount ? (
                            <span className="flex items-center justify-center">
                              <span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>
                              Sufficient Credits Available
                            </span>
                          ) : (
                            <div className="text-center">
                              <div className="flex items-center justify-center mb-1">
                                <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                                Need {fee.amount - userProfile.walletBalance} More Credits
                              </div>
                              <div className="text-xs text-yellow-400 font-semibold">
                                💳 Click "BUY CREDITS" below ↓
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Buy Credits Section - Show if user has insufficient credits for any entry fee */}
                {entryFees.some(fee => userProfile.walletBalance < fee.amount) && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-700 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Wallet className="h-6 w-6 text-yellow-400" />
                      <h4 className="text-lg font-bold text-yellow-400">Need More Credits?</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-300">
                          Your current balance: <span className="font-bold text-blue-400">{userProfile.walletBalance} Credits</span>
                        </p>
                        <p className="text-sm text-gray-400">
                          Some matches require more credits than you currently have.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Button
                          className="w-full h-12 bg-gradient-to-r from-yellow-600 via-orange-600 to-yellow-600 hover:from-yellow-500 hover:via-orange-500 hover:to-yellow-500 text-white font-bold border-2 border-yellow-500 hover:border-yellow-400 shadow-xl hover:shadow-2xl hover:shadow-yellow-500/30 transition-all duration-300 relative overflow-hidden group"
                          onClick={() => {
                            // Show the insufficient credits modal with general info
                            setInsufficientCreditsData({
                              required: Math.max(...entryFees.map(f => f.amount)),
                              available: userProfile.walletBalance,
                              shortfall: Math.max(...entryFees.map(f => f.amount)) - userProfile.walletBalance,
                              matchDetails: 'Premium Match Entry'
                            });
                            setShowInsufficientCreditsModal(true);
                          }}
                        >
                          {/* Button glow effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                          
                          <div className="relative flex items-center justify-center gap-2">
                            <DollarSign className="h-5 w-5 group-hover:scale-110 transition-transform" />
                            <span>BUY CREDITS</span>
                            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                          </div>
                        </Button>
                        <p className="text-xs text-gray-500 text-center">
                          Instant credit top-up available
                        </p>
                      </div>
                    </div>
                  </div>
                )}
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

            {/* Credits Balance Section */}
            <div className="bg-gradient-to-r from-gaming-purple/20 to-gaming-cyan/20 border border-gaming-purple/30 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Wallet className="h-8 w-8 text-gaming-cyan" />
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Credits Balance</h3>
                    <p className="text-sm text-muted-foreground">Available credits for matches</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gaming-cyan">{userProfile.walletBalance} Credits</p>
                  <p className="text-sm text-green-400">Total Credits Earned: {userProfile.totalEarnings}</p>
                </div>
              </div>
              
              {/* Credits Info */}
              <div className="mt-4 p-3 bg-gaming-dark/30 rounded-lg border border-gaming-cyan/20">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Credit Rate:</span>
                  <span className="text-gaming-cyan font-semibold">1 Credit = ₹1</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Purchase Method:</span>
                  <span className="text-gaming-purple font-semibold">UPI/QR Code</span>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-gradient-card border border-gaming-purple/30 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <History className="h-6 w-6 text-gaming-purple" />
                <h3 className="text-xl font-bold text-foreground">Recent Transactions</h3>
              </div>
              
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {transactionHistory.length > 0 ? (
                  transactionHistory.slice(0, 10).map((transaction) => (
                    <div
                      key={transaction.id}
                      className={`p-4 rounded-lg border ${
                        transaction.type === 'match_entry' ? 'bg-red-900/20 border-red-700' :
                        transaction.type === 'match_reward' ? 'bg-green-900/20 border-green-700' :
                        transaction.type === 'credit' ? 'bg-blue-900/20 border-blue-700' :
                        'bg-gray-900/20 border-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className={`font-semibold ${
                            transaction.type === 'match_entry' ? 'text-red-400' :
                            transaction.type === 'match_reward' ? 'text-green-400' :
                            transaction.type === 'credit' ? 'text-blue-400' :
                            'text-gray-400'
                          }`}>
                            {transaction.type === 'match_entry' ? '-' : '+'}
                            {transaction.amount} Credits
                          </p>
                          <p className="text-gray-300 text-sm mt-1">{transaction.description}</p>
                          {transaction.matchId && (
                            <p className="text-gray-500 text-xs mt-1">
                              Match ID: {transaction.matchId.slice(-8)}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500 text-xs">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {new Date(transaction.date).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No transactions yet</p>
                    <p className="text-sm">Start playing matches to see your transaction history</p>
                  </div>
                )}
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

              {/* Second Row - Buy Credits and Withdraw */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="flex flex-col items-center space-y-2 h-24 border-green-500/30 text-green-400 hover:bg-green-500/10 hover:text-green-300"
                  onClick={() => {
                    // Open the buy credits modal from profile
                    setInsufficientCreditsData({
                      required: 1000,
                      available: walletBalance,
                      shortfall: Math.max(1000 - walletBalance, 100),
                      matchDetails: 'General Credit Top-up'
                    });
                    setShowInsufficientCreditsModal(true);
                    setShowProfileModal(false); // Close profile modal
                  }}
                >
                  <TrendingUp className="h-8 w-8" />
                  <span className="text-base font-medium">Buy Credits</span>
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

              {/* Fourth Row - Logout Button */}
              <div className="flex justify-center pt-4 border-t border-gaming-purple/30 mt-6">
                <Button
                  variant="destructive"
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg shadow-lg"
                  onClick={() => {
                    setShowProfileModal(false);
                    onLogout();
                  }}
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-base font-medium">Logout from Account</span>
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

      {/* Buy Credits Modal - Redesigned */}
      <Dialog open={showInsufficientCreditsModal} onOpenChange={setShowInsufficientCreditsModal}>
        <DialogContent className="max-w-7xl w-[98vw] max-h-[80vh] overflow-y-auto bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-red-500/30 text-white rounded-2xl shadow-2xl">
          {/* Header with Back Arrow - Compact */}
          <div className="flex items-center justify-between py-2 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInsufficientCreditsModal(false)}
                className="p-2 hover:bg-gray-700 rounded-full"
              >
                <ArrowLeft className="h-4 w-4 text-gray-400" />
              </Button>
              <h3 className="text-lg font-bold text-white">Buy Credits</h3>
            </div>
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
          </div>

          {insufficientCreditsData && (
            <div className="py-3">
              {/* Horizontal Layout - Full Width */}
              <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Left Section - Credit Info (Compact) */}
                <div className="lg:w-1/3">
                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-600/50">
                    <h4 className="text-base font-semibold text-gray-300 mb-3 flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-blue-400" />
                      Your Balance
                    </h4>
                    
                    <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                      <span className="text-white font-bold text-3xl">{insufficientCreditsData.available}</span>
                      <p className="text-gray-400 text-xs mt-1">Available Credits</p>
                    </div>
                  </div>
                </div>

                {/* Right Section - Action Buttons (Horizontal) */}
                <div className="lg:w-2/3">
                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-600/50">
                    <h4 className="text-base font-semibold text-gray-300 mb-3">Purchase Credits</h4>
                    
                    {/* Horizontal Button Layout */}
                    <div className="flex flex-wrap gap-3 justify-center">
                      <Button
                        onClick={() => {
                          setShowInsufficientCreditsModal(false);
                          alert('🚀 Buy Credits feature coming soon!\n\nFor now, contact admin to add credits to your account.\n\n💡 Tip: Use the admin panel to add credits instantly!');
                        }}
                        className="flex-1 min-w-[200px] bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold py-3 rounded-xl text-base transition-all duration-200 shadow-lg hover:shadow-green-500/25"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Buy Credits Now
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => setShowInsufficientCreditsModal(false)}
                        className="flex-1 min-w-[150px] border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 py-3"
                      >
                        Maybe Later
                      </Button>
                    </div>
                    
                    <p className="text-center text-xs text-gray-400 mt-3">
                      🔒 Secure payment • Credits added instantly
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameDashboard;