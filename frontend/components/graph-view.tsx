// import * as d3 from 'd3';
// import { useEffect, useRef } from 'react';
// import { SelectionAny } from '../lib/utils';
// import { useTree } from '../lib/hooks';
// import { TreeType } from 'src/lib/tree';


// type GraphViewProps = {
//     width : number;
//     height : number;
// }
// function DrawGraph(selection : SelectionAny, tree : TreeType, width : number, height : number, active : string | null, setactive : (id : string | null) => void, ){
//     const simulation = d3
//         .forceSimulation(tree.nodes as any)
//         .force("link", d3.forceLink().id((d:any) => d.id).strength(2).distance(800).links(tree.links))
//         .force("charge", d3.forceManyBody().strength(d => 'bb' in d ? -10000 : -10000))
//         .force("center", d3.forceCenter(width / 2, height / 2))
//         .force("collision", d3.forceCollide().radius(60).strength(1.0));
    
//     let link : SelectionAny = 
//         selection
//             .select("g.links")
//             .selectAll("line")
//             .data(tree.links, (d : any) => d.source.id + '-' + d.target.id);
    
//     link.exit().remove();
        
//     link = 
//         link.enter()
//             .append("line")
//             .attr('stroke', 'lightgray')
//             .attr("stroke-width", 3)
//             .merge(link);    

//     const elem = "rect"
//     let node : SelectionAny = 
//         selection
//             .select("g.nodes")
//             .selectAll(elem)
//             .data(tree.nodes, (d : any) => d.id);

//     node.exit().remove();
        
//     node = 
//         node.enter()
//             .append(elem)
//             .attr("fill", d => 'bb' in d ? "red" : "black")
//             .attr("data-id", d => d.id)
//             // .attr("href", d => {
//             //     let base_url = `atom:///${d.image_path}/?`
//             //     if('bb' in d){
//             //       const {x, y, w, h} = d.bb;
//             //       base_url += `x=${x}&y=${y}&w=${w}&h=${h}`;
//             //     }
//             //     else base_url += `width=200`;
//             //     return base_url;
//             //   })
//             .attr("width", 200)
//             .attr("height", 200)
//             .merge(node)
//             .on("click", (e, d) => active === d.id ? setactive(null) : setactive(d.id))
//             .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended) as any);

    
//     simulation.on("tick", ticked);
//     function ticked() {
//         link
//             .attr("x1", (d : any) => d.source.x)
//             .attr("y1", (d : any) => d.source.y)
//             .attr("x2", (d : any) => d.target.x)
//             .attr("y2", (d : any) => d.target.y)

//         node
//             .attr("x", (d : any) => d.x - 100)
//             .attr("y", (d : any) => d.y - 100)
//     }

//     function dragstarted(event : any, d : any) {
//         if (!event.active) simulation.alphaTarget(0.3).restart();
//         d.fx = d.x;
//         d.fy = d.y;
//     }

//     function dragged(event : any, d : any) {
//         d.fx = event.x;
//         d.fy = event.y;
//     }

//     function dragended(event : any, d : any) {
//         if (!event.active) simulation.alphaTarget(0);
//         d.fx = null;
//         d.fy = null;
//     }
//     return () => {
//         simulation.stop();
//     };
// }

// export default function GraphView({ width, height } : GraphViewProps){
//     const { tree, active, setactive } = useTree("50");
//     const svgRef = useRef<SVGSVGElement>(null);
    
//     useEffect(() => {
//         console.log(tree, "recalled");
//         if(!tree || !svgRef) return;
//         const svg = d3.select(svgRef.current);
//         const canvas = svg.select('g');
        
//         svg.call(d3.zoom().on("zoom", (event) => canvas.attr("transform", event.transform)) as any);
        
//         const copyTree = structuredClone(tree);

//         return DrawGraph(canvas, copyTree, width, height, active, setactive);
//     }, [tree, svgRef.current, width, height]);

//     return (
//         <svg ref={svgRef} width={width} height={height} className=' bg-purple-300'>
//             <g>
//                 <g className='links'/>
//                 <g className='nodes'/>
//             </g>
//         </svg>
//     );
// }