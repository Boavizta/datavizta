const tsJest = { tsconfig: { preserveValueImports: false } };

module.exports = {
	transform: {
		'^.+\\.svelte$': ['svelte-jester', { preprocess: './svelte.config.test.cjs' }],
		'^.+\\.ts$': ['ts-jest', tsJest],
		'^.+\\.js$': ['ts-jest', tsJest]
	},
	moduleFileExtensions: ['js', 'ts', 'svelte'],
	moduleNameMapper: {
		'^\\$lib(.*)$': '<rootDir>/src/lib$1',
		'^\\$app(.*)$': [
			'<rootDir>/.svelte-kit/dev/runtime/app$1',
			'<rootDir>/.svelte-kit/build/runtime/app$1'
		]
	},
	setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
	testPathIgnorePatterns: ['/node_modules/', '<rootDir>/tests/e2e/'],
	collectCoverageFrom: ['src/**/*.{ts,tsx,svelte,js,jsx}']
};
