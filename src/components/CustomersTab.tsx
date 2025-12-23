import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Search, Filter, Download, FileSpreadsheet, FileText, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useEnq } from '@/hooks/useAuth';
import { Enq } from '@/types/enq';
import { updateEnq } from '@/services/enqService';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CustomersTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [agentFilter, setAgentFilter] = useState<string>('all');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Enq | null>(null);

  const { data: enquiries = [], isLoading } = useEnq();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; updates: Partial<Enq> }) =>
      updateEnq(data.id, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enq'] });
      toast({
        title: 'Success',
        description: 'Customer updated successfully',
      });
      setEditDialogOpen(false);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update customer',
        variant: 'destructive',
      });
    },
  });

  // Filter only converted enquiries (customers)
  const customers = enquiries.filter((enq) => enq.status === 'converted');

  // Get unique properties for filter (exclude empty values)
  const uniqueProperties = Array.from(
    new Set(customers.map(enq => enq.property).filter(prop => prop && prop.trim() !== ''))
  ).sort();

  // Get unique agents for filter
  const uniqueAgents = Array.from(
    new Set(customers.filter(enq => enq.assignedAgent).map(enq => ({
      id: enq.assignedAgent._id,
      name: enq.assignedAgent.name
    }))),
    (agent) => JSON.stringify(agent)
  ).map(str => JSON.parse(str));

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery);

    const matchesProperty =
      propertyFilter === 'all' || customer.property === propertyFilter;

    const matchesAgent =
      agentFilter === 'all' || customer.assignedAgent?._id === agentFilter;

    return matchesSearch && matchesProperty && matchesAgent;
  });

  const handleUpdateCustomer = () => {
    if (selectedCustomer) {
      updateMutation.mutate({
        id: selectedCustomer._id,
        updates: {
          plotNumber: selectedCustomer.plotNumber || '',
        },
      });
    }
  };

  const exportToExcel = () => {
    // Create CSV content
    const headers = ['Name', 'Phone Number', 'Property', 'Plot Number', 'Registration Date'];
    const rows = filteredCustomers.map(customer => [
      customer.name,
      customer.phone,
      customer.property,
      customer.plotNumber || 'N/A',
      format(parseISO(customer.createdAt.toString()), 'MMM dd, yyyy')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `customers_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    // Create a printable HTML table
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;

    const tableHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Customers Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #4CAF50; color: white; }
          tr:nth-child(even) { background-color: #f2f2f2; }
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        <h1>Customers Report</h1>
        <p>Generated on: ${format(new Date(), 'MMMM dd, yyyy')}</p>
        <p>Total Customers: ${filteredCustomers.length}</p>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Property</th>
              <th>Plot Number</th>
              <th>Registration Date</th>
            </tr>
          </thead>
          <tbody>
            ${filteredCustomers.map(customer => `
              <tr>
                <td>${customer.name}</td>
                <td>${customer.phone}</td>
                <td>${customer.property}</td>
                <td>${customer.plotNumber || 'N/A'}</td>
                <td>${format(parseISO(customer.createdAt.toString()), 'MMM dd, yyyy')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    printWindow.document.write(tableHTML);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold">Customers</h2>
          <p className="text-gray-600 text-sm">Total: {filteredCustomers.length}</p>
        </div>

        <div className="flex flex-col md:flex-row w-full md:w-auto gap-3">
          <Select value={propertyFilter} onValueChange={setPropertyFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {uniqueProperties.map((property) => (
                <SelectItem key={property} value={property}>
                  {property}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={agentFilter} onValueChange={setAgentFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Agents</SelectItem>
              {uniqueAgents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportToExcel} className="gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Export to Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToPDF} className="gap-2">
                <FileText className="h-4 w-4" />
                Export to PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Plot Number</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  No customers found
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer._id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.property}</TableCell>
                  <TableCell>{customer.plotNumber || 'N/A'}</TableCell>
                  <TableCell>
                    {format(parseISO(customer.createdAt.toString()), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setEditDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Customer Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer - {selectedCustomer?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="plotNumber">Plot Number</Label>
              <Input
                id="plotNumber"
                value={selectedCustomer?.plotNumber || ''}
                onChange={(e) =>
                  setSelectedCustomer((prev) => prev && { ...prev, plotNumber: e.target.value })
                }
                placeholder="Enter plot number"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCustomer}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomersTab;
