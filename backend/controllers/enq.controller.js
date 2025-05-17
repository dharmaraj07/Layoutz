import Enq from "../model/enq.model.js";

export const enq = async (req, res) => {
  try {
    const { 
        name,
        phone,
        property,
        review,
        completed,
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
      const customerEnq = await Enq.find();
      res.status(200).json(customerEnq); // 🔧 FIXED: return the correct variable
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
      const updated = await Enq.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ error: "Enquiry not found" });
      }
      res.status(200).json(updated);
    } catch (error) {
      console.log("Error in updateEnq Controller:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };