import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { TabsContent } from "../ui/tabs";
import { 
  BookOpen, 
  Download, 
  CheckCircle, 
  MessageSquare,
} from "lucide-react";
import type { Module } from '../../types';

// Forces modules to provide Module props defined in types.ts
interface ClearModuleProps {
    modules: Module[];
}

/**
 * ClearModules Component
 * @description Controls what's seen in the CLEAR Modules tab on the Resources page
 * @param modules (array) - Array of Module objects. 
 */
export function ClearModules({ modules }: ClearModuleProps) {

    const [selectedModule, setSelectedModule] = useState(modules[0]);

    const handleDownloadClick = () => {
      const link = document.createElement("a");
      link.href = "/assets/C-LEAR _Pocket_Card_03-06-26.pdf";
      link.download = "C-LEAR_Pocket_Card.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
        <TabsContent value="modules" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              {modules.map((module) => (
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
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
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
                    <Button variant="outline" className="gap-2" onClick={handleDownloadClick}>
                      <Download className="w-4 h-4" />
                      Download Guide
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
    );
}