import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NavBarAdmin from '@/components/NavBarAdmin';
import { Users, CalendarCheck, MessageSquare, UserCheck } from 'lucide-react';
import EnquiriesTab from '@/components/EnquiriesTab';
import VisitsTab from '@/components/VisitsTab';
import AgentsTab from '@/components/AgentsTab';
import CustomersTab from '@/components/CustomersTab';
import { useEnq, useVisit, useAgents } from '@/hooks/useAuth';

const CRM = () => {
  const [activeTab, setActiveTab] = useState('enquiries');
  const { data: enquiries = [] } = useEnq();
  const { data: visits = [] } = useVisit();
  const { data: agents = [] } = useAgents();

  // Calculate stats
  const stats = {
    totalEnquiries: enquiries.length,
    pendingEnquiries: enquiries.filter((e: any) => e.status === 'pending').length,
    totalVisits: visits.length,
    scheduledVisits: visits.filter((v: any) => v.status === 'scheduled').length,
    totalAgents: agents.length,
    activeAgents: agents.filter((a: any) => a.status === 'active').length,
    totalCustomers: enquiries.filter((e: any) => e.status === 'converted').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <NavBarAdmin />
      
      <div className="w-full px-4 sm:px-6 md:px-8 py-24">
        <div className="max-w-screen-2xl mx-auto">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-2xl p-8 mb-8 text-white">
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">CRM Dashboard</h1>
              <p className="text-blue-100 text-lg">Manage your enquiries, visits, agents, and customers</p>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-blue-100 text-sm font-medium">Enquiries</p>
                  <MessageSquare className="h-5 w-5 text-blue-200" />
                </div>
                <p className="text-3xl font-bold">{stats.totalEnquiries}</p>
                <p className="text-blue-200 text-xs mt-1">{stats.pendingEnquiries} pending</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-blue-100 text-sm font-medium">Visits</p>
                  <CalendarCheck className="h-5 w-5 text-blue-200" />
                </div>
                <p className="text-3xl font-bold">{stats.totalVisits}</p>
                <p className="text-blue-200 text-xs mt-1">{stats.scheduledVisits} scheduled</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-blue-100 text-sm font-medium">Agents</p>
                  <Users className="h-5 w-5 text-blue-200" />
                </div>
                <p className="text-3xl font-bold">{stats.totalAgents}</p>
                <p className="text-blue-200 text-xs mt-1">{stats.activeAgents} active</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-blue-100 text-sm font-medium">Customers</p>
                  <UserCheck className="h-5 w-5 text-blue-200" />
                </div>
                <p className="text-3xl font-bold">{stats.totalCustomers}</p>
                <p className="text-blue-200 text-xs mt-1">Total converted</p>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-white rounded-xl shadow-sm p-2 mb-6">
              <TabsList className="grid w-full max-w-3xl grid-cols-4 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger 
                  value="enquiries" 
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Enquiries</span>
                  {stats.totalEnquiries > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      {stats.totalEnquiries}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="visits" 
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                >
                  <CalendarCheck className="h-4 w-4" />
                  <span className="hidden sm:inline">Visits</span>
                  {stats.totalVisits > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      {stats.totalVisits}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="agents" 
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Agents</span>
                  {stats.totalAgents > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                      {stats.totalAgents}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="customers" 
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                >
                  <UserCheck className="h-4 w-4" />
                  <span className="hidden sm:inline">Customers</span>
                  {stats.totalCustomers > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                      {stats.totalCustomers}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="enquiries" className="mt-0">
              <EnquiriesTab />
            </TabsContent>

            <TabsContent value="visits" className="mt-0">
              <VisitsTab />
            </TabsContent>

            <TabsContent value="agents" className="mt-0">
              <AgentsTab />
            </TabsContent>

            <TabsContent value="customers" className="mt-0">
              <CustomersTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CRM;
