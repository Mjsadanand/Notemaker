"use client";
import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuid4 } from "uuid";
import { toast } from "sonner";
import { createNoteAction } from "@/actions/notes";
import { resolve } from "path";
type Props = {
  user: User | null;
}

function NewNoteButton({ user }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);


  const handleClickNewNoteButton= async ()=> {
    if (!user) {
      router.push("/login");
    } else {
      setLoading(true);

      // await new Promise((resolve)=>{
      //   setTimeout(resolve, debounceTimeout + 500);   
      // })
      const uuid = uuid4();

      await createNoteAction(uuid);

      router.push(`/?noteId=${uuid}`);
      toast.success("New note created successfully!");
    }
    setLoading(false);
  }


  return (
    <Button
      onClick={handleClickNewNoteButton}
      className="w-24"
      variant="secondary"
      disabled={loading}>
      {loading ? <Loader2 className="anime-spin" /> : "New Note"}
    </Button>
  )
}

export default NewNoteButton
