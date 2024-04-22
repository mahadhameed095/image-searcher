import { useEffect } from "react";
import { cn, ImagePathMaker } from "@/lib/utils";
import Image from "./image";
import useSelect from "@/lib/hooks/use-select";
import { ClusterPublic } from "@/client";

type FaceGalleryProps = Omit<React.HTMLProps<HTMLUListElement>, 'onSelect'> & {
    onSelect : (selected : number[]) => void;
    clusters : ClusterPublic[];  
};

export default function FaceGallery({ clusters, onSelect, className, ...props} : FaceGalleryProps){
    const {select, selected,unSelect, isSelected}= useSelect<number>();

    useEffect(()=>{
        onSelect(selected)
    }, [selected])

    return (
        <>
            <ul className=" border rounded-lg w-full flex min-h-16 space-x-3 overflow-x-auto items-center">
                { selected.length === 0 ? <p className="pl-4 text-sm text-gray-400">No Clusters selected</p> :
                clusters.filter(c => isSelected(c.id)).map(({ id, representative_face : { image_path, x, y, w, h} }) => (
                    <li key={id}>
                        <Image
                            onClick={() => unSelect(id)}
                            className={`p-3 min-w-16 h-16 rounded-full`}
                            src={ImagePathMaker(image_path, { width : 2000, cache : true, bb : {x,y,w,h}})}
                        />
                    </li>
                ))}
            </ul>

            <ul {...props} className={cn("grid grid-cols-3",  className)}>
                {clusters.filter(c => !isSelected(c.id)).map(({ id, representative_face : { image_path, x, y, w, h} }) => (
                    <li 
                        key={id} 
                        className={cn(isSelected(id) && " selected")}
                        onClick={() => select(id)}
                    >
                        
                        <Image
                            className={`p-3 w-full aspect-square rounded-full`} 
                            src={ImagePathMaker(image_path, { width : 2000, cache : true, bb : {x,y,w,h}})}
                        />
                    </li>
                ))}
            </ul>
        </>
    );
}