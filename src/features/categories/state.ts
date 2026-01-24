import { create } from 'zustand'

import { RouterOutput } from '@/server/trpc/router/_app'
import { CategoryData } from '@/types/data'
import { DataTableRowAction } from '@/types/data-table'

interface CategoryRowActionState {
  rowAction: DataTableRowAction<CategoryData> | null
  setRowAction: (action: DataTableRowAction<CategoryData> | null) => void
}

export const useCategoryRowAction = create<CategoryRowActionState>((set) => ({
  rowAction: null,
  setRowAction: (action) => set({ rowAction: action }),
}))

interface CategoryImageState {
  item: RouterOutput['categories']['list']['items'][0] | null
  setItem: (src: RouterOutput['categories']['list']['items'][0] | null) => void
}

export const useCategoryPreview = create<CategoryImageState>((set) => ({
  item: null,
  setItem: (item) => set({ item }),
}))
