import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("Received data:", body);
    const filteredData = [
      { prohibited_items: "prohibited_items" },
      { restricted_items: "restricted_items" },
      { gifts: "gifts" },
      { currency_exceeding: "currency_exceeding" },
      { mobile_device_local_network: "mobile_device_local_network" },
      { mining_equipment: "mining_equipment" },
      { good_for_reimportation: "good_for_reimportation" },
    ];

    const enhancedData = filteredData.map((item, index) => {
      const key = Object.keys(item)[0] as keyof typeof item;
      const value = item[key];

      return {
        id: index + 1,
        label: value,
        [key]: value,
      };
    });

    console.log(enhancedData);

    console.log("Filtered data:", enhancedData);

    return NextResponse.json(
      { message: "Success", data: enhancedData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during create entity process:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
