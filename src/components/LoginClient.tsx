"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/lib/store";
type AppDispatch = typeof store.dispatch;
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { loginUser, resetActionStatus } from "@/lib/features/users/userSlice";

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { userInfo, actionStatus, error } = useSelector((state: RootState) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isLoading = actionStatus === "loading";

  useEffect(() => {
    if (userInfo) {
      switch (userInfo.role) {
        case "admin": router.push("/admin"); break;
        case "professional":
        case "contractor": router.push("/professional"); break;
        case "seller": router.push("/seller"); break;
        case "user": router.push("/"); break;
        default:
          toast.error("Your account type is not authorized to login to this platform.");
      }
    }
  }, [userInfo, router]);

  useEffect(() => {
    if (actionStatus === "succeeded" && userInfo) {
      if (["user", "admin", "professional", "seller", "contractor"].includes(userInfo.role)) {
        switch (userInfo.role) {
          case "admin":
            toast.success("Admin login successful! Redirecting...");
            setTimeout(() => router.push("/admin"), 1000);
            break;
          case "professional":
          case "contractor":
            toast.success(`${userInfo.role.charAt(0).toUpperCase() + userInfo.role.slice(1)} login successful! Redirecting...`);
            setTimeout(() => router.push("/professional"), 1000);
            break;
          case "seller":
            toast.success("Seller login successful! Redirecting...");
            setTimeout(() => router.push("/seller"), 1000);
            break;
          case "user":
          default:
            toast.success("Login successful! Redirecting...");
            setTimeout(() => router.push("/"), 1000);
        }
      } else {
        toast.error("Your account type is not authorized to access this platform.");
        dispatch(resetActionStatus());
      }
    }
    if (actionStatus === "failed" && error) {
      toast.error(error);
      dispatch(resetActionStatus());
    }
  }, [actionStatus, userInfo, error, router, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in both email and password.");
      return;
    }
    (dispatch as AppDispatch)(loginUser({ email, password }));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500" aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Logging in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot your password?
            </Link>
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-semibold">
                Register here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;
