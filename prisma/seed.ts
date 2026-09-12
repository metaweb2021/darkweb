/**
 * Seed script — creates the initial admin user.
 * Run: npx prisma db seed
 *
 * IMPORTANT: Change the password immediately after first login.
 */

import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const username = process.env.ADMIN_USERNAME ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "admin123";

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash },
  });

  console.log(`Admin user seeded: "${user.username}" (id: ${user.id})`);
  console.log("IMPORTANT: Change the default password immediately.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
