import Layout from '../lib/components/Layout'
import PageTitle from '../lib/components/PageTitle'
import ContactCard from '../lib/components/ContactCard'
import MoneyButtonTip from '../lib/components/MoneyButtonTip'

export default function AboutPage () {
  return (
    <Layout title='About'>
      <PageTitle>About</PageTitle>
      <p>
        HeartMail was founded on January 1, 2022.
      </p>
      <p>
        HeartMail Inc.<br />
        1321 Upland Dr.<br />
        Houston, TX 77043<br />
        USA
      </p>
      <ContactCard avatar='/ryan.jpg' name='Ryan X. Charles' heartmail='ryan@heartmail.com' bio='Cofounder & CEO of HeartMail' />
      <ContactCard avatar='/casey.jpg' name='Casey N. Hamilton' heartmail='casey@heartmail.com' bio='Cofounder & COO of HeartMail' />
      <ContactCard avatar='/diddy.jpg' name='Diddy Wheldon' heartmail='diddy@heartmail.com' bio='Project Manager of HeartMail' />
      <ContactCard avatar='/ruth.jpg' name='Ruth Heasman' heartmail='ruth@heartmail.com' bio='Branding of HeartMail' />
      <MoneyButtonTip />
    </Layout>
  )
}
