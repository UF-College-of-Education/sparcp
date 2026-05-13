import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { MessageCircle, BookOpen, BarChart3, Clock, Award, User } from "lucide-react";

interface DashboardProps {
  onStartNewSession?: () => void;
}

const clearModel = [
  { letter: "C", word: "Counsel", description: "Provide medical advice and guidance", progress: 75 },
  { letter: "L", word: "Listen", description: "Actively listen to parent concerns", progress: 85 },
  { letter: "E", word: "Empathize", description: "Show understanding and compassion", progress: 60 },
  { letter: "A", word: "Answer", description: "Address the content of the question", progress: 70 },
  { letter: "R", word: "Recommend", description: "Summarize and confirm understanding", progress: 65 },
];

const recentSessions = [
  { id: 1, date: "2024-01-30", scenario: "Initial HPV Discussion", score: 85, duration: "12 min" },
  { id: 2, date: "2024-01-28", scenario: "Vaccine Hesitant Parent", score: 72, duration: "15 min" },
  { id: 3, date: "2024-01-26", scenario: "Side Effects Concern", score: 88, duration: "10 min" },
];

export function Dashboard( { onStartNewSession }: DashboardProps) {
  return (
    <main className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">SPARC-P Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Standardized Patient Avatar for Reflective Communication Practice
          </p>
        </div>
        <Button className="gap-2" onClick={onStartNewSession}>
          <MessageCircle className="w-4 h-4" />
          Start New Session
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Total Practice Time</span>
          </div>
          <div className="text-2xl font-semibold">24h 30min</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Sessions Completed</span>
          </div>
          <div className="text-2xl font-semibold">47</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Average Score</span>
          </div>
          <div className="text-2xl font-semibold">82%</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Improvement</span>
          </div>
          <div className="text-2xl font-semibold text-green-600">+15%</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* C-LEAR Model Progress */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">C-LEAR Model Progress</h2>
          </div>
          <div className="space-y-4">
            {clearModel.map((item) => (
              <div key={item.letter} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center font-semibold">
                      {item.letter}
                    </Badge>
                    <div>
                      <span className="font-medium">{item.word}</span>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium">{item.progress}%</span>
                </div>
                <Progress value={item.progress} className="h-2" />
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Sessions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Recent Sessions</h2>
            </div>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <span className="font-medium">{session.scenario}</span>
                  <p className="text-sm text-muted-foreground">{session.date} • {session.duration}</p>
                </div>
                <Badge variant={session.score >= 80 ? "default" : "secondary"}>
                  {session.score}%
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="h-20 flex-col gap-2">
            <MessageCircle className="w-6 h-6" />
            <span>New Practice Session</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2" onClick={onStartNewSession}>
            <BookOpen className="w-6 h-6" />
            <span>View Learning Materials</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <BarChart3 className="w-6 h-6" />
            <span>Detailed Reports</span>
          </Button>
        </div>
      </Card>

      
    </main>
  );
}