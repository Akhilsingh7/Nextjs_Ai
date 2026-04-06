import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User.model";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = user.id;

  try {
    const { acceptMessage } = await request.json();

    const updatedUser = await UserModel.findByIdAndUpdate(
      { userId },
      { isAcceptingMessage: acceptMessage },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update user status to accept messsages",
        },
        {
          status: 401,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message status acceptance updated",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("error in accepting message api", error);

    return Response.json(
      {
        success: false,
        message: "Failed to update user status to accept messsages",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = user.id;

  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 401,
        }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error in getting message acceptance  status",
      },
      {
        status: 500,
      }
    );
  }
}
