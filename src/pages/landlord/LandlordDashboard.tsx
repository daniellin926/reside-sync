
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '@/components/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useMaintenance } from '@/contexts/MaintenanceContext';
import { useAuth } from '@/contexts/AuthContext';
import RequestCard from '@/components/RequestCard';
import EmptyState from '@/components/EmptyState';
import { FileText, Bell } from 'lucide-react';

const LandlordDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { requests } = useMaintenance();
  const [activeTab, setActiveTab] = useState('new');
  
  // In a real app, we would filter by landlord ID
  // Here we just show all requests for demo purposes
  const submittedRequests = requests.filter(r => r.status === 'submitted');
  const pendingApprovalRequests = requests.filter(r => r.status === 'pending_approval');
  const activeBidsRequests = requests.filter(r => ['seeking_bids', 'bids_received'].includes(r.status));
  const scheduledRequests = requests.filter(r => r.status === 'scheduled');
  const completedRequests = requests.filter(r => r.status === 'completed');
  const allActiveRequests = [...submittedRequests, ...pendingApprovalRequests, ...activeBidsRequests, ...scheduledRequests];

  return (
    <PortalLayout title="Landlord Dashboard">
      <div className="space-y-8">
        {/* Welcome section */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Welcome back, {user?.name}</h2>
          <Button variant="outline" onClick={() => navigate('/landlord/properties')}>
            Manage Properties
          </Button>
        </div>

        {/* Status overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="New Requests"
            value={submittedRequests.length}
            description="Waiting for your review"
            onClick={() => setActiveTab('new')}
          />
          <StatsCard
            title="Seeking Bids"
            value={activeBidsRequests.length}
            description="Requests with active bidding"
            onClick={() => setActiveTab('active')}
          />
          <StatsCard
            title="Scheduled"
            value={scheduledRequests.length}
            description="Upcoming maintenance"
            onClick={() => setActiveTab('scheduled')}
          />
          <StatsCard
            title="Completed"
            value={completedRequests.length}
            description="Resolved requests"
            onClick={() => setActiveTab('completed')}
          />
        </div>

        {/* Request tabs */}
        <Tabs defaultValue="new" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-md mb-6">
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="new" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>New Requests</CardTitle>
                <CardDescription>
                  Maintenance requests awaiting your review
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submittedRequests.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {submittedRequests.map(request => (
                      <RequestCard key={request.id} request={request} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No new requests"
                    description="There are no new maintenance requests to review."
                    icon={<Bell className="h-10 w-10" />}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="active" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Active Requests</CardTitle>
                <CardDescription>
                  Requests that are being processed
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeBidsRequests.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeBidsRequests.map(request => (
                      <RequestCard key={request.id} request={request} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No active requests"
                    description="There are no requests currently seeking bids."
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
                    icon={<FileText className="h-10 w-10" />}
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
  onClick: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, description, onClick }) => {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className="p-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LandlordDashboard;
