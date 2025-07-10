import { prisma } from "@/db/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
 try {
   const {searchParams} = new URL(request.url);
   const userId = searchParams.get("userId")||"";

   if (!userId) {
     return NextResponse.json({
       newestNoteId: null,
       message: "User ID is required"
     }, { status: 400 });
   }

   const newestNoteId = await prisma.note.findFirst({
      where:{
          authorId: userId,
      },
      orderBy: {
          createdAt: 'desc',
      },
      select: {
          id: true,
      }
   });

   return NextResponse.json({
      newestNoteId: newestNoteId?.id,
      message: "Note fetched successfully"
   });
 } catch (error) {
   console.error("Error fetching newest note:", error);
   return NextResponse.json({
     newestNoteId: null,
     message: "Failed to fetch note"
   }, { status: 500 });
 }
}