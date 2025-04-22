import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Image, LogOut, X } from 'lucide-react';
import { Property } from '@/types/property';
import { getProperties, updateProperty, addProperty,deleteProperty } from '@/services/propertyService';
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
import { useAdmin } from '@/hooks/useAdmin';
import NavBarAdmin from '@/components/NavBarAdmin';
import {baseURL} from '../content/url'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';


const Admin = () => {
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentProperty, setCurrentProperty] = useState<Partial<Property>>({
    title: '',
    location: '',
    price: '',
    beds: 0,
    baths: 0,
    sqft: 0,
    image: '',
    featured: false,
    forSale: true,
    type: 'house',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();




const fetchAuthUser = async () => {
      const res = await fetch(`${baseURL}/api/auth/me`,{
          credentials: "include",
           // important for cookies to be sent
        });
        const data = await res.json();
        console.log(data)
    if (!res.ok || data.error) return navigate('/admin/login');
        if (res.ok || !data.error) return navigate('/admin');
        return data;
        
      };
        
      useQuery({
        queryKey: ['authUser'],
        queryFn: fetchAuthUser,
        retry: false,
        refetchOnWindowFocus: false,
      });

/*     
useEffect(() => {

  console.log(authUser)
  if (authUser) {
    navigate('/admin');
    return;
  }


    const loadedProperties = getProperties();
    setProperties(loadedProperties);
  }, [loading, isAdmin, navigate]);  */


  const handleOpenAddDialog = () => {
    setCurrentProperty({
      title: '',
      location: '',
      price: '',
      beds: 0,
      baths: 0,
      sqft: 0,
      image: '',
      featured: false,
      forSale: true,
      type: 'house',
    });
    setIsEditing(false);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (property: Property) => {
    setCurrentProperty(property);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleOpenDeleteDialog = (id: number) => {
    setPropertyToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!currentProperty.title || !currentProperty.location || !currentProperty.price) {
        toast({
          title: "Required fields missing",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }
 if (isEditing && currentProperty.id) {
        updateProperty(currentProperty as Property);
        toast({
          title: "Property updated",
          description: "The property was updated successfully."
        });
      } else {
        addProperty(currentProperty as Omit<Property, 'id'>);
        toast({
          title: "Property added",
          description: "A new property was added successfully."
        });
      }
      
      setDialogOpen(false);
      setProperties(await getProperties());
    } 
   catch (error) {
      toast({
        title: "An error occurred",
        description: (error as Error).message,
        variant: "destructive"
      });
    } 
  };

  const handleDelete = () => {
    if (propertyToDelete !== null) {
      deleteProperty(propertyToDelete);
/*       setProperties(getProperties()); */
      setDeleteDialogOpen(false);
      setPropertyToDelete(null);
      toast({
        title: "Property deleted",
        description: "The property was deleted successfully."
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentProperty((prev) => ({
      ...prev,
      [name]: name === 'beds' || name === 'baths' || name === 'sqft' ? parseInt(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setCurrentProperty((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setCurrentProperty((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const filteredProperties = properties.filter(property => 
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
        <NavBarAdmin />

      <div className="bg-background py-20">
        <div className="container max-w-6xl mx-auto px-4 pt-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center">
              <Link to="/">
                <Button variant="ghost" size="sm" className="mr-2">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Property Management</h1>
            </div>
            
            <div className="flex flex-col md:flex-row w-full md:w-auto gap-3">
              <Input 
                placeholder="Search properties..." 
                className="w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button onClick={handleOpenAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </div>
          </div>
          
          {filteredProperties.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Beds</TableHead>
                    <TableHead>Baths</TableHead>
                    <TableHead>Sq.Ft</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>
                        {property.image ? (
                          <div className="w-12 h-12 bg-cover bg-center rounded" 
                               style={{ backgroundImage: `url(${property.image})` }}/>
                        ) : (
                          <div className="w-12 h-12 bg-muted flex items-center justify-center rounded">
                            <Image className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{property.title}</TableCell>
                      <TableCell>{property.location}</TableCell>
                      <TableCell>{property.price}</TableCell>
                      <TableCell className="capitalize">{property.type}</TableCell>
                      <TableCell>{property.beds}</TableCell>
                      <TableCell>{property.baths}</TableCell>
                      <TableCell>{property.sqft}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          property.forSale ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {property.forSale ? 'For Sale' : 'For Rent'}
                        </span>
                        {property.featured && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            Featured
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenEditDialog(property)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleOpenDeleteDialog(property.id)}>
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
                Add Your First Property
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Property Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Property' : 'Add New Property'}</DialogTitle>
            <DialogDescription>
              Fill in the details for this property. Required fields are marked with an asterisk (*).
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={currentProperty.title || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    value={currentProperty.location || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    name="price"
                    value={currentProperty.price || ''}
                    onChange={handleInputChange}
                    placeholder="$1,250,000"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Property Type</Label>
                  <Select 
                    defaultValue={currentProperty.type || 'house'} 
                    onValueChange={(value) => handleSelectChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="beds">Bedrooms</Label>
                  <Input
                    id="beds"
                    name="beds"
                    type="number"
                    min="0"
                    value={currentProperty.beds || 0}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="baths">Bathrooms</Label>
                  <Input
                    id="baths"
                    name="baths"
                    type="number"
                    min="0"
                    step="0.5"
                    value={currentProperty.baths || 0}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="sqft">Square Feet</Label>
                  <Input
                    id="sqft"
                    name="sqft"
                    type="number"
                    min="0"
                    value={currentProperty.sqft || 0}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    name="image"
                    type="url"
                    value={currentProperty.image || ''}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                  {currentProperty.image && (
                    <div className="mt-2 relative h-40 bg-cover bg-center rounded-md" style={{ backgroundImage: `url(${currentProperty.image})` }}>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => setCurrentProperty(prev => ({ ...prev, image: '' }))}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Remove Image
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="forSale" 
                    checked={currentProperty.forSale} 
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('forSale', checked as boolean)
                    }
                  />
                  <Label htmlFor="forSale">For Sale</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="featured" 
                    checked={currentProperty.featured} 
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('featured', checked as boolean)
                    }
                  />
                  <Label htmlFor="featured">Featured Property</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Property' : 'Add Property'}
              </Button>
            </DialogFooter>
          </form>
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

export default Admin;
