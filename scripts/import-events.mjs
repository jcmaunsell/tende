// Run: node --env-file=.env.local scripts/import-events.mjs
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Only upcoming events (from today 2026-04-26 onwards)
const events = [
  {
    title: "Beacon Farmers Market",
    date: "2026-04-26T10:00:00-04:00",
    location: "223 Main Street, Beacon, NY 12508",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/67b280d5f7c74d32903613d1/1758918961583-9LXF6H45VQMJ3LO4BWSN/1.png",
    description: "Voted Best Market in the Hudson Valley three years running, the Beacon Farmers Market is your go-to spot for fresh, local produce and handmade goods. Stop by the Tende booth to meet Sage and explore handcrafted, plant-based hair and body care made with sustainability and intention. Support local, shop small, and enjoy a vibrant community atmosphere every week!",
  },
  {
    title: "Hudson Valley Open Market",
    date: "2026-05-02T10:00:00-04:00",
    location: "196 Main Street, New Paltz, NY 12561",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/67b280d5f7c74d32903613d1/1776803883168-ZGXKBG9S2E2VPEM2UKIO/HVOMprofile.webp",
    description: "Voted Best Market in the Hudson Valley three years running, the Beacon Farmers Market is your go-to spot for fresh, local produce and handmade goods. Stop by the Tende booth to meet Sage and explore handcrafted, plant-based hair and body care made with sustainability and intention. Support local, shop small, and enjoy a vibrant community atmosphere every week!",
  },
  {
    title: "Beacon Farmers Market",
    date: "2026-05-03T10:00:00-04:00",
    location: "223 Main Street, Beacon, NY 12508",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/67b280d5f7c74d32903613d1/1758918961583-9LXF6H45VQMJ3LO4BWSN/1.png",
    description: "Voted Best Market in the Hudson Valley three years running, the Beacon Farmers Market is your go-to spot for fresh, local produce and handmade goods. Stop by the Tende booth to meet Sage and explore handcrafted, plant-based hair and body care made with sustainability and intention. Support local, shop small, and enjoy a vibrant community atmosphere every week!",
  },
  {
    title: "Basilica Farm & Flea",
    date: "2026-05-09T10:00:00-04:00",
    location: "110 Front Street, Hudson, NY 12534",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/67b280d5f7c74d32903613d1/1776805635600-ZJSWM58K9C0Y3GV9C403/2026+Spring+Market+Flyer+.jpg",
    description: null,
  },
  {
    title: "Beacon Farmers Market",
    date: "2026-05-17T10:00:00-04:00",
    location: "223 Main Street, Beacon, NY 12508",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/67b280d5f7c74d32903613d1/1758918961583-9LXF6H45VQMJ3LO4BWSN/1.png",
    description: "Voted Best Market in the Hudson Valley three years running, the Beacon Farmers Market is your go-to spot for fresh, local produce and handmade goods. Stop by the Tende booth to meet Sage and explore handcrafted, plant-based hair and body care made with sustainability and intention. Support local, shop small, and enjoy a vibrant community atmosphere every week!",
  },
  {
    title: "Hudson Valley Open Market",
    date: "2026-05-23T10:00:00-04:00",
    location: "196 Main Street, New Paltz, NY 12561",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/67b280d5f7c74d32903613d1/1776803883168-ZGXKBG9S2E2VPEM2UKIO/HVOMprofile.webp",
    description: "Voted Best Market in the Hudson Valley three years running, the Beacon Farmers Market is your go-to spot for fresh, local produce and handmade goods. Stop by the Tende booth to meet Sage and explore handcrafted, plant-based hair and body care made with sustainability and intention. Support local, shop small, and enjoy a vibrant community atmosphere every week!",
  },
  {
    title: "Hudson Farmers Market",
    date: "2026-05-30T09:00:00-04:00",
    location: "Hudson, NY 12534",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/67b280d5f7c74d32903613d1/1763399427869-PVFP8K53RSCFNPOB5GLU/HFM%2BLOGO.webp",
    description: null,
  },
  {
    title: "Beacon Farmers Market",
    date: "2026-05-31T10:00:00-04:00",
    location: "223 Main Street, Beacon, NY 12508",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/67b280d5f7c74d32903613d1/1758918961583-9LXF6H45VQMJ3LO4BWSN/1.png",
    description: "Voted Best Market in the Hudson Valley three years running, the Beacon Farmers Market is your go-to spot for fresh, local produce and handmade goods. Stop by the Tende booth to meet Sage and explore handcrafted, plant-based hair and body care made with sustainability and intention. Support local, shop small, and enjoy a vibrant community atmosphere every week!",
  },
  {
    title: "Ellenville Farmers Market",
    date: "2026-06-12T16:00:00-04:00",
    location: "11 Market Street, Ellenville, NY 12428",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/67b280d5f7c74d32903613d1/1758919456551-9SDUN7YX3ADOPK7FA5AR/Screenshot%2B2025-09-26%2Bat%2B4.43.36%25E2%2580%25AFPM.png",
    description: "Along with fresh, local produce, stop by to meet Sage, the organic chemist behind Tende. Based in Beacon, Sage handcrafts solid shampoo and conditioner bars, body oils, and scrubs using only plant-based ingredients and pure essential oils. Sustainable, all-natural care for hair, skin, and planet.",
  },
  {
    title: "Hudson Valley Open Market",
    date: "2026-06-13T10:00:00-04:00",
    location: "196 Main Street, New Paltz, NY 12561",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/67b280d5f7c74d32903613d1/1776803883168-ZGXKBG9S2E2VPEM2UKIO/HVOMprofile.webp",
    description: "Voted Best Market in the Hudson Valley three years running, the Beacon Farmers Market is your go-to spot for fresh, local produce and handmade goods. Stop by the Tende booth to meet Sage and explore handcrafted, plant-based hair and body care made with sustainability and intention. Support local, shop small, and enjoy a vibrant community atmosphere every week!",
  },
  {
    title: "Ellenville Farmers Market",
    date: "2026-06-26T16:00:00-04:00",
    location: "11 Market Street, Ellenville, NY 12428",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/67b280d5f7c74d32903613d1/1758919456551-9SDUN7YX3ADOPK7FA5AR/Screenshot%2B2025-09-26%2Bat%2B4.43.36%25E2%2580%25AFPM.png",
    description: "Along with fresh, local produce, stop by to meet Sage, the organic chemist behind Tende. Based in Beacon, Sage handcrafts solid shampoo and conditioner bars, body oils, and scrubs using only plant-based ingredients and pure essential oils. Sustainable, all-natural care for hair, skin, and planet.",
  },
  {
    title: "Beacon Farmers Market",
    date: "2026-06-28T10:00:00-04:00",
    location: "223 Main Street, Beacon, NY 12508",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/67b280d5f7c74d32903613d1/1758918961583-9LXF6H45VQMJ3LO4BWSN/1.png",
    description: "Voted Best Market in the Hudson Valley three years running, the Beacon Farmers Market is your go-to spot for fresh, local produce and handmade goods. Stop by the Tende booth to meet Sage and explore handcrafted, plant-based hair and body care made with sustainability and intention. Support local, shop small, and enjoy a vibrant community atmosphere every week!",
  },
  {
    title: "Ellenville Farmers Market",
    date: "2026-07-10T16:00:00-04:00",
    location: "11 Market Street, Ellenville, NY 12428",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/67b280d5f7c74d32903613d1/1758919456551-9SDUN7YX3ADOPK7FA5AR/Screenshot%2B2025-09-26%2Bat%2B4.43.36%25E2%2580%25AFPM.png",
    description: "Along with fresh, local produce, stop by to meet Sage, the organic chemist behind Tende. Based in Beacon, Sage handcrafts solid shampoo and conditioner bars, body oils, and scrubs using only plant-based ingredients and pure essential oils. Sustainable, all-natural care for hair, skin, and planet.",
  },
  {
    title: "Hudson Valley Open Market",
    date: "2026-07-11T10:00:00-04:00",
    location: "196 Main Street, New Paltz, NY 12561",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/67b280d5f7c74d32903613d1/1776803883168-ZGXKBG9S2E2VPEM2UKIO/HVOMprofile.webp",
    description: "Voted Best Market in the Hudson Valley three years running, the Beacon Farmers Market is your go-to spot for fresh, local produce and handmade goods. Stop by the Tende booth to meet Sage and explore handcrafted, plant-based hair and body care made with sustainability and intention. Support local, shop small, and enjoy a vibrant community atmosphere every week!",
  },
  {
    title: "Beacon Farmers Market",
    date: "2026-07-12T10:00:00-04:00",
    location: "223 Main Street, Beacon, NY 12508",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/67b280d5f7c74d32903613d1/1758918961583-9LXF6H45VQMJ3LO4BWSN/1.png",
    description: "Voted Best Market in the Hudson Valley three years running, the Beacon Farmers Market is your go-to spot for fresh, local produce and handmade goods. Stop by the Tende booth to meet Sage and explore handcrafted, plant-based hair and body care made with sustainability and intention. Support local, shop small, and enjoy a vibrant community atmosphere every week!",
  },
  {
    title: "Beacon Farmers Market",
    date: "2026-07-26T10:00:00-04:00",
    location: "223 Main Street, Beacon, NY 12508",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/67b280d5f7c74d32903613d1/1758918961583-9LXF6H45VQMJ3LO4BWSN/1.png",
    description: "Voted Best Market in the Hudson Valley three years running, the Beacon Farmers Market is your go-to spot for fresh, local produce and handmade goods. Stop by the Tende booth to meet Sage and explore handcrafted, plant-based hair and body care made with sustainability and intention. Support local, shop small, and enjoy a vibrant community atmosphere every week!",
  },
];

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Delete all existing events then recreate
const existing = await client.fetch('*[_type == "event"]._id');
if (existing.length > 0) {
  const tx = client.transaction();
  for (const id of existing) tx.delete(id);
  await tx.commit();
  console.log(`Deleted ${existing.length} existing events`);
}

for (const ev of events) {
  const dateSlug = ev.date.slice(0, 10);
  const id = `event-${dateSlug}-${slugify(ev.title)}`;
  const doc = {
    _id: id,
    _type: "event",
    title: ev.title,
    date: ev.date,
    location: ev.location,
    imageUrl: ev.imageUrl ?? undefined,
    description: ev.description ?? undefined,
  };
  await client.createOrReplace(doc);
  console.log(`✓ ${ev.title} (${dateSlug})`);
}

console.log(`\nImported ${events.length} events.`);
