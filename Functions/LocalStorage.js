export const localSave = (data) => {
    localStorage.setItem('cart', JSON.stringify(data));
}