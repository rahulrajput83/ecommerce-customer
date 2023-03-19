export const Logout = () => {
    localStorage.removeItem('token');
    return '/login'
}