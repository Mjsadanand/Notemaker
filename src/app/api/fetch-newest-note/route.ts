import { prisma } from "@/db/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
 const {searchParams} = new URL(request.url);
 const userId = searchParams.get("userId")||"";

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
}