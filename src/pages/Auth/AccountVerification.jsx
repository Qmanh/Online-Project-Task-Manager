import { useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { verifyUserAPI } from '~/apis'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'

const AccountVerification = () => {
  let [searchParams] = useSearchParams()

  const { email, token } = Object.fromEntries([...searchParams])

  const [verified, setVerified] = useState(false)

  //call api
  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token })
        .then(() => setVerified(true))
        .catch()
    }
  }, [email, token])

  if (!email || !token) {
    return <Navigate to='/404NotFound' />
  }

  if (verified) {
    return (
      <PageLoadingSpinner caption={'Verifying your account..'} />
    )
  }
  return <Navigate to={`/login?verifiedEmail=${email}`} />
}

export default AccountVerification
