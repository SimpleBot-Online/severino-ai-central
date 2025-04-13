// Core UI component modules
declare module '*/components/ui/*' {
  import { ComponentType, PropsWithChildren } from 'react'
  const Component: ComponentType<PropsWithChildren<{
    className?: string
    children?: React.ReactNode
  }>>
  export default Component
}

// Common UI components
declare module '*/components/ui/button' {
  import { ComponentType, ButtonHTMLAttributes } from 'react'
  export const Button: ComponentType<ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'default'|'destructive'|'outline'|'secondary'|'ghost'|'link'
    size?: 'default'|'sm'|'lg'|'icon'
    asChild?: boolean
  }>
  export const buttonVariants: (props: {
    variant: string
    size: string
    className?: string
  }) => string
}

declare module '*/components/ui/card' {
  import { ComponentType, HTMLAttributes } from 'react'
  export const Card: ComponentType<HTMLAttributes<HTMLDivElement>>
  export const CardContent: ComponentType<HTMLAttributes<HTMLDivElement>>
  export const CardHeader: ComponentType<HTMLAttributes<HTMLDivElement>>
  export const CardTitle: ComponentType<HTMLAttributes<HTMLHeadingElement>>
  export const CardDescription: ComponentType<HTMLAttributes<HTMLParagraphElement>>
  export const CardFooter: ComponentType<HTMLAttributes<HTMLDivElement>>
}

declare module '*/components/ui/dropdown-menu' {
  import { ComponentType, HTMLAttributes, ReactNode } from 'react'

  interface DropdownMenuProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode
  }

  interface DropdownMenuTriggerProps extends HTMLAttributes<HTMLButtonElement> {
    asChild?: boolean
  }

  interface DropdownMenuContentProps extends HTMLAttributes<HTMLDivElement> {
    align?: 'start'|'center'|'end'
    sideOffset?: number
  }

  interface DropdownMenuItemProps extends HTMLAttributes<HTMLDivElement> {
    disabled?: boolean
  }

  interface DropdownMenuRadioGroupProps extends HTMLAttributes<HTMLDivElement> {
    value: string
    onValueChange: (value: string) => void
  }

  interface DropdownMenuRadioItemProps extends HTMLAttributes<HTMLDivElement> {
    value: string
    disabled?: boolean
  }

  export const DropdownMenu: ComponentType<DropdownMenuProps>
  export const DropdownMenuTrigger: ComponentType<DropdownMenuTriggerProps>
  export const DropdownMenuContent: ComponentType<DropdownMenuContentProps>
  export const DropdownMenuItem: ComponentType<DropdownMenuItemProps>
  export const DropdownMenuLabel: ComponentType<HTMLAttributes<HTMLDivElement>>
  export const DropdownMenuSeparator: ComponentType<HTMLAttributes<HTMLDivElement>>
  export const DropdownMenuRadioGroup: ComponentType<DropdownMenuRadioGroupProps>
  export const DropdownMenuRadioItem: ComponentType<DropdownMenuRadioItemProps>
}

declare module '*/components/ui/dialog' {
  import { ComponentType, HTMLAttributes, ReactNode } from 'react'

  interface DialogProps extends HTMLAttributes<HTMLDivElement> {
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }

  interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {
    forceMount?: boolean
  }

  export const Dialog: ComponentType<DialogProps>
  export const DialogContent: ComponentType<DialogContentProps>
  export const DialogDescription: ComponentType<HTMLAttributes<HTMLParagraphElement>>
  export const DialogFooter: ComponentType<HTMLAttributes<HTMLDivElement>>
  export const DialogHeader: ComponentType<HTMLAttributes<HTMLDivElement>>
  export const DialogTitle: ComponentType<HTMLAttributes<HTMLHeadingElement>>
  export const DialogTrigger: ComponentType<HTMLAttributes<HTMLButtonElement>>
}

// Add all other UI components similarly
declare module '*/components/ui/input' {
  import { ComponentType, InputHTMLAttributes } from 'react'
  export const Input: ComponentType<InputHTMLAttributes<HTMLInputElement>>
}

declare module '*/components/ui/textarea' {
  import { ComponentType, TextareaHTMLAttributes } from 'react'
  export const Textarea: ComponentType<TextareaHTMLAttributes<HTMLTextAreaElement>>
}

// Utility functions
declare module '*/lib/utils' {
  export const cn: (...classes: Array<string|boolean|undefined|null>) => string
}

// Store type declarations
declare module '*/store/*' {
  export * from '@/types'
}

// Hooks
declare module '*/hooks/use-theme' {
  export const useTheme: () => { theme: string; setTheme: (theme: string) => void }
}

declare module '*/hooks/use-toast' {
  export const useToast: () => {
    toast: (props: {
      title: string
      description?: string
      variant?: 'default'|'destructive'
    }) => void
  }
}

// Global types
interface Window {
  [key: string]: unknown
}

// Export types
export * from '@/types'
