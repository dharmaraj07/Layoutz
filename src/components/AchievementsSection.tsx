import { Award, Users, Building, Home, Star, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const achievements = [
  { id: 1, title: "Premium Properties Sold", value: "500+", icon: Home },
  { id: 2, title: "Happy Clients", value: "1,200+", icon: Users },
  { id: 3, title: "Years of Experience", value: "15+", icon: Building },
  { id: 4, title: "Industry Awards", value: "25+", icon: Award },
  { id: 5, title: "5-Star Reviews", value: "2,000+", icon: Star },
  { id: 6, title: "Prestigious Partnerships", value: "50+", icon: Trophy }
];

const AchievementsSection = () => {
  return (
    <section className="py-20 px-4 md:px-8 bg-gray-50 overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Our Achievements</h2>
      </div>
      <div className="relative overflow-hidden w-full">
        <motion.div
          className="flex space-x-6"
          animate={{ x: ["0%", "-100%"] }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
        >
          {[...achievements, ...achievements].map((item, index) => (
            <div key={index} className="bg-blue shadow-2xl rounded-lg p-6 h-32 w-64 flex-shrink-0"> 
              <item.icon className="inline-flex items-center justify-center rounded-full bg-housing-100 text-housing-700 mb-3 h-8 w-8" />
              <h3 className="text-xl font-semibold">{item.value}</h3>
              <p className="text-sm">{item.title}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AchievementsSection;
