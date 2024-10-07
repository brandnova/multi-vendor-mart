import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Badge } from "./VendorDashboard/UIComponents";
import { Store } from 'lucide-react';
import { motion } from 'framer-motion';

const StoreCard = ({ name, tagLine, bannerImage, primaryColor, secondaryColor, accentColor, slug }) => {
  return (
    <Link to={`/stores/${slug}`} className="block hover:shadow-lg transition-shadow duration-300">
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        <Card className="overflow-hidden h-full flex flex-col shadow-md hover:shadow-xl transition-shadow duration-300">
          <div className="h-40 relative">
            <img 
              src={bannerImage || '/api/placeholder/384/160'} 
              alt={`${name} banner`} 
              className="w-full h-full object-cover"
            />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4"
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
            >
              <h3 className="text-xl font-bold text-white truncate w-full">{name}</h3>
            </motion.div>
            <motion.div 
              className="absolute top-0 right-0 w-16 h-16"
              whileHover={{ scale: 1.1, rotate: 90 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                <path d="M0 0 L100 0 L100 100 Z" fill={primaryColor} />
                <path d="M0 0 L100 0 L0 100 Z" fill={primaryColor} />
                <circle cx="50" cy="50" r="25" fill={accentColor} />
              </svg>
            </motion.div>
          </div>
          <CardContent className="p-4 flex-grow flex flex-col justify-between">
          <p className="text-sm text-gray-600 line-clamp-2">{tagLine}</p>
          <Badge variant="outline" className="mt-2 self-start" style={{ borderColor: primaryColor, color: primaryColor }}>
            <Store className="w-4 h-4 mr-1" />
            Active Store
          </Badge>
        </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}

const RecentStores = ({ stores }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stores.map((store) => (
        <StoreCard 
          key={store.id}
          name={store.name}
          tagLine={store.tag_line}
          bannerImage={store.banner_image}
          primaryColor={store.primary_color}
          secondaryColor={store.secondary_color}
          accentColor={store.accent_color}
          slug={store.slug}
        />
      ))}
    </div>
  );
}

export default RecentStores;