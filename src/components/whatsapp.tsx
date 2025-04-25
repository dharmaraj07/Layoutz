import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCust } from "@/hooks/useAuth";

const WhatsAppBlast = () => {
  const { data: custData = [] } = useCust();
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedPhones, setSelectedPhones] = useState([]);
  const [message, setMessage] = useState("");
  const [media, setMedia] = useState<File | null>(null);

  // Extract unique customer types
  const custTypes = Array.from(new Set(custData.map(c => c.custType))).map(type => ({
    label: type,
    value: type,
  }));

  // Filter customers by selected types
  const filteredCustomers = custData.filter(c =>
    selectedTypes.length === 0 || selectedTypes.includes(c.custType)
  );

  const phoneOptions = filteredCustomers.map(c => ({
    label: `${c.name} - ${c.phone}`,
    value: c.phone,
  }));

  const handleSend = () => {
    if (!message && !media) {
      alert("Please enter a message or upload media.");
      return;
    }

    selectedPhones.forEach(phone => {
      const encodedMessage = encodeURIComponent(message);
      const waURL = `https://wa.me/${phone}?text=${encodedMessage}`;
      window.open(waURL, "_blank");
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* Column 1 - Customer Type Selection */}
      <div className="flex flex-col gap-2">
        <Label>Customer Types</Label>
        <Select
          isMulti
          options={custTypes}
          value={custTypes.filter(t => selectedTypes.includes(t.value))}
          onChange={(options) => setSelectedTypes(options.map(o => o.value))}
        />
      </div>

      {/* Column 2 - Phone Numbers */}
      <div className="flex flex-col gap-2">
        <Label>Phone Numbers</Label>
        <Select
          isMulti
          options={phoneOptions}
          value={phoneOptions.filter(p => selectedPhones.includes(p.value))}
          onChange={(options) => setSelectedPhones(options.map(o => o.value))}
        />
      </div>

      {/* Column 3 - Message, Media & Send */}
      <div className="flex flex-col gap-3">
        <Label>Message</Label>
        <Textarea
          placeholder="Type your message with emojis..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Label>Image / Video (optional)</Label>
        <Input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setMedia(e.target.files?.[0] || null)}
        />
        <Button onClick={handleSend}>Send via WhatsApp</Button>
      </div>
    </div>
  );
};

export default WhatsAppBlast;
