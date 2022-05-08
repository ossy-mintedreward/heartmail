import MoneyButton from '@moneybutton/react-money-button'

export default function MB () {
  return (
    <div style={{width: 300, height: 70}}>
      <div style={{width: 280, height: 50, padding: 0, margin: 10, backgroundColor: '#f6f6f6', borderRadius: 25}}>
        <MoneyButton
          to='heartmail@moneybutton.com'
          amount='10'
          currency='USD'
          label='Buy Access'
          onPayment={(payment) => {console.log(payment); console.log(payment.amountUsd, payment.id, payment.userId, payment.senderPaymail, payment.user.email, payment.user.emailVerified)}}
        />
      </div>
    </div>
  )
}
