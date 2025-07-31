import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { FreightRequest, Offer, Job, User, DriverProfile } from '../types';

export class FreightService {
  // Create a new freight request
  static async createFreightRequest(request: Omit<FreightRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'freightRequests'), {
        ...request,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error: any) {
      console.error('Create freight request error:', error);
      throw new Error('Error creating freight request');
    }
  }

  // Get freight request by ID
  static async getFreightRequest(requestId: string): Promise<FreightRequest | null> {
    try {
      const docRef = doc(db, 'freightRequests', requestId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          preferredDate: data.preferredDate?.toDate() || new Date(),
        } as FreightRequest;
      }
      return null;
    } catch (error: any) {
      console.error('Get freight request error:', error);
      throw new Error('Error getting freight request');
    }
  }

  // Get freight requests by consumer
  static async getFreightRequestsByConsumer(consumerId: string): Promise<FreightRequest[]> {
    try {
      const q = query(
        collection(db, 'freightRequests'),
        where('consumerId', '==', consumerId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        preferredDate: doc.data().preferredDate?.toDate() || new Date(),
      })) as FreightRequest[];
    } catch (error: any) {
      console.error('Get freight requests by consumer error:', error);
      throw new Error('Error getting freight requests');
    }
  }

  // Get available freight requests (for drivers)
  static async getAvailableFreightRequests(): Promise<FreightRequest[]> {
    try {
      const q = query(
        collection(db, 'freightRequests'),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        preferredDate: doc.data().preferredDate?.toDate() || new Date(),
      })) as FreightRequest[];
    } catch (error: any) {
      console.error('Get available freight requests error:', error);
      throw new Error('Error getting available freight requests');
    }
  }

  // Update freight request
  static async updateFreightRequest(requestId: string, updates: Partial<FreightRequest>): Promise<void> {
    try {
      const docRef = doc(db, 'freightRequests', requestId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error: any) {
      console.error('Update freight request error:', error);
      throw new Error('Error updating freight request');
    }
  }

  // Delete freight request
  static async deleteFreightRequest(requestId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'freightRequests', requestId));
    } catch (error: any) {
      console.error('Delete freight request error:', error);
      throw new Error('Error deleting freight request');
    }
  }

  // Create an offer
  static async createOffer(offer: Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'offers'), {
        ...offer,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error: any) {
      console.error('Create offer error:', error);
      throw new Error('Error creating offer');
    }
  }

  // Get offers for a freight request
  static async getOffersForRequest(requestId: string): Promise<Offer[]> {
    try {
      const q = query(
        collection(db, 'offers'),
        where('requestId', '==', requestId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Offer[];
    } catch (error: any) {
      console.error('Get offers for request error:', error);
      throw new Error('Error getting offers');
    }
  }

  // Update offer
  static async updateOffer(offerId: string, updates: Partial<Offer>): Promise<void> {
    try {
      const docRef = doc(db, 'offers', offerId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error: any) {
      console.error('Update offer error:', error);
      throw new Error('Error updating offer');
    }
  }

  // Create a job
  static async createJob(job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'jobs'), {
        ...job,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error: any) {
      console.error('Create job error:', error);
      throw new Error('Error creating job');
    }
  }

  // Get jobs for a user (consumer or driver)
  static async getJobsForUser(userId: string): Promise<Job[]> {
    try {
      const q = query(
        collection(db, 'jobs'),
        where('consumerId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const consumerJobs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        startTime: doc.data().startTime?.toDate(),
        endTime: doc.data().endTime?.toDate(),
      })) as Job[];

      // Also get jobs where user is the driver
      const driverQ = query(
        collection(db, 'jobs'),
        where('driverId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const driverQuerySnapshot = await getDocs(driverQ);
      const driverJobs = driverQuerySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        startTime: doc.data().startTime?.toDate(),
        endTime: doc.data().endTime?.toDate(),
      })) as Job[];

      return [...consumerJobs, ...driverJobs].sort((a, b) => 
        b.createdAt.getTime() - a.createdAt.getTime()
      );
    } catch (error: any) {
      console.error('Get jobs for user error:', error);
      throw new Error('Error getting jobs');
    }
  }

  // Update job
  static async updateJob(jobId: string, updates: Partial<Job>): Promise<void> {
    try {
      const docRef = doc(db, 'jobs', jobId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error: any) {
      console.error('Update job error:', error);
      throw new Error('Error updating job');
    }
  }

  // Listen to real-time updates for freight requests
  static subscribeToFreightRequests(callback: (requests: FreightRequest[]) => void): () => void {
    const q = query(
      collection(db, 'freightRequests'),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const requests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        preferredDate: doc.data().preferredDate?.toDate() || new Date(),
      })) as FreightRequest[];
      
      callback(requests);
    });
  }

  // Listen to real-time updates for jobs
  static subscribeToJobs(userId: string, callback: (jobs: Job[]) => void): () => void {
    const q = query(
      collection(db, 'jobs'),
      where('consumerId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const jobs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        startTime: doc.data().startTime?.toDate(),
        endTime: doc.data().endTime?.toDate(),
      })) as Job[];
      
      callback(jobs);
    });
  }
} 