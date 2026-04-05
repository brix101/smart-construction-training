import { DialogTitle } from '@radix-ui/react-dialog'

import { useCategoryPreview } from '../state'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'


export function CategoriesImagePreview() {
  const { item, setItem } = useCategoryPreview()

  if (!item) {
    return null
  }

  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && setItem(null)}>
      <DialogContent className="max-h-full p-4">
        <DialogHeader>
          <DialogTitle>{item.name}</DialogTitle>
        </DialogHeader>
        <img
          src={item.imgSrc}
          alt="Category Preview"
          className="max-h-[80vh] object-contain"
        />
      </DialogContent>
    </Dialog>
  )
}
