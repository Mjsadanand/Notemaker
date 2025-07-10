import { getUser } from "@/auth/server";
import AskAIButton from "@/components/AskAIButton";
import NewNoteButton from "@/components/NewNoteButton";
import NoteTextInput from "@/components/NoteTextInput";
import { prisma } from "@/db/prisma";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
async function HomePage({ searchParams }: Props) {
  const noteIdParam = (await searchParams).noteId
  const user = await getUser();

  const noteId = Array.isArray(noteIdParam)
    ? noteIdParam[0]
    : noteIdParam || "";

  let note = null;
  try {
    note = await prisma.note.findUnique({
      where: {
        id: noteId,
        authorId: user?.id,
      },
    });
  } catch (error) {
    console.error("Error fetching note:", error);
    // Continue with null note, which will result in empty text input
  }

  return (
    <div className="flex h-full items-center flex-col gap-4">
      <div className="flex w-full max-w-4xl justify-end gap-2">
        <AskAIButton user={user} />
        <NewNoteButton user={user} />
      </div>

      <NoteTextInput noteId={noteId} startingNoteText={note?.text || ""} />
    </div>
  )
}

export default HomePage
