
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

export type MaintenanceCategory = 
  'plumbing' | 
  'electrical' | 
  'appliance' | 
  'heating/cooling' | 
  'structural' | 
  'other';

export interface Bid {
  id: string;
  price: number;
  availableDates: string[];
  storeName: string;
  phoneNumber: string;
  createdAt: string;
}

export type RequestStatus = 
  'submitted' | 
  'pending_approval' | 
  'seeking_bids' | 
  'bids_received' | 
  'bid_accepted' | 
  'scheduled' | 
  'completed' | 
  'declined' |
  'rebid_requested';

export interface MaintenanceRequest {
  id: string;
  renterId: string;
  renterName: string;
  propertyId: string;
  propertyAddress: string;
  category: MaintenanceCategory;
  description: string;
  images: string[];
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  bids: Bid[];
  acceptedBidId?: string;
  scheduledDate?: string;
  isConfirmed?: boolean;
  completedDate?: string;
  completedNotes?: string;
  rebidRequired?: boolean;
  rebidReason?: string;
  rebidApproved?: boolean;
}

interface MaintenanceContextType {
  requests: MaintenanceRequest[];
  createRequest: (request: Omit<MaintenanceRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'bids'>) => void;
  updateRequestStatus: (requestId: string, status: RequestStatus) => void;
  addBid: (requestId: string, bid: Omit<Bid, 'id' | 'createdAt'>) => void;
  acceptBid: (requestId: string, bidId: string) => void;
  confirmSchedule: (requestId: string, confirmed: boolean) => void;
  getRequestById: (requestId: string) => MaintenanceRequest | undefined;
  getRequestsByRenterId: (renterId: string) => MaintenanceRequest[];
  getAllRequests: () => MaintenanceRequest[];
  markRequestComplete: (requestId: string, notes?: string) => void;
  requestRebid: (requestId: string, reason: string) => void;
  approveRebid: (requestId: string, approved: boolean) => void;
}

// Mock property data
const MOCK_PROPERTIES = {
  '1': {
    id: '1',
    address: '123 Main St, Apt 4B',
    landlordId: '2',
  },
  '2': {
    id: '2',
    address: '456 Oak Ave',
    landlordId: '2',
  }
};

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export const MaintenanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);

  useEffect(() => {
    // Load requests from localStorage if available
    const storedRequests = localStorage.getItem('maintenanceRequests');
    if (storedRequests) {
      setRequests(JSON.parse(storedRequests));
    }
  }, []);

  // Save requests to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('maintenanceRequests', JSON.stringify(requests));
  }, [requests]);

  const createRequest = (
    requestData: Omit<MaintenanceRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'bids'>
  ) => {
    const newRequest: MaintenanceRequest = {
      ...requestData,
      id: Math.random().toString(36).substring(2, 9),
      status: 'submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bids: [],
    };

    setRequests(prev => [...prev, newRequest]);
    toast.success('Maintenance request submitted successfully!');
  };

  const updateRequestStatus = (requestId: string, status: RequestStatus) => {
    setRequests(prev =>
      prev.map(request =>
        request.id === requestId
          ? { ...request, status, updatedAt: new Date().toISOString() }
          : request
      )
    );

    const statusMessages = {
      'pending_approval': 'Request is pending approval',
      'seeking_bids': 'Now seeking bids for this request',
      'bids_received': 'Bids have been received',
      'bid_accepted': 'A bid has been accepted',
      'scheduled': 'Maintenance has been scheduled',
      'completed': 'Request has been completed',
      'declined': 'Request has been declined',
      'rebid_requested': 'Rebid has been requested'
    };

    toast.info(statusMessages[status] || 'Request status updated');
  };

  const addBid = (requestId: string, bidData: Omit<Bid, 'id' | 'createdAt'>) => {
    const newBid: Bid = {
      ...bidData,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };

    setRequests(prev =>
      prev.map(request =>
        request.id === requestId
          ? {
              ...request,
              bids: [...request.bids, newBid],
              status: 'bids_received',
              updatedAt: new Date().toISOString(),
            }
          : request
      )
    );

    toast.success('Bid submitted successfully!');
  };

  const acceptBid = (requestId: string, bidId: string) => {
    setRequests(prev =>
      prev.map(request =>
        request.id === requestId
          ? {
              ...request,
              acceptedBidId: bidId,
              status: 'scheduled',
              updatedAt: new Date().toISOString(),
              scheduledDate: request.bids.find(bid => bid.id === bidId)?.availableDates[0],
            }
          : request
      )
    );

    toast.success('Bid accepted! Awaiting renter confirmation.');
  };

  const confirmSchedule = (requestId: string, confirmed: boolean) => {
    setRequests(prev =>
      prev.map(request =>
        request.id === requestId
          ? {
              ...request,
              isConfirmed: confirmed,
              status: confirmed ? 'scheduled' : 'bid_accepted',
              updatedAt: new Date().toISOString(),
            }
          : request
      )
    );

    if (confirmed) {
      toast.success('Schedule confirmed!');
    } else {
      toast.info('Reschedule requested.');
    }
  };

  // New function to mark a request as complete
  const markRequestComplete = (requestId: string, notes?: string) => {
    setRequests(prev =>
      prev.map(request =>
        request.id === requestId
          ? {
              ...request,
              status: 'completed',
              completedDate: new Date().toISOString(),
              completedNotes: notes || 'Work completed successfully.',
              updatedAt: new Date().toISOString(),
            }
          : request
      )
    );

    toast.success('Maintenance request marked as complete!');
  };

  // New function to request a rebid
  const requestRebid = (requestId: string, reason: string) => {
    setRequests(prev =>
      prev.map(request =>
        request.id === requestId
          ? {
              ...request,
              rebidRequired: true,
              rebidReason: reason,
              updatedAt: new Date().toISOString(),
            }
          : request
      )
    );

    toast.info('Rebid request submitted to landlord for approval.');
  };

  // New function for landlord to approve/decline rebid
  const approveRebid = (requestId: string, approved: boolean) => {
    setRequests(prev =>
      prev.map(request =>
        request.id === requestId
          ? {
              ...request,
              rebidApproved: approved,
              status: approved ? 'seeking_bids' : request.status,
              updatedAt: new Date().toISOString(),
            }
          : request
      )
    );
  };

  const getRequestById = (requestId: string) => {
    return requests.find(request => request.id === requestId);
  };

  const getRequestsByRenterId = (renterId: string) => {
    return requests.filter(request => request.renterId === renterId);
  };

  const getAllRequests = () => {
    return [...requests];
  };

  return (
    <MaintenanceContext.Provider
      value={{
        requests,
        createRequest,
        updateRequestStatus,
        addBid,
        acceptBid,
        confirmSchedule,
        getRequestById,
        getRequestsByRenterId,
        getAllRequests,
        markRequestComplete,
        requestRebid,
        approveRebid,
      }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = () => {
  const context = useContext(MaintenanceContext);
  if (context === undefined) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  return context;
};
