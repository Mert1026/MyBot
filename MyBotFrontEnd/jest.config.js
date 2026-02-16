module.exports = {
    testEnvironment: 'jsdom',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/js/**/*.js',
        '!src/js/**/*.test.js'
    ],
    testMatch: [
        '**/tests/**/*.test.js'
    ]
};
