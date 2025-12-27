import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, FileText, Settings, Activity, Calendar, Video, ShoppingBag, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/auth/AuthContext';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalQueries: number;
  todayQueries: number;
  totalDocuments: number;
}

export const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalQueries: 0,
    todayQueries: 0,
    totalDocuments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        // Mock data for now - replace with actual API calls
        setStats({
          totalUsers: 156,
          activeUsers: 42,
          totalQueries: 3847,
          todayQueries: 128,
          totalDocuments: 23,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAdmin, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-islamic-primary-green"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-islamic-primary-green',
      bgColor: 'bg-islamic-primary-green/10',
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: Activity,
      color: 'text-islamic-primary-teal',
      bgColor: 'bg-islamic-primary-teal/10',
    },
    {
      title: 'Total Queries',
      value: stats.totalQueries,
      icon: MessageSquare,
      color: 'text-islamic-primary-gold',
      bgColor: 'bg-islamic-primary-gold/10',
    },
    {
      title: 'Today\'s Queries',
      value: stats.todayQueries,
      icon: Activity,
      color: 'text-islamic-primary-green',
      bgColor: 'bg-islamic-primary-green/10',
    },
    {
      title: 'Documents',
      value: stats.totalDocuments,
      icon: FileText,
      color: 'text-islamic-primary-teal',
      bgColor: 'bg-islamic-primary-teal/10',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-islamic-cream/30 via-white to-islamic-gold/10 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-islamic-dark">Admin Dashboard</h1>
          <p className="text-islamic-dark/70 mt-2">Manage your XamSaDine AI platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border border-islamic-gold/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-islamic-dark/70">{stat.title}</p>
                    <p className="text-2xl font-bold text-islamic-dark mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border border-islamic-gold/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="islamicOutline"
                className="w-full justify-start"
                onClick={() => navigate('/admin/config')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Configure AI Models
              </Button>
              <Button
                variant="islamicOutline"
                className="w-full justify-start"
                onClick={() => navigate('/documents')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Manage Documents
              </Button>
              <Button
                variant="islamicOutline"
                className="w-full justify-start"
                onClick={() => navigate('/admin/events')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Manage Events
              </Button>
              <Button
                variant="islamicOutline"
                className="w-full justify-start"
                onClick={() => navigate('/admin/videos')}
              >
                <Video className="mr-2 h-4 w-4" />
                Manage Videos
              </Button>
              <Button
                variant="islamicOutline"
                className="w-full justify-start"
                onClick={() => navigate('/admin/products')}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Manage Products
              </Button>
              <Button
                variant="islamicOutline"
                className="w-full justify-start"
                onClick={() => navigate('/admin/library')}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Manage Library
              </Button>
              <Button
                variant="islamicOutline"
                className="w-full justify-start"
                onClick={() => window.open('/api/council/health', '_blank')}
              >
                <Activity className="mr-2 h-4 w-4" />
                Check System Health
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-islamic-gold/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-islamic-dark/70">Active Sessions</span>
                <span className="text-sm font-medium">{stats.activeUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-islamic-dark/70">New Users Today</span>
                <span className="text-sm font-medium">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-islamic-dark/70">Admin Users</span>
                <span className="text-sm font-medium">3</span>
              </div>
              <Button
                variant="islamicOutline"
                className="w-full mt-4"
                onClick={() => navigate('/admin/users')}
              >
                View All Users
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white/80 backdrop-blur-sm border border-islamic-gold/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { user: 'amadou.diop@xamsadine.sn', action: 'Asked about prayer times', time: '2 min ago' },
                { user: 'admin@xamsadine.ai', action: 'Uploaded new document', time: '15 min ago' },
                { user: 'student@islam.edu', action: 'Queried about Zakat', time: '1 hour ago' },
                { user: 'scholar@islamic.org', action: 'Updated AI model config', time: '2 hours ago' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-islamic-gold/20 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-islamic-dark">{activity.user}</p>
                    <p className="text-sm text-islamic-dark/70">{activity.action}</p>
                  </div>
                  <span className="text-xs text-islamic-dark/60">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
