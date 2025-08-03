import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Address {
  city: string;
  street: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  address: Address;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const loadFromLocalStorage = (): User[] => {
  const stored = localStorage.getItem("users");
  return stored ? JSON.parse(stored) : [];
};

const saveToLocalStorage = (users: User[]) => {
  localStorage.setItem("users", JSON.stringify(users));
};

const initialState: UserState = {
  users: loadFromLocalStorage(), // Load persisted data
  loading: false,
  error: null,
};

// Fetch API users only if localStorage is empty
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/users"
  );
  return response.data;
});

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // Add user (local only)
    addUserLocal: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
      saveToLocalStorage(state.users);
    },
    // Update user (local only)
    updateUserLocal: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
        saveToLocalStorage(state.users);
      }
    },
    // Delete user (local only)
    deleteUserLocal: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter((u) => u.id !== action.payload);
      saveToLocalStorage(state.users);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;

        // Only set API data if localStorage is empty
        if (state.users.length === 0) {
          state.users = action.payload;
          saveToLocalStorage(action.payload);
        }
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch users";
      });
  },
});

export const { addUserLocal, updateUserLocal, deleteUserLocal } =
  userSlice.actions;
export default userSlice.reducer;
