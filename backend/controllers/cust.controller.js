import Customer from '../model/cust.model.js'
import generateToken from '../utils/generateToken.js';

export const cust = async (req, res) => {
  try {
    const { 
      img,
      name,
      job,
      review,
      rating,
      videolink, 
    
    } = req.body;

    // ✅ Basic validation
    if (!name || !job || !review || !rating) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newCust = new Customer({
      img,
      name,
      job,
      review,
      rating,
      videolink
    });

    await newCust.save();

    res.status(200).json(newCust);
  } catch (error) {
    console.log(`Error in Cust Controller: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCust = async (req, res) => {
    try {
      const customerReview = await Customer.find();
      res.status(200).json(customerReview); // 🔧 FIXED: return the correct variable
    } catch (error) {
      console.log(`Error in getProps Controller: ${error}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  export const deleteCust = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deleteCust = await Customer.findByIdAndDelete(id);
  
      if (!deleteCust) {
        return res.status(404).json({ error: 'Property not found' });
      }
  
      res.status(200).json({ message: 'Property deleted successfully', deleteCust });
    } catch (error) {
      console.log(`Error in deleteProps Controller: ${error}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  export const updateCust = async (req, res) => {
    try {
      const updated = await Customer.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ error: "Property not found" });
      }
      res.status(200).json(updated);
    } catch (error) {
      console.log("Error in updateProps Controller:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };