
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '@/components/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, FileText } from 'lucide-react';

const RequestSubmitted = () => {
  const navigate = useNavigate();
  
  return (
    <PortalLayout title="Request Submitted">
      <div className="max-w-md mx-auto">
        <Card className="glass-card border-none shadow-md text-center animate-fade-in">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Request Submitted Successfully!</CardTitle>
            <CardDescription>
              Your maintenance request has been sent to your landlord
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your landlord will review your request and you'll be notified when there's an update.
            </p>
            
            <div className="rounded-lg bg-primary/5 p-4 text-left">
              <h4 className="font-medium mb-2">What happens next?</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">1.</span> 
                  <span>Landlord reviews your request</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2.</span> 
                  <span>If approved, service providers will send bids</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3.</span> 
                  <span>Your landlord selects a service provider</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">4.</span> 
                  <span>You'll be notified of the scheduled maintenance time</span>
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              className="w-full" 
              onClick={() => navigate('/renter')}
            >
              <Home className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/renter/create-request')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Submit Another Request
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PortalLayout>
  );
};

export default RequestSubmitted;
