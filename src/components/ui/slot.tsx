import { cloneElement, isValidElement } from "react"

function mergeProps(slotProps: any, childProps: any) {
  return {
    ...slotProps,
    ...childProps,
    className: [slotProps.className, childProps.className]
      .filter(Boolean)
      .join(" "),
  }
}

export function Slot({ children, ...props }: any) {
  if (!isValidElement(children)) return null

  return cloneElement(children, mergeProps(props, children.props))
}
