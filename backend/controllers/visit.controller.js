import Visit from '../model/visit.model.js';
import generateToken from '../utils/generateToken.js';

export const visit = async (req, res) => {
  try {
    const { 
      name,
      phone,
      property,
      visitDate,
      people ,
      status
    
    } = req.body;

    // ✅ Basic validation
    if (!name || !phone ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newVisit = new Visit({
      name,
      phone,
      property,
      visitDate,
      people ,
      status
    });

    await newVisit.save();

    res.status(200).json(newVisit);
  } catch (error) {
    console.log(`Error in Visit Controller: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getVisit = async (req, res) => {
    try {
      const customerVisit = await Visit.find();
      res.status(200).json(customerVisit); // 🔧 FIXED: return the correct variable
    } catch (error) {
      console.log(`Error in getProps Controller: ${error}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  export const deleteVisit = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deleteVisit = await Visit.findByIdAndDelete(id);
  
      if (!deleteVisit) {
        return res.status(404).json({ error: 'Property not found' });
      }
  
      res.status(200).json({ message: 'Property deleted successfully', deleteVisit });
    } catch (error) {
      console.log(`Error in deleteProps Controller: ${error}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  export const updateVisit = async (req, res) => {
    try {
      const updated = await Visit.findByIdAndUpdate(
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