import { cva } from 'class-variance-authority'

const buttonVariants = cva(
  [
    'relative inline-flex items-center justify-center font-base border border-transparent rounded outline-0 cursor-pointer',
  ],
  {
    variants: {
      intent: {
        primary:
          'text-primary-font bg-primary border-primary hover:bg-primary-light hover:border-primary-light',
        secondary:
          'text-primary bg-secondary-light border-primary hover:bg-background hover:border-primary-light',
        tertiary:
          'bg-secondary text-secondary-font border-secondary hover:bg-secondary-dark hover:border-secondary-dark',
        link: 'bg-transparent border-none text-primary hover:bg-primary-light hover:text-primary-font font-normal',
        disabled:
          'bg-transparent border-none text-secondary cursor-default hover:bg-transparent hover:border-transparent hover:text-secondary',
      },
      shape: {
        round: 'rounded-[25px] p-3',
      },
      action: {
        raised: 'shadow-[0_2px] shadow-[secondary] active:shadw-none active:top-px',
        fixed: 'active:shadow-none active:mt-[-1px]',
      },
      size: {
        large: 'py-3 px-4',
        medium: 'py-[0.4rem] px-[0.7rem]',
        pagination: 'w-8 h-8',
        default: 'h-auto w-auto',
        small: 'p-1',
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'default',
    },
  },
)

const Button = ({
  className,
  intent,
  size,
  action,
  shape,
  loading,
  icon,
  label,
  children,
  ...props
}) => {
  return (
    <button className={buttonVariants({ intent, size, action, shape, className })} {...props}>
      {loading ? (
        <span>
          <i className="fas fa-spinner fa-spin font-lg" />
        </span>
      ) : (
        <>
          {icon && <i className="material-icons font-lg">{icon}</i>}
          {label && <span className={icon ? 'ml-2' : ''}>{label}</span>}
          {children && <span className={icon ? 'ml-2' : 'w-max h-max'}>{children}</span>}
        </>
      )}
    </button>
  )
}
Button.displayName = 'Button'

export default Button
