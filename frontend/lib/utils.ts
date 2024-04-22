import { Selection } from "d3";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { OpenAPI } from "@/client";

export type Obj = Record<string, any>;
export type AwaitedReturnType<T extends (...args: any) => any> = Awaited<ReturnType<T>>;
export type SelectionAny = Selection<any, any, any, any>;


export function RecordToQueryString(obj : Obj){
    return new URLSearchParams(obj).toString();
}

export function removeDuplicates<T extends any>(array : T[], hash ?: (t : T) => string){
    const hashes = hash ? array.map(hash) : array.map(String);
    const obj = hashes.reduce((acc, curr_hash, i) => {
        acc[curr_hash] = array[i];
        return acc;
    }, {} as Record<string, T>);
    return Object.values(obj);
}
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function groupBy
<T extends Record<string, any>, K extends keyof T>
(array : T[], key : K)
: Record<string, T[]>
{
    const ret : Record<string, T[]> =  {};
    for(const entry of array){
        if(entry[key] in ret){
            ret[entry[key]].push(entry);
        }
        else{
            ret[entry[key]] = [entry];
        }
    }
    return ret;
}

type ImagePathMakerOptions = {
    bb ?: {x:number,y: number,w: number,h: number};
    cache ?: boolean;
    width : number;
}

export function ImagePathMaker(filePath : string, options ?: ImagePathMakerOptions){
    let flattenedOptions : Obj = { filePath };
    if(options){
        if(options.bb){
            flattenedOptions.x = options.bb.x;
            flattenedOptions.y = options.bb.y;
            flattenedOptions.w = options.bb.w;
            flattenedOptions.h = options.bb.h;
        }
        if(options.cache) flattenedOptions.cache = options.cache;
        if(options.width) flattenedOptions.width = options.width;
    };

    return `${OpenAPI.BASE}/image?${RecordToQueryString(flattenedOptions)}`;
}

// type TreeNode = {
//     name: string;
//     children: TreeNode[];
//     fullPath: string;
// }

// function groupPathsIntoTree(paths : string[]) : TreeNode[] {
//     let result : TreeNode[] = [];
//     let level : Record<string, any> = { result };
    
//     paths.forEach(path => {
//       path.split('/').filter(v => v != '').reduce((r, name) => {
//         if(!r[name]) {
//           r[name] = {result: []};
//           r.result.push({name, children: r[name].result, fullPath : path})
//         }
        
//         return r[name];
//       }, level)
//     })
    
//     return result;
// }

// function reduceTree(tree : TreeNode[]) : TreeNode[]{
//     if(tree.length > 1) return tree;
//     return reduceTree(tree[0].children);
// }

// function treeToList(tree : TreeNode[]) {

// }

export function getAllUniqueDirs(paths : string[]) {
    const uniqueDirs = new Set<string>();

    paths.forEach(path => {
        const dir = 
            path
                .split('/')
                .filter(item => item != '')
                .slice(0, -1)
                .join('/');
        // Exclude the last element (filename or empty string) if present
        uniqueDirs.add(dir)
    });

    return Array.from(uniqueDirs).sort();
}

export function clamp(num : number, min : number, max : number){
    return Math.min(Math.max(num, min), max);
}

export function shuffle<T extends any[]>(arr : T) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export function chunk<T extends any[]>(array : T, numberOfChunks : number) {
    const chunkSize = Math.floor(array.length / numberOfChunks);
    const chunks = [];

    for (let i = 0; i < numberOfChunks; i++) {
        chunks.push(array.slice(i * chunkSize, (i + 1) * chunkSize))
    }
    return chunks;
}

export type Vector2 = [number, number]

export function scaleValue(value: number, domain : Vector2, range : Vector2): number {
    const [minInput, maxInput] = domain;
    const [minOutput, maxOutput] = range;
    return ((value - minInput) / (maxInput - minInput)) * (maxOutput - minOutput) + minOutput;
}

export function getScaledPoints(points: Vector2[], rangeX: Vector2, rangeY: Vector2): Vector2[] {
    const X = points.map(p => p[0]);
    const Y = points.map(p => p[1]);
    const domainX : Vector2 = [Math.min(...X), Math.max(...X)]
    const domainY : Vector2 = [Math.min(...Y), Math.max(...Y)]
    return points.map(p => [scaleValue(p[0], domainX, rangeX), scaleValue(p[1], domainY, rangeY)])
}

