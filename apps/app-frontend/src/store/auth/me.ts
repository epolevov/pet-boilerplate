import axios from 'axios';
import { createStore, createEffect, createEvent } from 'effector';
import appConfig from '../../configs/appConfig';
import { Account, UpdateAccountRequestDTO } from '../../@core/types/account';

type State = {
  data: Account | null;
  loading: boolean;
  mutationLoading: boolean;
};

type LogIn = {
  accessToken: string;
  role: string;
};

type SignIn = {
  accessToken: string;
  role: string;
};

export const initialState: State = {
  data: null,
  loading: true,
  mutationLoading: false,
};

export const setLoading = createEvent<boolean>();

export const logInUser = createEffect(
  async (payload: { email: string; password: string }): Promise<LogIn> => {
    const { data } = await axios.post(`${appConfig.api}/v1/sessions`, payload);

    return data;
  }
);

export const signUpUser = createEffect(
  async (payload: { email: string; password: string }): Promise<SignIn> => {
    const { data } = await axios.post(`${appConfig.api}/v1/users`, payload);

    return data;
  }
);

export const updateUser = createEffect(
  async (payload: UpdateAccountRequestDTO): Promise<Account> => {
    const { data } = await axios.patch(`${appConfig.api}/v1/users/me`, payload);

    return data;
  }
);

export const getAuthMe = createEffect(async (): Promise<Account> => {
  const { data } = await axios.get(`${appConfig.api}/v1/users/me`, {});

  return data;
});

export const reset = createEvent();

const authMeStore = createStore({ ...initialState })
  .on([getAuthMe], (state) => ({
    ...state,
    loading: true,
  }))
  .on([getAuthMe.fail], (state) => ({
    ...state,
    loading: false,
  }))
  .on([getAuthMe.doneData], (state, data: Account) => {
    return {
      ...state,
      data,
      loading: false,
    };
  })
  .on(setLoading, (state, loading) => {
    state.loading = loading;

    return { ...state };
  })
  .reset(reset);

export default authMeStore;
