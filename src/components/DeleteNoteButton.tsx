"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { deleteNoteAction } from "@/actions/notes";

type Props = {
    noteId: string;
    deleteNoteLocally: (noteId: string) => void;
};

function DeleteNoteButton({ noteId, deleteNoteLocally }: Props) {
    const router = useRouter();
    const noteIdParam = useSearchParams().get("noteId") || "";

    const [isPending, startTransition] = useTransition();

    const handleDeleteNote = () => {
        startTransition(async () => {
            const { errorMessage } = await deleteNoteAction(noteId);

            if (!errorMessage) {
                toast.success("Note deleted successfully!");

                deleteNoteLocally(noteId);

                if (noteId === noteIdParam) {
                    router.replace("/");
                }
            } else {
                toast.error(`Error deleting note: ${errorMessage}`);
            }
        });
    };
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    className="absolute right-2 top-1/2 size-7 -translate-y-1/2 p-0 opacity-0 group-hover/item:opacity-100 [&_svg]:size-3 cursor-pointer"
                    variant="ghost"
                >
                    <Trash2 />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure you want to delete this note?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your note
                        from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteNote}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-24"
                    >
                        {isPending ? <Loader2 className="animate-spin" /> : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default DeleteNoteButton;