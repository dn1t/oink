import { login } from './login';
import { email, password, forced } from '../config.json';

login(email, password, forced).then(async (loginResult) => {
  console.log(loginResult);
});
