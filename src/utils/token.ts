import { isString } from 'lodash-es';


const TOKEN_KEY = 'gskey'

export function getSessionLevelToken() {
    return sessionStorage.getItem(TOKEN_KEY);
}

export function setSessionLevelToken(token: unknown) {
    if (!isString(token)) {
        throw new Error(`expected token to be a string but got ${token}`);
    }
    sessionStorage.setItem(TOKEN_KEY, token);
}