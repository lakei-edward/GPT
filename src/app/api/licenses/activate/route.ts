import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { LResponseError } from "@/lib";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) return LResponseError("Please log in first");

  const user = await prisma.user.findUnique({
    where: { id: session?.user.id },
  });

  if (!user) return LResponseError("User does not exist");

  const { license_key, instance_name } = await request.json();

  try {
    const variants = await fetch("https://api.lemonsqueezy.com/v1/variants", {
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      },
    }).then((res) => res.json());

    const check = await fetch(
      "https://api.lemonsqueezy.com/v1/licenses/validate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ license_key }),
      }
    ).then((res) => res.json());

    if (!check.valid) return LResponseError(check.error || "error");

    const { license_key: licenseKey, meta } = check;
    const { variant_id } = meta;

    const findvariants = variants.data.find(
      (p: any) => p.id === String(variant_id)
    );

    if (!findvariants) return LResponseError("License key is invalid.");

    const variants_name = findvariants.attributes.name;
    const price = findvariants.attributes.price;

    if (variants_name.includes("Free") && user.freeTrialed) {
      return LResponseError("You have already used your free trial");
    }
    if (variants_name.includes("Premium") && user.license_type === "premium") {
      return LResponseError("Your license is already premium");
    }

    const res = await fetch(
      "https://api.lemonsqueezy.com/v1/licenses/activate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ license_key, instance_name }),
      }
    ).then((res) => res.json());

    if (!res.activated) return LResponseError(res.error || "error");

    const { instance } = res;

    // add license
    await prisma.license.create({
      data: {
        license_key: licenseKey.key,
        license_created_at: new Date(licenseKey.created_at),
        license_activate_at: new Date(instance.created_at),
        variants_name,
        price,
        userId: session.user.id,
      },
    });

    let type = "";

    if (variants_name.includes("License")) {
      type = "license";
      let license_type = "";
      let add_tokens = 0;
      let freeTrialed = user.freeTrialed;

      if (variants_name.includes("Premium")) {
        license_type = "premium";
        add_tokens = 500000;
      } else if (variants_name.includes("Free")) {
        if (user.license_type !== "premium" && user.license_type !== "team") {
          license_type = "free";
        }
        add_tokens = 10000;
        freeTrialed = 1;
      }

      await prisma.user.update({
        data: {
          license_type,
          availableTokens: user.availableTokens + add_tokens,
          freeTrialed,
        },
        where: { id: session?.user.id },
      });
    } else if (variants_name.includes("Tokens")) {
      type = "tokens";
      let add_tokens = 0;

      if (price === 500) {
        add_tokens = 1660000;
        if (user.license_type === "premium") add_tokens += 330000;
      } else if (price === 1000) {
        add_tokens = 3400000;
        if (user.license_type === "premium") add_tokens += 700000;
      }
      await prisma.user.update({
        data: {
          availableTokens: user.availableTokens + add_tokens,
        },
        where: { id: session?.user.id },
      });
    }

    return NextResponse.json({ error: 0, data: { type } }, { status: 200 });
  } catch (error) {
    console.log(error, "validate licenses error");
    return NextResponse.json(
      { error: -1, msg: "validate licenses error" },
      { status: 500 }
    );
  }
}
