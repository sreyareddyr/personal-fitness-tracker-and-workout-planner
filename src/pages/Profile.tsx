import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Ruler, Weight, Calendar, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getCurrentUser, updateUserProfile, logoutUser } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string>("");
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    height: 0,
    weight: 0,
    age: 0,
  });
  const [bmi, setBmi] = useState<number>(0);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    setUserId(user.id);
    setProfileData({
      username: user.username,
      email: user.email,
      height: user.height || 0,
      weight: user.weight || 0,
      age: user.age || 0,
    });

    if (user.height && user.weight) {
      calculateBMI(user.height, user.weight);
    }
  }, [navigate]);

  const calculateBMI = (height: number, weight: number) => {
    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      const calculatedBMI = weight / (heightInMeters * heightInMeters);
      setBmi(parseFloat(calculatedBMI.toFixed(1)));
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight", color: "text-blue-500" };
    if (bmi < 25) return { category: "Normal", color: "text-success" };
    if (bmi < 30) return { category: "Overweight", color: "text-yellow-500" };
    return { category: "Obese", color: "text-destructive" };
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateUserProfile(userId, {
      height: profileData.height,
      weight: profileData.weight,
      age: profileData.age,
    });

    calculateBMI(profileData.height, profileData.weight);

    toast({
      title: "Profile updated!",
      description: "Your profile information has been saved.",
    });
  };

  const handleChange = (field: keyof typeof profileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: field === 'username' || field === 'email' ? value : parseInt(value) || 0,
    }));
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/auth");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const bmiInfo = getBMICategory(bmi);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Profile
            </h1>
            <p className="text-muted-foreground">Manage your personal information</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="username"
                        value={profileData.username}
                        className="pl-10"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        value={profileData.email}
                        className="pl-10"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <div className="relative">
                      <Ruler className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="height"
                        type="number"
                        value={profileData.height || ''}
                        onChange={(e) => handleChange('height', e.target.value)}
                        placeholder="170"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <div className="relative">
                      <Weight className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="weight"
                        type="number"
                        value={profileData.weight || ''}
                        onChange={(e) => handleChange('weight', e.target.value)}
                        placeholder="70"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="age"
                        type="number"
                        value={profileData.age || ''}
                        onChange={(e) => handleChange('age', e.target.value)}
                        placeholder="25"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                BMI Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-6">
                  <div className="inline-flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-bold">{bmi || '--'}</span>
                    <span className="text-2xl text-muted-foreground">kg/m²</span>
                  </div>
                  {bmi > 0 && (
                    <p className={`text-lg font-semibold ${bmiInfo.color}`}>
                      {bmiInfo.category}
                    </p>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Underweight</span>
                    <span className="text-muted-foreground">&lt; 18.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Normal</span>
                    <span className="text-muted-foreground">18.5 - 24.9</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Overweight</span>
                    <span className="text-muted-foreground">25 - 29.9</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Obese</span>
                    <span className="text-muted-foreground">&gt; 30</span>
                  </div>
                </div>

                {!profileData.height || !profileData.weight ? (
                  <p className="text-sm text-muted-foreground text-center">
                    Enter your height and weight to calculate BMI
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
