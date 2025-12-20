import { Home, Users, Building, Star, Trophy , Newspaper  } from 'lucide-react';
import { motion } from 'framer-motion';

const achievements = [
  { id: 1, title: "Premium Properties Sold", value: "1,500+", icon: Home },
  { id: 2, title: "Happy Clients", value: "1,200+", icon: Users },
  { id: 3, title: "Years of Experience", value: "15+", icon: Building },
  { id: 4, title: "5-Star Reviews", value: "2,000+", icon: Star },
  { id: 5, title: "Prestigious Partnerships", value: "50+", icon: Trophy },
  { id: 6, title: "Clean Documentation & Transaction", value: "100%", icon: Newspaper }
];

const AchievementsSection = () => {
  return (
    <section className="py-20 px-2 md:px-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-housing-700">Layoutz Achievements</h2>
        <p>We understand the importance of investing in the house of your dreams – a lifestyle that is unconditional & unrestricted. D-Layoutz is  India’s most trusted plot real estate developer, with every project and property in your favorite metro’s most prime & potential addresses.</p>
      </div>
      
      <div className="relative w-full ">
        <motion.div
          className="flex gap-10"
          animate={{ x: ["0%", "-100%"] }}
          transition={{ repeat: Infinity, duration: 50, ease: "linear" }}
        >
          {[...achievements, ...achievements].map((item, index) => (
          <div key={index} className="flex-shrink-0 w-64 h-80 flex flex-col items-center justify-between p-6  -mb-20 mt-2 rounded-lg ">
          <div className="flex items-center justify-center bg-housing-700 text-white rounded-full h-36 w-36  mb-4">
            <item.icon className="h-20 w-20 object-contain" />
          </div>
          <h3 className="text-xl font-semibold">{item.value}</h3>
          <p className="text-m text-center">{item.title}</p>
        </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AchievementsSection;
