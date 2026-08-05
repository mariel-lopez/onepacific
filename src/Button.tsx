import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react'
import { Link } from 'react-router-dom'

type SharedProps = {
  children: ReactNode
  className?: string
}

type RouterLinkProps = SharedProps & {
  to: string
  href?: undefined
}

type LinkButtonProps = SharedProps &
  { href: string; to?: undefined } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    'children' | 'className' | 'href'
  >

type NativeButtonProps = SharedProps &
  { href?: undefined; to?: undefined } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'children' | 'className'
  >

type ButtonProps = RouterLinkProps | LinkButtonProps | NativeButtonProps

function ArrowIcons() {
  return (
    <span className="btn-icon" aria-hidden="true">
      <svg className="btn-icon-diag" viewBox="0 0 16 16" fill="none">
        <path
          d="M4 12L12 4M12 4H6.5M12 4V9.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <svg className="btn-icon-right" viewBox="0 0 16 16" fill="none">
        <path
          d="M3.5 8h9M9 4.5 12.5 8 9 11.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

export function Button(props: ButtonProps) {
  const { children, className = '' } = props
  const classes = ['btn', className].filter(Boolean).join(' ')

  if ('to' in props && props.to !== undefined) {
    return (
      <Link className={classes} to={props.to}>
        <span className="btn-label">{children}</span>
        <ArrowIcons />
      </Link>
    )
  }

  if ('href' in props && props.href !== undefined) {
    const { children: _c, className: _cl, href, ...linkProps } = props
    return (
      <a className={classes} href={href} {...linkProps}>
        <span className="btn-label">{children}</span>
        <ArrowIcons />
      </a>
    )
  }

  const { children: _c, className: _cl, ...buttonProps } =
    props as NativeButtonProps

  return (
    <button
      className={classes}
      type={buttonProps.type ?? 'button'}
      {...buttonProps}
    >
      <span className="btn-label">{children}</span>
      <ArrowIcons />
    </button>
  )
}
