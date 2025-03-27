
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PortalLayout from '@/components/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMaintenance } from '@/contexts/MaintenanceContext';
import { useAuth } from '@/contexts/AuthContext';
import MaintenanceStatusBadge from '@/components/MaintenanceStatusBadge';
import { format } from 'date-fns';
import { ArrowLeft, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const RequestDetail = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { getRequestById, confirmSchedule } = useMaintenance();
  const { user } = useAuth();
  
  if (!requestId) {
    navigate('/renter');
    return null;
  }
  
  const request = getRequestById(requestId);
  
  if (!request) {
    navigate('/renter');
    return null;
  }
  
  // If this request doesn't belong to the current user, redirect
  if (user?.id !== request.renterId) {
    navigate('/renter');
    return null;
  }
  
  const handleConfirmSchedule = () => {
    confirmSchedule(requestId, true);
    toast.success('Schedule confirmed!');
  };
  
  const handleRequestReschedule = () => {
    confirmSchedule(requestId, false);
    toast.info('Reschedule requested');
  };
  
  // Format dates for display
  const createdDate = format(new Date(request.createdAt), 'PPP');
  const scheduledDate = request.scheduledDate 
    ? format(new Date(request.scheduledDate), 'PPP')
    : null;
  
  return (
    <PortalLayout title="Request Details">
      <div className="max-w-3xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate('/renter')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <div className="space-y-6">
          <Card className="glass-card border-none shadow-md">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>
                  {request.category.charAt(0).toUpperCase() + request.category.slice(1)} Issue
                </CardTitle>
                <CardDescription>
                  {request.propertyAddress}
                </CardDescription>
              </div>
              <MaintenanceStatusBadge status={request.status} />
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-1">Description</h3>
                <p className="text-muted-foreground">{request.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Timeline</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Submitted:</span>
                    <span>{createdDate}</span>
                  </div>
                  {scheduledDate && (
                    <div className="flex justify-between text-sm">
                      <span>Scheduled for:</span>
                      <span>{scheduledDate}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Show images if any */}
              {request.images && request.images.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Images</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {request.images.map((image, index) => (
                      <div key={index} className="rounded-md overflow-hidden aspect-square">
                        <img 
                          src={image} 
                          alt={`Request image ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Schedule confirmation */}
              {request.status === 'scheduled' && !request.isConfirmed && (
                <Card className="bg-primary/5 border border-primary/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Maintenance Scheduled</CardTitle>
                    </div>
                    <CardDescription>
                      Please confirm if this time works for you
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="font-medium">{scheduledDate}</p>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button onClick={handleConfirmSchedule} className="flex-1">
                      Confirm Schedule
                    </Button>
                    <Button variant="outline" onClick={handleRequestReschedule} className="flex-1">
                      Request Reschedule
                    </Button>
                  </CardFooter>
                </Card>
              )}
              
              {/* Confirmed schedule */}
              {request.status === 'scheduled' && request.isConfirmed && (
                <Card className="bg-green-50 border border-green-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-green-600" />
                      <CardTitle className="text-lg text-green-800">Maintenance Confirmed</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">Scheduled for {scheduledDate}</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
};

export default RequestDetail;
