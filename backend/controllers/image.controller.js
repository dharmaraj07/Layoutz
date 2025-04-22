import Hero from '../model/image.model.js';
import generateToken from '../utils/generateToken.js';

export const hero = async (req, res) => {
  try {
    const { title, image,type,link,mobileImage} = req.body;
  
    // ✅ Basic validation
    if (!title  || !type || !image) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newHero = new Hero({
      title,
      image,
      type,
      link,
      mobileImage
    });

    await newHero.save();

    res.status(200).json(newHero);

       
    
    
  } catch (error) {
    console.log(`Error in Image Controller: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getHero = async (req, res) => {
    try {
      const heroImages = await Hero.find();
      res.status(200).json(heroImages); // 🔧 FIXED: return the correct variable
    } catch (error) {
      console.log(`Error in getHero Controller: ${error}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  export const deleteHero = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deleteHero = await Props.findByIdAndDelete(id);
  
      if (!deleteHero) {
        return res.status(404).json({ error: 'Images not found' });
      }
  
      res.status(200).json({ message: 'Image deleted successfully', deleteHero });
    } catch (error) {
      console.log(`Error in deleteHero Controller: ${error}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  export const updateHero = async (req, res) => {
    try {
      const updated = await Hero.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ error: "Image not found" });
      }
      res.status(200).json(updated);
    } catch (error) {
      console.log("Error in updateHero Controller:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };