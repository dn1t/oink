import { KnownAuthStatusCode, LoginResult } from 'node-kakao';
import { createInterface } from 'readline';
import { authApiClient, client } from './store';

export const login = async (
  email: string,
  password: string,
  forced = true
): Promise<LoginResult> => {
  const loginForm = { email, password, forced };

  const apiLoginRes = await authApiClient.login(loginForm);
  if (!apiLoginRes.success) {
    if (
      apiLoginRes.status === KnownAuthStatusCode.DEVICE_NOT_REGISTERED ||
      apiLoginRes.status === -998
    ) {
      const passcodeRes = await authApiClient.requestPasscode(loginForm);
      if (!passcodeRes.success)
        throw new Error(
          'AuthApiClient.requestPasscode: ' + passcodeRes.status.toString()
        );

      const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const passcode = await new Promise<string>((res) =>
        rl.question(
          '사용중인 기기로 전송된 인증번호를 입력해주세요 >',
          (answer) => res(answer)
        )
      );
      rl.close();

      const registerDeviceRes = await authApiClient.registerDevice(
        loginForm,
        passcode,
        true
      );
      if (!registerDeviceRes.success)
        throw new Error(
          'AuthApiClient.registerDevice: ' + registerDeviceRes.status.toString()
        );

      return await login.apply(
        null,
        Object.values(loginForm) as [
          email: string,
          password: string,
          forced: boolean
        ]
      );
    } else
      throw new Error('AuthApiClient.login: ' + apiLoginRes.status.toString());
  }

  const loginRes = await client.login(apiLoginRes.result);
  if (!loginRes.success)
    throw new Error('TalkClient.login: ' + loginRes.status.toString());

  return loginRes.result;
};
