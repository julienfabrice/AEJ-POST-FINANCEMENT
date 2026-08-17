import { LoginBrand } from './UI/LoginBrand'
import { LoginForm } from './UI/LoginForm'

export function Login() {
  return (
    <div className="fixed inset-0 grid grid-cols-1 md:grid-cols-2 z-50 bg-background text-foreground">
      <LoginBrand />
      <LoginForm />
    </div>
  )
}
