import { postgres } from 'vite-plugin-db'

export default postgres({
  seed: {
    type: 'sql-script',
    path: 'drizzle/*.sql',
  },
  referrer: 'create-tanstack',
  dotEnvKey: 'VITE_DATABASE_URL',
})
