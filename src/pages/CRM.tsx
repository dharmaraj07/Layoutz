import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NavBarAdmin from '@/components/NavBarAdmin';
import { Users, CalendarCheck, MessageSquare, UserCheck } from 'lucide-react';
import EnquiriesTab from '@/components/EnquiriesTab';
import VisitsTab from '@/components/VisitsTab';
import AgentsTab from '@/components/AgentsTab';
import CustomersTab from '@/components/CustomersTab';

const CRM = () => {
  const [activeTab, setActiveTab] = useState('enquiries');

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBarAdmin />
      
      <div className="w-full px-4 sm:px-6 md:px-8 py-20">
        <div className="max-w-screen-2xl mx-auto pt-10">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">CRM Dashboard</h1>
            <p className="text-gray-600">Manage your enquiries, visits, and agents</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-2xl grid-cols-4 mb-8">
              <TabsTrigger value="enquiries" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Enquiries</span>
              </TabsTrigger>
              <TabsTrigger value="visits" className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Visits</span>
              </TabsTrigger>
              <TabsTrigger value="agents" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Agents</span>
              </TabsTrigger>
              <TabsTrigger value="customers" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Customers</span>
              </TabsTrigger>
            </TabsList>

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
