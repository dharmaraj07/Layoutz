import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Search, Filter, UserPlus, CheckCircle, X, Pencil, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEnq, useAgents } from '@/hooks/useAuth';
import { assignEnquiryToAgent } from '@/services/agentService';
import { updateEnq } from '@/services/enqService';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Enq } from '@/types/enq';

const EnquiriesTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [agentFilter, setAgentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enq | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');

  const { data: enquiries = [], isLoading: enqLoading } = useEnq();
  const { data: agents = [], isLoading: agentsLoading } = useAgents();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const assignMutation = useMutation({
    mutationFn: ({ enquiryId, agentId }: { enquiryId: string; agentId: string }) =>
      assignEnquiryToAgent(enquiryId, agentId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['enq'] });
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast({
        title: 'Success',
        description: 'Agent assigned successfully',
      });
      
      // Send WhatsApp message to agent
      const agent = agents.find(a => a._id === variables.agentId);
      if (agent && agent.phone && selectedEnquiry) {
        const message = encodeURIComponent(
          `Hello ${agent.name},\n\n` +
          `You have been assigned a new enquiry:\n\n` +
          `Customer Name: ${selectedEnquiry.name}\n` +
          `Phone: ${selectedEnquiry.phone}\n` +
          `Property: ${selectedEnquiry.property}\n` +
          `Comment: ${selectedEnquiry.comment || 'N/A'}\n\n` +
          `Please follow up at your earliest convenience.`
        );
        
        // Clean phone number (remove spaces, dashes, etc.)
        const cleanPhone = agent.phone.replace(/[\s-]/g, '');
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
        
        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');
      }
      
      setAssignDialogOpen(false);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to assign agent',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; updates: Partial<Enq> }) =>
      updateEnq(data.id, data.updates),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['enq'] });
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      
      const isPurchased = variables.updates.status === 'purchased';
      
      toast({
        title: isPurchased ? '🎉 Congratulations!' : 'Success',
        description: isPurchased 
          ? 'Enquiry marked as purchased! Great job on closing the deal!' 
          : 'Enquiry updated successfully',
      });
      setEditDialogOpen(false);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update enquiry',
        variant: 'destructive',
      });
    },
  });

  // Get unique properties for filter (exclude empty values)
  const uniqueProperties = Array.from(
    new Set(enquiries.map(enq => enq.property).filter(prop => prop && prop.trim() !== ''))
  ).sort();

  // Get unique agents for filter
  const uniqueAgents = agents.filter(agent => 
    enquiries.some(enq => enq.assignedAgent?._id === agent._id)
  );

  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesSearch =
      enq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enq.phone.includes(searchQuery) ||
      enq.property.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProperty =
      propertyFilter === 'all' || enq.property === propertyFilter;

    const matchesAgent =
      agentFilter === 'all' || enq.assignedAgent?._id === agentFilter;

    const status = enq.status || 'new';
    const matchesStatus =
      statusFilter === 'all' || status === statusFilter;

    return matchesSearch && matchesProperty && matchesAgent && matchesStatus;
  });

  const handleAssignAgent = () => {
    if (selectedEnquiry && selectedAgentId) {
      assignMutation.mutate({
        enquiryId: selectedEnquiry._id,
        agentId: selectedAgentId,
      });
    }
  };

  const handleMarkAsConverted = (enquiry: Enq) => {
    updateMutation.mutate({
      id: enquiry._id,
      updates: { status: 'converted', purchased: 'purchased' },
    });
  };

  const handleUpdateEnquiry = () => {
    if (selectedEnquiry) {
      const updates: any = {
        name: selectedEnquiry.name,
        phone: selectedEnquiry.phone,
        status: selectedEnquiry.status,
        completed: selectedEnquiry.completed,
        purchased: selectedEnquiry.status === 'purchased' ? 'purchased' : selectedEnquiry.purchased,
        comment: selectedEnquiry.comment,
        assignedAgent: selectedEnquiry.assignedAgent?._id || null,
        visitDate: selectedEnquiry.visitDate,
        plotNumber: selectedEnquiry.plotNumber || '',
      };
      
      updateMutation.mutate({
        id: selectedEnquiry._id,
        updates,
      });
    }
  };

  const exportToExcel = () => {
    const headers = ['Name', 'Phone', 'Property', 'Status', 'Agent', 'Visit Date', 'Plot Number', 'Comment', 'Created Date'];
    const rows = filteredEnquiries.map(enq => [
      enq.name,
      enq.phone,
      enq.property,
      enq.status || 'new',
      enq.assignedAgent?.name || 'Unassigned',
      enq.visitDate ? format(parseISO(enq.visitDate.toString()), 'MMM dd, yyyy') : 'N/A',
      enq.plotNumber || 'N/A',
      enq.comment || '',
      format(parseISO(enq.createdAt.toString()), 'MMM dd, yyyy')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `enquiries_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;

    const tableHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Enquiries Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
          th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
          th { background-color: #4CAF50; color: white; }
          tr:nth-child(even) { background-color: #f2f2f2; }
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        <h1>Enquiries Report</h1>
        <p>Generated on: ${format(new Date(), 'MMMM dd, yyyy')}</p>
        <p>Total Enquiries: ${filteredEnquiries.length}</p>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Property</th>
              <th>Status</th>
              <th>Agent</th>
              <th>Visit Date</th>
              <th>Plot Number</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            ${filteredEnquiries.map(enq => `
              <tr>
                <td>${enq.name}</td>
                <td>${enq.phone}</td>
                <td>${enq.property}</td>
                <td>${enq.status || 'new'}</td>
                <td>${enq.assignedAgent?.name || 'Unassigned'}</td>
                <td>${enq.visitDate ? format(parseISO(enq.visitDate.toString()), 'MMM dd, yyyy') : 'N/A'}</td>
                <td>${enq.plotNumber || 'N/A'}</td>
                <td>${enq.comment || ''}</td>
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

  const getStatusBadge = (enq: Enq) => {
    const status = enq.status || 'new';
    
    const statusConfig = {
      new: { label: 'New', className: 'bg-gray-100 text-gray-800 border-transparent' },
      contacted: { label: 'Contacted', className: 'bg-orange-100 text-orange-800 border-transparent' },
      qualified: { label: 'Qualified', className: 'bg-blue-100 text-blue-800 border-transparent' },
      converted: { label: 'Converted', className: 'bg-green-100 text-green-800 border-transparent' },
      lost: { label: 'Lost', className: 'bg-red-100 text-red-800 border-transparent' },
      purchased: { label: '🎉 Purchased', className: 'bg-green-100 text-green-800 border-transparent' },
      invalid: { label: 'Invalid', className: 'bg-purple-100 text-purple-800 border-transparent' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  if (enqLoading || agentsLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold">Enquiries</h2>
          <p className="text-gray-600 text-sm">Total: {filteredEnquiries.length}</p>
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
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Agents</SelectItem>
              {uniqueAgents.map((agent) => (
                <SelectItem key={agent._id} value={agent._id}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search enquiries..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
              <SelectItem value="invalid">Invalid</SelectItem>
            </SelectContent>
          </Select>

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
              <TableHead>Phone</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned Agent</TableHead>
              <TableHead>Visit Date</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEnquiries.map((enq) => (
              <TableRow key={enq._id}>
                <TableCell className="font-medium">{enq.name}</TableCell>
                <TableCell>{enq.phone}</TableCell>
                <TableCell>{enq.property || 'N/A'}</TableCell>
                <TableCell>{getStatusBadge(enq)}</TableCell>
                <TableCell>
                  {enq.assignedAgent ? (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                        {enq.assignedAgent.name.charAt(0)}
                      </div>
                      <span className="text-sm">{enq.assignedAgent.name}</span>
                    </div>
                  ) : (
                    <Badge variant="outline">Unassigned</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {enq.visitDate
                    ? format(parseISO(enq.visitDate.toString()), 'MMM dd, yyyy')
                    : 'N/A'}
                </TableCell>
                <TableCell className="max-w-xs truncate">{enq.comment || 'N/A'}</TableCell>
                <TableCell>
                  {format(parseISO(enq.createdAt.toString()), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {enq.status !== 'purchased' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedEnquiry(enq);
                            setSelectedAgentId(enq.assignedAgent?._id || '');
                            setAssignDialogOpen(true);
                          }}
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedEnquiry(enq);
                            setEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {enq.status !== 'converted' && enq.status !== 'purchased' && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleMarkAsConverted(enq)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Assign Agent Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Agent</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Enquiry: {selectedEnquiry?.name}</Label>
            </div>
            <div>
              <Label htmlFor="agent">Select Agent</Label>
              <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent._id} value={agent._id}>
                      {agent.name} - {agent.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignAgent} disabled={!selectedAgentId}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Enquiry Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Enquiry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={selectedEnquiry?.name || ''}
                  onChange={(e) =>
                    setSelectedEnquiry((prev) => prev && { ...prev, name: e.target.value })
                  }
                  placeholder="Enter name"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={selectedEnquiry?.phone || ''}
                  onChange={(e) =>
                    setSelectedEnquiry((prev) => prev && { ...prev, phone: e.target.value })
                  }
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={selectedEnquiry?.status || 'new'}
                  onValueChange={(value) =>
                    setSelectedEnquiry((prev) => prev && { ...prev, status: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                    <SelectItem value="purchased">Purchased</SelectItem>
                    <SelectItem value="invalid">Invalid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="completed">Completion Status</Label>
                <Select
                  value={selectedEnquiry?.completed || 'pending'}
                  onValueChange={(value) =>
                    setSelectedEnquiry((prev) => prev && { ...prev, completed: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="assignedAgent">Assigned Agent</Label>
              <Select
                value={selectedEnquiry?.assignedAgent?._id || 'unassigned'}
                onValueChange={(value) => {
                  if (value === 'unassigned') {
                    setSelectedEnquiry((prev) => prev && { ...prev, assignedAgent: null });
                  } else {
                    const agent = agents.find(a => a._id === value);
                    setSelectedEnquiry((prev) => prev && { ...prev, assignedAgent: agent });
                  }
                }}
                disabled={selectedEnquiry?.status === 'purchased'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {agents.map((agent) => (
                    <SelectItem key={agent._id} value={agent._id}>
                      {agent.name} - {agent.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="visitDate">Visit Date</Label>
              <Input
                id="visitDate"
                type="datetime-local"
                value={
                  selectedEnquiry?.visitDate
                    ? new Date(selectedEnquiry.visitDate).toISOString().slice(0, 16)
                    : ''
                }
                onChange={(e) =>
                  setSelectedEnquiry((prev) =>
                    prev && { ...prev, visitDate: new Date(e.target.value).toISOString() }
                  )
                }
              />
            </div>
            <div>
              <Label htmlFor="plotNumber">Plot Number</Label>
              <Input
                id="plotNumber"
                value={selectedEnquiry?.plotNumber || ''}
                onChange={(e) =>
                  setSelectedEnquiry((prev) => prev && { ...prev, plotNumber: e.target.value })
                }
                placeholder="Enter plot number"
              />
            </div>
            <div>
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                value={selectedEnquiry?.comment || ''}
                onChange={(e) =>
                  setSelectedEnquiry((prev) => prev && { ...prev, comment: e.target.value })
                }
                rows={4}
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => {
                if (selectedEnquiry) {
                  setSelectedEnquiry({
                    ...selectedEnquiry,
                    status: 'new',
                    completed: 'pending',
                    purchased: 'pending',
                  });
                }
              }}
            >
              Reset Status
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateEnquiry}>
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnquiriesTab;
