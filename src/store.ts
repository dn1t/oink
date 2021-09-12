import { AuthApiClient, DefaultConfiguration, TalkClient } from 'node-kakao';
import { AxiosWebClient } from 'node-kakao/dist/api/axios-web-client';
import { Win32XVCProvider } from 'node-kakao/dist/api/xvc';
import { hostname } from 'os';

export const name = hostname();
export const uuid = 'loco';

export const client = new TalkClient();
export const authApiClient = new AuthApiClient(new AxiosWebClient('https', 'katalk.kakao.com'), name, uuid, DefaultConfiguration, Win32XVCProvider);
