import { NextResponse } from "next/server";
import { getEntry, getEntryByEmailAndWallet } from "@/lib/hack-check-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { id?: string; email?: string; wallet?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ found: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const { id, email, wallet } = body;
  let entry = null;

  if (email && wallet) {
    entry = await getEntryByEmailAndWallet(email, wallet);
  } else if (id) {
    entry = await getEntry(id);
  }

  if (!entry) {
    return NextResponse.json({ found: false }, { status: 404 });
  }

  return NextResponse.json(
    {
      found: true,
      status: entry.status,
      isVerified: entry.status === "verified",
      entry,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const email = searchParams.get("email");
  const wallet = searchParams.get("wallet");

  let entry = null;

  if (email && wallet) {
    entry = await getEntryByEmailAndWallet(email, wallet);
  } else if (id) {
    entry = await getEntry(id);
  }

  if (!entry) {
    return NextResponse.json({ found: false }, { status: 404 });
  }

  return NextResponse.json(
    {
      found: true,
      status: entry.status,
      isVerified: entry.status === "verified",
      entry,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
