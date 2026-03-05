import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ClearModules } from "../components/resources/ClearModules";
import type { Module, ResourceListing, Video } from "../types";
import { VideoIndex } from "../components/resources/VideoIndex";
import { MoreResources } from "../components/resources/MoreResources";

const clearModules: Module[] = [
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

const videos: Video[] = [
  {
    id: 1,
    title: "The Concerned Parent",
    description: "Parent worried about vaccine safety after reading online articles",
    url: "https://vimeo.com/1138936606?share=copy&fl=sv&fe=ci",
    duration: "10-15 min",
    skills: ["Listen", "Empathize", "Counsel"],
    host: "Vimeo",
    embedCode: '<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1138936606?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" referrerpolicy="strict-origin-when-cross-origin" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Discover UF\'s Education Impact in 2025"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>'
  },
  {
    id: 2,
    title: "The Hesitant Family",
    description: "Family with religious or philosophical objections to vaccination",
    url: "https://vimeo.com/1138936606?share=copy&fl=sv&fe=ci",
    duration: "15-20 min",
    skills: ["Answer", "Restate", "Counsel"],
    host: "Vimeo",
    embedCode: '<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1138936606?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" referrerpolicy="strict-origin-when-cross-origin" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Discover UF\'s Education Impact in 2025"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>'
  },
  {
    id: 3,
    title: "The Research-Heavy Parent",
    description: "Parent who has done extensive research and wants detailed discussion",
    url: "https://vimeo.com/1138936606?share=copy&fl=sv&fe=ci",
    duration: "20-25 min",
    skills: ["Listen", "Counsel", "Restate"],
    host: "Vimeo",
    embedCode: '<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1138936606?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" referrerpolicy="strict-origin-when-cross-origin" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Discover UF\'s Education Impact in 2025"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>'
  }
];

const resourceListings: ResourceListing[] = [
  {
    id: 1,
    title: "Link Title",
    url: "https://education.ufl.edu",
    type: "link",
    category: "research",
  },
  {
    id: 2,
    title: "Doc Title",
    url: "https://education.ufl.edu",
    type: "document",
    category: "community",
  }
];

export function Resources() {
  return (
    <div className="p-6 space-y-6 w-full">
      <div>
        <h1 className="text-3xl font-semibold">Learning Resources</h1>
        <p className="text-muted-foreground mt-1">
          Master the C-LEAR communication model for effective HPV discussions
        </p>
      </div>

      <Tabs defaultValue="modules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="modules">C-LEAR Modules</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="resources">Additional Resources</TabsTrigger>
        </TabsList>

        <ClearModules modules={clearModules}></ClearModules>
        <VideoIndex videos={videos} ></VideoIndex>
        <MoreResources resources={resourceListings} ></MoreResources>

      </Tabs>
    </div>
  );
}