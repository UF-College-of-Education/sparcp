import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Play, 
  Download, 
  CheckCircle, 
  Clock,
  Users,
  MessageSquare,
  Heart,
  Search,
  ArrowRight
} from "lucide-react";

const clearModules = [
  {
    id: "counsel",
    letter: "C",
    title: "Counsel",
    description: "Learn to provide clear, evidence-based medical guidance about HPV vaccination",
    duration: "15 min",
    completed: true,
    content: {
      keyPoints: [
        "Present HPV vaccine as cancer prevention",
        "Use clear, jargon-free language",
        "Provide specific recommendations based on guidelines",
        "Address timing and dosing clearly"
      ],
      examples: [
        "I recommend the HPV vaccine for your child because it prevents cancers later in life.",
        "The vaccine is most effective when given at age 11-12, before exposure to HPV."
      ]
    }
  },
  {
    id: "listen",
    letter: "L",
    title: "Listen",
    description: "Master active listening techniques to understand parent concerns fully",
    duration: "12 min",
    completed: true,
    content: {
      keyPoints: [
        "Give parents your full attention",
        "Use verbal and non-verbal encouragement",
        "Ask open-ended questions",
        "Avoid interrupting"
      ],
      examples: [
        "Tell me more about your concerns with the HPV vaccine.",
        "What have you heard about this vaccine that worries you?"
      ]
    }
  },
  {
    id: "empathize",
    letter: "E",
    title: "Empathize",
    description: "Develop skills to show genuine understanding and compassion",
    duration: "10 min",
    completed: false,
    content: {
      keyPoints: [
        "Acknowledge emotional responses",
        "Show understanding without agreement",
        "Use reflective statements",
        "Validate parental instincts"
      ],
      examples: [
        "I can see that you're really concerned about your child's safety.",
        "It's natural to feel worried when making health decisions for your child."
      ]
    }
  },
  {
    id: "answer",
    letter: "A",
    title: "Answer",
    description: "Learn to recognize and validate parent feelings and concerns",
    duration: "8 min",
    completed: false,
    content: {
      keyPoints: [
        "Verbally recognize concerns",
        "Validate emotions without dismissing",
        "Show respect for parental role",
        "Acknowledge difficulty of decision"
      ],
      examples: [
        "I hear that you're concerned about side effects.",
        "You're being a thoughtful parent by asking these questions."
      ]
    }
  },
  {
    id: "restate",
    letter: "R",
    title: "Restate",
    description: "Practice summarizing to ensure mutual understanding",
    duration: "7 min",
    completed: false,
    content: {
      keyPoints: [
        "Summarize key concerns heard",
        "Check for accuracy",
        "Clarify misunderstandings",
        "Confirm mutual understanding"
      ],
      examples: [
        "Let me make sure I understand - you're worried about...",
        "So your main concerns are about safety and timing, is that right?"
      ]
    }
  }
];

const scenarios = [
  {
    id: 1,
    title: "The Concerned Parent",
    description: "Parent worried about vaccine safety after reading online articles",
    difficulty: "Beginner",
    duration: "10-15 min",
    skills: ["Listen", "Empathize", "Counsel"]
  },
  {
    id: 2,
    title: "The Hesitant Family",
    description: "Family with religious or philosophical objections to vaccination",
    difficulty: "Intermediate",
    duration: "15-20 min",
    skills: ["Answer", "Restate", "Counsel"]
  },
  {
    id: 3,
    title: "The Research-Heavy Parent",
    description: "Parent who has done extensive research and wants detailed discussion",
    difficulty: "Advanced",
    duration: "20-25 min",
    skills: ["Listen", "Counsel", "Restate"]
  }
];

export function LearningResources() {
  const [selectedModule, setSelectedModule] = useState(clearModules[0]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Learning Resources</h1>
        <p className="text-muted-foreground mt-1">
          Master the C-LEAR communication model for effective HPV discussions
        </p>
      </div>

      <Tabs defaultValue="modules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="modules">C-LEAR Modules</TabsTrigger>
          <TabsTrigger value="scenarios">Practice Scenarios</TabsTrigger>
          <TabsTrigger value="resources">Additional Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              {clearModules.map((module) => (
                <Card 
                  key={module.id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedModule.id === module.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedModule(module)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-semibold">
                      {module.letter}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{module.title}</h3>
                        {module.completed && <CheckCircle className="w-4 h-4 text-green-600" />}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {module.duration}
                        </div>
                        <Badge variant={module.completed ? "default" : "secondary"} className="text-xs">
                          {module.completed ? "Completed" : "Not Started"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-semibold text-lg">
                    {selectedModule.letter}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold">{selectedModule.title}</h2>
                    <p className="text-muted-foreground">{selectedModule.description}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Key Learning Points
                    </h3>
                    <ul className="space-y-2">
                      {selectedModule.content.keyPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Example Phrases
                    </h3>
                    <div className="space-y-2">
                      {selectedModule.content.examples.map((example, idx) => (
                        <div key={idx} className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-sm italic">"{example}"</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button className="gap-2">
                      <Play className="w-4 h-4" />
                      Start Module
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Download className="w-4 h-4" />
                      Download Guide
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map((scenario) => (
              <Card key={scenario.id} className="p-6">
                <h3 className="font-semibold text-lg mb-2">{scenario.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{scenario.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Difficulty:</span>
                    <Badge variant={scenario.difficulty === "Beginner" ? "secondary" : 
                                 scenario.difficulty === "Intermediate" ? "default" : "destructive"}>
                      {scenario.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{scenario.duration}</span>
                  </div>
                  
                  <div>
                    <span className="text-sm text-muted-foreground mb-2 block">Key Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {scenario.skills.map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-4 gap-2">
                  <Play className="w-4 h-4" />
                  Practice Scenario
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Research & Guidelines
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm">CDC HPV Vaccination Guidelines</span>
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm">AAP HPV Communication Toolkit</span>
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm">Parent Education Materials</span>
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Community & Support
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm">Discussion Forums</span>
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm">Expert Webinars</span>
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm">Peer Learning Groups</span>
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}