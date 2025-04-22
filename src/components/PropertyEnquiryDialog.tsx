import React, { useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { toast } from "@/hooks/use-toast";

// Property data
const propertyData: Record<string, string[]> = {
  Apartment: ["Skyline Heights", "Urban Nest", "Greenview Residency"],
  Villa: ["Palm Grove Villas", "Royal Enclave"],
  Plot: ["Plot 101", "Plot 202", "Plot 303"]
};

// Schema for validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  comments: z.string().optional(),
  propertyType: z.string().nonempty({ message: "Please select a property type." }),
  property: z.string().nonempty({ message: "Please select a property." }),
});

export type EnquiryFormData = z.infer<typeof formSchema>;

export interface PropertyInfo {
  id: number;
  title: string;
  location: string;
}

// Save to localStorage
const saveEnquiryData = (data: EnquiryFormData, propertyInfo: PropertyInfo) => {
  const enquiries = JSON.parse(localStorage.getItem('enquiries') || '[]');
  enquiries.push({
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    propertyTitle: propertyInfo.title,
    propertyLocation: propertyInfo.location,
  });
  localStorage.setItem('enquiries', JSON.stringify(enquiries));
};

interface PropertyEnquiryDialogProps {
  propertyInfo: PropertyInfo;
  triggerElement?: React.ReactNode;
}

export function PropertyEnquiryDialog({ propertyInfo, triggerElement }: PropertyEnquiryDialogProps) {
  const [open, setOpen] = useState(false);
  const [showScheduleVisit, setShowScheduleVisit] = useState(false);
  const [availableProperties, setAvailableProperties] = useState<string[]>([]);
  const navigate = useNavigate();

  const form = useForm<EnquiryFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      comments: "",
      propertyType: "",
      property: "",
    },
  });

  const watchType = form.watch("propertyType");

  useEffect(() => {
    if (watchType) {
      setAvailableProperties(propertyData[watchType] || []);
      form.setValue("property", "");
    }
  }, [watchType]);

  const onSubmit = (data: EnquiryFormData) => {
    try {
      saveEnquiryData(data, propertyInfo);
      toast({
        title: "Enquiry submitted!",
        description: "We'll get back to you shortly.",
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleScheduleVisit = () => {
    const formData = form.getValues();
    if (form.formState.isValid) {
      setShowScheduleVisit(true);
      setOpen(false);
    } else {
      form.trigger();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {triggerElement || <Button>Enquire Now</Button>}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enquire About This Property</DialogTitle>
            <DialogDescription>
              Interested in {propertyInfo.title}? Fill in your details and we'll get back to you.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Property Type */}
              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(propertyData).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Property */}
              <FormField
                control={form.control}
                name="property"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select property" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableProperties.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comments</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us what you're looking for..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button type="button" variant="outline" onClick={handleScheduleVisit} className="sm:order-first">
                  Schedule Visit
                </Button>
                <Button type="submit">Submit Enquiry</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>






      {showScheduleVisit && form.formState.isValid && (
        <ScheduleVisitWithPrefill
          name={form.getValues().name}
          phone={form.getValues().phone}
        />
      )}
    </>
  );
}

interface ScheduleVisitWithPrefillProps {
  name: string;
  phone: string;
}

function ScheduleVisitWithPrefill({ name, phone }: ScheduleVisitWithPrefillProps) {
  const [openScheduleVisit, setOpenScheduleVisit] = useState(true);

  useEffect(() => {
    const button = document.querySelector("[data-prefilled-visit-button]") as HTMLButtonElement;
    if (button) button.click();
  }, []);

  return (
    <Dialog open={openScheduleVisit} onOpenChange={setOpenScheduleVisit}>
      <DialogTrigger asChild>
        <Button data-prefilled-visit-button className="hidden">Schedule Visit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
      </DialogContent>
    </Dialog>
  );
}
