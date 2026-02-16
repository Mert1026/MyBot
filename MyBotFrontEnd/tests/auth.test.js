describe('AuthManager', () => {
    test('should check authentication status', () => {
        expect(typeof auth.isAuthenticated).toBe('function');
    });

    test('should check admin role', () => {
        expect(typeof auth.isAdmin).toBe('function');
    });
});
