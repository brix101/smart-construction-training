import { create } from 'zustand'

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
