import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User.model";
import { error } from "console";
import { decode } from "punycode";
import { use } from "react";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    const decodeUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({
      username: decodeUsername,
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Usern not found",
        },
        {
          status: 400,
        }
      );
    }

    const isCodeValid = user.verifyCode == code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;

      await user.save();

      return Response.json(
        {
          success: true,
          message: "Account verified suuccefully",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code has expired . Please signup again to get a new code",
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.log("Error in verifying username", error);
    return Response.json(
      {
        success: false,
        message: "Error in verifying code",
      },
      {
        status: 500,
      }
    );
  }
}
