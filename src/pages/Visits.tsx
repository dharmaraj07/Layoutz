import React, { useState } from 'react';
import { format, isWithinInterval, parseISO } from 'date-fns';
import { ArrowLeft, Search, CalendarIcon, X, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import NavBarAdmin from '@/components/NavBarAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { Visit } from '@/types/visit';
import { useVisit } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const Visits = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const { data: visits = [], isLoading, isError } = useVisit();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentVisit, setCurrentVisit] = useState<Partial<Visit>>({
    name:'',
    phone:'',
    property: '',
    people:0,
    visitDate: new Date(),
    status: 'Pending',
    createdAt: new Date()
});

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

  const handleEditChange = (field: keyof Visit, value: string) => {
    if (!currentVisit) return;

    if (field === 'visitDate' || field === 'createdAt') {
      setCurrentVisit({ ...currentVisit, [field]: new Date(value) });
    } else {
      setCurrentVisit({ ...currentVisit, [field]: value });
    }
  };

  const saveEditedVisit = () => {
    // 🔴 Send `currentVisit` to backend via mutation if needed
    console.log('Saving visit', currentVisit);
    setEditDialogOpen(false);
  };
  console.log(filteredVisits)
  return (
    <div className="min-h-screen flex flex-col items-center">
        <NavBarAdmin />

        <div className="w-full px-4 sm:px-6 md:px-8 py-20">
        <div className="max-w-screen-xl mx-auto pt-10">
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
                    className={cn('justify-start text-left font-normal', dateRange?.from && 'text-foreground')}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                        </>
                      ) : (
                        format(dateRange.from, 'LLL dd, y')
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
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                    <div className="flex justify-end items-center pt-4 border-t mt-3">
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
                    <TableHead>Property Type</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Scheduled On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVisits.map((visit: Visit) => (
                    <TableRow key={visit._id}>
                      <TableCell className="font-medium">{visit.name}</TableCell>
                      <TableCell>{visit.phone}</TableCell>
                      <TableCell> {visit.visitDate ? format(new Date(visit.visitDate), 'PPP') : '—'}</TableCell>
                      <TableCell>{visit.people}</TableCell>
                      <TableCell>{visit.name}</TableCell>
                      <TableCell>{visit.createdAt ? format(new Date(visit.createdAt), 'PPP') : '—'}</TableCell>
                      <TableCell>{visit.status}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setCurrentVisit({
                              ...visit,
                              visitDate: new Date(visit.visitDate),
                              createdAt: new Date(visit.createdAt),
                            });
                            setEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4 mr-2" /> Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
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
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Visit</DialogTitle>
          </DialogHeader>
          {currentVisit && (
            <div className="grid gap-4 py-4">
              {Object.entries(currentVisit).map(([key, value]) => (
                <div key={key} className="grid grid-cols-4 items-center gap-4">
                  <Label className="capitalize" htmlFor={key}>{key}</Label>
                  <Input
                    id={key}
                    type={key === 'visitDate' || key === 'createdAt' ? 'date' : 'text'}
                    value={
                      value instanceof Date
                        ? value.toISOString().split('T')[0]
                        : (value as string)
                    }
                    onChange={(e) =>
                      handleEditChange(key as keyof Visit, e.target.value)
                    }
                    className="col-span-3"
                  />
                </div>
              ))}
              <Button onClick={saveEditedVisit} className="w-full">
                Save
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Visits;
