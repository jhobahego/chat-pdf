import { writable } from 'svelte/store';

export const APP_STATUS = {
  INIT: 0,
  LOADING: 1,
  CHAT_MODE: 2,
  ERROR: -1,
};

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const appStatus = writable(APP_STATUS.INIT);
export const appStatusInfo = writable({ id: '', url: '', pages: 0 });
export const chatHistory = writable<Message[]>([]);

export const setAppStatusLoading = () => {
  appStatus.set(APP_STATUS.LOADING);
};

export const setAppStatusError = () => {
  appStatus.set(APP_STATUS.ERROR);
};

export const setAppStatusInit = () => {
  appStatus.set(APP_STATUS.INIT);
  chatHistory.set([]);
};

export const setAppStatusChatMode = ({
  id,
  url,
  pages,
}: {
  id: string;
  url: string;
  pages: number;
}) => {
  appStatus.set(APP_STATUS.CHAT_MODE);
  appStatusInfo.set({ id, url, pages });
};