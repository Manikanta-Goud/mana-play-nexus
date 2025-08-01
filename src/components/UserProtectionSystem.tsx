import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  FileText,
  Clock,
  Users,
  TrendingDown,
  Activity,
  Lock,
  Unlock,
  CreditCard,
  UserCheck
} from "lucide-react";

interface InvestmentProtection {
  userId: string;
  username: string;
  investmentAmount: number;
  protectionStatus: 'active' | 'suspended' | 'investigating';
  lastActivity: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  protectedAmount: number;
  pendingRefunds: number;
}

interface RefundRequest {
  id: string;
  userId: string;
  username: string;
  amount: number;
  reason: 'cheat_victim' | 'platform_error' | 'unfair_match' | 'other';
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  submittedAt: string;
  evidence: string[];
  adminNotes: string;
}

interface UserProtectionSystemProps {
  users: any[];
  onRefundApproval: (requestId: string, approved: boolean) => void;
  onProtectionUpdate: (userId: string, status: string) => void;
}

const UserProtectionSystem = ({ users, onRefundApproval, onProtectionUpdate }: UserProtectionSystemProps) => {
  const [activeTab, setActiveTab] = useState('protection');
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  // Mock data for investment protection
  const [investmentProtections] = useState<InvestmentProtection[]>([
    {
      userId: '1',
      username: 'Player123',
      investmentAmount: 2500,
      protectionStatus: 'active',
      lastActivity: '2024-08-01T10:30:00',
      riskLevel: 'low',
      protectedAmount: 2500,
      pendingRefunds: 0
    },
    {
      userId: '2',
      username: 'VictimPlayer',
      investmentAmount: 1800,
      protectionStatus: 'investigating',
      lastActivity: '2024-08-01T09:15:00',
      riskLevel: 'medium',
      protectedAmount: 1800,
      pendingRefunds: 500
    },
    {
      userId: '6',
      username: 'AffectedUser',
      investmentAmount: 3200,
      protectionStatus: 'suspended',
      lastActivity: '2024-07-31T18:20:00',
      riskLevel: 'high',
      protectedAmount: 2700,
      pendingRefunds: 500
    }
  ]);

  const [refundRequests] = useState<RefundRequest[]>([
    {
      id: '1',
      userId: '2',
      username: 'VictimPlayer',
      amount: 500,
      reason: 'cheat_victim',
      status: 'pending',
      submittedAt: '2024-08-01T09:00:00',
      evidence: [
        'Match replay showing opponent using aimbot',
        'Screenshots of suspicious kill patterns',
        'Community reports of the cheater'
      ],
      adminNotes: ''
    },
    {
      id: '2',
      userId: '6',
      username: 'AffectedUser',
      amount: 500,
      reason: 'unfair_match',
      status: 'pending',
      submittedAt: '2024-07-31T16:30:00',
      evidence: [
        'Server lag during crucial moments',
        'Disconnection issues affecting gameplay',
        'Match logs showing technical problems'
      ],
      adminNotes: ''
    },
    {
      id: '3',
      userId: '7',
      username: 'CompensatedUser',
      amount: 300,
      reason: 'platform_error',
      status: 'approved',
      submittedAt: '2024-07-30T14:20:00',
      evidence: [
        'Platform error logs',
        'Failed transaction records'
      ],
      adminNotes: 'Platform error confirmed. Full refund approved.'
    }
  ]);

  const getProtectionStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRefundStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'processed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRefundAction = (requestId: string, approved: boolean) => {
    onRefundApproval(requestId, approved);
    setShowRefundModal(false);
    setSelectedRefund(null);
    setAdminNotes('');
  };

  const totalInvestments = investmentProtections.reduce((sum, p) => sum + p.investmentAmount, 0);
  const totalProtected = investmentProtections.reduce((sum, p) => sum + p.protectedAmount, 0);
  const totalPendingRefunds = refundRequests
    .filter(r => r.status === 'pending')
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalInvestments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From {investmentProtections.length} users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Protected Amount</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{totalProtected.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((totalProtected / totalInvestments) * 100).toFixed(1)}% protection rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Refunds</CardTitle>
            <RefreshCw className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">₹{totalPendingRefunds.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {refundRequests.filter(r => r.status === 'pending').length} requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Protections</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {investmentProtections.filter(p => p.protectionStatus === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Out of {investmentProtections.length} total</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="protection">Investment Protection</TabsTrigger>
          <TabsTrigger value="refunds">Refund Requests</TabsTrigger>
          <TabsTrigger value="policies">Protection Policies</TabsTrigger>
        </TabsList>

        {/* Investment Protection Tab */}
        <TabsContent value="protection" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">User Investment Protection Status</h3>
          </div>

          <div className="space-y-4">
            {investmentProtections.map((protection) => (
              <Card key={protection.userId}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-lg">{protection.username}</h4>
                        <Badge className={getProtectionStatusColor(protection.protectionStatus)}>
                          {protection.protectionStatus}
                        </Badge>
                        <Badge className={
                          protection.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                          protection.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          protection.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {protection.riskLevel} risk
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Investment:</span>
                          <div className="font-medium">₹{protection.investmentAmount.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Protected:</span>
                          <div className="font-medium text-green-600">₹{protection.protectedAmount.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Pending Refunds:</span>
                          <div className="font-medium text-orange-600">₹{protection.pendingRefunds.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Last Activity:</span>
                          <div className="font-medium">{new Date(protection.lastActivity).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {protection.protectionStatus === 'suspended' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onProtectionUpdate(protection.userId, 'active')}
                        >
                          <Unlock className="h-4 w-4 mr-2" />
                          Restore Protection
                        </Button>
                      )}
                      {protection.protectionStatus === 'active' && protection.riskLevel === 'high' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onProtectionUpdate(protection.userId, 'investigating')}
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Start Investigation
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Refund Requests Tab */}
        <TabsContent value="refunds" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Refund Requests Management</h3>
            <Badge variant="outline" className="px-3 py-1">
              {refundRequests.filter(r => r.status === 'pending').length} Pending Review
            </Badge>
          </div>

          <div className="space-y-4">
            {refundRequests.map((request) => (
              <Card key={request.id} className={`${
                request.status === 'pending' ? 'border-l-4 border-l-orange-500' : ''
              }`}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-lg">{request.username}</h4>
                        <Badge className={getRefundStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                        <span className="text-2xl font-bold text-green-600">₹{request.amount}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Reason:</span>
                          <div className="font-medium capitalize">{request.reason.replace('_', ' ')}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Submitted:</span>
                          <div className="font-medium">{new Date(request.submittedAt).toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Evidence Items:</span>
                          <div className="font-medium">{request.evidence.length} files</div>
                        </div>
                      </div>

                      {request.adminNotes && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <span className="text-sm font-medium text-gray-500">Admin Notes:</span>
                          <p className="text-sm text-gray-700">{request.adminNotes}</p>
                        </div>
                      )}
                    </div>

                    {request.status === 'pending' && (
                      <div className="flex space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedRefund(request);
                            setShowRefundModal(true);
                          }}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Protection Policies Tab */}
        <TabsContent value="policies" className="space-y-4">
          <h3 className="text-lg font-semibold">Investment Protection Policies</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-600" />
                  Automatic Protection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• All user investments are automatically protected</li>
                  <li>• Real-time monitoring of cheat detection systems</li>
                  <li>• Immediate fund freezing when cheaters are detected</li>
                  <li>• Automatic refund processing for affected users</li>
                  <li>• Insurance coverage up to ₹10,00,000 per user</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <RefreshCw className="h-5 w-5 mr-2 text-blue-600" />
                  Refund Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Quick refund for verified cheat victims</li>
                  <li>• 24-48 hour processing time for approved claims</li>
                  <li>• Evidence-based review system</li>
                  <li>• Multiple refund methods available</li>
                  <li>• Transparent status tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                  Fair Play Guarantee
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Zero tolerance policy for cheating</li>
                  <li>• Advanced anti-cheat detection systems</li>
                  <li>• Regular security audits and updates</li>
                  <li>• Community reporting mechanisms</li>
                  <li>• Professional investigation team</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                  Investment Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Secure payment processing</li>
                  <li>• Escrow system for tournament funds</li>
                  <li>• Regular financial audits</li>
                  <li>• Transparent prize distribution</li>
                  <li>• Emergency fund for user protection</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Our commitment: Every user who invests in our platform deserves a fair and secure gaming 
              experience. We actively protect against cheaters and ensure that honest players never lose 
              their investments due to unfair play.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>

      {/* Refund Review Modal */}
      <Dialog open={showRefundModal} onOpenChange={setShowRefundModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Review Refund Request</DialogTitle>
            <DialogDescription>
              Carefully review the evidence and make a decision on this refund request
            </DialogDescription>
          </DialogHeader>
          
          {selectedRefund && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">User:</span>
                  <p className="text-lg font-medium">{selectedRefund.username}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Amount:</span>
                  <p className="text-lg font-medium text-green-600">₹{selectedRefund.amount}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Reason:</span>
                  <p className="text-lg font-medium capitalize">{selectedRefund.reason.replace('_', ' ')}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Submitted:</span>
                  <p className="text-lg font-medium">{new Date(selectedRefund.submittedAt).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-500 block mb-2">Evidence Provided:</span>
                <ul className="space-y-1">
                  {selectedRefund.evidence.map((evidence, index) => (
                    <li key={index} className="text-sm bg-gray-50 p-2 rounded">
                      • {evidence}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-500 block mb-2">Admin Notes:</span>
                <Textarea
                  placeholder="Add your review notes here..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowRefundModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleRefundAction(selectedRefund.id, false)}
                >
                  Reject Request
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleRefundAction(selectedRefund.id, true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Approve Refund
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProtectionSystem;
