//  @ts-check

/** @type {import('prettier').Config} */
const config = {
  endOfLine: 'lf',
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
  importOrder: [
    '<TYPES>',
    '^(react/(.*)$)|^(react$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '<TYPES>^[.|..|@]',
    '^@/(.*)$',
    '',
    '^[../]',
    '^[./]',
  ],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
  importOrderBuiltinModulesToTop: true,
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderMergeDuplicateImports: true,
  importOrderCombineTypeAndValueImports: true,
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
}

export default config
