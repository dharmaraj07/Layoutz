import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Image, LogOut, X } from 'lucide-react';
import { Customer } from '@/types/customer';
import { getCustomer, updateCustomer, addCustomer,deleteCustomer } from '@/services/customerService';
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
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {useCust } from '../hooks/useAuth';





const CustAdmin = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCustomers, setCurrentCustomers] = useState<Partial<Customer>>({
    name: '',
    job: '',
    img: '',
    review: '',
    rating: 0,
    videolink:''

  });
  const [isEditing, setIsEditing] = useState(false);
  const { data: custData, isLoading: custLoading, isError: custError } = useCust();
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [hover, setHover] = useState<number | null>(null);
 

  // 👇 Redirect based on auth status
  useEffect(() => {
    if (custError) {
      navigate("/admin/login");
    } else if (custData) {
      setCustomers(custData);
      console.log(setCustomers)


    }
}, [custError, navigate, custData]);

  const handleOpenAddDialog = () => {
    setCurrentCustomers({
    name: '',
    job: '',
    img: '',
    review: '',
    rating: 0,
    videolink:''
    });
    setIsEditing(false);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (customers: Customer) => {
    setCurrentCustomers(customers);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleOpenDeleteDialog = (id: string) => {
    setCustomerToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!currentCustomers.name || !currentCustomers.job || !currentCustomers.review) {
        toast({
          title: "Required fields missing",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }
 if (isEditing && currentCustomers._id) {
  await updateCustomer(currentCustomers as Customer);
        toast({
          title: "Customer updated",
          description: "The Customer was updated successfully."
        });
      } else {
        await addCustomer(currentCustomers as Omit<Customer, '_id'>);
        toast({
          title: "Customer added",
          description: "A new Customer was added successfully."
        });
      }
      
      setDialogOpen(false);
      setCustomers(await getCustomer());
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
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: async () => {
      toast({
        title: "Deleted",
        description: "The Customer has been deleted successfully.",
      });
      setDeleteDialogOpen(false);
      setCustomers(await getCustomer());
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete the Customer.",
        variant: "destructive",
      });
    },
  });
  const handleDelete = () => {
    if (customerToDelete) {
      deleteMutation.mutate(customerToDelete);
    }
  };
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentCustomers((prev) => ({
      ...prev,
      [name]: name === 'beds' || name === 'baths' ? parseInt(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setCurrentCustomers((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setCurrentCustomers((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const filteredProperties = customers.filter(Customer => 
    Customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    Customer.job.toLowerCase().includes(searchQuery.toLowerCase()) ||
    Customer.rating
  );

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
              <h1 className="text-3xl font-bold">Customer Management</h1>
            </div>
            
            <div className="flex flex-col md:flex-row w-full md:w-auto gap-4">
              <Input 
                placeholder="Search Customers..." 
                className="w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button onClick={handleOpenAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </div>
          </div>
          
          {filteredProperties.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table className='min-w-full table-auto border border-gray-200 '>
                <TableHeader>
                  <TableRow >
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Job</TableHead>
                    <TableHead>Review</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Video Link</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((Customer) => (
                    <TableRow key={Customer._id}>
                      <TableCell >
                        {Customer.img ? (
                          <div className="w-12 h-12 bg-cover bg-center rounded" 
                               style={{ backgroundImage: `url(${Customer.img})` }}/>
                        ) : (
                          <div className="w-12 h-12 bg-muted flex items-center justify-center rounded">
                            <Image className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">{Customer.name}</TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">{Customer.job}</TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">{Customer.review}</TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">{Customer.rating}</TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">{Customer.videolink}</TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenEditDialog(Customer)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleOpenDeleteDialog(Customer._id)}>
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
                Add Your First Customer
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Customer Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
            <DialogDescription>
              Fill in the details for this Customer. Required fields are marked with an asterisk (*).
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[70vh] pr-2">
          <form onSubmit={handleSubmit} >
            <div className="grid gap-4 py-4 ml-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={currentCustomers.name || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="job">Job *</Label>
                  <Input
                    id="job"
                    name="job"
                    value={currentCustomers.job || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="review">Review</Label>
                  <Textarea
                    id="review"
                    name="review"
                    value={currentCustomers.review || ''}
                    onChange={handleInputChange}
                    placeholder="Write your 100-word review here..."
                    required
                    rows={6} // adjust for better height
                  />
                </div>
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    name="rating"
                    placeholder='1000'
                    value={currentCustomers.rating}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="img">Image URL</Label>
                  <Input
                    id="image"
                    name="img"
                    type="url"
                    value={currentCustomers.img || ''}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                  {currentCustomers.img && (
                    <div className="mt-2 relative h-40 bg-cover bg-center rounded-md" style={{ backgroundImage: `url(${currentCustomers.img})` }}>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => setCurrentCustomers(prev => ({ ...prev, img: '' }))}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Remove Image
                        </Button>
                      </div>
                    </div>
                  )}
                </div>              
                <div className="col-span-2">
                  <Label htmlFor="video">Video URL</Label>
                  <Input
                    id="video"
                    name="videolink"
                    type="url"
                    value={currentCustomers.videolink || ''}
                    onChange={handleInputChange}
                    placeholder="https://www.youtube.com/embed/zjqQxwpCuOw?si=HlcNn7rxlzm58L6b"
                  />
                  {currentCustomers.videolink && (
                    <div className="mt-2 relative h-40 bg-cover bg-center rounded-md" style={{ backgroundImage: `url(${currentCustomers.videolink})` }}>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => setCurrentCustomers(prev => ({ ...prev, youtubelink: '' }))}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Remove Video
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Customer' : 'Add Customer'}
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
              Are you sure you want to delete this Customer? This action cannot be undone.
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

export default CustAdmin;
