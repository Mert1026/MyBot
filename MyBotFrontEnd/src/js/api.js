// API Configuration and Client
const API_BASE_URL = 'https://mybot-y0ns.onrender.com/api';

class ApiClient {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.refreshing = false;
    }

    getToken() {
        return localStorage.getItem('accessToken');
    }

    getRefreshToken() {
        return localStorage.getItem('refreshToken');
    }

    setTokens(accessToken, refreshToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    }

    clearTokens() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    }

    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        const token = this.getToken();
        if (token && !options.skipAuth) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...options,
                headers
            });

            if (response.status === 401 && !options.skipRetry && !options.skipAuth) {
                this.clearTokens();
                window.dispatchEvent(new CustomEvent('auth:logout'));
                throw new Error('Session expired. Please login again.');
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    async signUp(email, password, displayName, role) {
        return this.request('/Users/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password, displayName, role }),
            skipAuth: true
        });
    }

    async signIn(email, password) {
        return this.request('/Users/signin', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            skipAuth: true
        });
    }

    async getProfile() {
        return this.request('/Users/profile');
    }

    async getAllGroups() {
        return this.request('/Groups/all');
    }

    async getGroupById(id) {
        return this.request(`/Groups/id?id=${id}`);
    }

    async createGroup(groupData) {
        return this.request('/Groups/create', {
            method: 'POST',
            body: JSON.stringify(groupData)
        });
    }

    async updateGroup(name, groupData) {
        return this.request(`/Groups/update?name=${encodeURIComponent(name)}`, {
            method: 'POST',
            body: JSON.stringify(groupData)
        });
    }

    async deleteGroup(name) {
        return this.request(`/Groups/delete?name=${encodeURIComponent(name)}`, {
            method: 'DELETE'
        });
    }

    async softDeleteGroup(name) {
        return this.request(`/Groups/softDelete?name=${encodeURIComponent(name)}`, {
            method: 'DELETE'
        });
    }

    async getAllMembers() {
        return this.request('/Members/all');
    }

    async createMember(memberData) {
        return this.request('/Members/create', {
            method: 'POST',
            body: JSON.stringify(memberData)
        });
    }

    async updateMember(memberId, memberData) {
        return this.request(`/Members/update?memberid=${memberId}`, {
            method: 'POST',
            body: JSON.stringify(memberData)
        });
    }

    async deleteMember(id) {
        return this.request(`/Members/delete?id=${id}`, {
            method: 'DELETE'
        });
    }

    async changeMemberStatus(memberId, status) {
        return this.request(`/Members/statusChange?memberId=${memberId}&status=${status}`, {
            method: 'POST'
        });
    }

    async getAllUsers() {
        return this.request('/Users/all');
    }

    async getUsersByRole(role) {
        return this.request(`/Users/by-role/${role}`);
    }

    async deleteUser(id) {
        return this.request(`/Users/${id}`, {
            method: 'DELETE'
        });
    }
}

const api = new ApiClient();