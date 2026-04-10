/**
 * Observer Pattern Implementation
 * Facilitates loosely coupled event notifications, specifically
 * for broadcasting boarding status updates to parents.
 */

// IObserver Interface
export interface IObserver {
  update(studentId: string, status: string): void;
}

// ISubject Interface
export interface ISubject {
  addObserver(observer: IObserver): void;
  removeObserver(observer: IObserver): void;
  notify(studentId: string, status: string): void;
}

// Concrete Observer: Sends Notifications to Parents
export class ParentNotifierObserver implements IObserver {
  update(studentId: string, status: string): void {
    // In a production app, this would query the User table for the parent 
    // linked to `studentId` and dispatch an SMS, Email, or Push Notification.
    console.log(`[Observer Alert] Notification Dispatched: Student ${studentId} marked as ${status}.`);
  }
}

// Concrete Subject: Boarding Subject
export class BoardingSubject implements ISubject {
  private observers: IObserver[] = [];

  addObserver(observer: IObserver): void {
    this.observers.push(observer);
  }

  removeObserver(observer: IObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(studentId: string, status: string): void {
    for (const observer of this.observers) {
      observer.update(studentId, status);
    }
  }
}

// Export a singleton instance of the subject to maintain global observer state
export const boardingEventNotifier = new BoardingSubject();

// Register our specific observers immediately
boardingEventNotifier.addObserver(new ParentNotifierObserver());
