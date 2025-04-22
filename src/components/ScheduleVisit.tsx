import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Check } from 'lucide-react';
import { Visit } from '@/types/visit';
import { updateVisit, addVisit, deleteVisit, getVisit, updateallVisit } from '@/services/visitService';
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
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import NavBarAdmin from '@/components/NavBarAdmin';
import { baseURL } from '../content/url';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth, useEnq, useProps, useVisit } from '../hooks/useAuth';
import logo from '../image/logo.png';
import { Property } from '@/types/property';
import { Enq } from '@/types/enq';
import { getEnq, updateallEnq } from '@/services/enqService';

// Import libraries for export functionality
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable'; //
import { saveAs } from 'file-saver';

const ScheduleVisit = () => {
  const [tab, setTab] = useState<'visit' | 'enquiry'>('visit');
  const [properties, setProperties] = useState<Property[]>([]);
  const [visitors, setVisitors] = useState<Visit[]>([]);
  const [enquiries, setEnquiries] = useState<Enq[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentVisit, setCurrentVisit] = useState<Partial<Visit>>({
    name: '',
    phone: '',
    _id: "",
    property: '',
    people: 0,
    visitDate: new Date(),
    status: 'Pending',
    createdAt: new Date(),
  });
  const [currentEnq, setCurrentEnq] = useState<Partial<Enq>>({
    name: '',
    phone: '',
    _id: "",
    property: '',
    review: '',
    invest:true,
    createdAt: new Date()
  });
  const [isEditing, setIsEditing] = useState(false);
  const { data: propsData } = useProps();
  const { data: visitData } = useVisit();
  const { data: enqData } = useEnq();
  const [propertyToDelete, setVisitToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Update states when data is loaded
  useEffect(() => {
    if (visitData && propsData && enqData) {
      setVisitors(visitData);
      setProperties(propsData);
      setEnquiries(enqData);
    }
  }, [enqData, visitData, propsData]);

  // Export functions



const exportToExcel = () => {
  if (filteredVisitors.length === 0) {
    toast({
      title: "No Visit updated",
      description: "Please try after sometime"
    });
    return;
  }

  const worksheetData = filteredVisitors.map(visit => ({
    Name: visit.name,
    Phone: visit.phone,
    "Visit Date": new Date(visit.visitDate).toLocaleDateString('en-GB'),
    People: visit.people,
    Property: visit.property,
    "Created At": new Date(visit.createdAt).toLocaleDateString('en-GB'),
    Status: visit.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Visitors");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, "visitors.xlsx");
};

  const exportToPDF = () => {
    const doc = new jsPDF();
  
    doc.setFontSize(14);
    doc.text('Visit Data', 14, 15);
  
    const tableColumn = ['Name', 'Phone', 'Visit Date', 'People', 'Property', 'Requested Date', 'Status'];
    const tableRows = filteredVisitors.map(visit => [
      visit.name,
      visit.phone,
      new Date(visit.visitDate).toLocaleDateString('en-GB'),
      visit.people,
      visit.property,
      new Date(visit.createdAt).toLocaleDateString('en-GB'),
      visit.status,
    ]);
  
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
  
    doc.save('visit_data.pdf');
  };

  const handleOpenAddDialog = () => {
    setCurrentVisit({
      name: '',
      phone: '',
      _id: "",
      property: '',
      people: 0,
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
    } catch (error) {
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


  const handleConfirmVisit = async (visitId: string) => {
    try {
      await updateallVisit(visitId, { status: 'Confirmed' });
      toast({
        title: "Visit Confirmed",
        description: `Visit with ID ${visitId} is now confirmed.`,
      });
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

  const handleConfirmEnq = async (enqId: string) => {
    try {
      await updateallEnq(enqId, { completed: 'completed' });
      toast({ 
        title: "Enquiry Confirmed",
        description: `Enquiry with ID ${enqId} is now confirmed.`,
      });
      setEnquiries(await getEnq());

    } catch (error) {
      console.error("Error confirming Enquiry:", error);
      toast({
        title: "Error",
        description: "Could not confirm the Enquiry.",
        variant: "destructive",
      });
    }
  };
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc' as 'asc' | 'desc',
  });
  const sortData = (data: any []) => {
    const { key, direction } = sortConfig;
    const sortedData = [...data].sort((a, b) => {
      const aVal = key.includes('Date') || key === 'createdAt' ? new Date(a[key]) : a[key];
      const bVal = key.includes('Date') || key === 'createdAt' ? new Date(b[key]) : b[key];
  
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

  const filteredVisitors = useMemo( () => {
    const query = searchQuery.toLowerCase();
  
    return visitors.filter((v) => {
      return (
        v.name?.toLowerCase().includes(query) ||
        v.phone?.toLowerCase().includes(query) ||
        v.property?.toLowerCase().includes(query) ||
        (v.review && v.review.toLowerCase().includes(query)) ||
        (v.visitDate && new Date(v.visitDate).toLocaleDateString('en-GB').includes(query)) ||
        (v.createdAt && new Date(v.createdAt).toLocaleDateString('en-GB').includes(query))
      );
    });
  }, [visitors, searchQuery]);
  
  
  const filteredEnquiries = enquiries.filter(enquiry =>
    enquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enquiry.review.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enquiry.createdAt
  );
  
  const sortedVisitors = sortData(filteredVisitors);
  const sortedEnquiries = sortData(filteredEnquiries);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;


  // Pagination Logic for filtered visitors
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const totalPages = Math.ceil(visitors.length / rowsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
const paginatedVisitors = useMemo(() => {
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  return sortedVisitors.slice(start, end); // ✅ paginate before sorting
}, [visitors, currentPage]);

const sortedPaginatedVisitors = useMemo(() => {
  if (!sortConfig.key) return paginatedVisitors;  

  return [...paginatedVisitors].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (aVal === undefined || bVal === undefined) return 0;

    if (sortConfig.direction === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
}, [paginatedVisitors, sortConfig]);


const paginatedEnquiries = useMemo(() => {
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  return sortedEnquiries.slice(start, end); // ✅ paginate before sorting
}, [visitors, currentPage]);

const sortedPaginatedEnquiries = useMemo(() => {
  if (!sortConfig.key) return paginatedVisitors;

  return [...paginatedEnquiries].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (aVal === undefined || bVal === undefined) return 0;

    if (sortConfig.direction === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
}, [paginatedEnquiries, sortConfig]);

const emptyRows = rowsPerPage - sortedPaginatedVisitors.length;
const emptyRowsE = rowsPerPage - sortedPaginatedEnquiries.length;

  return (
    <div className="">
      <NavBarAdmin />
      <div className="bg-white py-10 ">
        <div className=" mx-0 p-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 pt-5">
            <div className="flex items-center">
              <Link to="/">
                <Button variant="ghost" size="sm" className="mr-2">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                </Link>


              <h1 className="text-3xl font-bold text-center">Visit Management</h1>
            </div>

            <div className="flex flex-col md:flex-row w-full md:w-auto gap-4 p-5">
              <Input
                placeholder="Search properties..."
                className="w-full md:w-64 bg-blue-100 focus:ring-blue-500 focus:border-black-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
              {/* Export buttons */}
              <div className="flex gap-4 mb-4 pt-4">
                <Button onClick={exportToPDF}>Export to PDF</Button>
                <Button onClick={exportToExcel}>Export to Excel</Button>
              </div>

          </div>
          <div className="mt-6 flex gap-4">
              <Button variant={tab === 'visit' ? 'default' : 'outline'} onClick={() => setTab('visit')}>
                Visits
              </Button>
              <Button variant={tab === 'enquiry' ? 'default' : 'outline'} onClick={() => setTab('enquiry')}>
                Enquiries
              </Button>
            </div>

          { (tab === 'visit' ? filteredVisitors.length : filteredEnquiries.length) > 0 ? (
            <div>
              {tab === 'visit' ? (
                <div className="border rounded-lg overflow-hidden ">
                  <Table>
                    <TableHeader>
                      <TableRow>
                      <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                        Name
                        {sortConfig.key === 'name' && (
                          <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                        )}
                      </TableHead>
                      <TableHead onClick={() => handleSort('phone')} className="cursor-pointer">
                        Phone
                        {sortConfig.key === 'phone' && (
                          <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                        )}
                      </TableHead>
                      <TableHead onClick={() => handleSort('visitDate')} className="cursor-pointer">
                        Visit Date
                        {sortConfig.key === 'visitDate' && (
                          <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                        )}
                      </TableHead>
                      <TableHead onClick={() => handleSort('people')} className="cursor-pointer">
                        People
                        {sortConfig.key === 'people' && (
                          <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                        )}
                      </TableHead>
                      <TableHead onClick={() => handleSort('property')} className="cursor-pointer">
                        Property
                        {sortConfig.key === 'property' && (
                          <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                        )}
                      </TableHead>
                      <TableHead onClick={() => handleSort('createdAt')} className="cursor-pointer">
                        Requested Date
                        {sortConfig.key === 'createdAt' && (
                          <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                        )}
                      </TableHead>
                      <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
                        Status
                        {sortConfig.key === 'status' && (
                          <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                        )}
                      </TableHead>
                      <TableHead className="cursor-pointer">
                        Action
                      </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedPaginatedVisitors.map((visit: Visit) => (
                        <TableRow key={visit._id}>
                          <TableCell className="font-medium">{visit.name}</TableCell>
                          <TableCell>{visit.phone}</TableCell>
                          <TableCell>{visit.visitDate ? new Date(visit.visitDate).toLocaleDateString('en-GB') : ''}</TableCell>
                          <TableCell>{visit.people}</TableCell>
                          <TableCell>{visit.property}</TableCell>
                          <TableCell>{visit.createdAt ? new Date(visit.createdAt).toLocaleDateString('en-GB') : ''}</TableCell>
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
                       {Array.from({ length: emptyRows }).map((_, i) => (
                        <TableRow key={`empty-${i}`}>
                          <TableCell colSpan={8} className="h-12" />
                        </TableRow>
                      ))} 
                    </TableBody>
                    <div className="flex justify-between items-center py-4">
                      <Button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm"
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
                  </Table>
                </div>
              ) : (
                <div className="border rounded-md overflow-auto">
                  <Table >
                    <TableHeader>
                      <TableRow>
                      <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                      Name
                      {sortConfig.key === 'name' && (
                        <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                      )}
                      </TableHead>
                      <TableHead onClick={() => handleSort('phone')} className="cursor-pointer">
                        Phone
                        {sortConfig.key === 'phone' && (
                          <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                        )}
                      </TableHead>
                      <TableHead onClick={() => handleSort('property')} className="cursor-pointer">
                        Property
                        {sortConfig.key === 'property' && (
                          <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                        )}
                      </TableHead>
                      <TableHead onClick={() => handleSort('review')} className="cursor-pointer">
                        Review
                        {sortConfig.key === 'review' && (
                          <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                        )}
                      </TableHead>
                      <TableHead onClick={() => handleSort('createdAt')} className="cursor-pointer">
                        Created
                        {sortConfig.key === 'createdAt' && (
                          <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                        )}
                      </TableHead>
                      <TableHead onClick={() => handleSort('completed')} className="cursor-pointer">
                        Completed
                        {sortConfig.key === 'completed' && (
                          <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                        )}
                  
                      </TableHead>
                      <TableHead className="cursor-pointer">
                        Investment
                      </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedPaginatedEnquiries.map((enq) => (
                        <TableRow key={enq._id}>
                          <TableCell>{enq.name}</TableCell>
                          <TableCell>{enq.phone}</TableCell>
                          <TableCell className="max-w-xs truncate">{enq.property}</TableCell>
                          <TableCell>{enq.review}</TableCell>
                          <TableCell>{enq.createdAt ? new Date(enq.createdAt).toLocaleDateString('en-GB') : ''}</TableCell>
                          <TableCell>
                            {enq.completed === "completed" ? (
                              <span className="text-green-600 font-semibold">Completed</span>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="text-yellow-500 font-semibold">Pending</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleConfirmEnq(enq._id)}
                                  className="text-blue-600 border-blue-500"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Confirm
                                </Button>
                              </div>
                            )}
                          </TableCell>
                      <TableCell className="w-[200px] max-w-[150px] truncate text-sm text-center">
                        <span className={`flex items-center px-2 py-1 rounded-l text-medium font-medium ${
                          enq.invest ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {enq.invest ? 'Invest' : 'General'}
                        </span>
                      </TableCell>                          
                        </TableRow>
                      ))}
                        {Array.from({ length: emptyRowsE }).map((_, i) => (
                        <TableRow key={`empty-${i}`}>
                          <TableCell colSpan={8} className="h-12" />
                        </TableRow>
                      ))} 
                    </TableBody>

                  </Table>
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
                </div>
              )}
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
            <form onSubmit={handleSubmit}>
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

export default ScheduleVisit;
