
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
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
import { toast } from "@/components/ui/use-toast";

interface DonateButtonProps {
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const DonateButton = ({
  variant = "default",
  size = "default",
  className,
}: DonateButtonProps) => {
  const [amount, setAmount] = useState("1000");
  const [donorName, setDonorName] = useState("");
  const [email, setEmail] = useState("");

  const handleDonation = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Log the donation information (would be replaced with actual payment processing)
    console.log("Donation processed:", {
      amount,
      donorName,
      email,
    });
    
    // Show success toast
    toast({
      title: "Thank you for your donation!",
      description: `Your donation of ₹${amount} will help support our mission.`,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`bg-[#8B5CF6] hover:bg-[#7c4deb] text-white ${className}`}
        >
          <Heart className="mr-2 h-4 w-4" /> Donate Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Make a Donation</DialogTitle>
          <DialogDescription>
            Your contribution helps us continue our mission of providing quality housing solutions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleDonation} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Donation Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">₹</span>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
                min="100"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="donorName" className="text-sm font-medium">
              Your Name
            </label>
            <Input
              id="donorName"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full bg-[#8B5CF6] hover:bg-[#7c4deb]">
              Complete Donation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DonateButton;
