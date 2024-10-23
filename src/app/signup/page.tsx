"use client";

import { turretroad } from "@/utils/fonts";
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
import { signUp } from "@/utils/bridge";
import { useAtom } from "jotai";
import { recAtom } from "@/utils/atoms";
import { cn } from "@/lib/utils";

export default function SignUp() {
  const router = useRouter();
  const [, setPhrase] = useAtom(recAtom);

  const formSchema = z.object({
    name: z.string().min(1),
    username: z
      .string()
      .min(1)
      .refine(() => {
        return true;
      }),
    password: z.string().min(5),
    confPassword: z.string().min(5),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (data.password !== data.confPassword) {
      form.setError("confPassword", {
        message: "Passwords don't match",
      });
      return;
    }

    const res = await signUp(data.name, data.username, data.confPassword);
    setPhrase(res.recoveryphrase);
    router.push("/recphrase");
  }

  return (
    <div className="flex flex-col w-full h-full items-center justify-center gap-2">
      <h2 className={cn("text-3xl font-semibold", turretroad)}>Sign Up</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={cn("w-1/4")}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Name</FormLabel>
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
          <FormField
            control={form.control}
            name="confPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Confirm Password</FormLabel>
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
    </div>
  );
}
