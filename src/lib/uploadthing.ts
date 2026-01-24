import {
  generateReactHelpers,
  generateUploadButton,
  generateUploadDropzone,
} from '@uploadthing/react'

import { UploadRouter } from '@/server/common/uploadthing'

export const UploadButton = generateUploadButton<UploadRouter>()
export const UploadDropzone = generateUploadDropzone<UploadRouter>()
export const { useUploadThing } = generateReactHelpers<UploadRouter>()
