import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

type DraggableProps = React.HTMLProps<HTMLDivElement>;
const Draggable = ({ style, ...props } : DraggableProps) => {
  const divRef = useRef(null);

  useEffect(() => {
    const containerNode = divRef.current
    if(!containerNode) return;
    const selection = d3.select(containerNode);

    const drag = d3.drag()
      .on("start", function(event) {
        // When dragging starts
        const bbox = this.getBoundingClientRect();
        const offsetX = event.x - bbox.left; // Calculate the offset from the click position
        const offsetY = event.y - bbox.top;

        selection.raise().style("cursor", "grabbing");
        selection.attr("data-offset-x", offsetX); // Store the offset
        selection.attr("data-offset-y", offsetY);
        props.onDragStart && props.onDragStart(event); 
      })
      .on("drag", function(event) {
        // During dragging
        
        const offsetX = Number(selection.attr("data-offset-x")); // Retrieve the stored offset
        const offsetY = Number(selection.attr("data-offset-y"));
        let x = event.x - offsetX;
        let y = event.y - offsetY;

        const existingTransform = d3.zoomTransform(selection.node() as any);
        x -= existingTransform.x;
        y -= existingTransform.y;
        x /= existingTransform.k;
        y /= existingTransform.k;

        selection.style("left", x + "px") // Apply offset to position
               .style("top", y + "px");
      })
      .on("end", function() {
        // When dragging ends
        selection.style("cursor", "grab");
      });

    selection.call(drag as any);

    return () => {
      // Clean up D3 drag behavior
      selection.on('.drag', null);
    };
  }, []);

  return (
    <div
        {...props}
        ref={divRef}
        style={{
            position: 'absolute',
            cursor: 'grab',
            ...style
        }}
        className='w-max'
    >
    </div>
  );
};

export default Draggable;
