import { useState } from "react";
import { signIn } from "@core/SupabaseAuth";
import { Stack } from "@components/Stack";
import styles from "@components/SupabaseLogin.module.css";

export default function SupabaseLogin() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    const { error } = await signIn(email, password);
    if (error) alert(error.message);
  };

  return (
    <div className={styles.root}>
      <Stack row>
        <p>Email</p>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Stack>
      <Stack row>
        <p>Password</p>
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Stack>

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}