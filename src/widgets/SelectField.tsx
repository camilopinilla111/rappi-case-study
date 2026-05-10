import type { ReactNode } from 'react'

type SelectFieldProps = {
  id: string
  label: string
  value: string
  disabled?: boolean
  children: ReactNode
  onChange: (value: string) => void
}

export function SelectField({
  id,
  label,
  value,
  disabled = false,
  children,
  onChange,
}: SelectFieldProps) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
      >
        {children}
      </select>
    </label>
  )
}
