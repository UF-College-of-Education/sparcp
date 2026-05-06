import type { ReactNode } from "react";
import Button from "./button";
import { Card } from "./card";

export function Confirm ({children, className="", onConfirm, onCancel}: {children: ReactNode, className?: string, onConfirm: ()=>void, onCancel: ()=>void}) {

    return (
        <div className="fixed top-0 bottom-0 left-0 right-0 bg-black/50 w-full h-full z-[999] flex items-center justify-center">
            <Card className="w-[380px] min-h-[250px] p-10 grid">
                <div className={className}>{children}</div>
                <div className="button-row mt-8 self-end w-full text-center">
                    <Button className="mr-2 mb-2 w-full" onClick={onConfirm}>Leave Training</Button>
                    <Button 
                        className="bg-black/15 w-full text-black border-2 border-transparent hover:bg-white hover:border-black" 
                        onClick={onCancel}>
                        Stay Here
                    </Button>
                </div>
            </Card>
        </div>
    );
}