class AuthManager {
    constructor() {
        this.user = null;
        this.init();
    }

    init() {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            this.user = JSON.parse(storedUser);
            this.updateUI();
        }

        window.addEventListener('auth:logout', () => this.logout());
    }

    async login(email, password) {
        try {
            const response = await api.signIn(email, password);
            
            if (response.success && response.data) {
                const { accessToken, refreshToken, user } = response.data;
                
                api.setTokens(accessToken, refreshToken);
                this.user = user;
                localStorage.setItem('user', JSON.stringify(user));
                
                this.updateUI();
                return { success: true };
            }
            
            throw new Error(response.message || 'Login failed');
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    }

    async signup(email, password, displayName, role) {
        try {
            const response = await api.signUp(email, password, displayName, role);
            
            if (response.success && response.data) {
                const { accessToken, refreshToken, user } = response.data;
                
                api.setTokens(accessToken, refreshToken);
                this.user = user;
                localStorage.setItem('user', JSON.stringify(user));
                
                this.updateUI();
                return { success: true };
            }
            
            throw new Error(response.message || 'Signup failed');
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, error: error.message };
        }
    }

    logout() {
        api.clearTokens();
        this.user = null;
        this.updateUI();
        window.location.hash = '#home';
    }

    isAuthenticated() {
        return this.user !== null && api.getToken() !== null;
    }

    hasRole(role) {
        return this.user && this.user.role === role;
    }

    isAdmin() {
        return this.hasRole('admin');
    }

    isTeacher() {
        return this.hasRole('teacher');
    }

    updateUI() {
        const authButtons = document.getElementById('authButtons');
        const userMenu = document.getElementById('userMenu');
        const protectedNavItems = document.querySelectorAll('.protected-nav');
        
        if (this.isAuthenticated()) {
            authButtons.classList.add('hidden');
            userMenu.classList.remove('hidden');
            
            const initials = this.user.displayName ? 
                this.user.displayName.split(' ').map(n => n[0]).join('').toUpperCase() : 
                this.user.email[0].toUpperCase();
            
            document.getElementById('userInitials').textContent = initials;
            document.getElementById('userName').textContent = this.user.displayName || 'User';
            document.getElementById('userEmail').textContent = this.user.email;
            document.getElementById('userRole').textContent = this.user.role.toUpperCase();
            
            protectedNavItems.forEach(item => item.classList.remove('hidden'));
        } else {
            authButtons.classList.remove('hidden');
            userMenu.classList.add('hidden');
            protectedNavItems.forEach(item => item.classList.add('hidden'));
        }
    }
}

const auth = new AuthManager();
