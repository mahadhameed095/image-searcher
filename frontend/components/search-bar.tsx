import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { getAllUniqueDirs } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type SearchBarProps = Omit<React.HTMLProps<HTMLDivElement>, 'onSubmit'> & {
  paths : string[];
  onSubmit ?: (val : string | null) => void;
};

export function SearchBar({ paths, onSubmit, className, ...props } : SearchBarProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string | null>(null);

  const uniqueDirs = React.useMemo(() => getAllUniqueDirs(paths), [paths]);

  return (
    <div className={className} {...props}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between overflow-hidden"
          >
            {value && `...${value.substring(value.length - 25)}`
              || "Search files..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full">
          <Command>
            <CommandInput placeholder="Search files..." />
            <CommandEmpty>No images found</CommandEmpty>
            <CommandGroup>
              <CommandList>
                {uniqueDirs.map((path) => (
                  <CommandItem
                    // className="max-w-[200px] overflow-ellipsis text-nowrap"
                    key={path}
                    value={path}
                    onSelect={(currentValue) => {
                      const newValue = currentValue === value ? null : currentValue;
                      setValue(newValue)
                      setOpen(false)
                      onSubmit && onSubmit(newValue);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === path ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {path}
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}