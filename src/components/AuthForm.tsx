"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CardContent, CardFooter } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useTransition } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { loginAction, signUpAction } from "@/actions/users";

type Props = {
    type: "login" | "signUp";
}
function AuthForm(type: Props) {
    const isLogin = type.type === "login";
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formdata : FormData) => {
        startTransition (async () => {
            const email = formdata.get("email") as string;
            const password = formdata.get("password") as string;

            let errorMessage ;
            // let title;
            let description

            if(isLogin){
                errorMessage=(await loginAction(email,password)).errorMessage;
                // title = "Logged In";
                description = "You have successfully logged in";
            }else{
                errorMessage=(await signUpAction(email,password)).errorMessage;
                // title = "Signed Up";
                description = "Check your email to verify your account";
            }

            if(!errorMessage){
                toast.success(description, { duration: 2000 });
                router.replace("/");
            }else{
                toast.error(errorMessage);
            }
        });
    }

    return (
        <form action={handleSubmit}>
            <CardContent className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</Label>
                    <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="Enter your email"
                    // disabled={!isPending}
                    />
                </div>
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email" className="block text-sm font-medium text-gray-700">Password</Label>
                    <Input
                    id="passwor"
                    name="password"
                    type="password"
                    required
                    placeholder="Enter your Password"
                    // disabled={!isPending}
                    />
                </div>
            </CardContent>
            <CardFooter className="mt-4 flex flex-col gap-6">
                <Button className="w-full">
                    {isPending ? <Loader2 className="animate-spin"/> : isLogin ? "Login" : "Sign Up"}
                </Button>
                <p className="text-xs">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}{" "}
                    <Link href={isLogin ? "/sign-up" : "/login"} className={`text-blue-500 underline ${isPending ? "pointer-events-none opacity-50":""}`} >
                    {isLogin ? "Sign Up" : "Login"}
                    </Link>
                </p>
            </CardFooter>
        </form>
    )
}

export default AuthForm
