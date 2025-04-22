import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Image, LogOut, X, Check, MessageSquare } from 'lucide-react';
import { Enq } from '@/types/enq';
import { updateEnq, addEnq,deleteEnq, getEnq} from '@/services/enqService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {baseURL} from '../content/url'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useProps, useEnq } from '../hooks/useAuth';
import logo from '../image/logo.png';
import { Property } from '@/types/property';
import { FormControl, FormField, FormItem, FormLabel } from './ui/form';

type PropertyEnquiryProps = {
  children: React.ReactNode;
};


export function PropertyEnquiry({ children }: PropertyEnquiryProps) {

    const [properties, setProperties]= useState<Property[]>([]);
    const [enquiry, setEnquiry] = useState<Enq[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentEnq, setCurrentEnq] = useState<Partial<Enq>>({
      name:'',
      phone:'',
      _id: "",
      property: '',
      review:''
  });
    const [isEditing, setIsEditing] = useState(false);
    const { data: propsData, isLoading: propsLoading, isError: propsError } = useProps();
    const { data: enqData, isLoading: enqLoading, isError: enqError } = useEnq();
    const [propertyToDelete, setEnqToDelete] = useState<string | null>(null);
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const navigate = useNavigate();
  
  
  
   
  
    // 👇 Redirect based on auth status
    useEffect(() => {
      if (enqData && propsData) {
        setEnquiry(enqData);
        setProperties(propsData);
      }
  
  }, [navigate, enqData, propsData]);
  
  
    const handleOpenAddDialog = () => {
      setCurrentEnq({
        name:'',
        phone:'',
        _id: "",
        property: '',
        review:''
    });
      setIsEditing(false);
      setDialogOpen(true);
    };
  
   
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (!currentEnq.name || !currentEnq.phone || !currentEnq.review) {
          toast({
            title: "Required fields missing",
            description: "Please fill in all required fields.",
            variant: "destructive"
          });
          return;
        }
   if (isEditing && currentEnq._id) {
    await updateEnq(currentEnq as Enq);
          toast({
            title: "Enq updated",
            description: "The property was updated successfully."
          });
        } else {
          await addEnq(currentEnq as Omit<Enq, '_id'>);
          toast({
            title: "Enq added",
            description: "A new property was added successfully."
          });
        }
        setDialogOpen(false);
        setEnquiry(await getEnq());
      } 
     catch (error) {
        toast({
          title: "An error occurred",
          description: (error as Error).message,
          variant: "destructive"
        });
      } 
    };
    
    const handleOpenEditDialog = (enq: Enq) => {
      setCurrentEnq(enq);
      setIsEditing(true);
      setDialogOpen(true);
    };
  
    const handleOpenDeleteDialog = (_id: string) => {
      setEnqToDelete(_id);
      setDeleteDialogOpen(true);
    };
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setCurrentEnq((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleSelectChange = (name: string, value: string) => {
      setCurrentEnq((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleCheckboxChange = (name: string, checked: boolean) => {
      setCurrentEnq((prev) => ({
        ...prev,
        [name]: checked,
      }));
    };
  
  
  
    const filteredEnqors = enquiry.filter(enqor => 
      enqor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enqor.property.toLowerCase().includes(searchQuery.toLowerCase())
    );


    
    return (
      <div className="min-5 ">
              <div className="bg-primary text-white flex text-medium rounded-l-lg hover:bg-primary/90 transition-colors shadow-md">
                <Button 
                onClick={handleOpenAddDialog}>
                  <MessageSquare className="h-6 w-6" />
                  Enquire Now
                </Button>
              </div>
        {/* Add/Edit Enq Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Enquiry' : 'Add New Enquiry'}</DialogTitle>
              <DialogDescription>
                Fill in the details for this property. Required fields are marked with an asterisk (*).
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[70vh] pr-2">
            <form onSubmit={handleSubmit} >
              <div className="grid gap-4 py-4 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="title">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={currentEnq.name || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="text"
                      placeholder="+91 8523647923"
                      value={currentEnq.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="propertyId">Select Property *</Label>
                    <select
                      id="propertyId"
                      name="property"
                      value={currentEnq.property || ""}
                      onChange={handleInputChange}
                      required
                      className="w-full border rounded p-2"
                    >
                      <option value="">-- Choose Property --</option>
                      {properties.map((prop) => (
                        <option key={prop._id} value={prop.title}>
                          {prop.title} - {prop.location}
                        </option>
                      ))}
                    </select>
                  </div>
                <div className="col-span-2">
                  <Label htmlFor="review">Enquiry Details</Label>
                  <Textarea
                    id="review"
                    name="review"
                    value={currentEnq.review || ''}
                    onChange={handleInputChange}
                    placeholder="Write your 100-word review here..."
                    required
                    rows={6} // adjust for better height
                  />
                </div>                               
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? 'Update Enq' : 'Add Enq'}
                </Button>
              </DialogFooter>
            </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  };