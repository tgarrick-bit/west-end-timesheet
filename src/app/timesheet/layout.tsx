import { Navigation } from '@/components/Navigation'

export default function TimesheetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Navigation />
      <main>{children}</main>
    </div>
  )
}
