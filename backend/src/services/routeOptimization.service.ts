/**
 * Route Optimization Service
 * Applies the Strategy Pattern to dynamically resolve school bus routing
 */

export interface Location {
  lat: number;
  lng: number;
}

export interface StudentInput {
  id: string;
  name: string;
  location: Location;
  present: boolean;
}

export interface BusInput {
  id: string;
  capacity: number;
}

export interface StopOrder {
  studentId: string;
  studentName: string;
  location: Location;
}

export interface RouteResult {
  busId: string;
  stops: StopOrder[];
}

/**
 * Strategy Interface for Route Optimization Algorithm
 * Allows us to hot-swap optimization algorithms later
 */
export interface RouteStrategy {
  optimize(students: StudentInput[], buses: BusInput[]): RouteResult[];
}

/**
 * GeoUtils Helpers
 * Reusable utility class for spatial analysis
 */
export class GeoUtils {
  static calculateDistance(loc1: Location, loc2: Location): number {
    // Haversine formula to find distance between two lat/lng coordinates
    const R = 6371; // Earth radius in km
    const dLat = (loc2.lat - loc1.lat) * (Math.PI / 180);
    const dLng = (loc2.lng - loc1.lng) * (Math.PI / 180);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(loc1.lat * (Math.PI / 180)) * Math.cos(loc2.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
      
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Returns distance in Kilometers
  }
}

/**
 * Concrete Strategy: Nearest Neighbor Algorithm
 * A basic heuristic to group and route nearby students efficiently
 */
export class NearestNeighborStrategy implements RouteStrategy {
  optimize(students: StudentInput[], buses: BusInput[]): RouteResult[] {
    // Step 1: Filter only present students (absent students skipped)
    const presentStudents = students.filter(s => s.present);
    
    // Create a mutable copy of unassigned students
    const remainingStudents = [...presentStudents];
    const generatedRoutes: RouteResult[] = [];

    // Step 2: Sort buses by descending capacity (utilize max size buses first)
    const sortedBuses = [...buses].sort((a, b) => b.capacity - a.capacity);

    for (const bus of sortedBuses) {
      if (remainingStudents.length === 0) break; // All students assigned

      const busStops: StopOrder[] = [];
      let capacityRemaining = bus.capacity;
      
      // Seed the route start near the very first remaining unassigned student
      let currentLocation = remainingStudents[0]!.location;

      // Step 3 & 4: Assign to bus until capacity reached or no students left
      while (capacityRemaining > 0 && remainingStudents.length > 0) {
        
        // Find nearest student to the current spatial location
        let nearestIndex = 0;
        let minDistance = Number.MAX_VALUE;

        for (let i = 0; i < remainingStudents.length; i++) {
          const dist = GeoUtils.calculateDistance(currentLocation, remainingStudents[i]!.location);
          if (dist < minDistance) {
            minDistance = dist;
            nearestIndex = i;
          }
        }

        const nextStudent = remainingStudents[nearestIndex]!;
        
        busStops.push({
          studentId: nextStudent.id,
          studentName: nextStudent.name,
          location: nextStudent.location
        });

        // Move bus forward spatially to the picked up student's location
        currentLocation = nextStudent.location;
        
        // Remove student from unassigned pool and decrement capacity tracker
        remainingStudents.splice(nearestIndex, 1);
        capacityRemaining--;
      }

      // Finalize the generated Route Segment for the specific Bus
      generatedRoutes.push({
        busId: bus.id,
        stops: busStops
      });
    }

    // Alert if students were stranded: if remainingStudents.length > 0 
    // it signals that available bus sizes were exceeded.

    return generatedRoutes;
  }
}

export class ClusterStrategy implements RouteStrategy {
  optimize(students: StudentInput[], buses: BusInput[]): RouteResult[] {
    // Basic Stub for Cluster Strategy:
    // In a real scenario, we might use K-Means for grouping students into `k` clusters based on bus count, 
    // and then route within those clusters. For this demonstration, we'll assign students
    // to buses by splitting them into equal sized chunks.

    const presentStudents = students.filter(s => s.present);
    const generatedRoutes: RouteResult[] = [];
    
    if (buses.length === 0 || presentStudents.length === 0) return [];
    
    let studentIndex = 0;
    for (const bus of buses) {
      const stops: StopOrder[] = [];
      const capacity = bus.capacity;
      
      while (stops.length < capacity && studentIndex < presentStudents.length) {
        const student = presentStudents[studentIndex]!;
        stops.push({
          studentId: student.id,
          studentName: student.name,
          location: student.location
        });
        studentIndex++;
      }
      
      generatedRoutes.push({
        busId: bus.id,
        stops
      });
      
      if (studentIndex >= presentStudents.length) break;
    }
    
    return generatedRoutes;
  }
}

/**
 * Context Engine 
 * Drives the routing generation process and maintains replaceable algorithmic behavior
 */
export class RouteOptimizationEngine {
  private strategy: RouteStrategy;

  constructor(strategy: RouteStrategy = new NearestNeighborStrategy()) {
    this.strategy = strategy; // Default to basic heuristic algorithm
  }

  // Allow for swapping logic at runtime
  public setStrategy(strategy: RouteStrategy): void {
    this.strategy = strategy;
  }

  public generateOptimizedRoute(students: StudentInput[], buses: BusInput[]): RouteResult[] {
    if (!students || !buses || buses.length === 0) {
      throw new Error("System Validation Failed: Unable to optimize without valid Fleet and Student Manifests.");
    }
    
    // Delegate actual generation calculation logic to the decoupled strategy
    return this.strategy.optimize(students, buses);
  }
}

// Export a singleton instance of the engine ready for the controller APIs
export default new RouteOptimizationEngine();
