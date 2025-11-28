// Mock Firebase
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
}));

jest.mock('../../firebase', () => ({
  auth: {},
  db: {},
}));

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import * as auth from 'firebase/auth';
import * as firestore from 'firebase/firestore';

// Helper component to test useAuth hook within context
const TestComponent = () => {
  const { currentUser, login, signup, logout, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div data-testid="user">{currentUser ? currentUser.email : 'No User'}</div>
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={() => signup('test@example.com', 'password', 'username')}>Signup</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should provide authentication state', async () => {
    // Mock onAuthStateChanged to immediately return no user
    auth.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
      return jest.fn(); // unsubscribe function
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Initial loading might be too fast to catch with getByText('Loading...') if the mock resolves instantly
    // So we just check that eventually we see 'No User'
    await waitFor(() => {
        expect(screen.getByText('No User')).toBeInTheDocument();
    });
  });

  test('should handle login', async () => {
    auth.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
      return jest.fn();
    });

    auth.signInWithEmailAndPassword.mockResolvedValue({
      user: { uid: '123', email: 'test@example.com' }
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText('No User')).toBeInTheDocument());

    const loginButton = screen.getByText('Login');
    await act(async () => {
      loginButton.click();
    });

    expect(auth.signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com',
      'password'
    );
  });

  test('should handle signup', async () => {
    auth.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
      return jest.fn();
    });

    const mockUser = { uid: '123', email: 'test@example.com' };
    auth.createUserWithEmailAndPassword.mockResolvedValue({ user: mockUser });
    firestore.setDoc.mockResolvedValue();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText('No User')).toBeInTheDocument());

    const signupButton = screen.getByText('Signup');
    await act(async () => {
      signupButton.click();
    });

    expect(auth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com',
      'password'
    );

    expect(firestore.setDoc).toHaveBeenCalled();
  });

  test('should handle logout', async () => {
    auth.onAuthStateChanged.mockImplementation((auth, callback) => {
        // Initially logged in
        callback({ uid: '123', email: 'test@example.com' });
        return jest.fn();
    });

    // Mock getting user data
    firestore.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ username: 'Test User' })
    });

    auth.signOut.mockResolvedValue();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for user to be loaded
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('test@example.com'));

    const logoutButton = screen.getByText('Logout');
    await act(async () => {
      logoutButton.click();
    });

    expect(auth.signOut).toHaveBeenCalled();
  });
});
