import { Link } from 'react-router';
import Content, { videoEmbedCode, ctaButtonText, ctaButtonLink, preplayMessage } from '../../../content/home/welcome-new-user.mdx';
import Button from '../ui/button';
import { type ComponentPropsWithoutRef } from 'react';
import { processVimeoEmbedCode } from '../../lib/utils';
import Player from '@vimeo/player';
import { useProgress } from '../../context/ProgressContext';
import { useRef, useEffect } from 'react';

const videoProps = processVimeoEmbedCode( videoEmbedCode );

const mdxComponents = {
    h1: ({children}: ComponentPropsWithoutRef<"h1">)=>(<h1 className="font-bold mb-6 text-4xl text-center">{children}</h1>),
    h2: ({children}: ComponentPropsWithoutRef<"h2"> )=>(<h2 className="font-semibold text-2xl mb-2">{children}</h2>),
    h3: ({children}: ComponentPropsWithoutRef<"h3"> )=>(<h3 className="font-semibold mb-2">{children}</h3>),
    h4: ({children}: ComponentPropsWithoutRef<"h4"> )=>(<h4 className="font-semibold mb-2">{children}</h4>),
    p: ({children}: ComponentPropsWithoutRef<"p"> )=>(<p className="mb-6">{children}</p>),
};

export function WelcomeNewUser () {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const {welcomeComplete, setWelcomeComplete} = useProgress();

    // Update Progress context when video is finished
    useEffect( ()=>{
        if ( ! iframeRef.current ) return;

        const player = new Player(iframeRef.current);
        player.on('ended', ()=>{
            setWelcomeComplete(true);
        })
        return () => { player.off('ended') };
    }, []);

    return (
        <section className="px-12 py-20 pr-20 mt-6">
            <div className="sparc-column w-full">
                <Content components={mdxComponents}/>
                <iframe 
                    ref={iframeRef}
                    src={`https://player.vimeo.com/video/${videoProps['videoId']}?h=${videoProps['hash']}&badge=0&autopause=0&player_id=0&app_id=58479&autoplay=0&title=0&byline=0&portrait=0`}
                    width="960" height="540" 
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    title={videoProps['title'] ?? ''} 
                    className='border border-off-white mx-auto my-12'>
                </iframe>
                
                <div className='text-center'>
                    <p className='m-4'>{preplayMessage}</p>
                    {welcomeComplete ? 
                        <Button className="bg-yellow text-black border-2 border-yellow font-bold text-md hover:bg-white">
                            <Link to={ctaButtonLink}>{ctaButtonText}</Link>
                        </Button>:
                        <></>
                    }
                </div>
            </div>

                
        </section>
    );

}