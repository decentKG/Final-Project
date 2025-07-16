import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileText, Building2, Users, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthContext";

function extractNameFromEmail(email: string) {
  if (!email) return "User";
  const namePart = email.split("@")[0];
  return namePart
    .replace(/[._-]+/g, ' ')
    .split(' ')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setIsAuthenticated, setUser } = useAuth();

  const [signUpData, setSignUpData] = useState({
    userType: "applicant" as "applicant" | "company",
    // Common fields
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    // Applicant fields
    firstName: "",
    lastName: "",
    phone: "",
    // Company fields
    companyName: "",
    industry: "",
    employeeCount: "",
    contactPerson: ""
  });

  const [signInData, setSignInData] = useState({
    email: "",
    password: ""
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (signUpData.password !== signUpData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (!signUpData.agreeToTerms) {
      toast({
        title: "Error",
        description: "Please agree to the Terms of Service and Privacy Policy",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      const newUser = {
        id: Date.now().toString(),
        email: signUpData.email,
        role: signUpData.userType,
        name: signUpData.userType === 'applicant' 
          ? `${signUpData.firstName} ${signUpData.lastName}`
          : signUpData.contactPerson || extractNameFromEmail(signUpData.email),
        companyName: signUpData.userType === 'company' ? signUpData.companyName : undefined,
        industry: signUpData.userType === 'company' ? signUpData.industry : undefined,
        profileComplete: false
      };

      setUser(newUser);
      setIsAuthenticated(true);
      
      toast({
        title: "Success!",
        description: `Your ${signUpData.userType} account has been created successfully. Welcome to C-Resume!`
      });
      
      setIsLoading(false);
      
      // Navigate based on user type
      navigate("/");
    }, 2000);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call - determine user type based on email domain or stored data
    setTimeout(() => {
      // For demo purposes, determine role based on email
      const isCompanyEmail = signInData.email.includes('company') || signInData.email.includes('corp') || signInData.email.includes('inc');
      const role = isCompanyEmail ? 'company' : 'applicant';
      
      const user = {
        id: Date.now().toString(),
        email: signInData.email,
        role: role as 'applicant' | 'company',
        name: extractNameFromEmail(signInData.email),
        companyName: role === 'company' ? 'Demo Company' : undefined,
        industry: role === 'company' ? 'Technology' : undefined,
        profileComplete: true
      };

      setUser(user);
      setIsAuthenticated(true);
      
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully."
      });
      
      setIsLoading(false);
      
      // Navigate based on user type
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin" className="text-sm">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="text-sm">Sign Up</TabsTrigger>
            </TabsList>

            {/* Sign In Form */}
            <TabsContent value="signin">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-xl">Sign in to your account</CardTitle>
                <CardDescription>
                  Enter your credentials to access your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        value={signInData.email}
                        onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                        value={signInData.password}
                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <Label htmlFor="remember" className="text-sm">Remember me</Label>
                    </div>
                    <Button variant="link" className="text-sm p-0 h-auto">
                      Forgot Password?
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            {/* Sign Up Form */}
            <TabsContent value="signup">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-xl">Create your account</CardTitle>
                <CardDescription>
                  Join C-Resume as an applicant or company
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  {/* User Type Selection */}
                  <div className="space-y-3">
                    <Label>I am a:</Label>
                    <RadioGroup
                      value={signUpData.userType}
                      onValueChange={(value: "applicant" | "company") => 
                        setSignUpData({ ...signUpData, userType: value })
                      }
                      className="flex space-x-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="applicant" id="applicant" />
                        <Label htmlFor="applicant" className="flex items-center cursor-pointer">
                          <User className="w-4 h-4 mr-2" />
                          Job Applicant
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="company" id="company" />
                        <Label htmlFor="company" className="flex items-center cursor-pointer">
                          <Building2 className="w-4 h-4 mr-2" />
                          Company
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Conditional Fields Based on User Type */}
                  {signUpData.userType === 'applicant' ? (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First Name</Label>
                          <Input
                            id="first-name"
                            type="text"
                            placeholder="John"
                            value={signUpData.firstName}
                            onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last Name</Label>
                          <Input
                            id="last-name"
                            type="text"
                            placeholder="Doe"
                            value={signUpData.lastName}
                            onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={signUpData.phone}
                          onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="company-name">Company Name</Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="company-name"
                            type="text"
                            placeholder="Your Company Name"
                            className="pl-10"
                            value={signUpData.companyName}
                            onChange={(e) => setSignUpData({ ...signUpData, companyName: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contact-person">Contact Person</Label>
                        <Input
                          id="contact-person"
                          type="text"
                          placeholder="Your Full Name"
                          value={signUpData.contactPerson}
                          onChange={(e) => setSignUpData({ ...signUpData, contactPerson: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Select
                          value={signUpData.industry}
                          onValueChange={(value) => setSignUpData({ ...signUpData, industry: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your industry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="consulting">Consulting</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="employee-count">Number of Employees</Label>
                        <div className="relative">
                          <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Select
                            value={signUpData.employeeCount}
                            onValueChange={(value) => setSignUpData({ ...signUpData, employeeCount: value })}
                          >
                            <SelectTrigger className="pl-10">
                              <SelectValue placeholder="Select company size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-10">1-10 employees</SelectItem>
                              <SelectItem value="11-50">11-50 employees</SelectItem>
                              <SelectItem value="51-200">51-200 employees</SelectItem>
                              <SelectItem value="201-500">201-500 employees</SelectItem>
                              <SelectItem value="501-1000">501-1000 employees</SelectItem>
                              <SelectItem value="1000+">1000+ employees</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Common Fields */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="pl-10 pr-10"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="pl-10 pr-10"
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={signUpData.agreeToTerms}
                      onCheckedChange={(checked) => setSignUpData({ ...signUpData, agreeToTerms: checked as boolean })}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the{" "}
                      <Button variant="link" className="text-sm p-0 h-auto underline">
                        Terms of Service
                      </Button>
                      {" "}and{" "}
                      <Button variant="link" className="text-sm p-0 h-auto underline">
                        Privacy Policy
                      </Button>
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2025 Changed Technologies. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Button variant="link" className="text-xs p-0 h-auto text-gray-500">
              Privacy Policy
            </Button>
            <Button variant="link" className="text-xs p-0 h-auto text-gray-500">
              Terms of Service
            </Button>
            <Button variant="link" className="text-xs p-0 h-auto text-gray-500">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;