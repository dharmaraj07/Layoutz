import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Image, LogOut, X } from 'lucide-react';
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
              <h1 className="text-3xl font-bold">Property Management</h1>
            </div>
            
            <div className="flex flex-col md:flex-row w-full md:w-auto gap-4">
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
              <Button variant="outline" onClick={() => logout()}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
          
          {filteredProperties.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table className='min-w-full table-auto border border-gray-200 '>
                <TableHeader>
                  <TableRow >
                    <TableHead>Image</TableHead>
                    <TableHead>Mobile Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Plot Elite</TableHead>
                    <TableHead>Plot Premium</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Residential Flag</TableHead>
                    <TableHead>Beds</TableHead>
                    <TableHead>Baths</TableHead>
                    <TableHead>Sq.Ft</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Project Area</TableHead>
                    <TableHead>Total Plots</TableHead>
                    <TableHead >DTCP & RERA Approved</TableHead>
                    <TableHead>MapSrc</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((property) => (
                    <TableRow key={property._id}>
                      <TableCell >
                        {property.image ? (
                          <div className="w-12 h-12 bg-cover bg-center rounded" 
                               style={{ backgroundImage: `url(${property.image})` }}/>
                        ) : (
                          <div className="w-12 h-12 bg-muted flex items-center justify-center rounded">
                            <Image className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell >
                        {property.image ? (
                          <div className="w-12 h-12 bg-cover bg-center rounded" 
                               style={{ backgroundImage: `url(${property.mobileImage})` }}/>
                        ) : (
                          <div className="w-12 h-12 bg-muted flex items-center justify-center rounded">
                            <Image className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">{property.title}</TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">{property.location}</TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">Rs.{property.price}</TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">Rs.{property.plotElitePrice}</TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">Rs.{property.plotPremiumPrice}</TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">{property.type}</TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          property.residential ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {property.residential ? 'Residential' : 'Commercial'}
                        </span>
                      </TableCell>                      
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">{property.beds}</TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">{property.baths}</TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">{property.sqft} Sq.ft</TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">
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
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">{property.projectArea}</TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">{property.totalPlots}</TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          property.approved ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {property.approved ? 'Approved' : 'Pending'}
                        </span>
                      </TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">{property.mapSrc}</TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenEditDialog(property)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleOpenDeleteDialog(property._id)}>
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
                    {(currentProperty.highlight || []).map((highlight, idx) => (
                      <div
                      key={idx}
                      className="flex items-center justify-between bg-muted px-3 py-1 rounded text-sm"
                    >
                      <span>{highlight}</span>
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
  