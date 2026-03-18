import { forwardRef, type ImgHTMLAttributes } from 'react'
import './image.css'
import { cn } from '@/lib/utils';

export type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  alt: string;
}

/**
 * Simple image component that just wraps a standard HTML img tag.
 * Replaces the Wix image kit dependency with a lightweight component.
 */
export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ alt, className, ...props }, ref) => {
    return (
      <img
        ref={ref}
        alt={alt}
        className={cn('', className)}
        {...props}
      />
    )
  }
)
Image.displayName = 'Image'
