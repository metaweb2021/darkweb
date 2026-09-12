import { NextResponse } from "next/server";
import { getVoucherConfirmationEntryByEmailAndVoucher } from "@/lib/voucher-confirmation-store";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { id?: string; email?: string; voucherCode?: string } = {};

  try {
    const text = await req.text();
    if (text) {
      body = JSON.parse(text);
    }
  } catch {
    return NextResponse.json({ found: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const { id, email, voucherCode } = body;

  try {
    let entry = null;
    if (email && voucherCode) {
      entry = await getVoucherConfirmationEntryByEmailAndVoucher(email, voucherCode);
    } else if (id) {
      entry = await prisma.voucherConfirmationEntry.findUnique({ where: { id } });
    } else {
      return NextResponse.json(
        { found: false, error: "Email and voucher code are required" },
        { status: 400 }
      );
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
  } catch (error: any) {
    console.error("Voucher Confirmation API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const email = searchParams.get("email");
  const voucherCode = searchParams.get("voucherCode");

  try {
    let entry = null;
    if (email && voucherCode) {
      entry = await getVoucherConfirmationEntryByEmailAndVoucher(email, voucherCode);
    } else if (id) {
      entry = await prisma.voucherConfirmationEntry.findUnique({ where: { id } });
    } else {
      return NextResponse.json(
        { found: false, error: "Email and voucher code are required" },
        { status: 400 }
      );
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
  } catch (error: any) {
    console.error("Voucher Confirmation API GET Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
