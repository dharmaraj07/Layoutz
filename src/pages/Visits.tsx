import React, { useState, useEffect } from 'react';
import { format, isWithinInterval, parseISO } from "date-fns";
import { ArrowLeft, Search, CalendarIcon, X } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VisitFormData } from '../components/ScheduleVisitDialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface Visit extends Omit<VisitFormData, 'visitDate'> {
  id: string;
  createdAt: string;
  visitDate: string;
}

const Visits = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  
  useEffect(() => {
    // Load visits from localStorage
    const storedVisits = JSON.parse(localStorage.getItem('visits') || '[]');
    setVisits(storedVisits);
  }, []);
  
  // Filter visits based on search query and date range
  const filteredVisits = visits.filter(visit => {
    // Text search filter
    const matchesSearch = 
      visit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visit.phone.includes(searchQuery);
    
    // Date range filter
    let matchesDateRange = true;
    if (dateRange && dateRange.from) {
      const visitDate = parseISO(visit.visitDate);
      const from = dateRange.from;
      const to = dateRange.to || dateRange.from;
      
      matchesDateRange = isWithinInterval(visitDate, { start: from, end: to });
    }
    
    return matchesSearch && matchesDateRange;
  });

  const clearDateFilter = () => {
    setDateRange(undefined);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-background py-20">
        <div className="container max-w-6xl mx-auto px-4 pt-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center">
              <Link to="/">
                <Button variant="ghost" size="sm" className="mr-2">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Scheduled Visits</h1>
            </div>
            
            <div className="flex flex-col md:flex-row w-full md:w-auto gap-3">
              {/* Text search */}
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name or phone..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Date range filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={cn(
                      "justify-start text-left font-normal",
                      dateRange?.from && "text-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Filter by date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <div className="p-3">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={(date) => setDateRange(date)}
                      numberOfMonths={2}
                      className="pointer-events-auto"
                    />
                    
                    <div className="flex items-center justify-end pt-4 border-t mt-3">
                      {dateRange?.from && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={clearDateFilter}
                          className="mr-2"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Clear
                        </Button>
                      )}
                      <Button size="sm" onClick={() => document.body.click()}>
                        Apply Filter
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {filteredVisits.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Visit Date</TableHead>
                    <TableHead>People</TableHead>
                    <TableHead>Scheduled On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVisits.map((visit) => (
                    <TableRow key={visit.id}>
                      <TableCell className="font-medium">{visit.name}</TableCell>
                      <TableCell>{visit.phone}</TableCell>
                      <TableCell>{format(new Date(visit.visitDate), "PPP")}</TableCell>
                      <TableCell>{visit.people}</TableCell>
                      <TableCell>{format(new Date(visit.createdAt), "PPP")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : searchQuery || dateRange?.from ? (
            <div className="text-center py-10">
              <p className="text-lg text-muted-foreground">No visits found matching your filters.</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setDateRange(undefined);
                }}
                className="mt-4" 
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-lg text-muted-foreground">No visits have been scheduled yet.</p>
              <Button 
                variant="outline" 
                asChild
                className="mt-4" 
              >
                <Link to="/">
                  Schedule Your First Visit
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Visits;