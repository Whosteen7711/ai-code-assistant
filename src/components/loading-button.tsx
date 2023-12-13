import { Loader2 } from 'lucide-react'
import { Button, ButtonProps } from './ui/button'

// extend the Button component with a isLoading prop and a loading indicator
type LoadingButtonProps = {
  isLoading: boolean
} & ButtonProps

const LoadingButton = ({
  children,
  isLoading,
  ...props
}: LoadingButtonProps) => {
  return (
    <Button {...props} disabled={props.disabled || isLoading}>
      {isLoading && <Loader2 className="animate-spin mr-2" size={16} />}
      {children}
    </Button>
  )
}
export default LoadingButton
