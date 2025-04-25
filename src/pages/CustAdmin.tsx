import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Image, LogOut, X } from 'lucide-react';
import { Customer } from '@/types/customer';
import { getCustomer, updateCustomer, addCustomer,deleteCustomer, addBulkCustomer } from '@/services/customerService';
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
import {useCust, useProps} from '../hooks/useAuth';
import { Property } from '@/types/property';

// Import libraries for export functionality
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable'; //
import { saveAs } from 'file-saver';
import { toast } from 'sonner';



const CustAdmin = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [properties, setProperties]= useState<Property[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCustomers, setCurrentCustomers] = useState<Partial<Customer>>({
    _id:'',
    name: '',
    phone:'',
    location:'',
    job: '',
    img: '',
    review: '',
    rating: 0,
    videolink:'',
    property:'',
    plotNum:'',
    custType:'enquiry',
    visitDate:new Date(),
    nextVisitDate:new Date()



  });
  const [isEditing, setIsEditing] = useState(false);
  const { data: custData, isLoading: custLoading, isError: custError } = useCust();
  const { data: propsData, isLoading: propsLoading, isError: propsError } = useProps();  
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [hover, setHover] = useState<number | null>(null);



  // 👇 Redirect based on auth status
  useEffect(() => {
    if (custError) {
      navigate("/admin/login");
    } else if (custData && propsData) {
      setCustomers(custData);
      setProperties(propsData);
      console.log(setCustomers)


    }
}, [custError, navigate, custData]);

  const handleOpenAddDialog = () => {
    setCurrentCustomers({
      _id:'',
      name: '',
      phone:'',
      location:'',
      job: '',
      img: '',
      review: '',
      rating: 0,
      videolink:'',
      property:'',
      plotNum:'',
      custType:'enquiry'
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

  const [sortConfig, setSortConfig] = useState({
      key: 'visitDate',
      direction: 'asc' as 'asc' | 'desc',
    });
    const sortData = (data: any []) => {
      const { key, direction } = sortConfig;
      const sortedData = [...data].sort((a, b) => {
        const aVal = key.includes('Date') || key === 'visitDate' ? new Date(a[key]) : a[key];
        const bVal = key.includes('Date') || key === 'visitDate' ? new Date(b[key]) : b[key];
    
        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        return 0;
      });
      return sortedData;
    };
  
    const handleSort = (key: string) => {
      let direction: 'asc' | 'desc' = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
      }
      setSortConfig({ key, direction });
    };
  
    const filteredProperties = useMemo( () => {
      const query = searchQuery.toLowerCase();
    
      return customers.filter((v) => {
        return (
          v.name?.toLowerCase().includes(query) ||
          v.phone?.toLowerCase().includes(query) ||
          v.property?.toLowerCase().includes(query) ||
          (v.review && v.review.toLowerCase().includes(query)) ||
          (v.visitDate && new Date(v.visitDate).toLocaleDateString('en-GB').includes(query)) ||
          (v.nextVisitDate && new Date(v.nextVisitDate).toLocaleDateString('en-GB').includes(query))
        );
      });
    }, [customers, searchQuery]);
    

  const exportToPDF = () => {
      const doc = new jsPDF();
    
      doc.setFontSize(14);
      doc.text('Customer Data', 14, 15);
    
      const tableColumn = ['name',' phone','location','property','plotNum','custType','visitDate','nextVisitDate']
      const tableRows = filteredProperties.map(customer => [
        customer.name,
        customer.phone,
        customer.location,
        customer.property,
        customer.plotNum,
        customer.custType,
        new Date(customer.visitDate).toLocaleDateString('en-GB'),
        new Date(customer.nextVisitDate).toLocaleDateString('en-GB'),
      ]);
    
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
      });
    
      doc.save('customer_data.pdf');
    };
    const exportToExcel = () => {
      if (filteredProperties.length === 0) {
        toast({
          title: "No Visit updated",
          description: "Please try after sometime"
        });
        return;
      }
    
      const worksheetData = filteredProperties.map(customer => ({
        name:customer.name,
        phone:customer.phone,
        job:customer.job,
        review:customer.review,
        rating:customer.rating,
        videolink:customer.videolink, 
        location:customer.location,
        property:customer.property,
        plotNum: customer.plotNum,
        custType:customer.custType,
        visitDate: new Date(customer.visitDate).toLocaleDateString('en-GB'),
        nextVisitDate: new Date(customer.nextVisitDate).toLocaleDateString('en-GB'),
      }));
    
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Visitors");
    
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
    
      const data = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(data, "customer.xlsx");
    };

     const sortedCustomers = sortData(filteredProperties);

    
      const [currentPage, setCurrentPage] = useState(1);
      const rowsPerPage = 20;
    
    
      // Pagination Logic for filtered visitors
      const indexOfLastRow = currentPage * rowsPerPage;
      const indexOfFirstRow = indexOfLastRow - rowsPerPage;
      const totalPages = Math.ceil(customers.length / rowsPerPage);
    
      const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
          setCurrentPage(page);
        }
      };
    const paginatedCustomers = useMemo(() => {
      const start = (currentPage - 1) * rowsPerPage;
      const end = start + rowsPerPage;
      return sortedCustomers.slice(start, end); // ✅ paginate before sorting
    }, [customers, currentPage]);
    
    const sortedPaginatedCustomers = useMemo(() => {
      if (!sortConfig.key) return paginatedCustomers;  
    
      return [...paginatedCustomers].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
    
        if (aVal === undefined || bVal === undefined) return 0;
    
        if (sortConfig.direction === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }, [paginatedCustomers, sortConfig]);
    
    
    
    
    const emptyRows = rowsPerPage - sortedPaginatedCustomers.length;
      const [file, setFile] = useState<File | null>(null);
        const [isUploading, setIsUploading] = useState(false);

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.name.endsWith('.xlsx')) {
      setFile(selectedFile);
    } else {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload an Excel file (.xlsx).',
        variant: 'destructive',
      });
    }
  };
 
  // Handle upload when button is clicked
  const handleUpload: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();

    if (!file) {
      toast({
        title: 'No File Selected',
        description: 'Please choose an Excel file to upload.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    console.log('Uploading file:', file); // Debug: Check if upload is triggered
  
    try {
      // Mock the upload process (replace with your actual logic)
      await handleExcelUpload(file); // You should replace this with your actual function to handle the upload.
      toast({
        title: 'Upload Successful',
        description: 'The file was uploaded successfully.',
      });
    } catch (error) {
      console.error('Upload failed:', error); // Debug: Log any upload error
      toast({
        title: 'Upload Failed',
        description: 'Something went wrong while uploading the file.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };
  const parseExcelDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
  
    const [day, month, year] = dateStr.split('/');
    if (!day || !month || !year) return null;
  
    return new Date(`${year}-${month}-${day}`);
  };
  const handleExcelUpload = async (file: File) => {
    const reader = new FileReader();
  
    reader.onload = async (e) => {
      const data = e.target?.result;
      if (typeof data === 'string') {
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
  
        // Parse to array of customer objects (excluding _id)
        const jsonData = XLSX.utils.sheet_to_json<Omit<Customer, '_id'>>(sheet);
        const formattedData = jsonData.map((cust: any) => {
          const formattedCust = {
            ...cust,
            visitDate: parseExcelDate(cust.visitDate),
            nextVisitDate: parseExcelDate(cust.nextVisitDate),
          };
          return formattedCust;
        });
        if (jsonData.length > 0) {
          // Filter unique by phone
          const newCustomers = formattedData.filter((newCust) =>
            !customers.some((existing) => existing.phone === newCust.phone)
          );
          

          
          console.log(newCustomers)
  
          if (newCustomers.length > 0) {
            try {
              // Send to backend
              await addBulkCustomer(newCustomers);
  
              // Toast success
              toast({
                title: "Customers added",
                description: `${newCustomers.length} new customer(s) added successfully.`,
              });
  
              // Update local state
              setCustomers((prev) => [...prev, ...newCustomers as Customer[]]);
            } catch (error) {
              console.error("Error adding to DB:", error);
              toast({
                title: "Upload failed",
                description: "Error uploading customers to the database.",
                variant: "destructive",
              });
            }
          } else {
            toast({
              title: "No new data",
              description: "All customers from the Excel file already exist.",
            });
          }
        } else {
          toast({
            title: "Empty file",
            description: "No customer data found in the uploaded Excel.",
            variant: "destructive",
          });
        }
      }
    };
  
    reader.readAsBinaryString(file);
  };
  

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
              <Table className='min-w-full table-auto border border-gray-200  '>
                <TableHeader>
                  <TableRow >
                    <TableHead >Image </TableHead>
                    <TableHead onClick={() => handleSort('name')} className="cursor-pointer whitespace-nowrap">Name 
                            {sortConfig.key === 'name' && (
                            
                              <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                            )}
                    </TableHead>
                    <TableHead onClick={() => handleSort('phone')} className="cursor-pointer whitespace-nowrap">Phone Number 
                            {sortConfig.key === 'phone' && (
                              <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                            )}
                    </TableHead>
                    <TableHead onClick={() => handleSort('location')} className="cursor-pointer whitespace-nowrap">Location
                            {sortConfig.key === 'location' && (
                              <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                            )}
                    </TableHead>
                    <TableHead onClick={() => handleSort('visitDate')} className="cursor-pointer whitespace-nowrap">Visit Date
                            {sortConfig.key === 'visitDate' && (
                              <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                            )}
                    </TableHead>
                    <TableHead onClick={() => handleSort('nextVisitDate')} className="cursor-pointer whitespace-nowrap">Next Visit Date
                            {sortConfig.key === 'nextVisitDate' && (
                              <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                            )}
                    </TableHead>
                    <TableHead >Job</TableHead>
                    <TableHead onClick={() => handleSort('review')} className="cursor-pointer whitespace-nowrap">Review
                    {sortConfig.key === 'review' && (
                              <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                            )}
                    </TableHead>
                    <TableHead onClick={() => handleSort('rating')} className="cursor-pointer whitespace-nowrap">Rating
                            {sortConfig.key === 'rating' && (
                              <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                            )}
                    </TableHead>
                    <TableHead className="cursor-pointer whitespace-nowrap">Video Link</TableHead>
                    <TableHead >Property</TableHead>
                    <TableHead  className="cursor-pointer whitespace-nowrap">Plot Number</TableHead>
                    <TableHead onClick={() => handleSort('custType')} className="cursor-pointer whitespace-nowrap">Customer Activity
                            {sortConfig.key === 'custType' && (
                              <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                            )}
                    </TableHead>
                    <TableHead >Action</TableHead>
                  </TableRow> 
                </TableHeader>
                <TableBody>
                  {sortedPaginatedCustomers.map((Customer) => (
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
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">{Customer.phone}</TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">{Customer.location}</TableCell>
                      <TableCell>{Customer.visitDate ? new Date(Customer.visitDate).toLocaleDateString('en-GB') : ''}</TableCell>
                      <TableCell>{Customer.nextVisitDate ? new Date(Customer.nextVisitDate).toLocaleDateString('en-GB') : ''}</TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">{Customer.job}</TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">{Customer.review}</TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">{Customer.rating}</TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">{Customer.videolink}</TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">{Customer.property}</TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">{Customer.plotNum}</TableCell>
                      <TableCell className="w-[200px] max-w-[200px] truncate text-sm">{Customer.custType}</TableCell>
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
                  {Array.from({ length: emptyRows }).map((_, i) => (
                   <TableRow key={`empty-${i}`}>
                     <TableCell colSpan={8} className="h-12" />
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
                  <div className="flex justify-between items-center p-4">
                              <Button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 text-sm p-4"
                              >
                                Previous
                              </Button>
                              <span className="text-sm">
                                Page {currentPage} of {totalPages}
                              </span>
                              <Button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 text-sm"
                              >
                                Next
                              </Button>
                            </div>
                                    {/* Export buttons */}
                                    <div className="container flex justify-center gap-4 mb-4 pt-4">
                              <Button onClick={exportToPDF}>Export to PDF</Button>
                              <Button onClick={exportToExcel}>Export to Excel</Button>
                                  <div>
      {/* File Upload Section */}
      <div className="flex upload-section gap-2">
        <Input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          className="upload-input"
        />
        <Button onClick={handleUpload} disabled={!file} className="upload-button  hover:bg-housing-700">
          Upload Excel
        </Button>
      </div>

      {/* Other existing code for customer data management */}
    </div>
                            </div>
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
                    placeholder='Murugan'
                    value={currentCustomers.name || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="col-span-2">
                <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder='7652365233'
                    value={currentCustomers.phone || ''}
                    onChange={handleInputChange}  
                    required
                  />
                </div>
                <div className="col-span-2">
                <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder='Rasipuram'
                    value={currentCustomers.location || ''}
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
                      value={currentCustomers.visitDate?.toString().split('T')[0] || ''}
                      onChange={handleInputChange}
                      required
                    />
                </div>
                <div className="col-span-2">
                    <Label htmlFor="nextVisitDate">Next Visit Date</Label>
                    <Input
                      id="nextVisitDate"
                      name="nextVisitDate"
                      type="date"
                      value={currentCustomers.nextVisitDate?.toString().split('T')[0] || ''}
                      onChange={handleInputChange}
    
                    />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="job">Job *</Label>
                  <Input
                    id="job"
                    name="job"
                    placeholder='Manager'
                    value={currentCustomers.job || ''}
                    onChange={handleInputChange}

                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="review">Review*</Label>
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
                  <Label htmlFor="rating">Rating*</Label>
                  <Input
                    id="rating"
                    name="rating"
                    placeholder='1000'
                    value={currentCustomers.rating}
                    onChange={handleInputChange}
                    required
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
                <div className="col-span-2">
                  <Label htmlFor="propertyId">Select Property *</Label>
                  <select
                    id="propertyId"
                    name="property"
                    value={currentCustomers.property || ""}
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
                <div>
                  <Label htmlFor="plotNum">Plot Number</Label>
                  <Input
                    id="plotNum"
                    name="plotNum"
                    placeholder='11'
                    value={currentCustomers.plotNum}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="custType">Property Type *</Label>
                  <Select 
                    defaultValue={currentCustomers.custType || 'Enquiry'} 
                    onValueChange={(value) => handleSelectChange('custType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enquiry">Enquiry</SelectItem>
                      <SelectItem value="justvisit">Just Visit</SelectItem>
                      <SelectItem value="purchase">Purchase</SelectItem>
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
