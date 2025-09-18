"use client";
import type { Database } from "@/lib/schema";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";


// lots of zod stuff in add-species-dialog, just used to relate to
// the interface to add new content, for a description pretty irrelevant



// pulled Species part from species-card, essentially need to conserve the same content
type Species = Database["public"]["Tables"]["species"]["Row"];




export default function SpeciesInformationDialog({ species }: { species: Species }) {
  // Control open/closed state of the dialog
  const [open, setOpen] = useState<boolean>(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="mt-3 w-full">Learn More</Button>
          </DialogTrigger>
          <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
            <DialogHeader>
                {/* Pulled species info from species-card, which is really from lib/Schema */}
              <DialogTitle>{species.scientific_name}</DialogTitle>
             <DialogDescription>
              {species.common_name}, {species.kingdom}
              </DialogDescription>
            </DialogHeader>
                 
                 {/* dealt with Unknown population problems or problems with description needing a period, etc */}
              <h1>Total Population: {species.total_population ?? "Unknown"}</h1>
              <p>{species.description?.trim().endsWith(".") ? species.description : species.description + "."}</p>
          </DialogContent>
        </Dialog>
      )
    }
    