import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Image, LogOut, X } from 'lucide-react';
import { Hero } from '@/types/heroImage';
import { getHero, updateHero, addHero,deleteHero } from '@/services/heroImage';
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
import { useHero, useProps } from '../hooks/useAuth';
import { Property } from '@/types/property';
import { ScheduleVisitDialog } from '@/components/ScheduleVisitDialog';





const Enquiries = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [heros, setHeros] = useState<Hero[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentHero, setCurrentHero] = useState<Partial<Hero>>({
    title: '',
    image: [],
    type: 'main',
    link:'',
    mobileImage:[]

  });
  const [isEditing, setIsEditing] = useState(false);
  const { data: heroData, isLoading: heroLoading, isError: heroError } = useHero();
  const { data: propsData, isLoading: propsLoading, isError: propsError } = useProps();
  const [heroToDelete, setHeroToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [newImage, setNewImage] = useState('');
  const [newMobileImage, setNewMobileImage] = useState('');
 

  // 👇 Redirect based on auth status
  useEffect(() => {
    if (heroError) {
    } else if ( heroData && propsData) {
      setHeros(heroData);
      setProperties(propsData);
      console.log(setHeros)
    }
}, [heroError, navigate, heroData]);

  const handleOpenAddDialog = () => {
    setCurrentHero({
      title: '',
      image: [],
      type: 'main',
      link:'',
      mobileImage:[]
  
    });
    setIsEditing(false);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (hero: Hero) => {
    setCurrentHero(hero);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleOpenDeleteDialog = (id: string) => {
    setHeroToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!currentHero.title || !currentHero.image ) {
        toast({
          title: "Required fields missing",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }
 if (isEditing && currentHero._id) {
  await updateHero(currentHero as Hero);
        toast({
          title: "Hero updated",
          description: "The hero was updated successfully."
        });
      } else {
        await addHero(currentHero as Omit<Hero, '_id'>);
        toast({
          title: "Hero added",
          description: "A new hero was added successfully."
        });
      }
      setDialogOpen(false);
      setHeros(await getHero());
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
    mutationFn: (id: string) => deleteHero(id),
    onSuccess: async () => {
      toast({
        title: "Deleted",
        description: "The hero has been deleted successfully.",
      });
      setDeleteDialogOpen(false);
      setHeros(await getHero());
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete the hero.",
        variant: "destructive",
      });
    },
  });
  const handleDelete = () => {
    if (heroToDelete) {
      deleteMutation.mutate(heroToDelete);
    }
  };
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentHero((prev) => ({
      ...prev,
      [name]: name === 'beds' || name === 'baths' ? parseInt(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setCurrentHero((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setCurrentHero((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };



  const filteredHeros = heros.filter(hero => 
    hero.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hero.image.includes(searchQuery.toLowerCase()) ||
    hero.link.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log(filteredHeros)
  function getYouTubeThumbnail(youtubelink: string) {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
        <NavBarAdmin />

        <div className="w-full px-4 sm:px-6 md:px-8 py-20">
        <div className="max-w-screen-xl mx-auto pt-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
            <div className="flex items-center">
              <Link to="/">
                <Button variant="ghost" size="sm" className="mr-2">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Hero Management</h1>
            </div>
            
            <div className="flex flex-col md:flex-row w-full md:w-auto gap-4">
              <Input 
                placeholder="Search heros..." 
                className="w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button onClick={handleOpenAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Hero
              </Button>
            </div>
          </div>
          
          {filteredHeros.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table className='min-w-full table-auto border border-gray-200 '>
                <TableHeader>
                  <TableRow >
                    <TableHead>Image</TableHead>
                    <TableHead>Mobile Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHeros.map((hero) => (
                    <TableRow key={hero._id}>
                      <TableCell >
                        {hero.image ? (
                          <div className="w-12 h-12 bg-cover bg-center rounded" 
                               style={{ backgroundImage: `url(${hero.image})` }}/>
                        ) : (
                          <div className="w-12 h-12 bg-muted flex items-center justify-center rounded">
                            <Image className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell >
                        {hero.mobileImage ? (
                          <div className="w-12 h-12 bg-cover bg-center rounded" 
                               style={{ backgroundImage: `url(${hero.mobileImage})` }}/>
                        ) : (
                          <div className="w-12 h-12 bg-muted flex items-center justify-center rounded">
                            <Image className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">{hero.title}</TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">{hero.type}</TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">
                        {hero.link || 'No link'}
                      </TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenEditDialog(hero)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleOpenDeleteDialog(hero._id)}>
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
                {searchQuery ? 'No heros match your search.' : 'No heros have been added yet.'}
              </p>
              <Button onClick={handleOpenAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Hero
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Hero Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-hidden p-4">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Hero' : 'Add New Hero'}</DialogTitle>
            <DialogDescription>
              Fill in the details for this hero. Required fields are marked with an asterisk (*).
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
                    value={currentHero.title || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Hero Type</Label>
                  <Select 
                    defaultValue={currentHero.type || 'main'} 
                    onValueChange={(value) => handleSelectChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Main</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/*/ Hero Image */}
                <div className="col-span-2">
                  <Label htmlFor="image">Hero Image</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      id="image"
                      name="image"
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                          if (newImage.trim()) {
                            setCurrentHero(prev => {
                              const updatedImage = new Set([...(prev.image || []), newImage.trim()]);
                              return {
                                      ...prev,
                                      image: Array.from(updatedImage),
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
                    {(currentHero.image || []).map((image, idx) => (
                      <div
                      key={idx}
                      className="flex items-center justify-between bg-muted px-3 py-1 rounded text-sm"
                    >
                      <span>{image}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentHero(prev => ({
                            ...prev,
                            image: prev.image.filter((_, i) => i !== idx),
                          }));
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                    ))}
                  </ul>
                </div>
{/*Mobile Image */}
                <div className="col-span-2">
                  <Label htmlFor="mobileImage">Mobile Image</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      id="mobileImage"
                      name="mobileImage"
                      value={newMobileImage}
                      onChange={(e) => setNewMobileImage(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />  
                    <Button
                      type="button"
                      onClick={() => {
                          if (newMobileImage.trim()) {
                            setCurrentHero(prev => {
                              const updatedImage = new Set([...(prev.mobileImage || []), newMobileImage.trim()]);
                              return {
                                      ...prev,
                                      mobileImage: Array.from(updatedImage),
                                    };
                                  });
                            setNewMobileImage('');
                          }
                        }}
                    >
                      Add
                    </Button>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    {(currentHero.mobileImage || []).map((mobileImage, idx) => (
                      <div
                      key={idx}
                      className="flex items-center justify-between bg-muted px-3 py-1 rounded text-sm"
                    >
                      <span>{mobileImage}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentHero(prev => ({
                            ...prev,
                            mobileImage: prev.mobileImage.filter((_, i) => i !== idx),
                          }));
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                    ))}
                  </ul>
                </div>
                <div className="col-span-2">
                <Label htmlFor="link">Link *</Label>
                <Select
                  value={currentHero.link}
                  onValueChange={(value) => handleSelectChange('link', value)} // Handle the change
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property) => (
                      <SelectItem key={property._id} value={`/property/${property.title}`}>
                        {property.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Hero' : 'Add Hero'}
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
              Are you sure you want to delete this hero? This action cannot be undone.
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

export default Enquiries;
