import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "your email";

  return (
    <Layout>
      <section className="min-h-[80vh] flex items-center justify-center py-16 px-4">
        <Card className="w-full max-w-md border-border/50 shadow-lg text-center">
          <CardHeader>
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-display">Check your inbox</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              We have sent you a verification email to <span className="font-medium text-foreground">{email}</span>. Please verify it and log in.
            </p>
            <Button onClick={() => navigate("/login")} className="w-full">
              Login
            </Button>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
};

export default VerifyEmail;
