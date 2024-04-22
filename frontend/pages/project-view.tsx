import FilterPane, { filter, FilterType } from '../components/filter-pane';
import { useQuery } from '@tanstack/react-query';
import ImageMasonry, { ImageMasonrySelectionControl } from '@/components/image-masonry';
import Skeleton from '@/components/skeleton';
import useObject from "@/lib/hooks/use-object";
import { DefaultService as client } from '@/client';
import { useMemo } from 'react';
import { groupBy } from '@/lib/utils';

export default function ProjectView(){
  
  const imageClusterAssignments = useQuery({
      queryKey : ['imageClusterAssignments'],
      queryFn : client.getImageClusterAssignments
  });

  const groupedImageClusterAssignments = useMemo(() => 
    imageClusterAssignments.data &&
      groupBy(imageClusterAssignments.data, 'image_path') 
  , [imageClusterAssignments.data])
  
  const [filterValue, updateFilter] = useObject<FilterType>({
    selected : [],
    strict : false,
    startsWith : null,
    showBB : false
  });

  return (
    <div className='flex h-screen'>
      <FilterPane 
        value={filterValue} 
        onChange={updateFilter}
      />
      {
        groupedImageClusterAssignments === undefined  ?
        <div className="w-full p-5">
            <Skeleton className="w-full h-full"/> 
        </div> :
        <>
          <div className='w-full h-full overflow-y-auto'>
            <ImageMasonrySelectionControl />
            <ImageMasonry images={filter(groupedImageClusterAssignments, filterValue)}/>
          </div>
        </>
      }

    </div>
  )
}