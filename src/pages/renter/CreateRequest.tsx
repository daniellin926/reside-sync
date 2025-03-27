
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '@/components/PortalLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useMaintenance, MaintenanceCategory } from '@/contexts/MaintenanceContext';
import { ArrowLeft, Upload } from 'lucide-react';

// Sample mock properties for the renter
const MOCK_PROPERTIES = [
  {
    id: '1',
    address: '123 Main St, Apt 4B',
  }
];

const CATEGORY_OPTIONS: { value: MaintenanceCategory; label: string }[] = [
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'appliance', label: 'Appliance' },
  { value: 'heating/cooling', label: 'Heating / Cooling' },
  { value: 'structural', label: 'Structural' },
  { value: 'other', label: 'Other' },
];

const CreateRequest = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createRequest } = useMaintenance();
  
  const [propertyId, setPropertyId] = useState(MOCK_PROPERTIES[0].id);
  const [category, setCategory] = useState<MaintenanceCategory>('plumbing');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        if (reader.result) {
          setImages([...images, reader.result.toString()]);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsSubmitting(true);
    
    // Find the property from our mock data
    const property = MOCK_PROPERTIES.find(p => p.id === propertyId);
    
    if (!property) {
      toast.error('Property not found');
      setIsSubmitting(false);
      return;
    }
    
    // Create the request
    createRequest({
      renterId: user.id,
      renterName: user.name,
      propertyId,
      propertyAddress: property.address,
      category,
      description,
      images,
    });
    
    navigate('/renter/request-submitted');
  };
  
  return (
    <PortalLayout title="Submit Maintenance Request">
      <div className="max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate('/renter')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <Card className="glass-card border-none shadow-md">
          <CardHeader>
            <CardTitle>Submit a New Maintenance Request</CardTitle>
            <CardDescription>
              Please provide details about the issue you're experiencing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="property">Property</Label>
                <Select defaultValue={propertyId} onValueChange={setPropertyId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_PROPERTIES.map(property => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Issue Category</Label>
                <Select defaultValue={category} onValueChange={(value) => setCategory(value as MaintenanceCategory)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Please describe the issue in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Images (Optional)</Label>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                      <img 
                        src={image} 
                        alt={`Uploaded preview ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                      >
                        &times;
                      </Button>
                    </div>
                  ))}
                  
                  {images.length < 3 && (
                    <div className="border-2 border-dashed border-muted-foreground/30 rounded-md flex items-center justify-center aspect-square">
                      <Label 
                        htmlFor="image-upload" 
                        className="cursor-pointer flex flex-col items-center justify-center h-full w-full text-sm text-muted-foreground"
                      >
                        <Upload className="h-6 w-6 mb-2" />
                        <span>Upload Image</span>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </Label>
                    </div>
                  )}
                </div>
              </div>
              
              <CardFooter className="px-0 pt-4">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
};

export default CreateRequest;
