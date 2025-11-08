import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Droplets, Flame, Moon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getCurrentUser, getTodayTrackerData, logTrackerData, updateTrackerData } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

const FitnessTracker = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string>("");
  const [trackerData, setTrackerData] = useState({
    steps: 0,
    water: 0,
    calories: 0,
    sleep: 0,
  });
  const [trackerId, setTrackerId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const user = getCurrentUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      setUserId(user.id);
      const today = await getTodayTrackerData(user.id);
      if (today) {
        setTrackerData({
          steps: today.steps,
          water: today.water,
          calories: today.calories,
          sleep: today.sleep,
        });
        setTrackerId(today.id);
      }
    };

    loadData();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const today = new Date().toISOString().split('T')[0];
    const data = {
      userId,
      ...trackerData,
      date: today,
    };

    try {
      if (trackerId) {
        await updateTrackerData(trackerId, data);
        toast({
          title: "Progress updated!",
          description: "Your daily fitness data has been updated.",
        });
      } else {
        const newData = await logTrackerData(data);
        setTrackerId(newData.id);
        toast({
          title: "Progress logged!",
          description: "Your daily fitness data has been recorded.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save data. Please make sure the backend is running.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (field: keyof typeof trackerData, value: string) => {
    setTrackerData(prev => ({
      ...prev,
      [field]: parseInt(value) || 0,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Fitness Tracker
          </h1>
          <p className="text-muted-foreground">Log your daily activities and monitor your progress</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="steps">Steps Today</Label>
                  <Input
                    id="steps"
                    type="number"
                    value={trackerData.steps}
                    onChange={(e) => handleChange('steps', e.target.value)}
                    placeholder="10000"
                    min="0"
                  />
                  <p className="text-sm text-muted-foreground">Goal: 10,000 steps</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-secondary" />
                  Water Intake
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="water">Glasses of Water</Label>
                  <Input
                    id="water"
                    type="number"
                    value={trackerData.water}
                    onChange={(e) => handleChange('water', e.target.value)}
                    placeholder="8"
                    min="0"
                  />
                  <p className="text-sm text-muted-foreground">Goal: 8 glasses</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-destructive" />
                  Calories Burned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={trackerData.calories}
                    onChange={(e) => handleChange('calories', e.target.value)}
                    placeholder="2000"
                    min="0"
                  />
                  <p className="text-sm text-muted-foreground">Goal: 2,000 kcal</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="w-5 h-5 text-secondary" />
                  Sleep
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="sleep">Hours of Sleep</Label>
                  <Input
                    id="sleep"
                    type="number"
                    value={trackerData.sleep}
                    onChange={(e) => handleChange('sleep', e.target.value)}
                    placeholder="8"
                    min="0"
                    max="24"
                    step="0.5"
                  />
                  <p className="text-sm text-muted-foreground">Goal: 8 hours</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex justify-center">
            <Button type="submit" size="lg" className="w-full md:w-auto px-12">
              {trackerId ? "Update Today's Data" : "Log Today's Data"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FitnessTracker;
