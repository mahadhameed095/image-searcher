import { useState } from "react";
import useIntersectionObserver from "@/lib/hooks/use-intersection-observer";
import Skeleton from "./skeleton";

type ImageProps=
    React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;

export default function Image({ src, className, onLoad, ...props } : ImageProps){
    const [loading, setloading] = useState(true);
    const [target, isVisible] = useIntersectionObserver();
    return (
        <>
        {loading && 
            <Skeleton
                ref={target}
                className={className}
                style={ { width : "100%", aspectRatio : 1 }}
            />}
            <img
                {...props}
                src={isVisible ? src : undefined}
                className={loading ? 'hidden' : className}
                onLoad={(e) => {
                    setloading(false);
                    onLoad && onLoad(e);
                }}
            />
        </>
    )
}