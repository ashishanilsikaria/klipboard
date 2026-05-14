import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  try {
    const blocks = await prisma.block.findMany({ take: 1 });
    console.log('✅ Connected');
  } catch (error) {
    console.error('❌ Error connecting to the database:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
