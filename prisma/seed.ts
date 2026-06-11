import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateSlug } from "../src/lib/utils";

const prisma = new PrismaClient();

async function main() {
  // 1. Admin user
  const passwordHash = await bcrypt.hash("kelana2024", 10);
  await prisma.adminUser.upsert({
    where: { email: "admin@kelanatravel.com" },
    update: {},
    create: {
      email: "admin@kelanatravel.com",
      passwordHash,
      name: "Admin Kelana Travel",
    },
  });

  // 2. Site settings (singleton)
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteName: "Kelana Travel",
      phoneWhatsapp: "6281234567890",
      phoneDisplay: "0812-3456-7890",
      email: "info@kelanatravel.com",
      address: "Jl. Magelang No. 10, Yogyakarta",
      mapsEmbedUrl: "",
      heroTagline: "Perjalanan Nyaman Antar Kota di Yogyakarta & Jawa Tengah",
      heroSubtext:
        "Travel terpercaya dengan armada ber-AC, harga transparan, dan layanan door-to-door.",
      heroImageUrl: "",
    },
  });

  // 3. Vehicles
  const vehiclesData = [
    {
      name: "Toyota HiAce Commuter",
      capacity: 14,
      facilities: ["AC", "Charger", "Musik"],
    },
    {
      name: "Toyota Avanza",
      capacity: 7,
      facilities: ["AC", "Charger"],
    },
    {
      name: "Daihatsu Xenia",
      capacity: 7,
      facilities: ["AC"],
    },
  ];

  await prisma.routePrice.deleteMany({});
  await prisma.vehicle.deleteMany({});
  const vehicles = await Promise.all(
    vehiclesData.map((v) =>
      prisma.vehicle.create({
        data: {
          name: v.name,
          slug: generateSlug(v.name),
          capacity: v.capacity,
          facilities: v.facilities,
          isActive: true,
        },
      })
    )
  );
  const [hiace, avanza] = vehicles;

  // 4. Routes (+ harga dasar untuk HiAce & Avanza)
  await prisma.route.deleteMany({});
  const routesData = [
    { cityFrom: "Yogyakarta", cityTo: "Semarang", durationEst: "3-4 jam", priceHiace: 175000, priceAvanza: 155000 },
    { cityFrom: "Yogyakarta", cityTo: "Solo", durationEst: "1-1.5 jam", priceHiace: 90000, priceAvanza: 75000 },
    { cityFrom: "Yogyakarta", cityTo: "Magelang", durationEst: "1 jam", priceHiace: 85000, priceAvanza: 70000 },
    { cityFrom: "Solo", cityTo: "Semarang", durationEst: "2-3 jam", priceHiace: 150000, priceAvanza: 130000 },
    { cityFrom: "Magelang", cityTo: "Semarang", durationEst: "2 jam", priceHiace: 135000, priceAvanza: 115000 },
  ];

  for (const r of routesData) {
    await prisma.route.create({
      data: {
        cityFrom: r.cityFrom,
        cityTo: r.cityTo,
        durationEst: r.durationEst,
        isActive: true,
        prices: {
          create: [
            { vehicleId: hiace.id, price: r.priceHiace },
            { vehicleId: avanza.id, price: r.priceAvanza },
          ],
        },
      },
    });
  }

  // 5. Features (Keunggulan)
  await prisma.feature.deleteMany({});
  await prisma.feature.createMany({
    data: [
      {
        iconKey: "wind",
        title: "Armada Ber-AC & Terawat",
        description: "Semua armada dilengkapi AC dan dirawat secara berkala demi kenyamanan perjalanan.",
        order: 1,
      },
      {
        iconKey: "user-check",
        title: "Driver Berpengalaman",
        description: "Driver kami berpengalaman dan memahami rute Yogyakarta-Jawa Tengah.",
        order: 2,
      },
      {
        iconKey: "receipt",
        title: "Harga Transparan",
        description: "Tarif jelas tanpa biaya tersembunyi, sesuai yang tertera di website.",
        order: 3,
      },
    ],
  });

  // 6. FAQ items
  await prisma.faqItem.deleteMany({});
  await prisma.faqItem.createMany({
    data: [
      {
        question: "Bagaimana cara memesan travel?",
        answer: "Isi form booking di halaman utama atau hubungi kami langsung via WhatsApp.",
        order: 1,
      },
      {
        question: "Apakah bisa request jemput di lokasi tertentu?",
        answer: "Bisa, silakan informasikan lokasi penjemputan saat melakukan pemesanan via WhatsApp.",
        order: 2,
      },
      {
        question: "Berapa lama estimasi perjalanan?",
        answer: "Estimasi durasi tertera pada masing-masing rute di halaman Rute & Harga.",
        order: 3,
      },
      {
        question: "Apakah ada batasan jumlah bagasi?",
        answer: "Bagasi standar penumpang ditampung di bagasi armada. Untuk barang besar, mohon informasikan terlebih dahulu.",
        order: 4,
      },
    ],
  });

  // 7. Testimonials
  await prisma.testimonial.deleteMany({});
  await prisma.testimonial.createMany({
    data: [
      {
        name: "Dewi Anggraini",
        rating: 5,
        review: "Pelayanannya ramah dan armadanya nyaman. Perjalanan Jogja-Semarang jadi lebih santai.",
        routeUsed: "Yogyakarta → Semarang",
        published: true,
      },
      {
        name: "Budi Santoso",
        rating: 5,
        review: "Tepat waktu dan harga sesuai dengan yang diinformasikan. Recommended!",
        routeUsed: "Yogyakarta → Solo",
        published: true,
      },
      {
        name: "Siti Rahma",
        rating: 4,
        review: "Drivernya baik dan sopan, mobil bersih dan ber-AC. Akan pakai lagi.",
        routeUsed: "Yogyakarta → Magelang",
        published: true,
      },
    ],
  });

  console.log("Seed selesai.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
