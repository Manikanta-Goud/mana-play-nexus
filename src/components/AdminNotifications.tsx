import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Shield, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  X,
  Bell,
  MessageCircle
} from "lucide-react";

interface AdminNotification {
  id: string;
  type: 'security' | 'maintenance' | 'announcement' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface AdminNotificationsProps {
  notifications: AdminNotification[];
  onMarkAsRead: (notificationId: string) => void;
  onDismiss: (notificationId: string) => void;
}

const AdminNotifications = ({ 
  notifications, 
  onMarkAsRead, 
  onDismiss 
}: AdminNotificationsProps) => {
  const [selectedNotification, setSelectedNotification] = useState<AdminNotification | null>(null);
  const [showModal, setShowModal] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'security': return <Shield className="h-5 w-5 text-red-600" />;
      case 'maintenance': return <Info className="h-5 w-5 text-blue-600" />;
      case 'announcement': return <MessageCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      default: return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleNotificationClick = (notification: AdminNotification) => {
    setSelectedNotification(notification);
    setShowModal(true);
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Admin Notifications</CardTitle>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="px-2 py-1">
                  {unreadCount} new
                </Badge>
              )}
            </div>
          </div>
          <CardDescription>
            Important updates from the game administrators
          </CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notifications at the moment</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 ${
                    !notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`text-sm font-medium ${
                            !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h4>
                          <Badge className={getPriorityColor(notification.priority)}>
                            {notification.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 ml-2 flex-shrink-0"></div>
                    )}
                  </div>
                </div>
              ))}
              
              {notifications.length > 5 && (
                <div className="text-center pt-2">
                  <Button variant="outline" size="sm">
                    View All Notifications ({notifications.length})
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Detail Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {selectedNotification && getNotificationIcon(selectedNotification.type)}
                <DialogTitle>{selectedNotification?.title}</DialogTitle>
              </div>
              <div className="flex items-center space-x-2">
                {selectedNotification && (
                  <Badge className={getPriorityColor(selectedNotification.priority)}>
                    {selectedNotification.priority}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (selectedNotification) {
                      onDismiss(selectedNotification.id);
                      setShowModal(false);
                    }
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          {selectedNotification && (
            <div className="space-y-4">
              <div className="text-sm text-gray-500">
                {new Date(selectedNotification.timestamp).toLocaleString()}
              </div>
              
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {selectedNotification.message}
                </p>
              </div>

              {selectedNotification.type === 'security' && (
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    This is a security-related notification. Please take appropriate action to ensure 
                    your account remains secure and follows our fair play guidelines.
                  </AlertDescription>
                </Alert>
              )}

              {selectedNotification.type === 'maintenance' && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Scheduled maintenance may affect game availability. Please plan your gaming 
                    sessions accordingly.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Close
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    if (selectedNotification) {
                      onDismiss(selectedNotification.id);
                      setShowModal(false);
                    }
                  }}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

// Sample notifications data that you can use in your main dashboard
export const sampleNotifications: AdminNotification[] = [
  {
    id: '1',
    type: 'security',
    title: 'Enhanced Anti-Cheat Measures',
    message: 'We have implemented new anti-cheat detection systems to ensure fair play. Players caught using hacks will face immediate bans. Your investments are protected through our robust monitoring system.',
    timestamp: '2024-08-01T10:00:00Z',
    isRead: false,
    priority: 'high'
  },
  {
    id: '2',
    type: 'announcement',
    title: 'New Tournament Schedule Released',
    message: 'Check out our upcoming Free Fire tournaments with increased prize pools! Registration opens tomorrow at 9 AM.',
    timestamp: '2024-08-01T08:30:00Z',
    isRead: false,
    priority: 'medium'
  },
  {
    id: '3',
    type: 'maintenance',
    title: 'Scheduled Server Maintenance',
    message: 'Our servers will undergo maintenance on August 3rd from 2:00 AM to 4:00 AM IST. All ongoing matches will be paused and resumed after maintenance.',
    timestamp: '2024-07-31T15:00:00Z',
    isRead: true,
    priority: 'medium'
  },
  {
    id: '4',
    type: 'warning',
    title: 'Fair Play Reminder',
    message: 'We have detected suspicious activity patterns. Remember, using any form of cheats or hacks will result in permanent account suspension and forfeiture of invested amounts.',
    timestamp: '2024-07-31T12:00:00Z',
    isRead: true,
    priority: 'high'
  },
  {
    id: '5',
    type: 'security',
    title: 'Account Security Update',
    message: 'Please ensure your account has strong passwords and enable two-factor authentication for enhanced security.',
    timestamp: '2024-07-30T18:00:00Z',
    isRead: true,
    priority: 'low'
  }
];

export default AdminNotifications;
