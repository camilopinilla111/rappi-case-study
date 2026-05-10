type SubmitButtonProps = {
  isSubmitting: boolean
  disabled: boolean
}

export function SubmitButton({ isSubmitting, disabled }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="h-11 rounded-md bg-emerald-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
    >
      {isSubmitting ? 'Analizando...' : 'Enviar'}
    </button>
  )
}
