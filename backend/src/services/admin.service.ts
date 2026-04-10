import Bus from '../models/bus.model';
import Boarding from '../models/boarding.model';
import Route from '../models/route.model';
import Alert from '../models/alert.model';
import User from '../models/user.model';

class AdminService {
  async getMetrics() {
    const activeBusesCount = await Bus.countDocuments({ status: 'active' });
    
    // Calculate Students Boarded today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const studentsBoardedCount = await Boarding.countDocuments({
      status: 'BOARDED',
      createdAt: { $gte: startOfDay }
    });

    // Routes Completed logic: For this demo, let's say a route is completed if all its assigned stops are boarded.
    // Simplifying: Count buses that have at least one boarded student today.
    const uniqueBusesWithBoarding = await Boarding.distinct('busId', {
        status: 'BOARDED',
        createdAt: { $gte: startOfDay }
    });
    const routesCompletedCount = uniqueBusesWithBoarding.length;

    const activeAlertsCount = await Alert.countDocuments();

    return {
      activeBuses: activeBusesCount,
      routesCompleted: routesCompletedCount,
      studentsBoarded: studentsBoardedCount,
      alerts: activeAlertsCount
    };
  }

  async getFleet() {
    const buses = await Bus.find().populate('driverId', 'name');
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const fleetData = await Promise.all(buses.map(async (bus) => {
      const boardingCount = await Boarding.countDocuments({
        busId: bus._id,
        status: 'BOARDED',
        createdAt: { $gte: startOfDay }
      });

      return {
        busId: bus.registrationNumber,
        driverName: (bus.driverId as any)?.name || 'Unassigned',
        status: bus.status === 'active' ? 'In Transit' : bus.status === 'inactive' ? 'Route Complete' : 'Maintenance',
        capacity: bus.capacity,
        currentLoad: boardingCount
      };
    }));

    return fleetData;
  }

  async getAlerts() {
    let alerts = await Alert.find().sort({ createdAt: -1 });
    
    // Seed sample alerts if none exist
    if (alerts.length === 0) {
      alerts = await Alert.insertMany([
        { type: 'DELAY', message: 'Bus-001 is running 5 mins late due to traffic.', severity: 'medium' },
        { type: 'INFO', message: 'New optimization strategy applied to South Route.', severity: 'low' }
      ]);
    }
    
    return alerts;
  }
}

export default new AdminService();
