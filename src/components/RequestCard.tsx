
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MaintenanceStatusBadge from '@/components/MaintenanceStatusBadge';
import { MaintenanceRequest } from '@/contexts/MaintenanceContext';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

interface RequestCardProps {
  request: MaintenanceRequest;
}

const RequestCard: React.FC<RequestCardProps> = ({ request }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const getDetailPath = () => {
    switch (user?.role) {
      case 'renter':
        return `/renter/request/${request.id}`;
      case 'landlord':
        return `/landlord/request/${request.id}`;
      case 'admin':
        return `/admin/request/${request.id}`;
      default:
        return '/';
    }
  };
  
  return (
    <Card className="glass-card overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{request.category.charAt(0).toUpperCase() + request.category.slice(1)} Issue</CardTitle>
            <CardDescription className="line-clamp-1">
              {request.propertyAddress}
            </CardDescription>
          </div>
          <MaintenanceStatusBadge status={request.status} />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm line-clamp-2 text-muted-foreground mb-2">{request.description}</p>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Submitted by: {request.renterName}</span>
          <span>{formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate(getDetailPath())}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RequestCard;
