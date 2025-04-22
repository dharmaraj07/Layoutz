import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import InvestHero from '@/components/InvestHero'
import propertymoney from '@/image/propertymoney.jpg'

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  BarChart3, 
  PieChartIcon, 
  Landmark, 
  Shield, 
  Award,
  Repeat,
  Building2,
  ArrowUpRight,
  HandCoins,
  CalendarRange,
  ClipboardPenLine,
  LandPlot
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import InvestmentComparisonTable from '@/components/InvestmentComparisonTable';
import { InvestmentEnquiry } from '@/components/InvestmentEnquiry';
import Header from '@/components/Header';

const Investor = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    investmentAmount: '',
    message: 'I would like more information about investment opportunities.'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInvestmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Investment enquiry:', formData);
    toast({
      title: "Investment Enquiry Submitted",
      description: "Thank you for your interest. Our team will contact you shortly.",
    });
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      investmentAmount: '',
      message: 'I would like more information about investment opportunities.'
    });
  };

  const returnData = [
    { year: '2018', return: 4.2 },
    { year: '2019', return: 5.1 },
    { year: '2020', return: 3.8 },
    { year: '2021', return: 7.3 },
    { year: '2022', return: 6.9 },
    { year: '2023', return: 8.2 },
  ];

  const investmentData = [
    { name: 'Residential', value: 45 },
    { name: 'Commercial', value: 30 },
    { name: 'Industrial', value: 15 },
    { name: 'Land', value: 10 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const projectData = [
    { name: 'Q1', completed: 12, ongoing: 8 },
    { name: 'Q2', completed: 15, ongoing: 10 },
    { name: 'Q3', completed: 18, ongoing: 7 },
    { name: 'Q4', completed: 22, ongoing: 5 },
  ];
  const property= [
    { name: "Electricity Line", img :propertymoney },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <Header />
      <InvestHero />
      
      <main className="flex-grow pb-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-l text-white py-20">

          <div className="max-w-8xl mx-20 px-4 sm:px-6 lg:px-8 flex gap-8 text-black">
          <img 
            src={propertymoney}
            alt="Investment Banner" 
            className="w-50 h-auto rounded-lg shadow-lg"
          />
            <div className="md:w-2/3 text-black">

              <h1 className="text-3xl md:text-3xl font-heading font-bold mb-6">
                   Investment Process

              </h1>
              <p className="text-lg md:text-xl mb-8 ">
              Secure Your Future with Layoutz’s Buy-Back Plan
              </p>
              <p className="text-lg md:text-xl mb-8 ">
              At Layoutz, we offer a unique Buy-Back Plan designed to provide you with flexible investment options and peace of mind. Whether you wish to retain your property, sell it back, or share the profits, our plan caters to your individual preferences.
              </p>
              {/* Investment Process Steps */}
              <section className="py-4 bg-transparent">
                <div className="max-w-6xl mx-auto px-4">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Row 1 */}
                    <div>
                      
                      
                      <h3 className="font-bold text-2xl mb-4 flex items-center text-housing-700"> <HandCoins className='w-10 h-10'/> &nbsp; Minimum Investment</h3>
                      <p className=" text-xl">Start with an investment of
                      ₹1 crores.</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl mb-4 flex items-center text-housing-700"> <CalendarRange className='w-10 h-10'/> &nbsp; Agreement Duration</h3>
                      <p className=" text-xl">Enter into a 2-year agreement
                      with us.</p>
                    </div>

                    {/* Row 2 */}
                    <div >
                      <h3 className="font-bold text-2xl mb-4 flex items-center text-housing-700"><ClipboardPenLine className='w-10 h-10'/>&nbsp; Comprehensive Agreements</h3>
                      <p className=" text-xl">We provide both a sale agreement and a buy-back agreement for transparency and security.</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl mb-4 flex items-center text-housing-700"><LandPlot className='w-10 h-10'/> &nbsp;Land/Plot Selection</h3>
                      <p className=" text-xl">The selection can be decided by either the developer or the buyer.</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-full h-20 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}></div>
        </section>

        {/* Why Plots are Better Investment */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-housing-800 mb-4">
                Why Plots are a Better Investment
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Investing in plots offers numerous advantages over other real estate investments. Discover why savvy investors prefer land investments.
              </p>
            </div>

            <div className="mb-12">
              <InvestmentComparisonTable />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <TrendingUp className="w-12 h-12 text-housing-600 mb-4" />,
                  title: "Higher Appreciation",
                  description: "Land values typically appreciate faster than built properties, offering greater returns on investment over time."
                },
                {
                  icon: <Building2 className="w-12 h-12 text-housing-600 mb-4" />,
                  title: "Lower Investment Entry",
                  description: "Plots require lower initial investment compared to constructed properties, making them accessible to more investors."
                },
                {
                  icon: <ArrowUpRight className="w-12 h-12 text-housing-600 mb-4" />,
                  title: "No Depreciation",
                  description: "Unlike buildings that depreciate over time, land doesn't deteriorate and requires minimal maintenance costs."
                },
                {
                  icon: <Shield className="w-12 h-12 text-housing-600 mb-4" />,
                  title: "Limited Supply",
                  description: "Land is a finite resource that cannot be manufactured, ensuring its long-term value and demand."
                },
                {
                  icon: <Landmark className="w-12 h-12 text-housing-600 mb-4" />,
                  title: "Development Potential",
                  description: "Plots offer flexibility for future development according to market trends and personal preferences."
                },
                {
                  icon: <Repeat className="w-12 h-12 text-housing-600 mb-4" />,
                  title: "Easier to Liquidate",
                  description: "Undeveloped land is often easier and quicker to sell than constructed properties, providing better liquidity."
                }
              ].map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex">
                  <div className="text-center">
                    <div className="items-center flex gap-4 justify-center">
                    {item.icon}
                    <h3 className="text-xl font-bold text-housing-800 mb-3">{item.title}</h3>
                    </div>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Investment Highlights */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-housing-800 mb-4">
                Why Invest With Us
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Layoutz Housing offers a range of investment opportunities designed to maximize returns while minimizing risk.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <TrendingUp className="w-12 h-12 text-housing-600 mb-4" />,
                  title: "Consistent Returns",
                  description: "Our properties consistently deliver above-market returns for our investors."
                },
                {
                  icon: <Shield className="w-12 h-12 text-housing-600 mb-4" />,
                  title: "Secured Investment",
                  description: "All investments are backed by real assets, providing security and peace of mind."
                },
                {
                  icon: <Landmark className="w-12 h-12 text-housing-600 mb-4" />,
                  title: "Portfolio Diversification",
                  description: "Spread your investment across various types of properties to reduce risk."
                },
                {
                  icon: <Award className="w-12 h-12 text-housing-600 mb-4" />,
                  title: "Expert Management",
                  description: "Our team of professionals ensures optimal performance of your investments."
                }
              ].map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="text-center">
                    <div className="items-center flex gap-2 justify-center">
                    {item.icon}
                    <h3 className="text-xl font-bold text-housing-800 mb-3">{item.title}</h3>
                    </div>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Buy Back Guarantee */}
        {/*
        <section className="py-16 bg-housing-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="bg-housing-700 text-white p-8 md:p-12">
                  <h2 className="text-3xl font-heading font-bold mb-6">Buy Back Guarantee</h2>
                  <p className="text-lg mb-6">
                    We stand firmly behind the quality and value of our properties with our exclusive buy-back program.
                  </p>
                  <ul className="space-y-4">
                    {[
                      "Guaranteed buy-back after 3 years of investment",
                      "Buy-back value at 120% of original investment",
                      "No hidden terms or conditions",
                      "Transparent process with simple documentation",
                      "Risk-free investment opportunity"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-housing-300 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-8 md:p-12">
                  <h3 className="text-2xl font-heading font-bold text-housing-800 mb-4">How It Works</h3>
                  <ol className="space-y-6">
                    {[
                      {
                        title: "Make Your Investment",
                        description: "Purchase a plot or property through our investment program."
                      },
                      {
                        title: "Hold for Minimum Term",
                        description: "Maintain your investment for at least 3 years to qualify for the buy-back option."
                      },
                      {
                        title: "Request Buy-Back",
                        description: "Notify us of your intention to exercise the buy-back option with 30 days' notice."
                      },
                      {
                        title: "Receive Guaranteed Returns",
                        description: "We repurchase your property at best."
                      }
                    ].map((item, index) => (
                      <li key={index} className="relative pl-10">
                        <span className="absolute left-0 top-0 flex items-center justify-center w-7 h-7 rounded-full bg-housing-600 text-white font-bold text-sm">
                          {index + 1}
                        </span>
                        <h4 className="font-bold text-housing-800 mb-1">{item.title}</h4>
                        <p className="text-gray-600">{item.description}</p>
                      </li>
                    ))}
                  </ol>
                   <div className="mt-8">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-housing-600 hover:bg-housing-700">
                          Learn More About Buy-Back
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Buy-Back Guarantee Details</DialogTitle>
                          <DialogDescription>
                            Our buy-back guarantee provides you with a secure exit strategy for your investment.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <p>The Layoutz Housing Buy-Back Guarantee offers investors peace of mind with these key features:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Available on select premium plots and properties</li>
                            <li>Minimum holding period of 3 years from date of purchase</li>
                            <li>Guaranteed buy-back price of 120% of the original purchase price</li>
                            <li>Written guarantee provided at time of purchase</li>
                            <li>30-day notice period required to exercise buy-back option</li>
                            <li>Seamless process with minimal paperwork</li>
                          </ul>
                          <p className="text-sm text-gray-500 mt-4">
                            Terms and conditions apply. Please contact our investment team for complete details.
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div> 
                </div>
              </div>
            </div>
          </div>
        </section>
        */}

        {/* Performance Metrics */}
{/*         <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-housing-800 mb-4">
                Investment Performance
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Track record of our investment performance over the years, showcasing consistent growth and returns.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <BarChart3 className="w-6 h-6 text-housing-600 mr-2" />
                  <h3 className="text-xl font-bold text-housing-800">Annual Returns</h3>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={returnData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Return']}
                        labelFormatter={(label) => `Year: ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="return" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }} 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <PieChartIcon className="w-6 h-6 text-housing-600 mr-2" />
                  <h3 className="text-xl font-bold text-housing-800">Investment Distribution</h3>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={investmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {investmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <BarChart3 className="w-6 h-6 text-housing-600 mr-2" />
                <h3 className="text-xl font-bold text-housing-800">Project Progress</h3>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={projectData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completed" name="Completed Projects" fill="#8884d8" />
                    <Bar dataKey="ongoing" name="Ongoing Projects" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section> */}

        {/* Investment Process */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-housing-800 mb-4">
                Investment Process
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Our straightforward process makes investing with Layoutz Housing simple and transparent.
              </p>
            </div>

            <div className="relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-300 -translate-y-1/2"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                {[
                  {
                    step: 1,
                    title: "Initial Consultation",
                    description: "Meet with our investment advisors to discuss your goals and risk tolerance."
                  },
                  {
                    step: 2,
                    title: "Investment Selection",
                    description: "Choose from our available investment opportunities based on your preferences."
                  },
                  {
                    step: 3,
                    title: "Documentation",
                    description: "Complete the necessary paperwork and investment agreements."
                  },
                  {
                    step: 4,
                    title: "Portfolio Management",
                    description: "Receive regular updates on your investment performance and returns."
                  }
                ].map((item, index) => (
                  <div key={index} className="relative">
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-housing-600 text-white flex items-center justify-center font-bold z-10">
                        {item.step}
                      </div>
                      <div className="text-center pt-4">
                        <h3 className="text-xl font-bold text-housing-800 mb-3">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-housing-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                What Our Investors Say
              </h2>
              <p className="text-housing-100 max-w-3xl mx-auto">
                Hear from our satisfied investors about their experience with Layoutz Housing investments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "I've been investing with Layoutz Housing for over 5 years and have consistently received excellent returns. Their professional approach and transparency make them stand out.",
                  name: "Michael Chen",
                  position: "Private Investor"
                },
                {
                  quote: "The diversification of my investment portfolio with Layoutz Housing has significantly reduced my overall risk while maintaining strong returns.",
                  name: "Sarah Johnson",
                  position: "Institutional Investor"
                },
                {
                  quote: "What impressed me most was the level of personal attention I received. They took the time to understand my investment goals and tailored a solution specifically for me.",
                  name: "Robert Patel",
                  position: "Real Estate Investor"
                }
              ].map((item, index) => (
                <div key={index} className="bg-housing-700 p-6 rounded-lg">
                  <div className="mb-4 text-housing-300">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 8c-4.4 0-8 3.6-8 8s3.6 8 8 8h1v-2h-1c-3.3 0-6-2.7-6-6s2.7-6 6-6h1V8h-1zm12 0c-4.4 0-8 3.6-8 8s3.6 8 8 8h1v-2h-1c-3.3 0-6-2.7-6-6s2.7-6 6-6h1V8h-1z"/>
                    </svg>
                  </div>
                  <p className="mb-6 text-housing-100 italic">{item.quote}</p>
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-housing-300 text-sm">{item.position}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-housing-600 to-housing-800 rounded-lg p-8 md:p-12 shadow-xl text-white text-center">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                Ready to Start Your Investment Journey?
              </h2>
              <p className="text-lg mb-8 max-w-3xl mx-auto">
                Contact our investment team today to learn more about current opportunities and how we can help you achieve your financial goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Dialog>
                  <DialogTrigger asChild>
                          <InvestmentEnquiry>
                          <button
                          >
                          </button> 
                        </InvestmentEnquiry>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Schedule a Consultation</DialogTitle>
                      <DialogDescription>
                        Fill out this form to schedule a consultation with our investment team.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleInvestmentSubmit} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <label htmlFor="consult-name" className="text-sm font-medium">Full Name</label>
                        <Input 
                          id="consult-name" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleInputChange} 
                          placeholder="John Doe" 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="consult-email" className="text-sm font-medium">Email</label>
                        <Input 
                          id="consult-email" 
                          name="email" 
                          type="email" 
                          value={formData.email} 
                          onChange={handleInputChange} 
                          placeholder="john@example.com" 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="consult-phone" className="text-sm font-medium">Phone Number</label>
                        <Input 
                          id="consult-phone" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleInputChange} 
                          placeholder="+1 (555) 123-4567" 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="consult-message" className="text-sm font-medium">Message</label>
                        <Textarea 
                          id="consult-message" 
                          name="message" 
                          value={formData.message} 
                          onChange={handleInputChange} 
                          placeholder="I'm interested in investing..." 
                          rows={3} 
                        />
                      </div>
                      <Button type="submit" className="w-full">Request Consultation</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Investor;
