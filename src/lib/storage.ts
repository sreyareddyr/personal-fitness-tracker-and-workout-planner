// API-based storage management for fitness tracker data

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  height?: number;
  weight?: number;
  age?: number;
}

export interface Workout {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'Cardio' | 'Strength' | 'Yoga' | 'Other';
  duration: number;
  date: string;
}

export interface TrackerData {
  id: string;
  userId: string;
  steps: number;
  water: number;
  calories: number;
  sleep: number;
  date: string;
}

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Storage keys (for fallback/current user)
const CURRENT_USER_KEY = 'fittrack_current_user';

// Helper function to get headers
const getHeaders = () => ({
  'Content-Type': 'application/json',
});

// Helper functions for current user
const getCurrentUserFromStorage = (): User | null => {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  return stored ? JSON.parse(stored) : null;
};

const saveCurrentUserToStorage = (user: User | null): void => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// User Management Functions

export const registerUser = async (
  username: string,
  email: string,
  password: string,
  age?: number,
  height?: number,
  weight?: number
): Promise<{ success: boolean; error?: string; user?: User }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ username, email, password, age, height, weight }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Registration failed' };
    }

    const user: User = {
      id: data.user.id,
      username: data.user.username,
      email: data.user.email,
      age: data.user.age,
      height: data.user.height,
      weight: data.user.weight,
    };

    saveCurrentUserToStorage(user);
    return { success: true, user };
  } catch (error) {
    return { success: false, error: 'Network error. Please check if the backend is running on http://localhost:5000' };
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: User }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Login failed' };
    }

    const user: User = {
      id: data.user.id,
      username: data.user.username,
      email: data.user.email,
      age: data.user.age,
      height: data.user.height,
      weight: data.user.weight,
    };

    saveCurrentUserToStorage(user);
    return { success: true, user };
  } catch (error) {
    return { success: false, error: 'Network error. Please check if the backend is running on http://localhost:5000' };
  }
};

export const logoutUser = (): void => {
  saveCurrentUserToStorage(null);
};

export const getCurrentUser = (): User | null => {
  return getCurrentUserFromStorage();
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<Omit<User, 'id' | 'email'>>
): Promise<User | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const updatedUser: User = {
      id: data._id,
      username: data.username,
      email: data.email,
      age: data.age,
      height: data.height,
      weight: data.weight,
    };

    saveCurrentUserToStorage(updatedUser);
    return updatedUser;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
};

// Workout Management Functions

export const createWorkout = async (workout: Omit<Workout, 'id'>): Promise<Workout> => {
  try {
    const response = await fetch(`${API_BASE_URL}/workouts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        userId: workout.userId,
        title: workout.title,
        type: workout.category,
        duration: workout.duration,
        description: workout.description,
        date: workout.date,
      }),
    });

    const data = await response.json();
    return {
      id: data._id,
      userId: data.userId,
      title: data.title,
      category: data.type,
      duration: data.duration,
      description: data.description,
      date: data.date,
    };
  } catch (error) {
    throw new Error('Failed to create workout');
  }
};

export const getWorkouts = async (userId?: string): Promise<Workout[]> => {
  try {
    const url = userId ? `${API_BASE_URL}/workouts?userId=${userId}` : `${API_BASE_URL}/workouts`;
    const response = await fetch(url, {
      headers: getHeaders(),
    });

    const data = await response.json();
    return data.map((w: any) => ({
      id: w._id,
      userId: w.userId,
      title: w.title,
      category: w.type,
      duration: w.duration,
      description: w.description,
      date: w.date,
    }));
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return [];
  }
};

export const updateWorkout = async (
  id: string,
  updates: Partial<Omit<Workout, 'id' | 'userId'>>
): Promise<Workout | null> => {
  try {
    const apiUpdates: any = { ...updates };
    if (updates.category) {
      apiUpdates.type = updates.category;
      delete apiUpdates.category;
    }

    const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(apiUpdates),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return {
      id: data._id,
      userId: data.userId,
      title: data.title,
      category: data.type,
      duration: data.duration,
      description: data.description,
      date: data.date,
    };
  } catch (error) {
    console.error('Error updating workout:', error);
    return null;
  }
};

export const deleteWorkout = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting workout:', error);
    return false;
  }
};

// Tracker Management Functions

export const logTrackerData = async (data: Omit<TrackerData, 'id'>): Promise<TrackerData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tracker`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return {
      id: result._id,
      userId: result.userId,
      date: result.date,
      steps: result.steps,
      water: result.water,
      calories: result.calories,
      sleep: result.sleep,
    };
  } catch (error) {
    throw new Error('Failed to log tracker data');
  }
};

export const getTrackerData = async (userId?: string, date?: string): Promise<TrackerData[]> => {
  try {
    let url = `${API_BASE_URL}/tracker?`;
    if (userId) url += `userId=${userId}&`;
    if (date) url += `date=${date}`;

    const response = await fetch(url, {
      headers: getHeaders(),
    });

    const data = await response.json();
    return data.map((t: any) => ({
      id: t._id,
      userId: t.userId,
      date: t.date,
      steps: t.steps,
      water: t.water,
      calories: t.calories,
      sleep: t.sleep,
    }));
  } catch (error) {
    console.error('Error fetching tracker data:', error);
    return [];
  }
};

export const updateTrackerData = async (
  id: string,
  updates: Partial<Omit<TrackerData, 'id' | 'userId' | 'date'>>
): Promise<TrackerData | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tracker/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return {
      id: data._id,
      userId: data.userId,
      date: data.date,
      steps: data.steps,
      water: data.water,
      calories: data.calories,
      sleep: data.sleep,
    };
  } catch (error) {
    console.error('Error updating tracker data:', error);
    return null;
  }
};

export const getTodayTrackerData = async (userId: string): Promise<TrackerData | null> => {
  const today = new Date().toISOString().split('T')[0];
  const data = await getTrackerData(userId, today);
  return data.length > 0 ? data[0] : null;
};
