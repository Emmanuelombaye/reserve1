import ShopSubPage from '../../../components/ShopSubPage'
import { pageMetadata } from '../../../lib/seo'

export const metadata = pageMetadata({
  title: 'Order Support',
  description: 'Order support for RSRV supplement purchases, shipping, and returns.',
  path: '/supplements/order-support',
})

export default function Page() {
  return <ShopSubPage params={{ slug: 'order-support' }} />
}
