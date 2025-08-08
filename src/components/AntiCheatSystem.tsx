import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  AlertTriangle, 
  Target, 
  Activity, 
  TrendingUp, 
  Zap, 
  Eye, 
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  BarChart3
} from "lucide-react";

interface AntiCheatSystemProps {
  onBanUser: (userId: string, reason: string) => void;
  onFlagUser: (userId: string, reason: string) => void;
}

interface CheatDetection {
  id: string;
  userId: string;
  username: string;
  cheatType: 'aimbot' | 'wallhack' | 'speedhack' | 'norecoil' | 'esp' | 'unusual_stats';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  evidence: string[];
  timestamp: string;
  gameSession: string;
  status: 'pending' | 'reviewed' | 'dismissed' | 'banned';
}

interface PlayerStats {
  userId: string;
  username: string;
  headShotRatio: number;
  killDeathRatio: number;
  winRate: number;
  averageAccuracy: number;
  suspiciousMovements: number;
  reactionTime: number;
  consistencyScore: number;
  reportCount: number;
}

const AntiCheatSystem = ({ onBanUser, onFlagUser }: AntiCheatSystemProps) => {
  const [activeTab, setActiveTab] = useState('detections');
  const [detections, setDetections] = useState<CheatDetection[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [systemStatus, setSystemStatus] = useState({
    isActive: true,
    lastUpdate: new Date(),
    detectionRate: 94.2,
    falsePositiveRate: 2.1,
    processedGames: 1247,
    bannedUsers: 23
  });

  // Mock real-time detection data
  useEffect(() => {
    const mockDetections: CheatDetection[] = [
      {
        id: '1',
        userId: '2',
        username: 'SuspiciousGamer',
        cheatType: 'aimbot',
        severity: 'critical',
        confidence: 97.8,
        evidence: [
          'Impossible flick shots detected',
          'Consistent headshot ratio: 98.2%',
          'Inhuman reaction times: 12ms average',
          'Perfect crosshair placement through walls'
        ],
        timestamp: '2024-08-01T10:30:00',
        gameSession: 'BR_Bermuda_143045',
        status: 'pending'
      },
      {
        id: '2',
        userId: '3',
        username: 'WallHacker123',
        cheatType: 'wallhack',
        severity: 'high',
        confidence: 89.4,
        evidence: [
          'Pre-aiming through walls detected',
          'Tracking enemies behind cover',
          'Knowledge of enemy positions without visual contact',
          'Unusual movement patterns to enemy locations'
        ],
        timestamp: '2024-08-01T09:15:00',
        gameSession: 'CS_Factory_091530',
        status: 'pending'
      },
      {
        id: '3',
        userId: '4',
        username: 'SpeedRunner',
        cheatType: 'speedhack',
        severity: 'medium',
        confidence: 76.2,
        evidence: [
          'Movement speed 25% above normal',
          'Impossible traversal times',
          'Inconsistent sprint patterns'
        ],
        timestamp: '2024-08-01T08:45:00',
        gameSession: 'BR_Purgatory_084500',
        status: 'reviewed'
      }
    ];

    const mockPlayerStats: PlayerStats[] = [
      {
        userId: '2',
        username: 'SuspiciousGamer',
        headShotRatio: 98.2,
        killDeathRatio: 15.7,
        winRate: 94.5,
        averageAccuracy: 97.8,
        suspiciousMovements: 847,
        reactionTime: 12,
        consistencyScore: 15,
        reportCount: 23
      },
      {
        userId: '3',
        username: 'WallHacker123',
        headShotRatio: 67.8,
        killDeathRatio: 8.3,
        winRate: 78.9,
        averageAccuracy: 84.2,
        suspiciousMovements: 234,
        reactionTime: 89,
        consistencyScore: 31,
        reportCount: 12
      },
      {
        userId: '5',
        username: 'CleanPlayer',
        headShotRatio: 23.4,
        killDeathRatio: 1.8,
        winRate: 34.2,
        averageAccuracy: 45.6,
        suspiciousMovements: 2,
        reactionTime: 178,
        consistencyScore: 78,
        reportCount: 0
      }
    ];

    setDetections(mockDetections);
    setPlayerStats(mockPlayerStats);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600/20 text-red-300 border-red-500/50';
      case 'high': return 'bg-orange-600/20 text-orange-300 border-orange-500/50';
      case 'medium': return 'bg-yellow-600/20 text-yellow-300 border-yellow-500/50';
      case 'low': return 'bg-blue-600/20 text-blue-300 border-blue-500/50';
      default: return 'bg-gray-600/20 text-gray-300 border-gray-500/50';
    }
  };

  const getCheatTypeIcon = (type: string) => {
    switch (type) {
      case 'aimbot': return <Target className="h-4 w-4" />;
      case 'wallhack': return <Eye className="h-4 w-4" />;
      case 'speedhack': return <Zap className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const handleBanUser = (detection: CheatDetection) => {
    onBanUser(detection.userId, `Cheat detected: ${detection.cheatType} (Confidence: ${detection.confidence}%)`);
    setDetections(prev => prev.map(d => 
      d.id === detection.id ? { ...d, status: 'banned' as const } : d
    ));
  };

  const handleDismissDetection = (detectionId: string) => {
    setDetections(prev => prev.map(d => 
      d.id === detectionId ? { ...d, status: 'dismissed' as const } : d
    ));
  };

  const getRiskScore = (stats: PlayerStats): number => {
    let score = 0;
    
    // Abnormal headshot ratio
    if (stats.headShotRatio > 80) score += 30;
    else if (stats.headShotRatio > 60) score += 15;
    
    // Abnormal K/D ratio
    if (stats.killDeathRatio > 10) score += 25;
    else if (stats.killDeathRatio > 5) score += 10;
    
    // Abnormal win rate
    if (stats.winRate > 90) score += 20;
    else if (stats.winRate > 70) score += 10;
    
    // Fast reaction time (potentially inhuman)
    if (stats.reactionTime < 50) score += 25;
    
    // Low consistency score (indicates possible automation)
    if (stats.consistencyScore < 30) score += 15;
    
    // High report count
    score += Math.min(stats.reportCount * 2, 20);
    
    return Math.min(score, 100);
  };

  return (
    <div className="space-y-6">
      {/* Enhanced System Status Overview */}
      <div className="bg-black border border-gray-600 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Shield className="h-6 w-6 mr-3 text-red-400" />
              AI-Powered Anti-Cheat System
            </h2>
            <p className="text-gray-300 mt-2">
              Advanced real-time detection protecting investments and fair gameplay
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {systemStatus.isActive ? (
              <Badge className="bg-green-600/20 text-green-300 border-green-500/50 px-3 py-1">
                <CheckCircle className="h-4 w-4 mr-1" />
                SYSTEM ACTIVE
              </Badge>
            ) : (
              <Badge className="bg-red-600/20 text-red-300 border-red-500/50 px-3 py-1">
                <XCircle className="h-4 w-4 mr-1" />
                SYSTEM OFFLINE
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-gray-600 bg-black">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-white">System Status</CardTitle>
            <Shield className={`h-5 w-5 ${systemStatus.isActive ? 'text-green-400' : 'text-red-400'}`} />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {systemStatus.isActive ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-400" />
              )}
              <span className="text-2xl font-bold text-white">
                {systemStatus.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-1 font-medium">
              Last update: {systemStatus.lastUpdate.toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-600 bg-black">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-white">Detection Rate</CardTitle>
            <BarChart3 className="h-5 w-5 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {systemStatus.detectionRate}%
            </div>
            <Progress value={systemStatus.detectionRate} className="mt-2" />
            <p className="text-xs text-gray-300 mt-1 font-medium">
              False positive: {systemStatus.falsePositiveRate}%
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-600 bg-black">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-white">Games Monitored</CardTitle>
            <Activity className="h-5 w-5 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemStatus.processedGames}</div>
            <p className="text-xs text-gray-300 font-medium">
              +47 in last hour
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-600 bg-black">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-white">Users Banned</CardTitle>
            <Ban className="h-5 w-5 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemStatus.bannedUsers}</div>
            <p className="text-xs text-gray-300 font-medium">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="border border-gray-600 rounded-lg">
        <TabsList className="grid w-full grid-cols-3 bg-black">
          <TabsTrigger value="detections" className="text-white data-[state=active]:bg-gray-800 data-[state=active]:text-white">Live Detections</TabsTrigger>
          <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-gray-800 data-[state=active]:text-white">Player Analytics</TabsTrigger>
          <TabsTrigger value="patterns" className="text-white data-[state=active]:bg-gray-800 data-[state=active]:text-white">Cheat Patterns</TabsTrigger>
        </TabsList>

        {/* Enhanced Live Detections Tab */}
        <TabsContent value="detections" className="space-y-4 p-6 bg-black">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
                Real-time Cheat Detections
              </h3>
              <p className="text-gray-300 text-sm mt-1">Live monitoring of suspicious gaming activities</p>
            </div>
            <Badge className="bg-red-600/20 text-red-300 border-red-500/50 px-4 py-2 text-sm font-bold">
              <Activity className="h-4 w-4 mr-1" />
              {detections.filter(d => d.status === 'pending').length} Pending Review
            </Badge>
          </div>

          <div className="space-y-4">
            {detections.map((detection) => (
              <Card key={detection.id} className={`border-l-4 shadow-lg border-gray-600 bg-black ${
                detection.severity === 'critical' ? 'border-l-red-600' :
                detection.severity === 'high' ? 'border-l-orange-500' :
                detection.severity === 'medium' ? 'border-l-yellow-500' :
                'border-l-blue-500'
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        detection.cheatType === 'aimbot' ? 'bg-red-600/20 border border-red-500/50' :
                        detection.cheatType === 'wallhack' ? 'bg-orange-600/20 border border-orange-500/50' :
                        detection.cheatType === 'speedhack' ? 'bg-yellow-600/20 border border-yellow-500/50' :
                        'bg-blue-600/20 border border-blue-500/50'
                      }`}>
                        {getCheatTypeIcon(detection.cheatType)}
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-white">{detection.username}</CardTitle>
                        <CardDescription className="text-gray-300 font-medium">
                          🎯 {detection.cheatType.toUpperCase()} detected in {detection.gameSession}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getSeverityColor(detection.severity)} font-bold text-xs px-3 py-1`}>
                        🚨 {detection.severity.toUpperCase()}
                      </Badge>
                      <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/50 font-bold px-3 py-1">
                        🎯 {detection.confidence}% confidence
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                      <h4 className="font-bold mb-3 text-white flex items-center">
                        <Eye className="h-4 w-4 mr-2 text-red-400" />
                        Detection Evidence:
                      </h4>
                      <ul className="space-y-2">
                        {detection.evidence.map((evidence, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-start font-medium">
                            <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {evidence}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-600">
                      <div className="flex items-center space-x-2 text-sm text-gray-300 font-medium">
                        <Clock className="h-4 w-4 text-blue-400" />
                        <span>⏰ {new Date(detection.timestamp).toLocaleString()}</span>
                      </div>
                      
                      {detection.status === 'pending' && (
                        <div className="flex space-x-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDismissDetection(detection.id)}
                            className="hover:bg-gray-700 border-gray-600 text-white font-medium"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Dismiss
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleBanUser(detection)}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold"
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            🔨 Ban User
                          </Button>
                        </div>
                      )}
                      
                      {detection.status !== 'pending' && (
                        <Badge className={`font-bold px-3 py-1 ${
                          detection.status === 'banned' ? 'bg-red-600/20 text-red-300 border-red-500/50' :
                          detection.status === 'dismissed' ? 'bg-gray-600/20 text-gray-300 border-gray-500/50' :
                          'bg-blue-600/20 text-blue-300 border-blue-500/50'
                        }`}>
                          {detection.status === 'banned' ? '🔨 BANNED' :
                           detection.status === 'dismissed' ? '❌ DISMISSED' :
                           `✅ ${detection.status.toUpperCase()}`}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {detections.length === 0 && (
              <Card className="border-gray-600 bg-black">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white">All Clear!</h3>
                  <p className="text-gray-300">No suspicious activities detected in the last hour.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Enhanced Player Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4 p-6 bg-black">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-orange-400" />
              Player Statistical Analysis
            </h3>
            <p className="text-gray-300 text-sm mt-1">Advanced behavioral pattern analysis and risk assessment</p>
          </div>
          
          <div className="space-y-4">
            {playerStats.map((stats) => {
              const riskScore = getRiskScore(stats);
              return (
                <Card key={stats.userId} className={`shadow-lg border-gray-600 bg-black ${
                  riskScore >= 80 ? 'border-l-4 border-l-red-600' :
                  riskScore >= 60 ? 'border-l-4 border-l-orange-500' :
                  riskScore >= 40 ? 'border-l-4 border-l-yellow-500' :
                  'border-l-4 border-l-green-500'
                }`}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg font-bold text-white">{stats.username}</CardTitle>
                        <CardDescription className="text-gray-300 font-medium">
                          🔍 Advanced statistical risk analysis and behavioral monitoring
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`font-bold px-3 py-1 ${
                          riskScore >= 80 ? 'bg-red-600/20 text-red-300 border-red-500/50' :
                          riskScore >= 60 ? 'bg-orange-600/20 text-orange-300 border-orange-500/50' :
                          riskScore >= 40 ? 'bg-yellow-600/20 text-yellow-300 border-yellow-500/50' :
                          'bg-green-600/20 text-green-300 border-green-500/50'
                        }`}>
                          ⚠️ Risk: {riskScore}%
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center bg-gray-800 p-3 rounded-lg border border-gray-600">
                        <div className={`text-2xl font-bold ${
                          stats.headShotRatio > 80 ? 'text-red-400' :
                          stats.headShotRatio > 60 ? 'text-orange-400' :
                          'text-green-400'
                        }`}>{stats.headShotRatio}%</div>
                        <div className="text-sm text-gray-300 font-medium">🎯 Headshot Ratio</div>
                        {stats.headShotRatio > 80 && (
                          <Badge className="bg-red-600/20 text-red-300 text-xs mt-1">SUSPICIOUS</Badge>
                        )}
                      </div>
                      <div className="text-center bg-gray-800 p-3 rounded-lg border border-gray-600">
                        <div className={`text-2xl font-bold ${
                          stats.killDeathRatio > 10 ? 'text-red-400' :
                          stats.killDeathRatio > 5 ? 'text-orange-400' :
                          'text-green-400'
                        }`}>{stats.killDeathRatio}</div>
                        <div className="text-sm text-gray-300 font-medium">⚔️ K/D Ratio</div>
                        {stats.killDeathRatio > 10 && (
                          <Badge className="bg-red-600/20 text-red-300 text-xs mt-1">EXTREME</Badge>
                        )}
                      </div>
                      <div className="text-center bg-gray-800 p-3 rounded-lg border border-gray-600">
                        <div className={`text-2xl font-bold ${
                          stats.winRate > 90 ? 'text-red-400' :
                          stats.winRate > 70 ? 'text-orange-400' :
                          'text-green-400'
                        }`}>{stats.winRate}%</div>
                        <div className="text-sm text-gray-300 font-medium">🏆 Win Rate</div>
                        {stats.winRate > 90 && (
                          <Badge className="bg-red-600/20 text-red-300 text-xs mt-1">INHUMAN</Badge>
                        )}
                      </div>
                      <div className="text-center bg-gray-800 p-3 rounded-lg border border-gray-600">
                        <div className={`text-2xl font-bold ${
                          stats.reactionTime < 50 ? 'text-red-400' :
                          stats.reactionTime < 100 ? 'text-orange-400' :
                          'text-green-400'
                        }`}>{stats.reactionTime}ms</div>
                        <div className="text-sm text-gray-300 font-medium">⚡ Avg Reaction</div>
                        {stats.reactionTime < 50 && (
                          <Badge className="bg-red-600/20 text-red-300 text-xs mt-1">INHUMAN</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-600 bg-gray-800 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-300 font-medium">
                          📊 Reports: <span className="font-bold text-red-400">{stats.reportCount}</span> | 
                          🚨 Suspicious movements: <span className="font-bold text-orange-400">{stats.suspiciousMovements}</span> |
                          🎯 Consistency: <span className="font-bold text-blue-400">{stats.consistencyScore}%</span>
                        </div>
                        {riskScore >= 70 && (
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white font-bold">
                            <Eye className="h-4 w-4 mr-2" />
                            🔍 Monitor Closely
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Enhanced Cheat Patterns Tab */}
        <TabsContent value="patterns" className="space-y-4 p-6 bg-black">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-purple-400" />
              Common Cheat Patterns & Detection Methods
            </h3>
            <p className="text-gray-300 text-sm mt-1">AI-powered pattern recognition and behavioral analysis techniques</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-gray-600 bg-black shadow-lg">
              <CardHeader className="bg-gray-800">
                <CardTitle className="flex items-center text-white">
                  <Target className="h-5 w-5 mr-2 text-red-400" />
                  🎯 Aimbot Detection
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start text-white font-medium">
                    <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Impossible flick shots (&gt;90° in &lt;50ms)
                  </li>
                  <li className="flex items-start text-white font-medium">
                    <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Consistent headshot ratios &gt;80%
                  </li>
                  <li className="flex items-start text-white font-medium">
                    <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Perfect tracking through smoke/walls
                  </li>
                  <li className="flex items-start text-white font-medium">
                    <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Inhuman reaction times (&lt;30ms)
                  </li>
                  <li className="flex items-start text-white font-medium">
                    <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Pixel-perfect crosshair placement
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-gray-600 bg-black shadow-lg">
              <CardHeader className="bg-gray-800">
                <CardTitle className="flex items-center text-white">
                  <Eye className="h-5 w-5 mr-2 text-orange-400" />
                  👁️ Wallhack Detection
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start text-white font-medium">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Pre-aiming at enemy positions
                  </li>
                  <li className="flex items-start text-white font-medium">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Tracking through solid objects
                  </li>
                  <li className="flex items-start text-white font-medium">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Knowledge without line of sight
                  </li>
                  <li className="flex items-start text-white font-medium">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Unusual movement to enemy locations
                  </li>
                  <li className="flex items-start text-white font-medium">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Perfect timing on enemy encounters
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-gray-600 bg-black shadow-lg">
              <CardHeader className="bg-gray-800">
                <CardTitle className="flex items-center text-white">
                  <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                  ⚡ Speed Hack Detection
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start text-white font-medium">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Movement speed above game limits
                  </li>
                  <li className="flex items-start text-white font-medium">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Impossible traversal times
                  </li>
                  <li className="flex items-start text-white font-medium">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Inconsistent animation frames
                  </li>
                  <li className="flex items-start text-white font-medium">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Teleportation-like movement
                  </li>
                  <li className="flex items-start text-white font-medium">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Rapid position changes
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-gray-600 bg-black shadow-lg">
              <CardHeader className="bg-gray-800">
                <CardTitle className="flex items-center text-white">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
                  📊 Statistical Anomalies
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start text-white font-medium">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Sudden skill improvement spikes
                  </li>
                  <li className="flex items-start text-white font-medium">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Inhuman consistency patterns
                  </li>
                  <li className="flex items-start text-white font-medium">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Perfect recoil compensation
                  </li>
                  <li className="flex items-start text-white font-medium">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Automated-like behavior patterns
                  </li>
                  <li className="flex items-start text-white font-medium">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Multiple account correlations
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Alert className="border-gray-600 bg-black">
            <Shield className="h-5 w-5 text-green-400" />
            <AlertDescription className="text-gray-300 font-medium">
              🛡️ <strong className="text-white">Investment Protection:</strong> The anti-cheat system uses machine learning algorithms trained on millions of gameplay sessions 
              to detect these patterns. All detections are reviewed to minimize false positives and protect 
              legitimate players who have invested in the platform. Our 94.2% accuracy rate ensures fair gameplay while protecting your investments.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AntiCheatSystem;
