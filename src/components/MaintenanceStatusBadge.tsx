
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { RequestStatus } from '@/contexts/MaintenanceContext';

interface StatusConfig {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'warning';
}

const statusConfigs: Record<RequestStatus, StatusConfig> = {
  'submitted': { label: 'Submitted', variant: 'default' },
  'pending_approval': { label: 'Pending Approval', variant: 'secondary' },
  'seeking_bids': { label: 'Seeking Bids', variant: 'secondary' },
  'bids_received': { label: 'Bids Received', variant: 'secondary' },
  'bid_accepted': { label: 'Bid Accepted', variant: 'default' },
  'scheduled': { label: 'Scheduled', variant: 'default' },
  'completed': { label: 'Completed', variant: 'outline' },
  'declined': { label: 'Declined', variant: 'destructive' },
  'rebid_requested': { label: 'Rebid Requested', variant: 'warning' },
};

// Add a new variant prop to the Badge component
const variantStyles = {
  warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200'
};

interface MaintenanceStatusBadgeProps {
  status: RequestStatus;
}

const MaintenanceStatusBadge: React.FC<MaintenanceStatusBadgeProps> = ({ status }) => {
  const config = statusConfigs[status] || { label: 'Unknown', variant: 'outline' };
  
  // For 'warning' variant, apply custom class names
  if (config.variant === 'warning') {
    return (
      <Badge className={variantStyles.warning}>
        {config.label}
      </Badge>
    );
  }
  
  return (
    <Badge variant={config.variant as 'default' | 'secondary' | 'destructive' | 'outline'}>
      {config.label}
    </Badge>
  );
};

export default MaintenanceStatusBadge;
