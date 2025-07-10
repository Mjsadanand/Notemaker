import { prisma } from "@/db/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
 try {
   const {searchParams} = new URL(request.url);
   const userId = searchParams.get("userId")||"";

   if (!userId) {
     return NextResponse.json({
       noteId: null,
       message: "User ID is required"
     }, { status: 400 });
   }

   const {id} = await prisma.note.create({
      data:{
          authorId: userId,
          text: "",
      }
   });

   return NextResponse.json({
      noteId: id,
      message: "Note created successfully"
   });
 } catch (error) {
   console.error("Error creating note:", error);
   return NextResponse.json({
     noteId: null,
     message: "Failed to create note"
   }, { status: 500 });
 }
}