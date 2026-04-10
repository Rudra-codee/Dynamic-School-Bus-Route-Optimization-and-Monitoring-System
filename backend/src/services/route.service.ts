import Route, { IRoute } from '../models/route.model';

class RouteService {
  async createRoute(data: Partial<IRoute>): Promise<IRoute> {
    const route = new Route(data);
    return await route.save();
  }

  async getAllRoutes(): Promise<IRoute[]> {
    return await Route.find().populate('busId');
  }

  async getRouteById(id: string): Promise<IRoute | null> {
    return await Route.findById(id).populate('busId');
  }

  async updateRoute(id: string, data: Partial<IRoute>): Promise<IRoute | null> {
    return await Route.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteRoute(id: string): Promise<IRoute | null> {
    return await Route.findByIdAndDelete(id);
  }
}

export default new RouteService();
