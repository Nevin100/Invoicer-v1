export const CacheKeys = {
  clients: (userId: string) => `clients:${userId}`,
  client: (userId: string, clientId: string) => `client:${userId}:${clientId}`,

  invoices: (userId: string) => `invoices:${userId}`,
  invoice: (userId: string, invoiceId: string) => `invoice:${userId}:${invoiceId}`,

  expenses: (userId: string) => `expenses:${userId}`,
  expense: (userId: string, expenseId: string) => `expense:${userId}:${expenseId}`,

  analytics: (userId: string) => `analytics:${userId}`,
};