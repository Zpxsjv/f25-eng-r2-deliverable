"use client";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import type { Database } from "@/lib/schema";
import { useRouter } from "next/navigation";
import { useState } from "react";


type Species = Database["public"]["Tables"]["species"]["Row"];


export default function TrashSpeciesDialog({ species }: { species: Species }) {
const router = useRouter();
const [open, setOpen] = useState<boolean>(false);

const onCancel = () => {
  setOpen(false);
}
const onConfirm = async () => {
  const supabase = createBrowserSupabaseClient();;
  const { error } = await supabase.from("species").delete().eq('id', species.id);

  if (error) {
    return toast({
      title: "Something went wrong.",
      description: error.message,
      variant: "destructive",
    });
  }


  setOpen(false);

  router.refresh();


  return toast({
    title: species.scientific_name + " species deleted.",
    description: "Successfully deleted " + species.scientific_name + ".",
  });

};

return (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
    <Button variant="destructive">
        <Icons.trash className="mr-0 h-5 w-5" />
      </Button>
    </DialogTrigger>
    <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Are you sure you want to remove &quot;{species.scientific_name}&quot;?</DialogTitle>
      </DialogHeader>
      <div className="flex">
                <Button onClick={()=>{void onConfirm()}} type="button" className="ml-1 mr-1 flex-auto" variant="destructive">
                  Delete
                </Button>
                <DialogClose asChild>
                  <Button onClick={onCancel} type="button" className="ml-1 mr-1 flex-auto" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
              </div>
    </DialogContent>
  </Dialog>
)

}
