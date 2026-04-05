import type { RouterOutput } from '@/server/trpc/router/_app'
import type { CategoryData } from '@/types/data'
import type { DataTableRowAction } from '@/types/data-table'
import { create } from 'zustand'

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
