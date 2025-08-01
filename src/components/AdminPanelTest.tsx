import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, DollarSign, Target } from "lucide-react";

interface AdminPanelTestProps {
  onLogout: () => void;
  onBackToDashboard: () => void;
  username: string;
}

const AdminPanelTest = ({ onLogout, onBackToDashboard, username }: AdminPanelTestProps) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Shield className="h-10 w-10 text-blue-500" />
            <div>
              <h1 className="text-3xl font-bold text-white">ADMIN PANEL</h1>
              <p className="text-gray-400">Welcome, {username}</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={onBackToDashboard}>
              Back to Game
            </Button>
            <Button variant="outline" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">15,847</div>
              <p className="text-xs text-gray-400">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Active Matches</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">127</div>
              <p className="text-xs text-gray-400">3,429 players online</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Cheats Detected</CardTitle>
              <Shield className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">43</div>
              <p className="text-xs text-gray-400">Today only</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Protected Funds</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">₹28.4L</div>
              <p className="text-xs text-gray-400">100% protection rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Test Content */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">Admin Panel Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Admin Panel:</span>
                <span className="text-green-400 font-semibold">✅ LOADED SUCCESSFULLY</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">User:</span>
                <span className="text-white font-semibold">{username}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Components:</span>
                <span className="text-green-400 font-semibold">✅ ALL WORKING</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Anti-Cheat System:</span>
                <span className="text-green-400 font-semibold">✅ ACTIVE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">User Protection:</span>
                <span className="text-green-400 font-semibold">✅ ENABLED</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanelTest;
