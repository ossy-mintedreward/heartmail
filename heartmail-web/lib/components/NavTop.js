import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Image from 'next/image'
import Link from './Link'
import Avatar from '@mui/material/Avatar'

export default function NavTop (props) {
  const showAccount = !(props.showAccount === false)
  return (
    <Box>
      <AppBar position='fixed'>
        <Toolbar>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
            <Box sx={{ marginTop: '5px', width: '40px', height: '40px' }}>
              {/** TODO: Place burger menu here */}
            </Box>
            <Box sx={{ alignItems: 'center', flex: 1, display: 'flex', flexDirection: 'column', marginTop: '7px' }}>
              <Link href='/'>
                <Image src='/heartmail-small.png' alt='HeartMail: Get paid for email.' width='205' height='35.14' />
              </Link>
            </Box>
            <Box sx={{ marginTop: '5px', width: '40px', height: '40px' }}>
              {showAccount
                ? (
                  <Link href='/accounts'>
                    <Avatar src='/anonymous-avatar-120.jpg' alt='Self' width='40' height='40' />
                  </Link>
                  )
                : ('')}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Box>
  )
}
