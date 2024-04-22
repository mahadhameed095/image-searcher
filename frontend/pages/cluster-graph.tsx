import Image from "@/components/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Zoomable } from "@/components/zoomable";
import { useMemo } from "react";
import { Vector2, cn, getScaledPoints, ImagePathMaker } from "@/lib/utils";
import Draggable from "@/components/draggable";
import useSelect from "@/lib/hooks/use-select";
import { MarqueeSelection,  MarqueeSelectable } from "@/components/marquee-selection";

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { DefaultService as client } from "@/client";  

function ClusterGraph(){
    const {select, toggle, selected, unSelectAll, isSelected} = useSelect<number>();
    const queryClient = useQueryClient();
    
    const clusters = useQuery({
        queryKey : ['clusters'],
        queryFn : client.getClusters,
    });

    const mutation = useMutation({
        mutationFn: client.mergeClusters,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey : ['clusters']});
            unSelectAll();
        },
    });

    const scaledPoints = useMemo(() => {
        if(!clusters.data) return null;
        const points : Vector2[] = clusters.data.map(({ representative_face : { embedding_x, embedding_y }}) => [embedding_x, embedding_y]);
        const paddingX = 200;
        const paddingY = 100;
        return getScaledPoints(points, [paddingX, window.innerWidth - paddingX], [paddingY, window.innerHeight - paddingY]);
    }, [clusters.data]);
    console.log(scaledPoints);
    return (
        <div className="overflow-hidden">
            <ContextMenu>
                <ContextMenuTrigger>
                <Zoomable disabled={true} className="relative h-screen w-screen bg-[length:100vw_100vh] grid-bg">
            {
                clusters.data && scaledPoints &&
                <MarqueeSelection
                    className="z-10 border-primary border-dashed border-2 rounded-md"
                    onSelect={keys => select(...keys.map(k => Number(k)))}
                >
                        {clusters.data.map(({ id, representative_face : { image_path, x, y, w, h} }, i) => (
                            <MarqueeSelectable 
                                key={id}
                                itemId={String(id)}
                            >
                                <Draggable
                                    onDragStart={() => toggle(id)}
                                    style={{left: scaledPoints[i][0], top : scaledPoints[i][1]}} 
                                >
                                    <Image
                                        className={cn(`select-none size-16 rounded-full`, isSelected(id) && "border-2 border-emerald-400")}
                                        src={ImagePathMaker(image_path, { width : 2000, cache : true, bb :{x,y,w,h}})}
                                    />
                                </Draggable>
                            </MarqueeSelectable>
                    ))}
                </MarqueeSelection>
                }          
            </Zoomable>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem onClick={() => {
                        console.log(selected);
                        mutation.mutate({ requestBody : { cluster_ids : selected }})
                    }}>Merge</ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </div>
    )
}

export default ClusterGraph;