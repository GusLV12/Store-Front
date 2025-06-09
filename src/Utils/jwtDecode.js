import { jwtDecode } from 'jwt-decode';

export const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    // console.log('exp:', decoded.exp, '=>', new Date(decoded.exp * 1000));
    // console.log('Now:', Date.now(), new Date());
    // console.log('Expired?', Date.now() > decoded.exp * 1000);
    if (!decoded.exp) return true;

    const expirationTime = decoded.exp * 1000; // JWT exp está en segundos
    return Date.now() > expirationTime;
  } catch (e) {
    return true; // Si falla al decodificar, asumimos que está expirado
  }
};
