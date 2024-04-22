import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type SkeletonProps = React.HTMLProps<HTMLDivElement>;

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>((props, ref) => {
    return (
        <div {...props} ref={ref} className={cn("animate-pulse bg-slate-200 rounded-sm", props.className)} />
    );
});

export default Skeleton;
