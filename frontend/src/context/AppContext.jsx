// frontend/src/context/AppContext.jsx
// Real API integration — replaces all mock data with live backend calls

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [items,    setItems]    = useState([]);
  const [requests, setRequests] = useState([]);
  const [reviews,  setReviews]  = useState([]);
  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(true);

  // ── Load all data on mount ───────────────────────────────────
  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('bs_token');

      if (token) {
        // Identify current user role first
        let isAdmin = false;
        try {
          const meRes = await api.get('/api/auth/me');
          isAdmin = meRes.data?.user?.role === 'admin';
        } catch {
          // token invalid — let auth context handle logout
        }

        if (isAdmin) {
          // ── Admin fetch: get everything ──────────────────────
          const [itemsRes, requestsRes, reviewsRes, usersRes] = await Promise.allSettled([
            api.get('/api/items?status=all&limit=500'),       // ALL items regardless of status
            api.get('/api/requests').catch(() => api.get('/api/requests/incoming')), // admin all or fallback
            api.get('/api/reviews/my'),
            api.get('/api/auth/users'),
          ]);

          if (itemsRes.status    === 'fulfilled') setItems(itemsRes.value.data.items || []);
          if (requestsRes.status === 'fulfilled') setRequests(requestsRes.value.data.requests || []);
          if (reviewsRes.status  === 'fulfilled') setReviews(reviewsRes.value.data.reviews || []);
          if (usersRes.status    === 'fulfilled') setUsers(usersRes.value.data?.users || []);

        } else {
          // ── Regular user fetch ───────────────────────────────
          const [itemsRes, requestsRes, reviewsRes, myItemsRes, incomingRequestsRes] = await Promise.allSettled([
            api.get('/api/items'),
            api.get('/api/requests/my'),
            api.get('/api/reviews/my'),
            api.get('/api/items/my'),
            api.get('/api/requests/incoming'),
          ]);

          let allItems = [];
          if (itemsRes.status === 'fulfilled') {
            allItems = itemsRes.value.data.items || [];
          }
          if (myItemsRes.status === 'fulfilled') {
            const myItems = myItemsRes.value.data.items || [];
            const itemMap = new Map(allItems.map(i => [i._id, i]));
            myItems.forEach(i => itemMap.set(i._id, i));
            allItems = Array.from(itemMap.values());
          }
          setItems(allItems);

          let allRequests = [];
          if (requestsRes.status === 'fulfilled') {
            allRequests = requestsRes.value.data.requests || [];
          }
          if (incomingRequestsRes.status === 'fulfilled') {
            const incomingRequests = incomingRequestsRes.value.data.requests || [];
            const reqMap = new Map(allRequests.map(r => [r._id, r]));
            incomingRequests.forEach(r => reqMap.set(r._id, r));
            allRequests = Array.from(reqMap.values());
          }
          setRequests(allRequests);

          if (reviewsRes.status  === 'fulfilled') setReviews(reviewsRes.value.data.reviews || []);
          setUsers([]);
        }
      } else {
        // Guest user — only fetch public items, skip private requests
        try {
          const itemsRes = await api.get('/api/items');
          setItems(itemsRes.data.items || []);
        } catch (err) {
          console.error('Error fetching public items:', err);
          setItems([]);
        }
        setRequests([]);
        setReviews([]);
        setUsers([]);
      }
    } catch (err) {
      console.error('AppContext fetchAll error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Item CRUD ────────────────────────────────────────────────
  const addItem = async (itemData) => {
    const res = await api.post('/api/items', itemData);
    setItems(prev => [res.data.item, ...prev]);
    return res.data.item;
  };

  const updateItem = async (itemId, updates) => {
    const res = await api.patch(`/api/items/${itemId}`, updates);
    setItems(prev => prev.map(i => i._id === itemId ? res.data.item : i));
    return res.data.item;
  };

  const deleteItem = async (itemId) => {
    await api.delete(`/api/items/${itemId}`);
    setItems(prev => prev.filter(i => i._id !== itemId));
  };

  const deactivateItem = async (itemId) => {
    const res = await api.patch(`/api/items/${itemId}/deactivate`);
    setItems(prev => prev.map(i => i._id === itemId ? res.data.item : i));
  };

  const reactivateItem = async (itemId) => {
    const res = await api.patch(`/api/items/${itemId}/reactivate`);
    setItems(prev => prev.map(i => i._id === itemId ? res.data.item : i));
  };

  // ── Request: create ──────────────────────────────────────────
  const addRequest = async (requestData) => {
    const res = await api.post('/api/requests', requestData);
    setRequests(prev => [res.data.request, ...prev]);
    return res.data.request;
  };

  // ── Helper: update item + request in state after lifecycle step
  const _applyLifecycle = (itemId, requestId, updatedItem, updatedRequest) => {
    if (updatedItem)    setItems(prev    => prev.map(i => i._id === itemId    ? updatedItem    : i));
    if (updatedRequest) setRequests(prev => prev.map(r => r._id === requestId ? updatedRequest : r));
  };

  // ── DONATION TRACK ───────────────────────────────────────────
  const approveReceiver = async (itemId, requestId) => {
    const res = await api.patch(`/api/requests/${requestId}/approve`);
    _applyLifecycle(itemId, requestId, res.data.item, res.data.request);
  };

  const confirmPickup = async (itemId, requestId) => {
    const res = await api.patch(`/api/requests/${requestId}/confirm-pickup`);
    _applyLifecycle(itemId, requestId, res.data.item, res.data.request);
  };

  const confirmDelivery = async (itemId, requestId) => {
    const res = await api.patch(`/api/requests/${requestId}/confirm-delivery`);
    _applyLifecycle(itemId, requestId, res.data.item, res.data.request);
  };

  // ── LENDING TRACK ────────────────────────────────────────────
  const approveBorrower = async (itemId, requestId) => {
    const res = await api.patch(`/api/requests/${requestId}/approve-borrower`);
    _applyLifecycle(itemId, requestId, res.data.item, res.data.request);
  };

  const confirmReceipt = async (itemId, requestId) => {
    const res = await api.patch(`/api/requests/${requestId}/confirm-receipt`);
    _applyLifecycle(itemId, requestId, res.data.item, res.data.request);
  };

  const initiateReturn = async (itemId, requestId) => {
    const res = await api.patch(`/api/requests/${requestId}/initiate-return`);
    _applyLifecycle(itemId, requestId, res.data.item, res.data.request);
  };

  const confirmReturn = async (itemId, requestId) => {
    const res = await api.patch(`/api/requests/${requestId}/confirm-return`);
    _applyLifecycle(itemId, requestId, res.data.item, res.data.request);
  };

  // ── Reject request ───────────────────────────────────────────
  const rejectRequest = async (requestId) => {
    const res = await api.patch(`/api/requests/${requestId}/reject`);
    setRequests(prev => prev.map(r => r._id === requestId ? res.data.request : r));
  };

  // ── Reviews ──────────────────────────────────────────────────
  const addReview = async (reviewData) => {
    const res = await api.post('/api/reviews', reviewData);
    setReviews(prev => [res.data.review, ...prev]);
    return res.data.review;
  };

  // ── Admin: User Management ───────────────────────────────────
  const makeAdmin = async (userId) => {
    const res = await api.patch(`/api/auth/users/${userId}/role`, { role: 'admin' });
    setUsers(prev => prev.map(u => u._id === userId ? res.data.user : u));
  };

  const removeAdmin = async (userId) => {
    const res = await api.patch(`/api/auth/users/${userId}/role`, { role: 'user' });
    setUsers(prev => prev.map(u => u._id === userId ? res.data.user : u));
  };

  // ── Helper Queries (synchronous — no API call) ───────────────
  const getItemById     = (id)     => items.find(i => i._id === id);
  const getUserById     = (id)     => users.find(u => u._id === id);
  const getItemRequests = (itemId) => requests.filter(r => r.item_id === itemId);
  const getUserRequests = (userId) => requests.filter(r => r.requester_id === userId);
  const getItemReviews  = (itemId) => reviews.filter(r => r.item_id === itemId);
  const getAvgRating    = (itemId) => {
    const rs = reviews.filter(r => r.item_id === itemId);
    return rs.length ? rs.reduce((sum, r) => sum + r.rating, 0) / rs.length : 0;
  };

  const availableItems = items.filter(i => i.status === 'AVAILABLE');

  return (
    <AppContext.Provider value={{
      items, requests, reviews, users,
      loading, availableItems, refetch: fetchAll,
      // Item actions
      addItem, updateItem, deleteItem, deactivateItem, reactivateItem,
      // Request actions
      addRequest, rejectRequest,
      // Donation track
      approveReceiver, confirmPickup, confirmDelivery,
      // Lending track
      approveBorrower, confirmReceipt, initiateReturn, confirmReturn,
      // Reviews
      addReview,
      // Admin
      makeAdmin, removeAdmin,
      // Queries
      getItemById, getUserById, getItemRequests, getUserRequests, getItemReviews, getAvgRating,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
