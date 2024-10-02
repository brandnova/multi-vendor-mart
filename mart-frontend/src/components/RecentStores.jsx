import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "./VendorDashboard/UIComponents"
import { Badge } from "./VendorDashboard/UIComponents"
import { Store } from 'lucide-react';

const StoreCard = ({ name, tagLine, bannerImage, primaryColor, secondaryColor, accentColor, slug }) => {
  return (
    <Link to={`/stores/${slug}`} className="block hover:shadow-lg transition-shadow duration-300">
      <Card className="overflow-hidden h-full" style={{ backgroundColor: accentColor, color: primaryColor }}>
        <div className="h-32 relative">
          <img src={bannerImage || '/placeholder.svg?height=128&width=384'} alt={`${name} banner`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-4">
            <h3 className="text-xl font-bold text-white">{name}</h3>
          </div>
        </div>
        <CardContent className="p-4">
          <p className="text-sm" style={{ color: primaryColor }}>{tagLine}</p>
          <Badge variant="primary" className="mt-2" style={{ borderColor: primaryColor, color: primaryColor }}>
            <Store className="w-4 h-4 mr-1" />
            Active Store
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}

const RecentStores = ({ stores }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stores.map((store, index) => (
        <StoreCard 
          key={store.id || index}
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