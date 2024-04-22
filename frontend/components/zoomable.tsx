import { useEffect, useRef } from "react";
import * as d3 from 'd3';

export type ZoombableProps = React.HTMLProps<HTMLDivElement>;
export function Zoomable({ children, disabled, ...props } : ZoombableProps){
    const divRef = useRef(null);

    useEffect(() => {
        if(!divRef || disabled) return;
        const container = d3.select(divRef.current);
        const canvas = container.select('div');
        
        container.call(d3.zoom().on("zoom", (event) =>{
            let t = event.transform;
            canvas.attr("style", `transform : translate(${t.x}px, ${t.y}px) scale(${t.k}); transform-origin : 0 0;`)
        }) as any);
        return () => {
            container.on(".drag", null);
        }
    }, [divRef.current, disabled]);

    return (
        <div {...props} ref = {divRef}>
            <div style={{ width : "100%", height : "100%"}}>{children}</div>
        </div>
    );
}