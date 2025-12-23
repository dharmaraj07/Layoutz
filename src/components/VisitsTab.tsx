import React, { useState } from 'react';
import { format, parseISO, isWithinInterval } from 'date-fns';
import { Search, CalendarIcon, X } from 'lucide-react';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { useVisit } from '@/hooks/useAuth';

const VisitsTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const { data: visits = [], isLoading } = useVisit();

  const filteredVisits = visits.filter((visit) => {
    const matchesSearch =
      visit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visit.phone.includes(searchQuery);

    let matchesDateRange = true;
    if (dateRange?.from) {
      const visitDate = parseISO(visit.visitDate.toString());
      const from = dateRange.from;
      const to = dateRange.to || dateRange.from;
      matchesDateRange = isWithinInterval(visitDate, { start: from, end: to });
    }

    return matchesSearch && matchesDateRange;
  });

  const clearDateFilter = () => setDateRange(undefined);

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold">Scheduled Visits</h2>
          <p className="text-gray-600 text-sm">Total: {filteredVisits.length}</p>
        </div>

        <div className="flex flex-col md:flex-row w-full md:w-auto gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or phone..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full md:w-[280px] justify-start text-left font-normal',
                  !dateRange && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'LLL dd, y')} -{' '}
                      {format(dateRange.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(dateRange.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {dateRange && (
            <Button variant="ghost" size="icon" onClick={clearDateFilter}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>People</TableHead>
              <TableHead>Visit Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVisits.map((visit) => (
              <TableRow key={visit._id}>
                <TableCell className="font-medium">{visit.name}</TableCell>
                <TableCell>{visit.phone}</TableCell>
                <TableCell>{visit.property || 'N/A'}</TableCell>
                <TableCell>{visit.people || 1}</TableCell>
                <TableCell>
                  {format(parseISO(visit.visitDate.toString()), 'MMM dd, yyyy h:mm a')}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={visit.status === 'Confirmed' ? 'default' : 'secondary'}
                  >
                    {visit.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(parseISO(visit.createdAt.toString()), 'MMM dd, yyyy')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredVisits.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No visits found matching your criteria
        </div>
      )}
    </div>
  );
};

export default VisitsTab;
