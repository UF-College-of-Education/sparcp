import { Card } from "../ui/card";
import { BookOpen, ArrowRight, Users } from "lucide-react";
import { TabsContent } from "../ui/tabs";
import type { ResourceListing } from "../../types";

// Forces resources to provide ResourceListing props defined in types.ts
interface ResourceListingsArray {
  resources: ResourceListing[];
}

/**
 * MoreResources component 
 * @description Controls what's seen in the Additional Resources tab of the Resources page.
 * @param resources (array) - array of ResourceListing  
 */
export function MoreResources( {resources}: ResourceListingsArray ) {
  // Sort resources based on category.
  // TODO Make video categories dynamic.
  const researchResources = resources.filter(
    (resource) => resource.category === "research"
  );
  
  const communityResources = resources.filter(
    (resource) => resource.category === "community"
  );

  return (
    <TabsContent value="resources" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Research & Guidelines
          </h3>
          <div className="space-y-3">
            {(researchResources.length > 0) && researchResources.map(
              (researchResource)=>{
                return (
                  <a href={researchResource.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm">{researchResource.title}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )
              }
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Community & Support
          </h3>
          <div className="space-y-3">
            {(communityResources.length > 0) && communityResources.map(
              (communityResource)=>{ return (
                <a href={communityResource.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm">{communityResource.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}
            )}
          </div>
        </Card>
      </div>
    </TabsContent>
  );
}