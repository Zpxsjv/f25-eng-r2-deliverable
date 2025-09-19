"use client";
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
import type { SpeciesWithAuthor } from "./types";


// lots of zod stuff in add-species-dialog, just used to relate to
// the interface to add new content, for a description pretty irrelevant



// pulled Species part from species-card, essentially need to conserve the same content
export default function SpeciesInformationDialog({ species }: { species: SpeciesWithAuthor }) {
  // Control open/closed state of the dialog
  const [open, setOpen] = useState<boolean>(false);
  const author = species.author_profile;

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
            {author ? (
              <div className="mt-2 text-sm text-muted-foreground">
                <p>
                  Added by <span className="font-medium text-foreground">{author.display_name}</span>
                  {author.email ? ` (${author.email})` : ""}
                </p>
                {author.biography ? <p className="mt-1">{author.biography}</p> : null}
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Author information unavailable.</p>
            )}
             <p className={`text-sm font-medium ${species.endangered ? "text-red-600" : "text-emerald-600"}`}>
              {species.endangered ? "Endangered" : "Not Endangered"}
             </p>
                 
                 {/* dealt with Unknown population problems or problems with description needing a period, etc */}
              <h1>Total Population: {species.total_population ?? "Unknown"}</h1>
              <p>{species.description?.trim().endsWith(".") ? species.description : species.description + "."}</p>
          </DialogContent>
        </Dialog>
      )
    }
    
