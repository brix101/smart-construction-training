import { Icons } from "~/components/icons"
import { Button } from "~/components/ui/button"

export function GoogleButton() {
  return (
    <Button variant="outline" type="button">
      <Icons.google />
      Continue with Google
    </Button>
  )
}
