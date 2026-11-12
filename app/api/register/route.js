import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { validateRegister } from "@/lib/validate";

export async function POST(req) {
  try {
    const body = await req.json();
    const normalizedBody = {
      fullName: typeof body.fullName === "string" ? body.fullName.trim() : "",
      email: typeof body.email === "string" ? body.email.trim().toLowerCase() : "",
      password: typeof body.password === "string" ? body.password : "",
      confirmPassword: typeof body.confirmPassword === "string" ? body.confirmPassword : "",
      phone: typeof body.phone === "string" ? body.phone.trim() : "",
      terms: Boolean(body.terms),
    };

    // 1) تحقق في السيرفر (ما نثقوش في الواجهة وحدها)
    const errors = validateRegister(normalizedBody);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    await connectDB();

    // 2) هل الإيميل موجود؟
    const exists = await User.findOne({ email: normalizedBody.email });
    if (exists) {
      return NextResponse.json(
        { errors: { email: "This email is already registered." } },
        { status: 409 }
      );
    }

    // 3) تشفير الباسورد قبل التخزين
    const hashed = await bcrypt.hash(normalizedBody.password, 10);

    await User.create({
      fullName: normalizedBody.fullName,
      email: normalizedBody.email,
      password: hashed,
      phone: normalizedBody.phone,
    });

    return NextResponse.json({ message: "Account created" }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
