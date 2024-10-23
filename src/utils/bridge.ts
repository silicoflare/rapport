import axios from "axios";

export async function signUp(name: string, username: string, password: string) {
  const hash = (await axios.post("/api/hashpass", {
    password
  })).data.password

  const res = await axios.post(
    `/api/signup`,
    {
      username,
      name,
      password: hash,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res.data as Record<"id" | "username" | "recoveryphrase", string>
}