import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Image, LogOut, X, Check } from 'lucide-react';
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




const ScheduleVisit1= () => {
  const [tab, setTab] = useState<'visit' | 'enquiry'>('visit');
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
      console.log(setProperties)

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
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVisit(id),
    onSuccess: async () => {
      toast({
        title: "Deleted",
        description: "The property has been deleted successfully.",
      });
      setDeleteDialogOpen(false);
      setVisitors(await getVisit());
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete the property.",
        variant: "destructive",
      });
    },
  });
  const handleDelete = () => {
    if (propertyToDelete) {
      deleteMutation.mutate(propertyToDelete);
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
    <div className="min-h-screen flex  justify-center">
        <NavBarAdmin />

      <div className="bg-background py-20">
        <div className="container mx-0 pt-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
            <div className="flex items-center">
              <Link to="/">
                <Button variant="ghost" size="sm" className="mr-2">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Visit Management</h1>
            </div>
            
            <div className="flex flex-col md:flex-row w-full md:w-auto gap-4">
              <Input 
                placeholder="Search properties..." 
                className="w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="mt-6 flex gap-4">
            <Button variant={tab === 'visit' ? 'default' : 'outline'} onClick={() => setTab('visit')}>
              Visits
            </Button>
            <Button variant={tab === 'enquiry' ? 'default' : 'outline'} onClick={() => setTab('enquiry')}>
              Enquiries
            </Button>
          </div>
          </div>
          
          {filteredVisitors.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                             <TableHeader>
                               <TableRow>
                                 <TableHead>Name</TableHead>
                                 <TableHead>Phone</TableHead>
                                 <TableHead>Visit Date</TableHead>
                                 <TableHead>People</TableHead>
                                 <TableHead>Property</TableHead>
                                 <TableHead>Requested Date</TableHead>
                                 <TableHead>Status</TableHead>
                                 <TableHead>Actions</TableHead>
                               </TableRow>
                             </TableHeader>
                             <TableBody>
                               {filteredVisitors.map((visit: Visit) => (
                                 <TableRow key={visit._id}>
                                   <TableCell className="font-medium">{visit.name}</TableCell>
                                   <TableCell>{visit.phone}</TableCell>
                                   <TableCell>   {currentVisit.visitDate? new Date(currentVisit.visitDate).toLocaleDateString('en-GB') // dd/mm/yyyy
                                                      : ''}</TableCell>
                                   <TableCell>{visit.people}</TableCell>
                                   <TableCell>{visit.property}</TableCell>
                                   <TableCell>{currentVisit.createdAt? new Date(currentVisit.createdAt).toLocaleDateString('en-GB') // dd/mm/yyyy
                                                      : ''}</TableCell>
                                   <TableCell>
                                      {visit.status === "Confirmed" ? (
                                        <span className="text-green-600 font-semibold">Confirmed</span>
                                      ) : (
                                        <div className="flex items-center gap-2">
                                          <span className="text-yellow-500 font-semibold">Pending</span>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleConfirmVisit(visit._id)}
                                            className="text-blue-600 border-blue-500"
                                          >
                                            <Check className="h-4 w-4 mr-1" />
                                            Confirm
                                          </Button>
                                        </div>
                                      )}
                                    </TableCell>

                                    <TableCell className="w-[200px] max-w-[200px] truncate text-sm">
                                      <div className="flex space-x-2">
                                        <Button variant="ghost" size="sm" onClick={() => handleOpenEditDialog(visit)}>
                                          <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleOpenDeleteDialog(visit._id)}>
                                          <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                 </TableRow>
                               ))}
                             </TableBody>
                           </Table>
            </div>
          ) : (
            <div className="text-center py-10 border rounded-lg">
              <p className="text-lg text-muted-foreground mb-4">
                {searchQuery ? 'No properties match your search.' : 'No properties have been added yet.'}
              </p>
              <Button onClick={handleOpenAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Visit
              </Button>
            </div>
          )}
        </div>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this property? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduleVisit1;
