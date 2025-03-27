
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PortalLayout from '@/components/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMaintenance } from '@/contexts/MaintenanceContext';
import MaintenanceStatusBadge from '@/components/MaintenanceStatusBadge';
import { format, addDays } from 'date-fns';
import { ArrowLeft, Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';

const RequestDetail = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { getRequestById, addBid } = useMaintenance();
  
  // State for the bid form
  const [price, setPrice] = useState('');
  const [storeName, setStoreName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [availableDates, setAvailableDates] = useState<string[]>([
    format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    format(addDays(new Date(), 5), 'yyyy-MM-dd')
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!requestId) {
    navigate('/admin');
    return null;
  }
  
  const request = getRequestById(requestId);
  
  if (!request) {
    navigate('/admin');
    return null;
  }
  
  const handleAddDate = () => {
    const newDate = format(addDays(new Date(), availableDates.length + 3), 'yyyy-MM-dd');
    setAvailableDates([...availableDates, newDate]);
  };
  
  const handleRemoveDate = (index: number) => {
    setAvailableDates(availableDates.filter((_, i) => i !== index));
  };
  
  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!price || !storeName || !phoneNumber || availableDates.length === 0) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    // Convert price to number
    const numericPrice = parseFloat(price);
    
    if (isNaN(numericPrice)) {
      toast.error('Please enter a valid price');
      setIsSubmitting(false);
      return;
    }
    
    // Add the bid
    addBid(requestId, {
      price: numericPrice,
      storeName,
      phoneNumber,
      availableDates,
    });
    
    // Reset form
    setPrice('');
    setStoreName('');
    setPhoneNumber('');
    setAvailableDates([
      format(addDays(new Date(), 3), 'yyyy-MM-dd'),
      format(addDays(new Date(), 5), 'yyyy-MM-dd')
    ]);
    setIsSubmitting(false);
    
    navigate('/admin');
  };
  
  // Format dates for display
  const createdDate = format(new Date(request.createdAt), 'PPP');
  
  // Check if bid has already been submitted by this admin
  const hasBidSubmitted = request.bids.length > 0;
  
  return (
    <PortalLayout title="Request Details">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate('/admin')}
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
          </Card>
          
          {/* Bid submission form */}
          {request.status === 'seeking_bids' && (
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Submit Bid</CardTitle>
                <CardDescription>
                  Provide your bid details for this maintenance request
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitBid} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="Enter price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Service Provider</Label>
                    <Input
                      id="storeName"
                      placeholder="Enter store/company name"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      placeholder="Enter phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Available Dates</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddDate}
                        className="h-8 text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Date
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {availableDates.map((date, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            type="date"
                            value={date}
                            onChange={(e) => {
                              const newDates = [...availableDates];
                              newDates[index] = e.target.value;
                              setAvailableDates(newDates);
                            }}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveDate(index)}
                            disabled={availableDates.length <= 1}
                            className="h-8 w-8"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <CardFooter className="px-0 pt-4">
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting || hasBidSubmitted}
                    >
                      {isSubmitting ? 'Submitting...' : hasBidSubmitted ? 'Bid Already Submitted' : 'Submit Bid'}
                    </Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>
          )}
          
          {/* Already submitted bids */}
          {(request.status !== 'seeking_bids' || hasBidSubmitted) && (
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Bid Status</CardTitle>
              </CardHeader>
              <CardContent>
                {hasBidSubmitted ? (
                  <div className="text-center py-4">
                    <p className="text-green-600 font-medium mb-2">
                      Your bid has been submitted
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Waiting for landlord to review all bids
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">
                      This request is no longer accepting bids
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PortalLayout>
  );
};

export default RequestDetail;
