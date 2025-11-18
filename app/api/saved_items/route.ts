import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Atomic fetch + delete in one transaction
    const [savedItems] = await prisma.$transaction([
      prisma.savedItem.findMany({
        where: { phone: body.phone },
      }),
      prisma.savedItem.deleteMany({
        where: { phone: body.phone },
      }),
    ]);

    // Transform items
    const items = savedItems.map((item) => ({
      type: item.category,
      hscode: item.hsCode,
      description: item.item,
      quantity: item.quantity,
      value: item.amount,
      currency: item.currency,
    }));

    // Convert to readable text
    const itemsString = items
      .map(
        (item, index) =>
          `Item ${index + 1}:\nType: ${item.type}\nHS Code: ${
            item.hscode
          }\nDescription: ${item.description}\nQuantity: ${
            item.quantity
          }\nValue: ${item.value} ${item.currency}\n`
      )
      .join("\n");

    return NextResponse.json(
      {
        message: "Success",
        itemsString,
        items,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during fetch + delete:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
