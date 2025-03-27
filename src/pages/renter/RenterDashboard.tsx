
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '@/components/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMaintenance } from '@/contexts/MaintenanceContext';
import { useAuth } from '@/contexts/AuthContext';
import RequestCard from '@/components/RequestCard';
import EmptyState from '@/components/EmptyState';
import { Plus, FileText } from 'lucide-react';

const RenterDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getRequestsByRenterId } = useMaintenance();
  
  const requests = user ? getRequestsByRenterId(user.id) : [];
  const activeRequests = requests.filter(r => 
    !['completed', 'declined'].includes(r.status)
  );
  const completedRequests = requests.filter(r => 
    ['completed', 'declined'].includes(r.status)
  );

  return (
    <PortalLayout title="Renter Dashboard">
      <div className="space-y-8">
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <h2 className="text-2xl font-semibold">Welcome back, {user?.name}</h2>
          <Button onClick={() => navigate('/renter/create-request')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Submit New Request
          </Button>
        </div>

        {/* Active requests */}
        <Card>
          <CardHeader>
            <CardTitle>Active Requests</CardTitle>
            <CardDescription>
              Your ongoing maintenance requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeRequests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeRequests.map(request => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No active requests"
                description="You don't have any active maintenance requests."
                icon={<FileText className="h-10 w-10" />}
                action={
                  <Button variant="outline" onClick={() => navigate('/renter/create-request')}>
                    Submit a Request
                  </Button>
                }
              />
            )}
          </CardContent>
        </Card>

        {/* Completed requests */}
        {completedRequests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Past Requests</CardTitle>
              <CardDescription>
                Your completed or declined maintenance requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedRequests.map(request => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PortalLayout>
  );
};

export default RenterDashboard;
