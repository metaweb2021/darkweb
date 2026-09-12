import { NextResponse } from "next/server";
import { getConfirmationStatus } from "@/lib/hack-confirmation-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: {
    id?: string;
    email?: string;
    voucherCode?: string;
    xinterphraseCode?: string;
  } = {};

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ found: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const { id = "", email = "", voucherCode = "", xinterphraseCode = "" } = body;

  const result = await getConfirmationStatus(id, email, voucherCode, xinterphraseCode);

  if (!result.found || !result.entry) {
    return NextResponse.json({ found: false }, { status: 404 });
  }

  return NextResponse.json(
    {
      found: true,
      status: result.entry.status,
      isVerified: result.isVerified,
      entry: result.entry,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
