"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { recoverAccount, resetPassword } from "./actions";
import { toast } from "sonner";
import { useState } from "react";
import { useAtom } from "jotai";
import { recAtom } from "@/utils/atoms";
import { useRouter } from "next/navigation";

export default function Recover() {
  const [disabled, setDisabled] = useState(false);
  const [, setPhrase] = useAtom(recAtom);
  const router = useRouter();

  const schema = z.object({
    username: z.string().min(1, "Username is required"),
    recphrase: z.string().min(1, "Recovery phrase is required"),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      recphrase: "",
    },
  });

  const resetSchema = z.object({
    username: z.string(),
    recphrase: z.string(),
    password: z.string().min(1, "Password is required"),
    confpass: z.string().min(1, "Re-enter password"),
  });

  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      username: "",
      recphrase: "",
      password: "",
      confpass: "",
    },
  });

  async function onSubmit(data: z.infer<typeof schema>) {
    const res = await recoverAccount(data.username, data.recphrase);

    switch (res) {
      case 404:
        toast.error(`User "${data.username}" not found!`);
        break;

      case 401:
        toast.error("Wrong recovery phrase");
        break;

      case 200:
        setDisabled((old) => true);
        resetForm.setValue("username", data.username);
        resetForm.setValue("recphrase", data.recphrase);
        break;
    }
  }

  async function resetSubmit(data: z.infer<typeof resetSchema>) {
    if (data.password !== data.confpass) {
      resetForm.setError("confpass", { message: "Passwords don't match" });
      return;
    }

    const res = await resetPassword(
      data.username,
      data.recphrase,
      data.password
    );

    setPhrase(res.message);
    router.push("/recphrase");
  }

  return (
    <div className="flex flex-col w-full h-full items-center justify-center gap-2">
      <h2 className="text-3xl font-semibold font-header">Recover Account</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Username</FormLabel>
                <FormControl>
                  <Input {...field} disabled={disabled} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <br />
          <FormField
            control={form.control}
            name="recphrase"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Recovery phrase</FormLabel>
                <FormControl>
                  <Textarea
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <br />
          {!disabled && (
            <div className="w-full flex items-center justify-center">
              <Button type="submit">Submit</Button>
            </div>
          )}
        </form>
      </Form>
      {disabled && (
        <Form {...resetForm}>
          <form
            onSubmit={resetForm.handleSubmit(resetSubmit)}
            className="w-1/4">
            <FormField
              control={resetForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <br />
            <FormField
              control={resetForm.control}
              name="confpass"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Confirm password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
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
      )}
    </div>
  );
}
