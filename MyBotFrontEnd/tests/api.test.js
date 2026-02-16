// Mock tests for API client
describe('ApiClient', () => {
    test('should create instance', () => {
        expect(typeof api).toBe('object');
    });

    test('should have required methods', () => {
        expect(typeof api.signIn).toBe('function');
        expect(typeof api.signUp).toBe('function');
        expect(typeof api.getAllGroups).toBe('function');
    });
});
