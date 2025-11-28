// Mock Firebase
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  serverTimestamp: jest.fn(() => 'mock-timestamp'),
}));

jest.mock('../../firebase', () => ({
  db: {},
}));

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

import { renderHook, act, waitFor } from '@testing-library/react';
import { useRoutines } from '../useRoutines';
import { useAuth } from '../../contexts/AuthContext';
import * as firestore from 'firebase/firestore';

describe('useRoutines hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return initial state', async () => {
    useAuth.mockReturnValue({ currentUser: null });
    const { result } = renderHook(() => useRoutines());

    expect(result.current.routines).toEqual([]);
    expect(result.current.currentRoutine).toBeNull();
    // In initial state without user, loading should be false
    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBeNull();
  });

  test('should load routines for authenticated user', async () => {
    useAuth.mockReturnValue({ currentUser: { uid: 'test-user' } });

    const mockRoutines = [
      { id: '1', name: 'Routine 1' },
      { id: '2', name: 'Routine 2' }
    ];

    firestore.getDocs.mockResolvedValue({
      docs: mockRoutines.map(r => ({
        id: r.id,
        data: () => ({ name: r.name })
      }))
    });

    const { result } = renderHook(() => useRoutines());

    // Trigger loadRoutines via useEffect if currentUser is present,
    // or manually if we want to test the function specifically.
    // The hook has a useEffect that calls loadRoutines on mount/currentUser change.

    await waitFor(() => {
      expect(result.current.routines).toHaveLength(2);
    });

    expect(result.current.routines[0]).toEqual({ id: '1', name: 'Routine 1' });
    expect(result.current.routines[1]).toEqual({ id: '2', name: 'Routine 2' });
  });

  test('should handle load routines error', async () => {
    useAuth.mockReturnValue({ currentUser: { uid: 'test-user' } });
    firestore.getDocs.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useRoutines());

    await waitFor(() => {
      expect(result.current.error).toBe('Network error');
    });

    expect(result.current.loading).toBe(false);
  });

  test('should create a routine', async () => {
    useAuth.mockReturnValue({ currentUser: { uid: 'test-user' } });
    firestore.addDoc.mockResolvedValue({ id: 'new-routine-id' });

    const { result } = renderHook(() => useRoutines());

    await act(async () => {
      await result.current.createRoutine({ name: 'New Routine' });
    });

    expect(firestore.addDoc).toHaveBeenCalled();
    expect(result.current.routines).toHaveLength(1);
    expect(result.current.routines[0].id).toBe('new-routine-id');
    expect(result.current.routines[0].name).toBe('New Routine');
  });

  test('should update a routine', async () => {
    useAuth.mockReturnValue({ currentUser: { uid: 'test-user' } });

    // Setup initial state
    firestore.getDocs.mockResolvedValue({
      docs: [{ id: '1', data: () => ({ name: 'Old Name' }) }]
    });

    const { result } = renderHook(() => useRoutines());

    await waitFor(() => {
      expect(result.current.routines).toHaveLength(1);
    });

    await act(async () => {
      await result.current.updateRoutine('1', { name: 'Updated Name' });
    });

    expect(firestore.updateDoc).toHaveBeenCalled();
    expect(result.current.routines[0].name).toBe('Updated Name');
  });

  test('should delete a routine', async () => {
    useAuth.mockReturnValue({ currentUser: { uid: 'test-user' } });

    // Setup initial state
    firestore.getDocs.mockResolvedValue({
      docs: [{ id: '1', data: () => ({ name: 'To Delete' }) }]
    });

    const { result } = renderHook(() => useRoutines());

    await waitFor(() => {
      expect(result.current.routines).toHaveLength(1);
    });

    await act(async () => {
      await result.current.deleteRoutine('1');
    });

    expect(firestore.deleteDoc).toHaveBeenCalled();
    expect(result.current.routines).toHaveLength(0);
  });
});
