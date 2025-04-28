import Props from '../model/props.model.js'
import generateToken from '../utils/generateToken.js';

export const props = async (req, res) => {
  try {
    const { title, location, price, sqft, image,mobileImage,propimage, featured, forSale, type,projectArea, totalPlots,
      approved,mapSrc,schools, college, transit, hospital, restaurants, youtubelink, residential,highlight, plotElitePrice,plotPremiumPrice} = req.body;
  
    // ✅ Basic validation
    if (!title || !location || !price || !sqft || !type || !featured|| !forSale|| !projectArea|| !totalPlots|| !approved || !mapSrc || !residential ||!propimage) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newProps = new Props({
      title,
      location,
      price,
      sqft,
      image,
      mobileImage,
      propimage,
      featured,
      forSale,
      type,projectArea, totalPlots,approved,mapSrc,schools, college, transit, hospital, restaurants, youtubelink, residential,
      highlight, plotElitePrice,plotPremiumPrice
    });

    await newProps.save();

    res.status(200).json(newProps);

       
    
    
  } catch (error) {
    console.log(`Error in Props Controller: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getProps = async (req, res) => {
    try {
      const properties = await Props.find();
      res.status(200).json(properties); // 🔧 FIXED: return the correct variable
    } catch (error) {
      console.log(`Error in getProps Controller: ${error}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  export const deleteProps = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedProp = await Props.findByIdAndDelete(id);
  
      if (!deletedProp) {
        return res.status(404).json({ error: 'Property not found' });
      }
  
      res.status(200).json({ message: 'Property deleted successfully', deletedProp });
    } catch (error) {
      console.log(`Error in deleteProps Controller: ${error}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  export const updateProps = async (req, res) => {
    try {
      const updated = await Props.findByIdAndUpdate(
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