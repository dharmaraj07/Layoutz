import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Image, LogOut, X, Check, Car } from 'lucide-react';
import { Visit } from '@/types/visit';
import { updateVisit, addVisit,deleteVisit, getVisit, updateallVisit } from '@/services/visitService';
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
import NavBarAdmin from '@/components/NavBarAdmin';
import {baseURL} from '../content/url'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useAuth, useProps, useVisit } from '../hooks/useAuth';
import logo from '../image/logo.png';
import { Property } from '@/types/property';


export function ScheduleVisitDialog1() {
    const { data: authUser, isLoading, isError } = useAuth();
    const [properties, setProperties]= useState<Property[]>([]);
    const [visitors, setVisitors] = useState<Visit[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentVisit, setCurrentVisit] = useState<Partial<Visit>>({
      name:'',
      phone:'',
      _id: "",
      property: '',
      people:0,
      visitDate: new Date(),
      status: 'Pending',
      createdAt: new Date()
  });
    const [isEditing, setIsEditing] = useState(false);
    const { data: propsData, isLoading: propsLoading, isError: propsError } = useProps();
    const { data: visitData, isLoading: visitLoading, isError: visitError } = useVisit();
    const [propertyToDelete, setVisitToDelete] = useState<string | null>(null);
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const navigate = useNavigate();
  
  
  
   
  
    // 👇 Redirect based on auth status
    useEffect(() => {
    if (visitData && propsData) {
        setVisitors(visitData);
        setProperties(propsData);

      }
  
  }, [authUser, isError, navigate, visitData, propsData]);
  
  
    const handleOpenAddDialog = () => {
      setCurrentVisit({
        name:'',
        phone:'',
        _id: "",
        property: '',
        people:0,
        visitDate: new Date(),
        status: 'Pending',
        createdAt: new Date()
    });
      setIsEditing(false);
      setDialogOpen(true);
    };
  
   
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (!currentVisit.name || !currentVisit.phone || !currentVisit.visitDate) {
          toast({
            title: "Required fields missing",
            description: "Please fill in all required fields.",
            variant: "destructive"
          });
          return;
        }
   if (isEditing && currentVisit._id) {
    await updateVisit(currentVisit as Visit);
          toast({
            title: "Visit updated",
            description: "The property was updated successfully."
          });
        } else {
          await addVisit(currentVisit as Omit<Visit, '_id'>);
          toast({
            title: "Visit added",
            description: "A new property was added successfully."
          });
        }
        setDialogOpen(false);
        setVisitors(await getVisit());
      } 
     catch (error) {
        toast({
          title: "An error occurred",
          description: (error as Error).message,
          variant: "destructive"
        });
      } 
    };
    
    const handleOpenEditDialog = (visit: Visit) => {
      setCurrentVisit(visit);
      setIsEditing(true);
      setDialogOpen(true);
    };
  
    const handleOpenDeleteDialog = (_id: string) => {
      setVisitToDelete(_id);
      setDeleteDialogOpen(true);
    };
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setCurrentVisit((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleSelectChange = (name: string, value: string) => {
      setCurrentVisit((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleCheckboxChange = (name: string, checked: boolean) => {
      setCurrentVisit((prev) => ({
        ...prev,
        [name]: checked,
      }));
    };
  
  
  
    const filteredVisitors = visitors.filter(visitor => 
      visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visitor.visitDate
    );
    
    const handleConfirmVisit = async (visitId: string) => {
      try {
        await updateallVisit(visitId, { status: 'Confirmed' });
        toast({
          title: "Visit Confirmed",
          description: `Visit with ID ${visitId} is now confirmed.`,
        });
    
        // Refresh the visit list
        setVisitors(await getVisit());
      } catch (error) {
        console.error("Error confirming visit:", error);
        toast({
          title: "Error",
          description: "Could not confirm the visit.",
          variant: "destructive",
        });
      }
    };
  
    return (
      <div className="min-10 ">
              <div className="min-w-10">
                <Button onClick={handleOpenAddDialog}>
                <Car className="text-amber-500 w-10 h-10"/> Schedule Visit
                </Button>
              </div>
        {/* Add/Edit Visit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Visit' : 'Add New Visit'}</DialogTitle>
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
                      value={currentVisit.name || ''}
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
                      value={currentVisit.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                      <Label htmlFor="visitDate">Visit Date *</Label>
                      <Input
                        id="visitDate"
                        name="visitDate"
                        type="date"
                        value={currentVisit.visitDate?.toString().split('T')[0] || ''}
                        onChange={handleInputChange}
                        required
                      />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="people">Number of Person to Visit *</Label>
                    <Input
                      id="people"
                      name="people"
                      placeholder="1 - 5"
                      value={currentVisit.people}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="propertyId">Select Property *</Label>
                    <select
                      id="propertyId"
                      name="property"
                      value={currentVisit.property || ""}
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
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? 'Update Visit' : 'Add Visit'}
                </Button>
              </DialogFooter>
            </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  };