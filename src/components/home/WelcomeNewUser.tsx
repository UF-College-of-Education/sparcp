import { Link } from 'react-router';
import Content, { videoEmbedCode, ctaButtonText, ctaButtonLink } from '../../../content/home/welcome-new-user.mdx';
import Button from '../ui/button';
import { type ComponentPropsWithoutRef } from 'react';
import { processVimeoEmbedCode } from '../../lib/utils';

const videoProps = processVimeoEmbedCode( videoEmbedCode );

const mdxComponents = {
    h1: ({children}: ComponentPropsWithoutRef<"h1">)=>(<h1 className="font-bold mb-6 text-4xl">{children}</h1>),
    h2: ({children}: ComponentPropsWithoutRef<"h2"> )=>(<h2 className="font-semibold text-2xl mb-2">{children}</h2>),
    h3: ({children}: ComponentPropsWithoutRef<"h3"> )=>(<h3 className="font-semibold mb-2">{children}</h3>),
    h4: ({children}: ComponentPropsWithoutRef<"h4"> )=>(<h4 className="font-semibold mb-2">{children}</h4>),
    p: ({children}: ComponentPropsWithoutRef<"p"> )=>(<p className="mb-6">{children}</p>),
};

export function WelcomeNewUser () {

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-20 px-12 py-20 pr-20 mt-6 items-center">
            <div className="sparc-column">
                <Content components={mdxComponents}/>
                <Button className="bg-black">
                    <Link to={ctaButtonLink}>{ctaButtonText}</Link>
                </Button>
            </div>

            <div className="sparc-column2 aspect-video px-6">                
                <iframe 
                    src={`https://player.vimeo.com/video/${videoProps['videoId']}?h=${videoProps['hash']}&badge=0&autopause=0&player_id=0&app_id=58479`}
                    width="600" height="338" 
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    title={videoProps['title'] ?? ''} 
                    className='border border-off-white'>
                </iframe>
            </div>
        </section>
    );

}