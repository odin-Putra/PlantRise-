import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [signInErrors, setSignInErrors] = useState({ email: "", password: "" });
  const [signUpErrors, setSignUpErrors] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSignInChange = (field: string, value: string) => {
    setSignInData((prev) => ({ ...prev, [field]: value }));
    let error = "";
    if (field === "email" && value && !validateEmail(value)) {
      error = "Invalid email address";
    }
    if (field === "password" && value && !validatePassword(value)) {
      error = "Password must be at least 6 characters";
    }
    setSignInErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSignUpChange = (field: string, value: string) => {
    setSignUpData((prev) => ({ ...prev, [field]: value }));
    let error = "";
    if (field === "email" && value && !validateEmail(value)) {
      error = "Invalid email address";
    }
    if (field === "password" && value && !validatePassword(value)) {
      error = "Password must be at least 6 characters";
    }
    if (field === "confirmPassword" && value && value !== signUpData.password) {
      error = "Passwords do not match";
    }
    // Also re-validate confirm password if password changes
    if (field === "password" && signUpData.confirmPassword && value !== signUpData.confirmPassword) {
      setSignUpErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
    } else if (field === "password" && signUpData.confirmPassword && value === signUpData.confirmPassword) {
      setSignUpErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }

    setSignUpErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInData.email || !signInData.password) {
      toast({ title: "Missing fields", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    if (signInErrors.email || signInErrors.password) {
      toast({ title: "Invalid fields", description: "Please fix the errors before signing in.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, signInData.email, signInData.password);
      navigate("/profile");
    } catch {
      toast({ title: "Sign in failed", description: "Email or password is incorrect", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpData.name || !signUpData.email || !signUpData.password || !signUpData.confirmPassword) {
      toast({ title: "Missing fields", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    if (signUpErrors.email || signUpErrors.password || signUpErrors.confirmPassword) {
      toast({ title: "Invalid fields", description: "Please fix the errors before signing up.", variant: "destructive" });
      return;
    }
    if (signUpData.password !== signUpData.confirmPassword) {
      toast({ title: "Password mismatch", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, signUpData.email, signUpData.password);
      navigate("/profile");
    } catch (error) {
      const err = error as { code?: string; message?: string };
      if (err?.code === "auth/email-already-in-use") {
        toast({ title: "Sign up failed", description: "User already exists. Please sign in", variant: "destructive" });
      } else {
        toast({ title: "Sign up failed", description: err?.message || "Something went wrong", variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="min-h-[80vh] flex items-center justify-center py-16 px-4">
        <Card className="w-full max-w-md border-border/50 shadow-lg">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-2xl font-display">Welcome to Plantrise</CardTitle>
            <CardDescription>Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="you@example.com"
                        className={`pl-10 ${signInErrors.email ? "border-destructive" : ""}`}
                        value={signInData.email}
                        onChange={(e) => handleSignInChange("email", e.target.value)}
                      />
                    </div>
                    {signInErrors.email && <p className="text-xs text-destructive">{signInErrors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`pl-10 pr-10 ${signInErrors.password ? "border-destructive" : ""}`}
                        value={signInData.password}
                        onChange={(e) => handleSignInChange("password", e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {signInErrors.password && <p className="text-xs text-destructive">{signInErrors.password}</p>}
                  </div>
                  <div className="flex justify-end">
                    <button type="button" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </button>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        className="pl-10"
                        value={signUpData.name}
                        onChange={(e) => handleSignUpChange("name", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        className={`pl-10 ${signUpErrors.email ? "border-destructive" : ""}`}
                        value={signUpData.email}
                        onChange={(e) => handleSignUpChange("email", e.target.value)}
                      />
                    </div>
                    {signUpErrors.email && <p className="text-xs text-destructive">{signUpErrors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`pl-10 pr-10 ${signUpErrors.password ? "border-destructive" : ""}`}
                        value={signUpData.password}
                        onChange={(e) => handleSignUpChange("password", e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {signUpErrors.password && <p className="text-xs text-destructive">{signUpErrors.password}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-confirm"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`pl-10 ${signUpErrors.confirmPassword ? "border-destructive" : ""}`}
                        value={signUpData.confirmPassword}
                        onChange={(e) => handleSignUpChange("confirmPassword", e.target.value)}
                      />
                    </div>
                    {signUpErrors.confirmPassword && <p className="text-xs text-destructive">{signUpErrors.confirmPassword}</p>}
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
};

export default Login;
