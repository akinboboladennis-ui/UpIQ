'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { resetPasswordSchema, type ResetPasswordInput } from '@upiq/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { createClient } from '@/lib/supabase/client'

export function ResetPasswordForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  async function onSubmit(data: ResetPasswordInput) {
    setIsLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.updateUser({ password: data.password })

    setIsLoading(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('Password updated successfully.')
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="animate-spin" />}
          Update Password
        </Button>
      </form>
    </Form>
  )
}
