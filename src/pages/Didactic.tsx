import Content, { videoEmbedCode, ctaButtonText, ctaButtonLink, preplayMessage } from '../../content/training/didactic.mdx';
import { type ComponentPropsWithoutRef, useEffect, useRef, useState } from 'react';
import Button from '../components/ui/button';
import { Link } from 'react-router';
import { processVimeoEmbedCode } from '../lib/utils';
import Player from '@vimeo/player';
import { useProgress } from '../context/ProgressContext';

const videoProps = processVimeoEmbedCode( videoEmbedCode );

const mdxComponents = {
    h1: ({children}: ComponentPropsWithoutRef<"h1">)=>(<h1 className="font-bold mb-6 text-4xl text-center">{children}</h1>),
    h2: ({children}: ComponentPropsWithoutRef<"h2"> )=>(<h2 className="font-semibold text-2xl mb-2">{children}</h2>),
    h3: ({children}: ComponentPropsWithoutRef<"h3"> )=>(<h3 className="font-semibold mb-2">{children}</h3>),
    h4: ({children}: ComponentPropsWithoutRef<"h4"> )=>(<h4 className="font-semibold mb-2">{children}</h4>),
    p: ({children}: ComponentPropsWithoutRef<"p"> )=>(<p className="mb-6">{children}</p>),
};

export function Didactic () {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const {didacticComplete, setDidacticComplete} = useProgress();

    // Update Progress context when video is finished
    useEffect( ()=>{
        if ( ! iframeRef.current ) return;

        const player = new Player(iframeRef.current);
        player.on('ended', ()=>{
            setDidacticComplete(true);
        })
        return () => { player.off('ended') };
    }, []);

    return (
        <main className='w-full h-page p-12 flex align-center justify-center flex-col'>

            <Content components={mdxComponents}/>

            <iframe 
                ref={iframeRef}
                src={`https://player.vimeo.com/video/${videoProps['videoId']}?h=${videoProps['hash']}&badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0`}
                width="960" height="540" 
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                title={videoProps['title'] ?? ''} 
                className='border border-off-white mx-auto my-12'>
            </iframe>

            <div className='text-center'>
                <p className='m-4'>{preplayMessage}</p>
                {didacticComplete ? 
                    <Button className="bg-yellow text-black border-2 border-yellow font-bold text-md hover:bg-white transition-all duration-[250ms]">
                        <Link to={ctaButtonLink} >{ctaButtonText}</Link>
                    </Button> :
                    <></>
                }
            </div>
        </main>
    );
}