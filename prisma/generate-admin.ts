import crypto from "crypto";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Generate password admin acak yang kuat dan update admin_users di DB.
 * Jalankan: npx ts-node --project tsconfig.seed.json prisma/generate-admin.ts -- admin@kelanatravel.com
 */
async function main() {
  const email = process.argv[2] ?? "admin@kelanatravel.com";

  const password = crypto.randomBytes(12).toString("base64url");
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.adminUser.update({
    where: { email },
    data: { passwordHash },
  });

  console.log("Password admin berhasil di-generate.");
  console.log("Email   :", admin.email);
  console.log("Password:", password);
  console.log("\nSimpan password ini di tempat aman — tidak akan ditampilkan lagi.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
