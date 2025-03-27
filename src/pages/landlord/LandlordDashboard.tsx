
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
import { FileText, Bell, Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// Mock renter data for the landlord dashboard
const MOCK_RENTERS = [
  {
    id: '1',
    name: 'Robert Renter',
    email: 'renter@example.com',
    address: '123 Main St, Apt 4B',
    rent: 1250,
    dueDate: '1st of month',
    activeRequests: 2
  },
  {
    id: '3',
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    address: '456 Oak Ave',
    rent: 1450,
    dueDate: '5th of month',
    activeRequests: 0
  },
  {
    id: '4',
    name: 'Michael Johnson',
    email: 'michael@example.com',
    address: '789 Pine Lane, Unit 12',
    rent: 1100,
    dueDate: '1st of month',
    activeRequests: 1
  }
];

const LandlordDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { requests } = useMaintenance();
  const [activeTab, setActiveTab] = useState('new');
  const [renterTab, setRenterTab] = useState('list');
  
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
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/landlord/properties')}>
              Manage Properties
            </Button>
          </div>
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

        {/* Renters Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                My Renters
              </CardTitle>
              <CardDescription>
                Manage your property renters and their requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="list" value={renterTab} onValueChange={setRenterTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="list">Renter List</TabsTrigger>
                  <TabsTrigger value="requests">Renter Requests</TabsTrigger>
                </TabsList>
                
                <TabsContent value="list">
                  <div className="border rounded-md">
                    <div className="grid grid-cols-6 gap-4 p-4 font-medium border-b">
                      <div className="col-span-2">Renter</div>
                      <div className="col-span-2">Address</div>
                      <div className="col-span-1">Monthly Rent</div>
                      <div className="col-span-1">Requests</div>
                    </div>
                    {MOCK_RENTERS.map((renter) => (
                      <div 
                        key={renter.id}
                        className="grid grid-cols-6 gap-4 p-4 border-b hover:bg-muted/50 cursor-pointer"
                        onClick={() => navigate(`/landlord/renter/${renter.id}`)}
                      >
                        <div className="col-span-2">
                          <div className="font-medium">{renter.name}</div>
                          <div className="text-sm text-muted-foreground">{renter.email}</div>
                        </div>
                        <div className="col-span-2 flex items-center">{renter.address}</div>
                        <div className="col-span-1 flex items-center">${renter.rent}/month</div>
                        <div className="col-span-1 flex items-center">
                          {renter.activeRequests > 0 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                              {renter.activeRequests} active
                            </span>
                          ) : (
                            <span className="text-muted-foreground">None</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="requests">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allActiveRequests.length > 0 ? (
                      allActiveRequests.map(request => (
                        <RequestCard key={request.id} request={request} />
                      ))
                    ) : (
                      <EmptyState
                        title="No active requests"
                        description="There are no maintenance requests from your renters."
                        icon={<FileText className="h-10 w-10" />}
                        className="col-span-full"
                      />
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
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
