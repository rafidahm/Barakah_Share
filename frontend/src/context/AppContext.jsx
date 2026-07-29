import { createContext, useContext, useState } from 'react';
import { mockItems, mockRequests, mockReviews, mockUsers } from '../data/mockData';

// TODO: REST API Integration — replace all mock arrays with Axios GET/POST/PATCH calls
// TODO: MongoDB Integration — data shape matches Mongoose schemas

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [items, setItems]       = useState(mockItems);
  const [requests, setRequests] = useState(mockRequests);
  const [reviews, setReviews]   = useState(mockReviews);
  const [users, setUsers]       = useState(mockUsers);

  // ── Item CRUD ────────────────────────────────────────────────
  const addItem = (item) => {
    const newItem = { ...item, _id: `i${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] };
    setItems(prev => [newItem, ...prev]);
    return newItem;
  };

  const updateItem = (itemId, updates) => {
    setItems(prev => prev.map(i => i._id === itemId ? { ...i, ...updates } : i));
  };

  const updateItemStatus = (itemId, newStatus) => {
    setItems(prev => prev.map(i => i._id === itemId ? { ...i, status: newStatus } : i));
  };

  const deleteItem = (itemId) => {
    setItems(prev => prev.filter(i => i._id !== itemId));
  };

  const deactivateItem = (itemId) => {
    setItems(prev => prev.map(i =>
      i._id === itemId && i.status === 'AVAILABLE' ? { ...i, status: 'DEACTIVATED' } : i
    ));
  };

  // ── Request CRUD ─────────────────────────────────────────────
  const addRequest = (request) => {
    const newReq = { ...request, _id: `r${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] };
    setRequests(prev => [newReq, ...prev]);
    return newReq;
  };

  const updateRequestStatus = (requestId, newStatus) => {
    setRequests(prev => prev.map(r => r._id === requestId ? { ...r, status: newStatus } : r));
  };

  // ── DONATION TRACK ───────────────────────────────────────────

  // Step 3: Donor approves ONE receiver → item: CLAIMED, request: APPROVED
  const approveReceiver = (itemId, requestId) => {
    updateItemStatus(itemId, 'CLAIMED');
    updateRequestStatus(requestId, 'APPROVED');
  };

  // Step 4: Receiver confirms pickup → request: RECEIVED (item stays CLAIMED)
  const confirmPickup = (requestId) => {
    updateRequestStatus(requestId, 'RECEIVED');
  };

  // Step 5: Donor confirms delivery → item: COMPLETED, request: COMPLETED
  //         Only allowed when request.status === 'RECEIVED'
  const confirmDelivery = (itemId, requestId) => {
    updateItemStatus(itemId, 'COMPLETED');
    updateRequestStatus(requestId, 'COMPLETED');
  };

  // ── LENDING TRACK ────────────────────────────────────────────

  // Step 3: Lender approves borrower → item: CLAIMED, request: APPROVED
  const approveBorrower = (itemId, requestId) => {
    updateItemStatus(itemId, 'CLAIMED');
    updateRequestStatus(requestId, 'APPROVED');
  };

  // Step 4: Borrower confirms receipt → item: IN_USE, request: IN_USE
  const confirmReceipt = (itemId, requestId) => {
    updateItemStatus(itemId, 'IN_USE');
    updateRequestStatus(requestId, 'IN_USE');
  };

  // Step 5: Borrower initiates return → item: PENDING_RETURN, request: PENDING_RETURN
  const initiateReturn = (itemId, requestId) => {
    updateItemStatus(itemId, 'PENDING_RETURN');
    updateRequestStatus(requestId, 'PENDING_RETURN');
  };

  // Step 6: Lender confirms return → item: AVAILABLE, request: RETURNED
  const confirmReturn = (itemId, requestId) => {
    updateItemStatus(itemId, 'AVAILABLE');
    updateRequestStatus(requestId, 'RETURNED');
  };

  // ── Request Approval/Rejection ────────────────────────────────
  const rejectRequest = (requestId) => {
    updateRequestStatus(requestId, 'REJECTED');
  };

  // ── Reviews ──────────────────────────────────────────────────
  const addReview = (review) => {
    const newReview = { ...review, _id: `rv${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] };
    setReviews(prev => [newReview, ...prev]);
    return newReview;
  };

  // ── User Management (Admin) ──────────────────────────────────
  const makeAdmin = (userId) => {
    setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: 'admin' } : u));
  };

  const removeAdmin = (userId) => {
    setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: 'user' } : u));
  };

  // ── Helper Queries ────────────────────────────────────────────
  const getItemById    = (id) => items.find(i => i._id === id);
  const getUserById    = (id) => users.find(u => u._id === id);
  const getItemRequests= (itemId) => requests.filter(r => r.item_id === itemId);
  const getUserRequests= (userId) => requests.filter(r => r.requester_id === userId);
  const getItemReviews = (itemId) => reviews.filter(r => r.item_id === itemId);
  const getAvgRating   = (itemId) => {
    const rs = reviews.filter(r => r.item_id === itemId);
    return rs.length ? rs.reduce((sum, r) => sum + r.rating, 0) / rs.length : 0;
  };

  const availableItems = items.filter(i => i.status === 'AVAILABLE');

  return (
    <AppContext.Provider value={{
      items, requests, reviews, users,
      availableItems,
      // Item actions
      addItem, updateItem, updateItemStatus, deleteItem, deactivateItem,
      // Request actions
      addRequest, updateRequestStatus, rejectRequest,
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
