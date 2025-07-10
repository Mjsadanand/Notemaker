"use client"

import { Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react";
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { logOutAction } from "@/actions/users";

function LogoutButton() {
  const [loading, setLoading] = useState(false);
   const router = useRouter();
  const handleLogOut = async ()=> {
    setLoading(true);

    const {errorMessage} = await logOutAction();

    if(!errorMessage) {
      toast("Logged out successfully. You have been logged out.");
      router.push("/");
    }else{
        toast.error("Error logging out. Please try again.");
    }
    
    setLoading(false);
  }

  return (
    <div>
      <Button 
      onClick={handleLogOut}
      variant={"outline"}
      disabled={loading}
      className="w-24"
      >{loading ? <Loader2 className="animate-spin"/> : "Log Out"}
      </Button>
    </div>
  )
}

export default LogoutButton
