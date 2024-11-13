"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignUp() {
  const router = useRouter();

  const formSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(5),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const res = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    if (res && res.ok) {
      router.push("/chats");
    } else {
      form.setError("username", { message: "Username or password is invalid" });
      form.setError("password", { message: "Username or password is invalid" });
    }
  }

  return (
    <div className="flex flex-col w-full h-full items-center justify-center gap-2">
      <h2 className="text-3xl font-semibold font-header">Login</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={cn("w-1/4")}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <br />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <br />
          <div className="w-full flex items-center justify-center">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
      <div className="w-full text-center mt-10">
        <Link href="/recover" className="underline">
          Forgot password?
        </Link>
      </div>
    </div>
  );
}
