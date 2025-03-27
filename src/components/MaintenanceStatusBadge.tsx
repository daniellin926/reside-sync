
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { RequestStatus } from '@/contexts/MaintenanceContext';

interface StatusConfig {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
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
};

interface MaintenanceStatusBadgeProps {
  status: RequestStatus;
}

const MaintenanceStatusBadge: React.FC<MaintenanceStatusBadgeProps> = ({ status }) => {
  const config = statusConfigs[status] || { label: 'Unknown', variant: 'outline' };
  
  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};

export default MaintenanceStatusBadge;
