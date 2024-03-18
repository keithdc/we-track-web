import {environment} from './environment';

export function isProd(): boolean {
  return environment.apiUrl.indexOf('we-track-web.com') > -1;
}

export function isLocal(): boolean {
  return environment.apiUrl.indexOf('localhost') > -1;
}

export function getEnvKey({prepend = ''}: { prepend?: string } = {}): string {
  if (isLocal()) {
    return `${prepend}local`;
  }
  // no key for prod
  return '';
}
