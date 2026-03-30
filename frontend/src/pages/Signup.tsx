import { useAuth } from "../context/AuthContext.tsx";
import { signup } from "../api/auth.ts";

import { Link, useNavigate } from "react-router-dom";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

import PasswordStrength from "../components/pswdStrength.tsx";
import { analyzePassword } from "../utils/pswdStrength.ts";

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof schema>;

export default function SignUp() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const password = watch("password") ?? "";
  const { score } = analyzePassword(password);
  const isStrong = score >= 4;

  const mutation = useMutation<
    any, // response data (Axios)
    AxiosError,
    FormData
  >({
    mutationFn: signup,
    onSuccess: (res) => {
      login(res.data.token);
      navigate("/profile");
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  let errorMessage = "";
  if (mutation.isError) {
    const err = mutation.error;

    if (err.response?.status === 400) {
      errorMessage =
        (err.response.data as any)?.error ?? "Invalid request";
    } else {
      errorMessage = "Something went wrong. Please try again.";
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Sign Up</h2>

      <input {...register("username")} placeholder="Username" />
      {errors.username && (
        <p style={{ color: "red" }}>{errors.username.message}</p>
      )}

      <input
        type="password"
        {...register("password")}
        placeholder="Password"
      />
      {errors.password && (
        <p style={{ color: "red" }}>{errors.password.message}</p>
      )}

      {password && (
        <div style={{ width: "30%", maxWidth: "300px" }}>
          <PasswordStrength password={password} />
        </div>
      )}

      {/* Server-side error message */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <button type="submit" disabled={mutation.isPending || !isStrong}>
        {mutation.isPending ? "Signing up..." : "Sign Up"}
      </button>

      <p>
        Already have an account? <Link to="/signin">Sign in</Link>
      </p>
    </form>
  );
}