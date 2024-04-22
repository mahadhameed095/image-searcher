import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as React from 'react';

const calculateRectDimensions = (startX : number, startY : number, endX : number, endY : number) => {
  const left = Math.min(startX, endX);
  const top = Math.min(startY, endY);
  
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);

  return { left, top, width, height };
};

type MarqueeSelectableProps = {
  itemId : string;
  children : React.ReactElement;
};

export function MarqueeSelectable({ itemId, children }: MarqueeSelectableProps) {
  const childWithProps = React.cloneElement(children, {
    'data-marquee-item-id': itemId
  });
  return childWithProps;
}

type MarqueeSelectionProps = { 
  children : React.ReactElement<typeof MarqueeSelectable>[];
  onSelect : (keys : string[]) => any;
  className ?: string;
}

export function MarqueeSelection ({ onSelect, children, className } : MarqueeSelectionProps) {
    const divRef = useRef(null);
    useEffect(() => {
        const container = divRef.current;
        if(!container) return;
        const marquee = d3.select(container);
        const parent = d3.select((marquee.node() as any)?.parentElement)
        
        const startMousePos = { x : 0, y : 0} 
        let dims = { left : 0, top : 0, width : 0, height : 0 }
        const drag = d3.drag()
            .on("start", function(event) {
                startMousePos.x = event.x;
                startMousePos.y = event.y;
                marquee
                    .style("left", `${startMousePos.x}px`).style("top", `${startMousePos.y}px`)
                    .style("width", 0).style("height", 0)
                    .style("display", "block")
            })
            .on("drag", function(event) {
                dims = calculateRectDimensions(startMousePos.x, startMousePos.y, event.x, event.y);
                marquee
                    .style("left", `${dims.left}px`).style("top", `${dims.top}px`)
                    .style("width", `${dims.width}px`).style("height", `${dims.height}px`)
            })
            .on("end", function() {
                marquee.style("display", "none");
                const siblings = parent.selectAll('[data-marquee-item-id]');
                const keys = siblings.filter(function() {
                  const siblingDims = (this as Element).getBoundingClientRect();
                  return (
                    siblingDims.left < dims.left + dims.width &&
                    siblingDims.left + siblingDims.width > dims.left &&
                    siblingDims.top < dims.top + dims.height &&
                    siblingDims.top + siblingDims.height > dims.top
                  );
                }).nodes().map(node => (node as Element).getAttribute('data-marquee-item-id')!);
                
                onSelect(keys);
            });
  
      parent.call(drag as any);

    return () => {
      parent.on('.drag', null);
    };
  }, [divRef.current]);

  return (
    <>
      <div ref={divRef} style={{ position : 'absolute', display : 'none' }} className={className}/>
      {children}
    </>
  );
};