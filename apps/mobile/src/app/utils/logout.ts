import AsyncStorage from '@react-native-async-storage/async-storage';

import { emitter } from '../providers/mitt';

let currentLogoutPromise: NodeJS.Timeout | null = null;
let currentFullLogoutPromise: NodeJS.Timeout | null = null;

export const logoutOnExpire = (accessExpiresIn: number) => {
  currentLogoutPromise = setTimeout(logout, accessExpiresIn);
};

export const fullLogoutOnExpire = (refreshExpiresIn: number) => {
  currentFullLogoutPromise = setTimeout(fullLogout, refreshExpiresIn);
};

export const logout = async () => {
  await AsyncStorage.removeItem('accessToken');
  emitter.emit('logout');

  if (currentLogoutPromise) {
    clearTimeout(currentLogoutPromise);
    currentLogoutPromise = null;
  }

  if (currentFullLogoutPromise) {
    clearTimeout(currentFullLogoutPromise);
    currentFullLogoutPromise = null;
  }
  // TODO: try to refresh token
};

export const fullLogout = async () => {
  await logout();
  await AsyncStorage.removeItem('refreshToken');
  // TODO: redirect to homepage
};
