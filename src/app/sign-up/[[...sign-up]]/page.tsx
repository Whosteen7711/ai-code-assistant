import { SignUp } from '@clerk/nextjs'

type Props = {}
const SignUpPage = (props: Props) => {
  return (
    // allow div to take up entire screen
    // center sign up form
    <div className="flex h-screen items-center justify-center">
      <SignUp appearance={{ variables: { colorPrimary: '#0F172A' } }} />
    </div>
  )
}
export default SignUpPage
