// best practice to create single instance of Prisma Client and export it to prevent warnings

import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

// create global variable to prevent multiple instances of Prisma Client in development
declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

// nullish coalescing operator (??) to check if globalThis.prisma is defined
const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

// no need to check connection in production, since schema will not change
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}
