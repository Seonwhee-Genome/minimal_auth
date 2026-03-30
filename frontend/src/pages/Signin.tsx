import { signin } from "../api/auth.ts";
import { useAuth } from "../context/AuthContext.tsx";
import { useNavigate, Link } from "react-router-dom";

import { useMutation } from "@tanstack/react-query";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

// ---------------------------------------------
// Validation schema (Zod)
// Defines shape and constraints of form inputs
// ---------------------------------------------
const schema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });
  
type FormData = z.infer<typeof schema>;
  

export default function SignIn() {
  const { login } = useAuth(); // global auth state handler
  const navigate = useNavigate();

  // ---------------------------------------------
  // React Hook Form setup
  // Handles form state + integrates validation
  // ---------------------------------------------
  const {register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // ---------------------------------------------
  // React Query mutation
  // Responsible for API call + async state handling
  // ---------------------------------------------
  const mutation = useMutation<
    any,            // response data
    AxiosError,     // error type
    FormData        // variables
    >({
        mutationFn: signin,
        // On success:
        // - store token globally
        // - redirect user to protected page
        onSuccess: (res) => {
            login(res.data.token);
            navigate("/profile");
        },
    });

  // ---------------------------------------------
  // Form submit handler
  // Delegates execution to React Query mutation
  // ---------------------------------------------
  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  // ---------------------------------------------
  // Derive user-friendly error message
  // Based on server response
  // ---------------------------------------------
  let errorMessage = "";

  if (mutation.isError) {
    const err = mutation.error;

    if (err.response?.status === 401) {
      errorMessage = "Invalid username or password";
    } else {
      errorMessage = "Something went wrong. Please try again.";
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Sign In</h2>

      {/* Username input */}
      <input {...register("username")} placeholder="Username" />
      {errors.username && (
        <p style={{ color: "red" }}>{errors.username.message}</p>
      )}

      {/* Password input */}
      <input
        type="password"
        {...register("password")}
        placeholder="Password"
      />
      {errors.password && (
        <p style={{ color: "red" }}>{errors.password.message}</p>
      )}

      {/* Server-side error message */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {/* Submit button with loading state */}
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Signing in..." : "Sign In"}
      </button>

      {/* Navigation link */}
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </form>
  );
}

