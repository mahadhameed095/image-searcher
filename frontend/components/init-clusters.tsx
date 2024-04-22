import { useMutation } from "@tanstack/react-query";
import { DefaultService as client } from "@/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import useObject from "@/lib/hooks/use-object";
import { Button } from "@/components/ui/button";
import Loading from "@/components/loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function InitClusters() {
  const [params, updateParams] = useObject({
    minSamples : 3,
    minClusterSize : 3
  });

  const mutation = useMutation({ 
    mutationFn : client.initializeClusters,
    onSuccess: () => window.location.reload() //for some reason queryClient.invalidateQueries is not working. so this is a quick hack fix
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Clusters</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Loading active={mutation.isPending}>
          <DialogHeader>
            <DialogTitle>Initialize Clusters</DialogTitle>
            <DialogDescription>
              Identify all the unique faces in the uploaded images.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="minSamples"  className="text-right">
                Minimum Samples
              </Label>
              <Input 
                id="minSamples"
                type="number"
                value={params.minSamples}
                className="col-span-3"
                onChange={(e) => updateParams({ minSamples : Number(e.target.value) })} 
              />

            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="minClusterSize" className="text-right">
                Minimum Cluster Size
              </Label>
              <Input 
                id="minClusterSize"
                type="number"
                value={params.minClusterSize}
                className="col-span-3"
                onChange={(e) => updateParams({ minClusterSize : Number(e.target.value) })} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => mutation.mutate(params)}>Continue</Button>
          </DialogFooter>
        </Loading>
      </DialogContent>
    </Dialog>
  )
}