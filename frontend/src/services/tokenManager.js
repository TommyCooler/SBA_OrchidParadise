// TokenManager.js - Quản lý JWT Token ở Frontend

class TokenManager {
    
    // Option 1: Sử dụng localStorage (Đơn giản, persistent)
    static saveTokenToLocalStorage(token) {
        localStorage.setItem('authToken', token);
    }
    
    static getTokenFromLocalStorage() {
        return localStorage.getItem('authToken');
    }
    
    static removeTokenFromLocalStorage() {
        localStorage.removeItem('authToken');
    }
    
    // Option 2: Sử dụng sessionStorage (Tự động xóa khi đóng browser)
    static saveTokenToSessionStorage(token) {
        sessionStorage.setItem('authToken', token);
    }
    
    static getTokenFromSessionStorage() {
        return sessionStorage.getItem('authToken');
    }
    
    static removeTokenFromSessionStorage() {
        sessionStorage.removeItem('authToken');
    }
    
    // Option 3: Sử dụng cookie (Server sẽ tự động set cookie)
    static getTokenFromCookie() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'authToken') {
                return value;
            }
        }
        return null;
    }
    
    // Hàm tiện ích để setup Axios interceptor
    static setupAxiosInterceptor() {
        // Tự động thêm token vào mọi request
        axios.interceptors.request.use(
            (config) => {
                const token = this.getTokenFromLocalStorage(); // hoặc sessionStorage
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
        
        // Xử lý response để handle token expired
        axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // Token expired hoặc invalid
                    this.removeTokenFromLocalStorage();
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }
    
    // Kiểm tra token có hợp lệ không
    static isTokenValid() {
        const token = this.getTokenFromLocalStorage();
        if (!token) return false;
        
        try {
            // Decode JWT payload để check expiration
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp > currentTime;
        } catch (error) {
            return false;
        }
    }
}

// Sử dụng trong component React/Vue
export default TokenManager;
