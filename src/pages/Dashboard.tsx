import { useState, useEffect } from "react";
import { Activity, Flame, Trophy, Droplets, Moon, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getCurrentUser, getTodayTrackerData, getWorkouts } from "@/lib/storage";
import { getRandomQuote } from "@/lib/quotes";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = useState("");
  const [todayData, setTodayData] = useState({ steps: 0, water: 0, calories: 0, sleep: 0 });
  const [workoutStreak, setWorkoutStreak] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const user = getCurrentUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      setQuote(getRandomQuote());
      
      const today = await getTodayTrackerData(user.id);
      if (today) {
        setTodayData(today);
      }

      // Calculate workout streak (simplified)
      const workouts = await getWorkouts(user.id);
      const recentWorkouts = workouts.filter(w => {
        const workoutDate = new Date(w.date);
        const daysAgo = Math.floor((Date.now() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysAgo < 7;
      });
      setWorkoutStreak(recentWorkouts.length);
    };

    loadData();
  }, [navigate]);

  const stepsGoal = 10000;
  const waterGoal = 8;
  const caloriesGoal = 2000;
  const sleepGoal = 8;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back! Here's your fitness overview for today.</p>
        </div>

        {/* Motivational Quote */}
        <Card className="border-none bg-gradient-to-r from-primary to-secondary text-white shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <TrendingUp className="w-8 h-8 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium opacity-90 mb-1">Daily Motivation</p>
                <p className="text-xl font-semibold leading-relaxed">{quote}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            icon={Activity}
            label="Steps Today"
            value={todayData.steps.toLocaleString()}
            unit={`/ ${stepsGoal.toLocaleString()}`}
            gradient="from-primary to-accent"
          />
          <StatsCard
            icon={Flame}
            label="Calories Burned"
            value={todayData.calories}
            unit="kcal"
            gradient="from-destructive to-primary"
          />
          <StatsCard
            icon={Trophy}
            label="Workout Streak"
            value={workoutStreak}
            unit="days"
            gradient="from-success to-secondary"
          />
          <StatsCard
            icon={Droplets}
            label="Water Intake"
            value={todayData.water}
            unit={`/ ${waterGoal} glasses`}
            gradient="from-secondary to-primary"
          />
        </div>

        {/* Progress Trackers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Daily Goals Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Steps</span>
                  <span className="text-muted-foreground">
                    {todayData.steps} / {stepsGoal}
                  </span>
                </div>
                <Progress value={(todayData.steps / stepsGoal) * 100} className="h-3" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Water</span>
                  <span className="text-muted-foreground">
                    {todayData.water} / {waterGoal} glasses
                  </span>
                </div>
                <Progress value={(todayData.water / waterGoal) * 100} className="h-3" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Calories</span>
                  <span className="text-muted-foreground">
                    {todayData.calories} / {caloriesGoal} kcal
                  </span>
                </div>
                <Progress value={(todayData.calories / caloriesGoal) * 100} className="h-3" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-secondary" />
                Sleep & Recovery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <div className="inline-flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-bold">{todayData.sleep}</span>
                    <span className="text-2xl text-muted-foreground">hours</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Last night's sleep</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Sleep Goal</span>
                    <span className="text-muted-foreground">{sleepGoal} hours</span>
                  </div>
                  <Progress value={(todayData.sleep / sleepGoal) * 100} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
