
import React, { useState } from 'react';
import PortalLayout from '@/components/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMaintenance } from '@/contexts/MaintenanceContext';
import { useAuth } from '@/contexts/AuthContext';
import RequestCard from '@/components/RequestCard';
import EmptyState from '@/components/EmptyState';
import { FileText, CircleDollarSign, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { requests } = useMaintenance();
  const [activeTab, setActiveTab] = useState('new');
  
  // Filter requests by status
  const newBidRequests = requests.filter(r => r.status === 'seeking_bids');
  const activeBidRequests = requests.filter(r => r.status === 'bids_received');
  const scheduledRequests = requests.filter(r => r.status === 'scheduled');
  const completedRequests = requests.filter(r => ['completed', 'declined'].includes(r.status));

  return (
    <PortalLayout title="Admin Dashboard">
      <div className="space-y-8">
        {/* Welcome section */}
        <div>
          <h2 className="text-2xl font-semibold">Welcome back, {user?.name}</h2>
          <p className="text-muted-foreground">
            Manage maintenance requests and bidding
          </p>
        </div>

        {/* Status overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="New Requests"
            value={newBidRequests.length}
            description="Waiting for bids"
            icon={<CircleDollarSign className="h-5 w-5" />}
            onClick={() => setActiveTab('new')}
          />
          <StatsCard
            title="Active Bids"
            value={activeBidRequests.length}
            description="Bids submitted, pending approval"
            icon={<FileText className="h-5 w-5" />}
            onClick={() => setActiveTab('active')}
          />
          <StatsCard
            title="Scheduled"
            value={scheduledRequests.length}
            description="Upcoming maintenance"
            icon={<CheckCircle className="h-5 w-5" />}
            onClick={() => setActiveTab('scheduled')}
          />
          <StatsCard
            title="Completed"
            value={completedRequests.length}
            description="Resolved requests"
            icon={<FileText className="h-5 w-5" />}
            onClick={() => setActiveTab('completed')}
          />
        </div>

        {/* Request tabs */}
        <Tabs defaultValue="new" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-md mb-6">
            <TabsTrigger value="new">New Requests</TabsTrigger>
            <TabsTrigger value="active">Active Bids</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="new" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>New Bid Requests</CardTitle>
                <CardDescription>
                  Maintenance requests awaiting bids from service providers
                </CardDescription>
              </CardHeader>
              <CardContent>
                {newBidRequests.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {newBidRequests.map(request => (
                      <RequestCard key={request.id} request={request} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No new requests"
                    description="There are no new maintenance requests requiring bids."
                    icon={<CircleDollarSign className="h-10 w-10" />}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="active" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Active Bids</CardTitle>
                <CardDescription>
                  Requests with submitted bids, pending landlord approval
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeBidRequests.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeBidRequests.map(request => (
                      <RequestCard key={request.id} request={request} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No active bids"
                    description="There are no active bids waiting for approval."
                    icon={<FileText className="h-10 w-10" />}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="scheduled" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Maintenance</CardTitle>
                <CardDescription>
                  Upcoming maintenance appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {scheduledRequests.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {scheduledRequests.map(request => (
                      <RequestCard key={request.id} request={request} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No scheduled maintenance"
                    description="There are no upcoming maintenance appointments."
                    icon={<CheckCircle className="h-10 w-10" />}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Completed Requests</CardTitle>
                <CardDescription>
                  Maintenance requests that have been resolved
                </CardDescription>
              </CardHeader>
              <CardContent>
                {completedRequests.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {completedRequests.map(request => (
                      <RequestCard key={request.id} request={request} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No completed requests"
                    description="There are no completed maintenance requests."
                    icon={<FileText className="h-10 w-10" />}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  );
};

interface StatsCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, description, icon, onClick }) => {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="text-primary">{icon}</div>
          </div>
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
