import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Image, LogOut, X, Check } from 'lucide-react';
import { Property } from '@/types/property';
import { getProperties, updateProperty, addProperty,deleteProperty, fetchAuthUser,logoutuser } from '@/services/propertyService';
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
import { useAuth, useProps } from '../hooks/useAuth';
import logo from '../image/logo.png'




const Admin = () => {
  const { data: authUser, isLoading, isError } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentProperty, setCurrentProperty] = useState<Partial<Property>>({
    title: '',
    location: '',
    city:'',
    price: 0,
    beds: 0,
    baths: 0,
    sqft: 0,
    image: '',
    mobileImage:'',
    propimage:[],
    featured: false,
    forSale: true,
    type: 'plots',
    reraID:'',
    projectArea:'',
    totalPlots:0,
    approved:true,
    mapSrc:'',
    schools:[],
    highlight:[],
    college:[],
    transit:[],
    hospital:[],
    plotElitePrice:0,
    plotPremiumPrice:0,
    restaurants:[],
    youtubelink: '',
    residential:true

  });
  const [isEditing, setIsEditing] = useState(false);
  const { data: propsData, isLoading: propsLoading, isError: propsError } = useProps();
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [newSchool, setNewSchool] = useState('');
  const [newHighlight, setNewHighlight] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newCollege, setNewCollege] = useState('');
  const [newTransit, setNewTransit] = useState('');
  const [newHospital, setNewHospital] = useState('');
  const [newRestaurant, setNewRestaurant] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

 

  // 👇 Redirect based on auth status
  useEffect(() => {
    if (isError) {
    } else if (authUser && propsData) {
      setProperties(propsData);
      console.log(setProperties)
      console.log("Authenticated:", authUser);
    }
}, [authUser, isError, navigate, propsData]);

