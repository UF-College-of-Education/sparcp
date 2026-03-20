import { CardContent } from "../ui/card";
import Content from "../../../content/ClearGuide/ClearFaqs.mdx";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type QuestionProps = {
    children: ReactNode
}

type AnswerProps = {
    children: ReactNode
}

type QuestionEntry = {
    children: ReactNode
}

/**
 * Overrides default MDX mappings to allow for additional props 
 * to be passed in or to create custom MDX components.
 */
const mdxComponents = {
    h2: ({children}: ComponentPropsWithoutRef<"h2"> )=>(<h2 className="font-semibold text-primary mb-2">{children}</h2>),
    h3: ({children}: ComponentPropsWithoutRef<"h3"> )=>(<h3 className="font-semibold text-primary mb-2">{children}</h3>),
    h4: ({children}: ComponentPropsWithoutRef<"h4"> )=>(<h4 className="font-semibold text-primary mb-2">{children}</h4>),
    p: ({children}: ComponentPropsWithoutRef<"p"> )=>(<p className="mb-6">{children}</p>),
    Answer: ({children}: AnswerProps)=>(<div>{children}</div>),
    Question: ({children}: QuestionProps) =>(
        <summary className="font-semibold text-yellow text-md mb-2 cursor-pointer"><span className="text-primary pl-2">{children}</span></summary>
    ),
    QuestionEntry: ({children}: QuestionEntry )=>(<details className="my-2">{children}</details>)
    
}

/**
 * Loads Clear Faqs content into card content.
 */
export default function ClearFaqs () {
    return (
        <CardContent>
            <Content components={mdxComponents}/>
        </CardContent>
    );
}