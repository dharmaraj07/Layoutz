import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Property } from '@/types/property';
import Navbar from '@/components/NavBar';
import { useProps } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { baseURL } from '@/content/url';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  comments: z.string().optional(),
  property: z.string().nonempty({ message: "Please select a property." }),
});

const Enquire = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [availableProperties, setAvailableProperties] = useState<Property[]>([]);
  const { data: propsData, isLoading } = useProps();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Update document title for SEO
  useEffect(() => {
    if (property) {
      document.title = `Enquire About ${property.title} - D Layoutz`;
    } else {
      document.title = 'Property Enquiry - D Layoutz';
    }
  }, [property]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      comments: "",
      property: "",
    },
  });

  // Load all available properties from database
  useEffect(() => {
    if (propsData && Array.isArray(propsData)) {
      setAvailableProperties(propsData);
      console.log('Loaded properties:', propsData);
    }
  }, [propsData]);

  // Pre-fill property if coming from specific property page
  useEffect(() => {
    if (propertyId && propertyId !== 'general' && propsData) {
      const foundProperty = propsData.find((p: Property) => p._id === propertyId);
      if (foundProperty) {
        setProperty(foundProperty);
        form.setValue("property", foundProperty._id || "");
      }
    }
  }, [propertyId, propsData]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // Find selected property details
    const selectedProperty = availableProperties.find((p) => p._id === values.property);
    
    console.log('Submitting enquiry:', {
      selectedProperty,
      values,
    });
    
    try {
      const response = await fetch(`${baseURL}/api/enq/enqs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          phone: values.phone,
          property: selectedProperty?.title || values.property,
          review: values.comments || 'Like to Learn More About Property Details',
          comment: values.comments,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast({
          title: "Enquiry Submitted",
          description: "We've received your message and will contact you shortly.",
        });
      } else {
        throw new Error('Failed to submit enquiry');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit enquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: .5}}
        className="flex flex-col min-h-screen"
      >
        <Navbar />
        
        <main className="flex-grow pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-housing-800 mb-3 mt-6">
              Get in Touch
            </h1>
            <p className="text-gray-600 text-lg">
              {property ? (
                <>Inquire about <span className="font-semibold">{property.title}</span></>
              ) : (
                <>We'd love to hear from you. Fill out the form below and we'll get back to you shortly.</>
              )}
            </p>
          </div>
          
          {isSubmitted ? (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-2xl font-heading font-semibold text-gray-800 mb-4">Thank You!</h2>
                <p className="text-gray-600 mb-6">
                  Your enquiry has been successfully submitted. Our team will get back to you within 24 hours.
                </p>
                <div className="flex justify-center gap-4">
                  <Link to="/properties">
                    <Button variant="outline">View More Properties</Button>
                  </Link>
                  <Link to="/">
                    <Button>Return Home</Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
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
                          <Input type="tel" placeholder="+91 XXXXX XXXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="property"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Property</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                          disabled={isLoading || availableProperties.length === 0}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={
                                isLoading 
                                  ? "Loading properties..." 
                                  : availableProperties.length === 0 
                                    ? "No properties available" 
                                    : "Choose a property"
                              } />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableProperties && availableProperties.length > 0 ? (
                              availableProperties.map((prop) => (
                                <SelectItem key={prop._id} value={prop._id}>
                                  {prop.title} {prop.location ? `- ${prop.location}` : ''}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled>
                                No properties available
                              </SelectItem>
                            )}
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
                        <FormLabel>Message (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your requirements or ask any questions..."
                            className="resize-none"
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full text-lg py-6" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      "Submit Enquiry"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default Enquire;
