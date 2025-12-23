import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Plus, Pencil, Trash2, UserCircle, TrendingUp, Users as UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { useAgents } from '@/hooks/useAuth';
import { createAgent, updateAgent, deleteAgent } from '@/services/agentService';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Agent } from '@/types/agent';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AgentsTab = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewEnquiriesDialogOpen, setViewEnquiriesDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    isActive: true,
  });

  const { data: agents = [], isLoading } = useAgents();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast({
        title: 'Success',
        description: 'Agent created successfully',
      });
      setAddDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create agent',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Agent> }) =>
      updateAgent(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast({
        title: 'Success',
        description: 'Agent updated successfully',
      });
      setEditDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update agent',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast({
        title: 'Success',
        description: 'Agent deleted successfully',
      });
      setDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete agent',
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      avatar: '',
      isActive: true,
    });
  };

  const handleAdd = () => {
    createMutation.mutate(formData);
  };

  const handleEdit = () => {
    if (selectedAgent) {
      updateMutation.mutate({
        id: selectedAgent._id,
        updates: formData,
      });
    }
  };

  const handleDelete = () => {
    if (selectedAgent) {
      deleteMutation.mutate(selectedAgent._id);
    }
  };

  const openEditDialog = (agent: Agent) => {
    setSelectedAgent(agent);
    setFormData({
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      avatar: agent.avatar,
      isActive: agent.isActive,
    });
    setEditDialogOpen(true);
  };

  const getStatusBadge = (enq: any) => {
    const status = enq.status || 'new';
    
    const statusConfig = {
      new: { label: 'New', color: 'bg-gray-100 text-gray-800' },
      contacted: { label: 'Contacted', color: 'bg-orange-100 text-orange-800' },
      qualified: { label: 'Qualified', color: 'bg-blue-100 text-blue-800' },
      converted: { label: 'Converted', color: 'bg-green-100 text-green-800' },
      lost: { label: 'Lost', color: 'bg-red-100 text-red-800' },
      purchased: { label: '🎉 Purchased', color: 'bg-green-100 text-green-800' },
      invalid: { label: 'Invalid', color: 'bg-purple-100 text-purple-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Agents</h2>
          <p className="text-gray-600 text-sm">Total: {agents.length}</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Agent
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Card key={agent._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={agent.avatar} alt={agent.name} />
                  <AvatarFallback className="bg-blue-600 text-white text-xl">
                    {agent.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{agent.name}</CardTitle>
                  <CardDescription className="text-sm">{agent.email}</CardDescription>
                  <p className="text-sm text-gray-600">{agent.phone}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <UsersIcon className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">Total Enquiries</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    {agent.stats?.totalEnquiries || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">Converted</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {agent.stats?.convertedEnquiries || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5 text-orange-600" />
                    <span className="text-sm font-medium">Active</span>
                  </div>
                  <span className="text-2xl font-bold text-orange-600">
                    {agent.stats?.activeEnquiries || 0}
                  </span>
                </div>
              </div>

              {agent.stats && agent.stats.enquiries && agent.stats.enquiries.length > 0 && (
                <Button
                  variant="link"
                  className="w-full mt-4"
                  onClick={() => {
                    setSelectedAgent(agent);
                    setViewEnquiriesDialogOpen(true);
                  }}
                >
                  View All Enquiries
                </Button>
              )}
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => openEditDialog(agent)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={() => {
                  setSelectedAgent(agent);
                  setDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {agents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <UserCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No agents yet</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first agent</p>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Agent
          </Button>
        </div>
      )}

      {/* Add Agent Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Agent</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter agent name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label htmlFor="avatar">Avatar URL (optional)</Label>
              <Input
                id="avatar"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="Enter avatar URL"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Add Agent</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Agent Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Agent</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email (optional)</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Phone *</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-avatar">Avatar URL (optional)</Label>
              <Input
                id="edit-avatar"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Agent Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Agent</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedAgent?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Enquiries Dialog */}
      <Dialog open={viewEnquiriesDialogOpen} onOpenChange={setViewEnquiriesDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Enquiries for {selectedAgent?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Visit Date</TableHead>
                  <TableHead>Comment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedAgent?.stats?.enquiries.map((enq: any) => (
                  <TableRow key={enq._id}>
                    <TableCell className="font-medium">{enq.name}</TableCell>
                    <TableCell>{enq.phone}</TableCell>
                    <TableCell>{enq.property || 'N/A'}</TableCell>
                    <TableCell>{getStatusBadge(enq)}</TableCell>
                    <TableCell>
                      {enq.visitDate
                        ? format(parseISO(enq.visitDate.toString()), 'MMM dd, yyyy')
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {enq.comment || 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentsTab;
