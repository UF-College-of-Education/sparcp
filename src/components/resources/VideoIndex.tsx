import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { TabsContent } from "../ui/tabs";
import type { Video } from "../../types";

// Forces videos to provide Video props defined in types.ts
interface Videos {
    videos: Video[];
}

/**
 * RENDER VIDEO
 * @description Determines whether a given video should be rendered via iframe or embed code. Needed because certain video hosts like YouTube and Vimeo require you to use their embed code to display videos.
 * @param video 
 * @returns 
 */
const renderVideo = (video: Video) => {
    if (video.host === "Other" && video.url) {
        return <iframe src={video.url} className="w-full aspect-video"></iframe>;
    }
    
    if (video.embedCode) {
        return <div dangerouslySetInnerHTML={{ __html: video.embedCode }} />;
    }
    
    return null;
}

/**
 * VideoIndex Component
 * @description Controls what is seen in the Videos tab on the Resources page
 * @param videos array of Video objects.  
 */
export function VideoIndex( {videos}: Videos) {
    return (
        <TabsContent value="videos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
                
              <Card key={video.id} className="p-6">

                <div className="mb-4 w-full aspect-video relative">
                    {renderVideo(video)}
                </div>

                <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{video.description}</p>
                
                <div className="space-y-3">
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{video.duration}</span>
                  </div>
                  
                  <div>
                    <span className="text-sm text-muted-foreground mb-2 block">Tags:</span>
                    <div className="flex flex-wrap gap-1">
                      {video.skills.map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
    );
}