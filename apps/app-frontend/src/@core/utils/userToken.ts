import axios from 'axios';
import authConfig from '../../configs/authConfig';

export function patchAxiosAuthorization(token: string | null) {
  if (token) {
    axios.defaults.headers.common.Authorization = `${authConfig.headerTokenKeyName} ${token}`;
  } else {
    axios.defaults.headers.common.Authorization = ``;
  }
}
