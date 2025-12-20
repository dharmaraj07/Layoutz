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
import Whatsapp from '@/components/whatsapp';



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
        <Whatsapp />

    </div>
  );
};

export default CustAdmin;
