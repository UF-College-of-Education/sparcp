import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ClearModules } from "../components/resources/ClearModules";
import type { Module, ResourceListing, Video } from "../types";
import { VideoIndex } from "../components/resources/VideoIndex";
import { MoreResources } from "../components/resources/MoreResources";
import { processVimeoEmbedCode } from "../lib/utils";

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
        "Present HPV vaccine as cancer prevention against 6 types of cancer",
        "Use clear, jargon-free language",
        "Provide specific recommendations based on guidelines",
        "Address timing and dosing clearly"
      ],
      examples: [
        "We have a vaccine for 9-year-olds that prevents against six types of cancer. I recommend they get this safe vaccine today and then come back in 6 to 12 months to get the second dose.",
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
        "Restate parents' concerns to ensure understanding",
        "Explore parents' concerns with open ended questions",
        "Give parents your full attention",
        "Use verbal and non-verbal encouragement",
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
    title: "Empathy",
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
    id: "recommend",
    letter: "R",
    title: "Recommend",
    description: "Make a strong recommendation",
    duration: "1 min",
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

const video1 = processVimeoEmbedCode('');
const video2 = processVimeoEmbedCode('');
const video3 = processVimeoEmbedCode('');

const videos: Video[] = [
  {
    id: 1,
    title: "Welcome Video",
    description: "Simulated Patient Educator Kennan DeGruccio, LSW provides an introduction to SPARC training method and the C-LEAR approach.",
    url: `https://vimeo.com/1183789256/58df34ea06?share=copy&fl=cl&fe=ci`,
    duration: "2:43",
    skills: ["SPARC", "C-LEAR Approach"],
    host: "Vimeo",
    embedCode: '<iframe src="https://player.vimeo.com/video/1175286017?h=af884888a7&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" referrerpolicy="strict-origin-when-cross-origin" width="450" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="SPARC Website Welcome Video"></iframe>'
  },
  {
    id: 2,
    title: "How to Talk to Parents About the HPV Vaccine: The C-LEAR Approach",
    description: "Learn how to use the C-LEAR Approach to discuss the HPV Vaccine with parents.",
    url: "https://vimeo.com/1185190523/e3adf950be?share=copy&fl=cl&fe=ci",
    duration: "26:05",
    skills: ["C-LEAR Approach", "Counsel", "Listen", "Empathize", "Answer", "Recommend", ],
    host: "Vimeo",
    embedCode: '<iframe src="https://player.vimeo.com/video/1185190523?h=e3adf950be&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" referrerpolicy="strict-origin-when-cross-origin" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="SPARC Didactic Video (CC)"></iframe>'
  },
  {
    id: 3,
    title: "Skills Practice 1 Instructions",
    description: "Learn how you will interact with a simulated patient avatar to practice recommending the HPV Vaccine using the clear approach.",
    url: "https://vimeo.com/1188484197/3073e5f22e?share=copy&fl=cl&fe=ci",
    duration: "4:01",
    skills: ['SPARC', 'AI'],
    host: "Vimeo",
    embedCode: '<iframe src="https://player.vimeo.com/video/1188484197?h=3073e5f22e&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" referrerpolicy="strict-origin-when-cross-origin" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="SPARC Skills Practice 1"></iframe>'
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