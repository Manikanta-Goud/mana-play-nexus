import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Target, Users, Crown, Clock, LogOut } from "lucide-react";

interface GameDashboardProps {
  username: string;
  onLogout: () => void;
}

const GameDashboard = ({ username, onLogout }: GameDashboardProps) => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-gaming-dark">
      {/* Header */}
      <header className="bg-gradient-card border-b border-gaming-purple/30 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Gamepad2 className="h-8 w-8 text-gaming-purple" />
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              MANA GAMING
            </h1>
          </div>
          
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
      </header>

      <div className="container mx-auto p-6">
        {!selectedGame ? (
          <div className="space-y-8">
            {/* Games Section */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Select Your Game</h2>
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

            {/* Upcoming Matches */}
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Upcoming Matches</h3>
              <div className="grid gap-4 md:grid-cols-3">
                {upcomingMatches.map((match, index) => (
                  <Card key={index} className="bg-gradient-card border-gaming-purple/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Clock className="h-5 w-5 text-gaming-cyan" />
                          <div>
                            <p className="font-semibold text-foreground">{match.time}</p>
                            <p className="text-sm text-muted-foreground">{match.mode}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-gaming-cyan/20 text-gaming-cyan">
                          {match.prize}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default GameDashboard;