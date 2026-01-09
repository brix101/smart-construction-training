import { Download, UploadCloudIcon } from 'lucide-react'

import type { Material } from '@/server/db/schema'
import { Button } from '@/components/ui/button'

interface TopicButtonProps {
  materials: { material: Material }[]
}

export function DownloadButton({ materials }: TopicButtonProps) {
  const downloadMaterial = materials
    .filter(({ material }) => material.type === 'download')
    .map((item) => item.material)

  function openLinks() {
    downloadMaterial.forEach((material) => {
      window.open(material.link, '_blank')
    })
  }

  const isDisabled = downloadMaterial.length === 0

  return (
    <Button
      onClick={openLinks}
      variant="outline"
      size={'sm'}
      disabled={isDisabled}
    >
      <Download className="mr-2 h-4 w-4" />
      Download Training Materials
      <span className="sr-only">Download Training Materials</span>
    </Button>
  )
}

export function UploadButton({ materials }: TopicButtonProps) {
  const uploadMaterials = materials
    .filter(({ material }) => material.type === 'upload')
    .map((item) => item.material)

  function openLinks() {
    uploadMaterials.forEach((material) => {
      window.open(material.link, '_blank')
    })
  }

  const isDisabled = uploadMaterials.length === 0

  return (
    <Button
      onClick={openLinks}
      variant="outline"
      size={'sm'}
      disabled={isDisabled}
    >
      <UploadCloudIcon className="mr-2 h-4 w-4" />
      Upload Materials
      <span className="sr-only">Upload Materials</span>
    </Button>
  )
}
