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
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Shield className={`h-4 w-4 ${systemStatus.isActive ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {systemStatus.isActive ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="text-2xl font-bold">
                {systemStatus.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Last update: {systemStatus.lastUpdate.toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Detection Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {systemStatus.detectionRate}%
            </div>
            <Progress value={systemStatus.detectionRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              False positive: {systemStatus.falsePositiveRate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Games Monitored</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStatus.processedGames}</div>
            <p className="text-xs text-muted-foreground">
              +47 in last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users Banned</CardTitle>
            <Ban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{systemStatus.bannedUsers}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="detections">Live Detections</TabsTrigger>
          <TabsTrigger value="analytics">Player Analytics</TabsTrigger>
          <TabsTrigger value="patterns">Cheat Patterns</TabsTrigger>
        </TabsList>

        {/* Live Detections Tab */}
        <TabsContent value="detections" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Real-time Cheat Detections</h3>
            <Badge variant="outline" className="px-3 py-1">
              {detections.filter(d => d.status === 'pending').length} Pending Review
            </Badge>
          </div>

          <div className="space-y-4">
            {detections.map((detection) => (
              <Card key={detection.id} className="border-l-4 border-l-red-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      {getCheatTypeIcon(detection.cheatType)}
                      <div>
                        <CardTitle className="text-lg">{detection.username}</CardTitle>
                        <CardDescription>
                          {detection.cheatType.toUpperCase()} detected in {detection.gameSession}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getSeverityColor(detection.severity)}>
                        {detection.severity}
                      </Badge>
                      <Badge variant="outline">
                        {detection.confidence}% confidence
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Evidence:</h4>
                      <ul className="space-y-1">
                        {detection.evidence.map((evidence, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {evidence}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(detection.timestamp).toLocaleString()}</span>
                      </div>
                      
                      {detection.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDismissDetection(detection.id)}
                          >
                            Dismiss
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleBanUser(detection)}
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Ban User
                          </Button>
                        </div>
                      )}
                      
                      {detection.status !== 'pending' && (
                        <Badge className={
                          detection.status === 'banned' ? 'bg-red-100 text-red-800' :
                          detection.status === 'dismissed' ? 'bg-gray-100 text-gray-800' :
                          'bg-blue-100 text-blue-800'
                        }>
                          {detection.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Player Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <h3 className="text-lg font-semibold">Player Statistical Analysis</h3>
          
          <div className="space-y-4">
            {playerStats.map((stats) => {
              const riskScore = getRiskScore(stats);
              return (
                <Card key={stats.userId} className={`${
                  riskScore >= 80 ? 'border-l-4 border-l-red-500' :
                  riskScore >= 60 ? 'border-l-4 border-l-orange-500' :
                  riskScore >= 40 ? 'border-l-4 border-l-yellow-500' :
                  'border-l-4 border-l-green-500'
                }`}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>{stats.username}</CardTitle>
                        <CardDescription>Statistical risk analysis</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={
                          riskScore >= 80 ? 'bg-red-100 text-red-800' :
                          riskScore >= 60 ? 'bg-orange-100 text-orange-800' :
                          riskScore >= 40 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }>
                          Risk: {riskScore}%
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{stats.headShotRatio}%</div>
                        <div className="text-sm text-gray-500">Headshot Ratio</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{stats.killDeathRatio}</div>
                        <div className="text-sm text-gray-500">K/D Ratio</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{stats.winRate}%</div>
                        <div className="text-sm text-gray-500">Win Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{stats.reactionTime}ms</div>
                        <div className="text-sm text-gray-500">Avg Reaction</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          Reports: {stats.reportCount} | Suspicious movements: {stats.suspiciousMovements}
                        </div>
                        {riskScore >= 70 && (
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            Monitor Closely
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

        {/* Cheat Patterns Tab */}
        <TabsContent value="patterns" className="space-y-4">
          <h3 className="text-lg font-semibold">Common Cheat Patterns & Detection Methods</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Aimbot Detection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Impossible flick shots (&gt;90° in &lt;50ms)</li>
                  <li>• Consistent headshot ratios &gt;80%</li>
                  <li>• Perfect tracking through smoke/walls</li>
                  <li>• Inhuman reaction times (&lt;30ms)</li>
                  <li>• Pixel-perfect crosshair placement</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Wallhack Detection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Pre-aiming at enemy positions</li>
                  <li>• Tracking through solid objects</li>
                  <li>• Knowledge without line of sight</li>
                  <li>• Unusual movement to enemy locations</li>
                  <li>• Perfect timing on enemy encounters</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Speed Hack Detection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Movement speed above game limits</li>
                  <li>• Impossible traversal times</li>
                  <li>• Inconsistent animation frames</li>
                  <li>• Teleportation-like movement</li>
                  <li>• Rapid position changes</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Statistical Anomalies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Sudden skill improvement spikes</li>
                  <li>• Inhuman consistency patterns</li>
                  <li>• Perfect recoil compensation</li>
                  <li>• Automated-like behavior patterns</li>
                  <li>• Multiple account correlations</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              The anti-cheat system uses machine learning algorithms trained on millions of gameplay sessions 
              to detect these patterns. All detections are reviewed to minimize false positives and protect 
              legitimate players who have invested in the platform.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AntiCheatSystem;
