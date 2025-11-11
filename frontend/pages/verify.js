import { useRouter } from 'next/router'
import { useState } from 'react'
import Container from '../components/Container'
import { api } from '../lib/api'
import { base } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import axios from "axios";

export default function Verify() {
  const router = useRouter();
  const mobile = router.query.mobile || '';
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { save } = useAuth();

const onFormSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {

    const res = await axios.post(`${base}/auth/verify-otp`, {
      mobile: mobile,
      otp: otp
    }  ,    {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

    if (res.data.success === true) {
      if (res.data.login === true) {
        save(res.data.access_token, res.data.user || null);
        router.push('/instructions');
      } else {
        router.push({
          pathname: '/profile',
          query: { mobile: mobile }
        });
      }
    } else {
      setError(res.data.message || "OTP verification failed");
    }

  } catch (err) {
    setError(err?.response?.data?.message || err.message);
  }

  setLoading(false);
};


  return (
    <Container>
      <h1 className="text-xl font-semibold mb-4">Enter the code we texted you</h1>
      <div className="text-sm text-slate-600 mb-2">We’ve sent an SMS to {mobile}</div>
      <form onSubmit={onFormSubmit} className="space-y-4">
        <input className="input" value={otp} onChange={e => setOtp(e.target.value)} placeholder="123456" required />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="btn w-full bg-brand text-white" disabled={loading}>{loading ? 'Verifying...' : 'Get Started'}</button>
      </form>
    </Container>
  )
}
