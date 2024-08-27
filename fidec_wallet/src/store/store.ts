import { configureStore } from "@reduxjs/toolkit";
import accountsReducer from "./StoreComponents/Accounts/accounts";
import networksReducer from "./StoreComponents/Networks/networks";
import tokensReducer from "./StoreComponents/Tokens/tokens";
import LoadingSlice from "./Support/Loading/LoadingSlice";

export const store = configureStore({
  reducer: {
    accounts: accountsReducer,
    networks: networksReducer,
    tokens: tokensReducer,
    loading: LoadingSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
