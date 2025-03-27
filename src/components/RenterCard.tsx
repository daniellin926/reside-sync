
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Home, DollarSign, FileText } from 'lucide-react';

interface RenterCardProps {
  renter: {
    id: string;
    name: string;
    email: string;
    address: string;
    rent: number;
    activeRequests: number;
  };
}

const RenterCard: React.FC<RenterCardProps> = ({ renter }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-2">
        <CardTitle>{renter.name}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Mail className="h-3.5 w-3.5" />
          {renter.email}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3 space-y-3">
        <div className="flex items-start gap-2">
          <Home className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <span>{renter.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">${renter.rent}/month</span>
        </div>
        {renter.activeRequests > 0 && (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>
              <span className="font-medium">{renter.activeRequests}</span> active request{renter.activeRequests > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate(`/landlord/renter/${renter.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RenterCard;
