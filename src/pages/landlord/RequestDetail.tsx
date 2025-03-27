
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PortalLayout from '@/components/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMaintenance, RequestStatus } from '@/contexts/MaintenanceContext';
import MaintenanceStatusBadge from '@/components/MaintenanceStatusBadge';
import { format } from 'date-fns';
import { ArrowLeft, CheckCircle, XCircle, CircleDollarSign } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const RequestDetail = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { getRequestById, updateRequestStatus, acceptBid } = useMaintenance();
  
  if (!requestId) {
    navigate('/landlord');
    return null;
  }
  
  const request = getRequestById(requestId);
  
  if (!request) {
    navigate('/landlord');
    return null;
  }
  
  const handleUpdateStatus = (status: RequestStatus) => {
    updateRequestStatus(requestId, status);
  };
  
  const handleApproveRequest = () => {
    updateRequestStatus(requestId, 'seeking_bids');
  };
  
  const handleDeclineRequest = () => {
    updateRequestStatus(requestId, 'declined');
  };
  
  const handleAcceptBid = (bidId: string) => {
    acceptBid(requestId, bidId);
  };
  
  const handleRequestMoreBids = () => {
    updateRequestStatus(requestId, 'seeking_bids');
    toast.info('Request for additional bids sent');
  };
  
  // Format dates for display
  const createdDate = format(new Date(request.createdAt), 'PPP');
  const formattedBids = request.bids.map(bid => ({
    ...bid,
    createdDate: format(new Date(bid.createdAt), 'PPP'),
    formattedDates: bid.availableDates.map(date => format(new Date(date), 'PPP')),
  }));
  
  return (
    <PortalLayout title="Request Details">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate('/landlord')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Request details */}
          <Card className="glass-card border-none shadow-md lg:col-span-2">
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
                <h3 className="text-sm font-medium mb-1">Submitted by</h3>
                <p className="text-muted-foreground">{request.renterName}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Timeline</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Submitted:</span>
                    <span>{createdDate}</span>
                  </div>
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
            </CardContent>
            
            {/* Action buttons for submitted requests */}
            {request.status === 'submitted' && (
              <CardFooter className="flex gap-2">
                <Button 
                  onClick={handleApproveRequest} 
                  className="flex-1"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve & Seek Bids
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleDeclineRequest} 
                  className="flex-1"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Decline Request
                </Button>
              </CardFooter>
            )}
          </Card>
          
          {/* Bids panel */}
          <div className="space-y-4 lg:col-span-1">
            {request.bids.length > 0 ? (
              <>
                <h3 className="text-lg font-medium">
                  Bids
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({request.bids.length})
                  </span>
                </h3>
                <div className="space-y-4">
                  {formattedBids.map((bid, index) => (
                    <Card 
                      key={bid.id} 
                      className={`overflow-hidden ${request.acceptedBidId === bid.id ? 'border-primary' : ''}`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{bid.storeName}</CardTitle>
                          <span className="font-semibold text-lg">${bid.price}</span>
                        </div>
                        <CardDescription>
                          <a href={`tel:${bid.phoneNumber}`}>{bid.phoneNumber}</a>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium">Available Dates:</h4>
                          <ul className="text-sm space-y-1">
                            {bid.formattedDates.map((date, i) => (
                              <li key={i}>{date}</li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                      {request.status === 'bids_received' && (
                        <CardFooter>
                          <Button 
                            onClick={() => handleAcceptBid(bid.id)} 
                            className="w-full"
                            variant={request.acceptedBidId === bid.id ? 'outline' : 'default'}
                          >
                            {request.acceptedBidId === bid.id ? 'Selected' : 'Select Bid'}
                          </Button>
                        </CardFooter>
                      )}
                    </Card>
                  ))}
                  
                  {request.status === 'bids_received' && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleRequestMoreBids}
                    >
                      Request More Bids
                    </Button>
                  )}
                </div>
              </>
            ) : (
              request.status === 'seeking_bids' && (
                <Card className="p-6 text-center">
                  <CircleDollarSign className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Awaiting Bids</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Service providers are reviewing this request and will submit bids soon.
                  </p>
                </Card>
              )
            )}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default RequestDetail;
