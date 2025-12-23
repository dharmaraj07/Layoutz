import Enq from "../model/enq.model.js";
import Customer from "../model/cust.model.js";

export const enq = async (req, res) => {
  try {
    const { 
        name,
        phone,
        property,
        review,
        completed,
        purchased,
        comment,
        visitDate,
        followUPDate,
        invest
    
    } = req.body;

    // ✅ Basic validation
    if (!name || !phone ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newEnq = new Enq({
        name,
        phone,
        property,
        review,
        completed,
        purchased,
        comment,
        visitDate,
        followUPDate,
        invest
    });

    await newEnq.save();

    res.status(200).json(newEnq);
  } catch (error) {
    console.log(`Error in Enq Controller: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getEnq = async (req, res) => {
    try {
      const customerEnq = await Enq.find().populate('assignedAgent').sort({ createdAt: -1 });
      res.status(200).json(customerEnq);
    } catch (error) {
      console.log(`Error in getEnq Controller: ${error}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  export const deleteEnq = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deleteEnq = await Enq.findByIdAndDelete(id);
  
      if (!deleteEnq) {
        return res.status(404).json({ error: 'Enquiry not found' });
      }
  
      res.status(200).json({ message: 'Enquiry deleted successfully', deleteEnq });
    } catch (error) {
      console.log(`Error in deleteEnq Controller: ${error}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  export const updateEnq = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      // Get the original enquiry to check status change
      const originalEnq = await Enq.findById(id);
      if (!originalEnq) {
        return res.status(404).json({ error: "Enquiry not found" });
      }
      
      // Update the enquiry
      const updated = await Enq.findByIdAndUpdate(
        id,
        updates,
        { new: true }
      ).populate('assignedAgent');
      
      // If status changed to "converted", create a customer record
      if (updates.status === 'converted' && originalEnq.status !== 'converted') {
        try {
          // Check if customer already exists with this phone
          const existingCustomer = await Customer.findOne({ phone: updated.phone });
          
          if (!existingCustomer) {
            // Create new customer record
            const newCustomer = new Customer({
              name: updated.name,
              phone: updated.phone,
              location: "", // Can be updated later
              property: updated.property || "",
              plotNum: updated.plotNumber || "",
              custType: "purchase",
              visitDate: updated.visitDate || new Date(),
              nextVisitDate: null,
              job: "",
              review: "",
              rating: 0,
              img: "",
              videolink: ""
            });
            
            await newCustomer.save();
            console.log(`Customer created for enquiry ${id}`);
          } else {
            console.log(`Customer with phone ${updated.phone} already exists`);
          }
        } catch (customerError) {
          console.log("Error creating customer:", customerError);
          // Don't fail the enquiry update if customer creation fails
        }
      }
      
      res.status(200).json(updated);
    } catch (error) {
      console.log("Error in updateEnq Controller:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };