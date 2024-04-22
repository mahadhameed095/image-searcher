import { useMutation } from "@tanstack/react-query";
import { DefaultService as client } from "@/client";
import Loading from "./loading";
import { Label } from "./ui/label";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AddImages() {
  const [imagesDir, setImagesDir] = useState("");
  const mutation = useMutation({
    mutationKey: [],
    mutationFn: () => client.addImagesFromFolder({ imagesDir }),
    onSuccess: () => window.location.reload() //for some reason queryClient.invalidateQueries is not working. so this is a quick hack fix
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Images</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Loading active={mutation.isPending}>
          <DialogHeader>
            <DialogTitle>Add Images</DialogTitle>
            <DialogDescription>
              Add images to this project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imagesDir" className="text-right">
                Folder Path
              </Label>
              <Input
                id="imagesDir"
                value={imagesDir}
                className="col-span-3"
                onChange={(e) => setImagesDir(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => mutation.mutate()}>Continue</Button>
          </DialogFooter>
        </Loading>
      </DialogContent>
    </Dialog>
  )
}