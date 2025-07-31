import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { FreightRequest, Offer, Job } from '../types';
import { FreightService } from '../services/freightService';

interface FreightState {
  requests: FreightRequest[];
  currentRequest: FreightRequest | null;
  offers: Offer[];
  jobs: Job[];
  filters: {
    dateFilter: string;
    statusFilter: string;
    locationFilter: string;
  };
}

interface FreightActions {
  // Request actions
  createRequest: (request: Omit<FreightRequest, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRequest: (id: string, updates: Partial<FreightRequest>) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  setCurrentRequest: (request: FreightRequest | null) => void;
  
  // Offer actions
  addOffer: (offer: Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateOffer: (id: string, updates: Partial<Offer>) => Promise<void>;
  
  // Job actions
  addJob: (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateJob: (id: string, updates: Partial<Job>) => Promise<void>;
  
  // Filter actions
  setDateFilter: (filter: string) => void;
  setStatusFilter: (filter: string) => void;
  setLocationFilter: (filter: string) => void;
  clearFilters: () => void;
  
  // Query actions
  getFilteredRequests: () => FreightRequest[];
  getRequestsByDate: (date: Date) => FreightRequest[];
  getOffersForRequest: (requestId: string) => Offer[];
  getJobsForUser: (userId: string) => Job[];
  
  // Firebase actions
  loadUserJobs: (userId: string) => Promise<void>;
  loadAvailableRequests: () => Promise<void>;
  subscribeToRequests: () => () => void;
  subscribeToJobs: (userId: string) => () => void;
}

type FreightStore = FreightState & FreightActions;

export const useFreightStore = create<FreightStore>()(
  persist(
    (set, get) => ({
      // Initial state
      requests: [],
      currentRequest: null,
      offers: [],
      jobs: [],
      filters: {
        dateFilter: 'all',
        statusFilter: 'all',
        locationFilter: '',
      },

      // Request actions
      createRequest: async (requestData) => {
        try {
          const requestId = await FreightService.createFreightRequest(requestData);
          const newRequest: FreightRequest = {
            ...requestData,
            id: requestId,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          set((state) => ({
            requests: [newRequest, ...state.requests],
          }));
        } catch (error: any) {
          console.error('Create request error:', error);
          throw error;
        }
      },

      updateRequest: async (id, updates) => {
        try {
          await FreightService.updateFreightRequest(id, updates);
          set((state) => ({
            requests: state.requests.map((request) =>
              request.id === id
                ? { ...request, ...updates, updatedAt: new Date() }
                : request
            ),
          }));
        } catch (error: any) {
          console.error('Update request error:', error);
          throw error;
        }
      },

      deleteRequest: async (id) => {
        try {
          await FreightService.deleteFreightRequest(id);
          set((state) => ({
            requests: state.requests.filter((request) => request.id !== id),
          }));
        } catch (error: any) {
          console.error('Delete request error:', error);
          throw error;
        }
      },

      setCurrentRequest: (request) => {
        set({ currentRequest: request });
      },

      // Offer actions
      addOffer: async (offerData) => {
        try {
          const offerId = await FreightService.createOffer(offerData);
          const newOffer: Offer = {
            ...offerData,
            id: offerId,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          set((state) => ({
            offers: [newOffer, ...state.offers],
          }));
        } catch (error: any) {
          console.error('Add offer error:', error);
          throw error;
        }
      },

      updateOffer: async (id, updates) => {
        try {
          await FreightService.updateOffer(id, updates);
          set((state) => ({
            offers: state.offers.map((offer) =>
              offer.id === id
                ? { ...offer, ...updates, updatedAt: new Date() }
                : offer
            ),
          }));
        } catch (error: any) {
          console.error('Update offer error:', error);
          throw error;
        }
      },

      // Job actions
      addJob: async (jobData) => {
        try {
          const jobId = await FreightService.createJob(jobData);
          const newJob: Job = {
            ...jobData,
            id: jobId,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          set((state) => ({
            jobs: [newJob, ...state.jobs],
          }));
        } catch (error: any) {
          console.error('Add job error:', error);
          throw error;
        }
      },

      updateJob: async (id, updates) => {
        try {
          await FreightService.updateJob(id, updates);
          set((state) => ({
            jobs: state.jobs.map((job) =>
              job.id === id
                ? { ...job, ...updates, updatedAt: new Date() }
                : job
            ),
          }));
        } catch (error: any) {
          console.error('Update job error:', error);
          throw error;
        }
      },

      // Filter actions
      setDateFilter: (filter) => {
        set((state) => ({
          filters: { ...state.filters, dateFilter: filter },
        }));
      },

      setStatusFilter: (filter) => {
        set((state) => ({
          filters: { ...state.filters, statusFilter: filter },
        }));
      },

      setLocationFilter: (filter) => {
        set((state) => ({
          filters: { ...state.filters, locationFilter: filter },
        }));
      },

      clearFilters: () => {
        set((state) => ({
          filters: {
            dateFilter: 'all',
            statusFilter: 'all',
            locationFilter: '',
          },
        }));
      },

      // Query actions
      getFilteredRequests: () => {
        const { requests, filters } = get();
        let filtered = requests;

        // Date filter
        if (filters.dateFilter !== 'all') {
          const today = dayjs();
          filtered = filtered.filter((request) => {
            const requestDate = dayjs(request.preferredDate);
            switch (filters.dateFilter) {
              case 'today':
                return requestDate.isSame(today, 'day');
              case 'tomorrow':
                return requestDate.isSame(today.add(1, 'day'), 'day');
              case 'this_week':
                return requestDate.isBetween(
                  today.startOf('week'),
                  today.endOf('week'),
                  'day',
                  '[]'
                );
              default:
                return true;
            }
          });
        }

        // Status filter
        if (filters.statusFilter !== 'all') {
          filtered = filtered.filter(
            (request) => request.status === filters.statusFilter
          );
        }

        // Location filter
        if (filters.locationFilter) {
          filtered = filtered.filter((request) =>
            request.origin.city
              .toLowerCase()
              .includes(filters.locationFilter.toLowerCase()) ||
            request.destination.city
              .toLowerCase()
              .includes(filters.locationFilter.toLowerCase())
          );
        }

        return filtered;
      },

      getRequestsByDate: (date) => {
        const { requests } = get();
        const targetDate = dayjs(date);
        return requests.filter((request) =>
          dayjs(request.preferredDate).isSame(targetDate, 'day')
        );
      },

      getOffersForRequest: (requestId) => {
        const { offers } = get();
        return offers.filter((offer) => offer.requestId === requestId);
      },

      getJobsForUser: (userId) => {
        const { jobs } = get();
        return jobs.filter(
          (job) => job.consumerId === userId || job.driverId === userId
        );
      },

      // Firebase actions
      loadUserJobs: async (userId: string) => {
        try {
          const jobs = await FreightService.getJobsForUser(userId);
          set({ jobs });
        } catch (error: any) {
          console.error('Load user jobs error:', error);
          throw error;
        }
      },

      loadAvailableRequests: async () => {
        try {
          const requests = await FreightService.getAvailableFreightRequests();
          set({ requests });
        } catch (error: any) {
          console.error('Load available requests error:', error);
          throw error;
        }
      },

      subscribeToRequests: () => {
        return FreightService.subscribeToFreightRequests((requests) => {
          set({ requests });
        });
      },

      subscribeToJobs: (userId: string) => {
        return FreightService.subscribeToJobs(userId, (jobs) => {
          set({ jobs });
        });
      },
    }),
    {
      name: 'freight-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 