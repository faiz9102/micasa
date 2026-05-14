import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'micasa_auth';

const readStoredAuth = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
};

const persistAuth = (state) => {
  try {
    const payload = {
      user: state.user,
      role: state.role,
      loggedInAsSeller: state.loggedInAsSeller,
      isAuthenticated: state.isAuthenticated,
      accessToken: state.accessToken,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
  }
};

const initialState = {
  user: null,
  role: null,
  loggedInAsSeller: false,
  isAuthenticated: false,
  accessToken: null,
  hydrated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    hydrateAuth(state) {
      const stored = readStoredAuth();
      if (stored) {
        state.user = stored.user ?? null;
        state.role = stored.role ?? null;
        state.loggedInAsSeller = Boolean(stored.loggedInAsSeller);
        state.isAuthenticated = Boolean(stored.isAuthenticated);
        state.accessToken = stored.accessToken ?? null;
      }
      state.hydrated = true;
    },
    loginSuccess(state, action) {
      const { user, role, loggedInAsSeller, accessToken } = action.payload;
      state.user = user;
      state.role = role;
      state.loggedInAsSeller = Boolean(loggedInAsSeller);
      state.isAuthenticated = true;
      state.accessToken = accessToken ?? null;
      persistAuth(state);
    },
    logout(state) {
      state.user = null;
      state.role = null;
      state.loggedInAsSeller = false;
      state.isAuthenticated = false;
      state.accessToken = null;
      persistAuth(state);
    },
    updateProfile(state, action) {
      state.user = { ...state.user, ...action.payload };
      persistAuth(state);
    },
  },
});

export const { hydrateAuth, loginSuccess, logout, updateProfile } = authSlice.actions;

export default authSlice.reducer;
