import VendorDashboard from '../components/VendorDashboard/VendorDashboard';
import withAuth from '../config/withAuth';

const VendorDashboardPage = () => {
  return <VendorDashboard />;
};

export default withAuth(VendorDashboardPage);