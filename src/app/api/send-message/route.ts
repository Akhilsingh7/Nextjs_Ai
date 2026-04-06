import dbConnect from "@/src/lib/dbConnect";
import UserModel, { Message } from "@/src/model/User.model";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import mongoose from "mongoose";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found ",
        },
        {
          status: 404,
        }
      );
    }

    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting the  messages",
        },
        {
          status: 404,
        }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.message.push(newMessage as Message);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("An unexpected erro occured: ", error);
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      {
        status: 500,
      }
    );
  }
}
