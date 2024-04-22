import Image from "./image";
import { chunk, ImagePathMaker } from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";
import { DownloadIcon } from "lucide-react"
import useSelect from "@/lib/hooks/use-select";
import { useState } from "react";

type ImageViewerProps = {
    images : string[];
} & React.HTMLProps<HTMLDivElement>;

export function ImageMasonrySelectionControl(){

    return (<></>
    //     <div className='flex justify-between p-8'>
    //         <div className="flex items-center space-x-2">
    //             <Checkbox id="select-all" />
    //             <label
    //                 htmlFor="select-all"
    //                 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    //             >
    //                 Select All
    //             </label>
    //         </div>
    //         <DownloadIcon />
    //   </div>
    )
}

type ImageOverlayProps = React.HTMLProps<HTMLImageElement> & {
    onOutsideClick ?: () => void;
}
function ImageOverlay({src, onOutsideClick, ...props} : ImageOverlayProps){
    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div onClick={onOutsideClick} className="absolute inset-0 bg-black opacity-90" />
            <img 
                {...props} 
                src={ImagePathMaker(src!)} 
                className=" z-10 max-h-[calc(100vh-5em)]"
            />
        </div>
    );
}

export default function ImageMasonry({images, className, ...props } : ImageViewerProps){
    // const { select, selected, isSelected } = useSelect();
    const [active, setactive] = useState<string | null>(null);
    return (
        <>
            {active && <ImageOverlay onOutsideClick={()=>setactive(null)} src={active}/>}
            <div {...props} className="overflow-x-hidden p-4 flex-1 grid auto-cols-fr grid-flow-col gap-4">
                {
                    chunk(images, 2).map((_chunk, i) => (
                        <div className="space-y-4" key={i}>
                            {_chunk.map(src =>

                                <Image
                                    key={src}
                                    onClick={() => setactive(src)} 
                                    className="rounded-lg object-cover" 
                                    src={ImagePathMaker(src, { width : 1000})} 
                                    alt="Description of Image 1" 
                            />)}
                        </div>
                    ))
                }
            </div>
        </>
    );
}