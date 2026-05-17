"use client"

import { Eye, EyeOff } from "lucide-react"
import type { ComponentProps } from "react"
import { useState } from "react"

import { cn } from "@/lib/utils"

import { Input } from "./input"

type PasswordInputProps = Omit<ComponentProps<typeof Input>, "type">

function PasswordInput({ className, disabled, ...props }: PasswordInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const toggleLabel = isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"

  return (
    <div className="relative">
      <Input
        {...props}
        type={isPasswordVisible ? "text" : "password"}
        disabled={disabled}
        className={cn(className, "pr-12")}
      />
      <button
        type="button"
        onClick={() => setIsPasswordVisible((currentValue) => !currentValue)}
        disabled={disabled}
        aria-label={toggleLabel}
        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[var(--campus-text-muted)] transition-colors hover:text-[var(--campus-text)] disabled:pointer-events-none disabled:opacity-50"
      >
        {isPasswordVisible ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
      </button>
    </div>
  )
}

export { PasswordInput }
