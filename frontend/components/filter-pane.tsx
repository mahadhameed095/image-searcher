import { SearchBar } from "./search-bar";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "./skeleton";
import FaceGallery from "./face-gallery";
import { DefaultService as client, ImageClusterAssignment } from "@/client";
import AddImages from "./add-images";
import InitClusters from "./init-clusters";
import { buttonVariants } from "./ui/button";
import { Link, useParams } from "react-router-dom";

// import { Edit2Icon } from "lucide-react";

export type FilterType = {
    selected : number[];
    startsWith : string | null;
    strict : boolean;
    showBB : boolean;
}
export function filter(
    imageAssignments : Record<string, ImageClusterAssignment[]>,
    { selected, strict, startsWith } : FilterType
){
    if(selected.length === 0) return [];
    const images = Object.entries(imageAssignments)
        .filter(([_, value]) => {
            if(strict && selected.length != value.length) return false;
            const _clusterIds = value.map(v => v.cluster_id);
            return selected.every(id => _clusterIds.includes(id));
        })
        .map(im => im[0]);
    if(startsWith) return images.filter(im => im.startsWith(startsWith));
    console.log(images);
    return images;
}


type OnChange = (filter : Partial<FilterType>) => unknown;

type FilterPaneProps = {
    value : FilterType;
    onChange : OnChange;
}

export default function FilterPane({ value, onChange } : FilterPaneProps){
    const params = useParams();
    const clusters = useQuery({ 
        queryKey : ['clusters'],
        queryFn : client.getClusters
    });
    const images = useQuery({ 
        queryKey : ['images'], 
        queryFn : client.getImages
    });

    return (
        <>
        <div className="overflow-y-auto flex flex-col max-w-[300px] w-1/4 h-[calc(100vh-20px)] m-3 rounded-md border shadow-md p-5 space-y-4">
            <div className="space-y-4">
                <h2 className=" text-sm font-semibold">Images</h2>
                <AddImages />
                <h2 className=" text-sm font-semibold">Filters</h2>
                { images.isLoading 
                    ? <Skeleton className="h-6"/> 
                    : <SearchBar 
                        onSubmit={startsWith => onChange({ startsWith })}
                        paths={images.data!}
                      />}
                <div className="flex items-center justify-between">
                    <Label className="text-xs" htmlFor="strict">Strict</Label>
                    <Switch 
                        id="strict"
                        checked={value.strict}
                        onCheckedChange={strict => onChange({ strict })} 
                    />
                </div>
                <div className="flex items-center justify-between">
                    <Label className="text-xs" htmlFor="showBB">Boundary</Label>
                    <Switch 
                        id="showBB"
                        checked={value.showBB}
                        onCheckedChange={showBB => onChange({ showBB })} 
                    />
                </div>
            </div>
            <Separator />
            <div className="space-y-4">
                <h2 className=" text-sm font-semibold">Clusters</h2>
                    <InitClusters/>
                    <Link
                        className={buttonVariants({ variant : 'outline'})}
                        to={`/projects/${params.projectName}/clusterGraph`}
                    >Graph View</Link>
                <div className="flex justify-between">
                </div>
                    {clusters.isLoading 
                    ?   <Skeleton />
                    : 
                        <FaceGallery 
                            clusters={clusters.data!}
                            onSelect={selected => onChange({ selected })}
                        />
                    }
            </div>
        </div>
        </>
    );
}