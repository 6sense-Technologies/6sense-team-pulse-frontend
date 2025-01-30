"use client"

import { useToast } from "../hooks/use-toast"
import { Button } from "@/components/ui/button"

export function CustomAlert() {
  const { toast } = useToast()

  return (
    <Button
      variant="outline"
      onClick={() => {
        toast({
          description: "Coming Soon !!!",
        })
      }}
    >
      Show Toast
    </Button>
  )
}