const { mutate: logout} = useMutation({
  mutationFn: logoutuser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['authUser'] });
    navigate('/');
  }
});

  const handleOpenAddDialog = () => {
    setCurrentProperty({
      title: '',
      location: '',
      city:'',
      price: 0,
      beds: 0,
      baths: 0,
      sqft: 0,
      image: '',
      mobileImage:'',
      propimage: [],
      featured: false,
      forSale: true,
      type: 'plots',
      reraID:'',
      projectArea:'',
      totalPlots:0,
      plotElitePrice:0,
      plotPremiumPrice:0,
      approved:true,
      mapSrc:'',
      schools:[],
      highlight:[],
      college:[],
      transit:[],
      hospital:[],
      restaurants:[],
      youtubelink: '',
      residential:true
    });
    setIsEditing(false);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (property: Property) => {
    setCurrentProperty(property);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleOpenDeleteDialog = (id: string) => {
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
 if (isEditing && currentProperty._id) {
  await updateProperty(currentProperty as Property);
        toast({
          title: "Property updated",
          description: "The property was updated successfully."
        });
      } else {
        await addProperty(currentProperty as Omit<Property, '_id'>);
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
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProperty(id),
    onSuccess: async () => {
      toast({
        title: "Deleted",
        description: "The property has been deleted successfully.",
      });
      setDeleteDialogOpen(false);
      setProperties(await getProperties());
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
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentProperty((prev) => ({
      ...prev,
      [name]: name === 'beds' || name === 'baths' ? parseInt(value) : value,
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
  console.log(filteredProperties)
  function getYouTubeThumbnail(youtubelink: string) {
    throw new Error('Function not implemented.');
  }
const handleDuplicate = async (property: Property) => {
  
  const duplicatedProperty: Omit<Property, '_id'> = {
    ...property,
    title: property.title + " (Copy)",
    schools: property.schools.map((s) => s + " (Copy)"),
  };

  try {
    await addProperty(duplicatedProperty);
    toast({
      title: "Duplicated",
      description: "The property has been duplicated successfully.",
    });
    setProperties(await getProperties());
  } catch (error) {
    toast({
      title: "Error",
      description: (error as Error).message || "Failed to duplicate the property.",
      variant: "destructive",
    });
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <NavBarAdmin />

        <div className="w-full px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-screen-2xl mx-auto">
          {/* Hero Section with Stats */}
          <div className="bg-gradient-to-r from-housing-600 to-housing-800 rounded-2xl shadow-2xl p-8 mb-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <img src={logo} alt="" className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold">Property Management</h1>
                    <p className="text-housing-100 mt-1">Manage and oversee all your properties</p>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-housing-100 text-sm">Total Properties</p>
                    <p className="text-2xl font-bold mt-1">{properties.length}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-housing-100 text-sm">For Sale</p>
                    <p className="text-2xl font-bold mt-1">{properties.filter(p => p.forSale).length}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-housing-100 text-sm">Featured</p>
                    <p className="text-2xl font-bold mt-1">{properties.filter(p => p.featured).length}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={handleOpenAddDialog}
                  size="lg"
                  className="bg-white text-housing-700 hover:bg-housing-50 shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Property
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => logout()}
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Input 
                  placeholder="Search by title, location, or type..." 
                  className="w-full h-12 pl-10 border-2 focus:border-housing-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Plus className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 rotate-45" aria-hidden="true" />
              </div>
              <Link to="/">
                <Button variant="outline" size="lg" className="h-12">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Site
                </Button>
              </Link>
            </div>
            {searchQuery && (
              <p className="mt-3 text-sm text-gray-600">
                Found <span className="font-semibold text-housing-700">{filteredProperties.length}</span> properties
              </p>
            )}
          </div>
          
          {filteredProperties.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
              <Table className='min-w-full divide-y divide-gray-200'>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-900">Image</TableHead>
                    <TableHead className="font-semibold text-gray-900">Mobile</TableHead>
                    <TableHead className="font-semibold text-gray-900">Title</TableHead>
                    <TableHead className="font-semibold text-gray-900">Location</TableHead>
                    <TableHead className="font-semibold text-gray-900">Price</TableHead>
                    <TableHead className="font-semibold text-gray-900">Plot Elite</TableHead>
                    <TableHead className="font-semibold text-gray-900">Plot Premium</TableHead>
                    <TableHead className="font-semibold text-gray-900">Type</TableHead>
                    <TableHead className="font-semibold text-gray-900">Category</TableHead>
                    <TableHead className="font-semibold text-gray-900">Beds</TableHead>
                    <TableHead className="font-semibold text-gray-900">Baths</TableHead>
                    <TableHead className="font-semibold text-gray-900">Sq.Ft</TableHead>
                    <TableHead className="font-semibold text-gray-900">Status</TableHead>
                    <TableHead className="font-semibold text-gray-900">Project Area</TableHead>
                    <TableHead className="font-semibold text-gray-900">Total Plots</TableHead>
                    <TableHead className="font-semibold text-gray-900">RERA ID</TableHead>
                    <TableHead className="font-semibold text-gray-900">Approved</TableHead>
                    <TableHead className="font-semibold text-gray-900">Map</TableHead>
                    <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {filteredProperties.map((property) => (
                    <TableRow key={property._id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        {property.image ? (
                          <div className="w-16 h-16 bg-cover bg-center rounded-lg shadow-sm ring-1 ring-gray-200 hover:ring-housing-500 transition-all" 
                               style={{ backgroundImage: `url(${property.image})` }}
                               title="Desktop image"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-lg">
                            <Image className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {property.mobileImage ? (
                          <div className="w-16 h-16 bg-cover bg-center rounded-lg shadow-sm ring-1 ring-gray-200 hover:ring-housing-500 transition-all" 
                               style={{ backgroundImage: `url(${property.mobileImage})` }}
                               title="Mobile image"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-lg">
                            <Image className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        <div className="max-w-[200px] truncate" title={property.title}>{property.title}</div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        <div className="max-w-[180px] truncate" title={property.location}>{property.location}</div>
                      </TableCell>
                      <TableCell className="text-gray-900 font-semibold">₹{property.price.toLocaleString()}</TableCell>
                      <TableCell className="text-gray-900">₹{property.plotElitePrice?.toLocaleString() || 'N/A'}</TableCell>
                      <TableCell className="text-gray-900">₹{property.plotPremiumPrice?.toLocaleString() || 'N/A'}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                          {property.type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                          property.residential ? 'bg-green-50 text-green-700' : 'bg-purple-50 text-purple-700'
                        }`}>
                          {property.residential ? 'Residential' : 'Commercial'}
                        </span>
                      </TableCell>                      
                      <TableCell className="text-gray-600">{property.beds}</TableCell>
                      <TableCell className="text-gray-600">{property.baths}</TableCell>
                      <TableCell className="text-gray-600">{property.sqft} sq.ft</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                            property.forSale ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                          }`}>
                            {property.forSale ? 'For Sale' : 'For Rent'}
                          </span>
                          {property.featured && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700">
                              ⭐ Featured
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{property.projectArea || 'N/A'}</TableCell>
                      <TableCell className="text-gray-600">{property.totalPlots || 'N/A'}</TableCell>
                      <TableCell className="text-gray-600">
                        <div className="max-w-[150px] truncate" title={property.reraID}>{property.reraID || 'N/A'}</div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                          property.approved ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                        }`}>
                          {property.approved ? '✓ Approved' : '⏳ Pending'}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        <div className="max-w-[100px] truncate" title={property.mapSrc}>{property.mapSrc ? 'Yes' : 'No'}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDuplicate(property)}
                            className="hover:bg-green-50 hover:text-green-600"
                            title="Duplicate property"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleOpenEditDialog(property)}
                            className="hover:bg-blue-50 hover:text-blue-600"
                            title="Edit property"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleOpenDeleteDialog(property._id)}
                            className="hover:bg-red-50 hover:text-red-600"
                            title="Delete property"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Image className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No properties found' : 'No properties yet'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchQuery 
                  ? `We couldn't find any properties matching "${searchQuery}". Try adjusting your search.`
                  : 'Get started by adding your first property to the system.'}
              </p>
              <Button 
                onClick={searchQuery ? () => setSearchQuery('') : handleOpenAddDialog}
                size="lg"
                className="bg-housing-600 hover:bg-housing-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                {searchQuery ? 'Clear Search' : 'Add Your First Property'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Property Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-hidden p-4">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Property' : 'Add New Property'}</DialogTitle>
            <DialogDescription>
              Fill in the details for this property. Required fields are marked with an asterisk (*).
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[70vh] pl-2 pr-2">
          <form onSubmit={handleSubmit} >
            <div className="grid gap-4 py-4 ">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 ">
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
                <div className="col-span-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={currentProperty.city || ''}
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
                    placeholder="1,250"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="plotElitePrice"> Elite Price *</Label>
                  <Input
                    id="plotElitePrice"
                    name="plotElitePrice"
                    value={currentProperty.plotElitePrice || ''}
                    onChange={handleInputChange}
                    placeholder="1,250"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="plotPremiumPrice">Premium Price *</Label>
                  <Input
                    id="plotPremiumPrice"
                    name="plotPremiumPrice"
                    value={currentProperty.plotPremiumPrice || ''}
                    onChange={handleInputChange}
                    placeholder="1,800"
                    
                  />
                </div>
                <div>
                  <Label htmlFor="reraID">RERA ID *</Label>
                  <Input
                    id="reraID"
                    name="reraID"
                    value={currentProperty.reraID || ''}
                    onChange={handleInputChange}
                    placeholder="TN/1253"
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
                      <SelectItem value="plots">Plots</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>                
                  {currentProperty.type?.toLowerCase() !== 'plots' && (
                  <><Label htmlFor="beds">Bedrooms</Label><Input
                    id="beds"
                    name="beds"
                    type="number"
                    min="0"
                    step="1"
                    value={currentProperty.beds || 0}
                    onChange={handleInputChange} /></>)}
                </div>
                <div>
                {currentProperty.type?.toLowerCase() !== 'plots' && (<><Label htmlFor="baths">Bathrooms</Label><Input
                    id="baths"
                    name="baths"
                    type="number"
                    min="0"
                    step="1"
                    value={currentProperty.baths || 0}
                    onChange={handleInputChange} /></>)}
                </div>
                <div>
                  <Label htmlFor="projectArea">Project Area</Label>
                  <Input
                    id="projectArea"
                    name="projectArea"
                    placeholder='1000'
                    value={currentProperty.projectArea}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="sqft">Plot Size Range</Label>
                  <Input
                    id="sqft"
                    name="sqft"
                    placeholder='1000 - 3000 Sq.ft'
                    value={currentProperty.sqft}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="totalPlots">Total Plots</Label>
                  <Input
                    id="totalPlots"
                    name="totalPlots"
                    type="number"
                    min="0"
                    value={currentProperty.totalPlots || 0}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="mapSrc">Map URL</Label>
                  <Input
                    id="mapSrc"
                    name="mapSrc"
                    type="url"
                    value={currentProperty.mapSrc || ''}
                    onChange={handleInputChange}
                    placeholder="https://www.google.com/maps/embed?"
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
                <div className="col-span-2">
                  <Label htmlFor="mobileImage">Mobile Image URL</Label>
                  <Input
                    id="mobileImage"
                    name="mobileImage"
                    type="url"
                    value={currentProperty.mobileImage || ''}
                    onChange={handleInputChange}
                    placeholder="https://example.com/mobileimage.jpg"
                  />
                  
                  {currentProperty.mobileImage && (
                    <div className="mt-2 relative h-40 bg-cover bg-center rounded-md" style={{ backgroundImage: `url(${currentProperty.mobileImage})` }}>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => setCurrentProperty(prev => ({ ...prev, mobileImage: '' }))}
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
                    name="youtubelink"
                    type="url"
                    value={currentProperty.youtubelink || ''}
                    onChange={handleInputChange}
                    placeholder="https://www.youtube.com/embed/zjqQxwpCuOw?si=HlcNn7rxlzm58L6b"
                  />
                  {currentProperty.youtubelink && (
                    <div className="mt-2 relative h-40 bg-cover bg-center rounded-md" style={{ backgroundImage: `url(${currentProperty.youtubelink})` }}>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => setCurrentProperty(prev => ({ ...prev, youtubelink: '' }))}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Remove Video
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/*/ Property Image */}
                <div className="col-span-2">
                  <Label htmlFor="propimage">Property Image</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      id="propimage"
                      name="propimage"
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                          if (newImage.trim()) {
                            setCurrentProperty(prev => {
                              const updatedImage = new Set([...(prev.propimage || []), newImage.trim()]);
                              return {
                                      ...prev,
                                      propimage: Array.from(updatedImage),
                                    };
                                  });
                            setNewImage('');
                          }
                        }}
                    >
                      Add
                    </Button>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    {(currentProperty.propimage || []).map((propimage, idx) => (
                      <div
                      key={idx}
                      className="flex items-center justify-between bg-muted px-3 py-1 rounded text-sm"
                    >
                      <span>{propimage}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentProperty(prev => ({
                            ...prev,
                            propimage: prev.propimage.filter((_, i) => i !== idx),
                          }));
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                    ))}
                  </ul>
                </div>

                {/* 👇 Add School, Hospital, college, transit, restaurant */}
                {/* highlights */}
                <div className="col-span-2">
                  <Label htmlFor="highlight">Highlight</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      id="highlight"
                      name="highlight"
                      value={newHighlight}
                      onChange={(e) => setNewHighlight(e.target.value)}
                      placeholder="Enter College/University Name"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (newHighlight.trim()) {
                          setCurrentProperty(prev => {
                            const updatedHighlight = new Set([...(prev.highlight || []), newHighlight.trim()]);
                            return {
                              ...prev,
                              highlight: Array.from(updatedHighlight),
                            };
                          });
                          setNewHighlight('');
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>

                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    {(currentProperty.highlight || []).map((highlight, idx, arr) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-muted px-3 py-1 rounded text-sm"
                      >
                        {editingIndex === idx ? (
                          <input
                            className="bg-white px-2 py-1 text-sm rounded border"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                          />
                        ) : (
                          <span>{highlight}</span>
                        )}

                        <div className="flex items-center gap-1">
                          {editingIndex === idx ? (
                            <>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setCurrentProperty(prev => {
                                    const updated = [...(prev.highlight || [])];
                                    updated[idx] = editingText.trim();
                                    return { ...prev, highlight: updated };
                                  });
                                  setEditingIndex(null);
                                  setEditingText('');
                                }}
                              >
                                <Check className="w-4 h-4 text-green-600" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingIndex(null);
                                  setEditingText('');
                                }}
                              >
                                <X className="w-4 h-4 text-gray-500" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingIndex(idx);
                                  setEditingText(highlight);
                                }}
                              >
                                <Pencil className="w-4 h-4 text-blue-500" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                disabled={idx === 0}
                                onClick={() => {
                                  setCurrentProperty(prev => {
                                    const updated = [...(prev.highlight || [])];
                                    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
                                    return { ...prev, highlight: updated };
                                  });
                                }}
                              >
                                <span className="text-xs">↑</span>
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                disabled={idx === arr.length - 1}
                                onClick={() => {
                                  setCurrentProperty(prev => {
                                    const updated = [...(prev.highlight || [])];
                                    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
                                    return { ...prev, highlight: updated };
                                  });
                                }}
                              >
                                <span className="text-xs">↓</span>
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setCurrentProperty(prev => ({
                                    ...prev,
                                    highlight: prev.highlight.filter((_, i) => i !== idx),
                                  }));
                                }}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </ul>
                </div>

                {/* School */}
                <div className="col-span-2">
                  <Label htmlFor="school">Schools</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      id="school"
                      name="school"
                      value={newSchool}
                      onChange={(e) => setNewSchool(e.target.value)}
                      placeholder="Enter College/University Name"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                          if (newSchool.trim()) {
                            setCurrentProperty(prev => {
                              const updatedSchools = new Set([...(prev.schools || []), newSchool.trim()]);
                              return {
                                      ...prev,
                                      schools: Array.from(updatedSchools),
                                    };
                                  });
                            setNewSchool('');
                          }
                        }}
                    >
                      Add
                    </Button>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    {(currentProperty.schools || []).map((school, idx) => (
                      <div
                      key={idx}
                      className="flex items-center justify-between bg-muted px-3 py-1 rounded text-sm"
                    >
                      <span>{school}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentProperty(prev => ({
                            ...prev,
                            schools: prev.schools.filter((_, i) => i !== idx),
                          }));
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                    ))}
                  </ul>
                </div>
                {/*College*/}
                <div className="col-span-2">
                  <Label htmlFor="college">Colleges/University</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      id="college"
                      name="college"
                      value={newCollege}
                      onChange={(e) => setNewCollege(e.target.value)}
                      placeholder="Enter College/University Name"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (newCollege.trim()) {
                          setCurrentProperty(prev => {
                            const updatedCollege = new Set([...(prev.college || []), newCollege.trim()]);
                            return {
                                    ...prev,
                                    college: Array.from(updatedCollege),
                                  };
                                });
                          setNewCollege('');
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    {(currentProperty.college || []).map((college, idx) => (
                      <div
                      key={idx}
                      className="flex items-center justify-between bg-muted px-3 py-1 rounded text-sm"
                    >
                      <span>{college}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentProperty(prev => ({
                            ...prev,
                            college: prev.college.filter((_, i) => i !== idx),
                          }));
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                    ))}
                  </ul>
                </div>

                    {/* TRANSIT */}

                    <div className="col-span-2">
                  <Label htmlFor="transit">Transit</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      id="transit"
                      name="transit"
                      value={newTransit}
                      onChange={(e) => setNewTransit(e.target.value)}
                      placeholder="Enter Bus Stand/Railway Station Name"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (newTransit.trim()) {
                          setCurrentProperty(prev => {
                            const updatedTransit = new Set([...(prev.transit || []), newTransit.trim()]);
                            return {
                                    ...prev,
                                    transit: Array.from(updatedTransit),
                                  };
                                });
                          setNewTransit('');
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    {(currentProperty.transit || []).map((transit, idx) => (
                      <div
                      key={idx}
                      className="flex items-center justify-between bg-muted px-3 py-1 rounded text-sm"
                    >
                      <span>{transit}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentProperty(prev => ({
                            ...prev,
                            transit: prev.transit.filter((_, i) => i !== idx),
                          }));
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                    ))}
                  </ul>
                </div>

                                    {/* HOSPITAL */}

                                    <div className="col-span-2">
                  <Label htmlFor="hospital">Hospital</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      id="hospital"
                      name="hospital"
                      value={newHospital}
                      onChange={(e) => setNewHospital(e.target.value)}
                      placeholder="Enter Hospital Name"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (newHospital.trim()) {
                          setCurrentProperty(prev => {
                            const updatedHospital = new Set([...(prev.hospital || []), newHospital.trim()]);
                            return {
                                    ...prev,
                                    hospital: Array.from(updatedHospital),
                                  };
                                });
                          setNewHospital('');
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    {(currentProperty.hospital || []).map((hospital, idx) => (
                      <div
                      key={idx}
                      className="flex items-center justify-between bg-muted px-3 py-1 rounded text-sm"
                    >
                      <span>{hospital}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentProperty(prev => ({
                            ...prev,
                            hospital: prev.hospital.filter((_, i) => i !== idx),
                          }));
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                    ))}
                  </ul>
                </div>
                                    {/* Restaurants */}

                <div className="col-span-2">
                  <Label htmlFor="restaurant">Restaurants</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      id="restaurant"
                      name="restaurant"
                      value={newRestaurant}
                      onChange={(e) => setNewRestaurant(e.target.value)}
                      placeholder="Enter Restaurants Name"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (newRestaurant.trim()) {
                          setCurrentProperty(prev => {
                            const updatedRestaurant = new Set([...(prev.restaurants || []), newRestaurant.trim()]);
                            return {
                                    ...prev,
                                    restaurants: Array.from(updatedRestaurant),
                                  };
                                });
                          setNewRestaurant('');
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    {(currentProperty.restaurants || []).map((restaurants, idx) => (
                      <div
                      key={idx}
                      className="flex items-center justify-between bg-muted px-3 py-1 rounded text-sm"
                    >
                      <span>{restaurants}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentProperty(prev => ({
                            ...prev,
                            restaurants: prev.restaurants.filter((_, i) => i !== idx),
                          }));
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                    ))}
                  </ul>
                </div>                    



                    {/* End of Nearby */}


                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="approved" 
                    name="approved" 
                    checked={currentProperty.approved} 
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('approved', checked as boolean)
                    }
                  />
                  <Label htmlFor="forSale">DTCP Approved</Label>
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
                    id="residential" 
                    checked={currentProperty.residential} 
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('residential', checked as boolean)
                    }
                  />
                  <Label htmlFor="residential">Residential Flag</Label>
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

export default Admin;
  