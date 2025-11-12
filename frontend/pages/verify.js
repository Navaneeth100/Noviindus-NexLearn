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
      }, {
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
      <h1 className="text-2xl font-semibold text-slate-900">Enter the code we texted you</h1>
      <p className="text-sm text-slate-600 mt-2 mb-6">We’ve sent an SMS to <span className="font-medium">{mobile}</span></p>
      <form onSubmit={onFormSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            SMS code
          </label>

          <input type="text" maxLength={6} className="w-full border border-slate-300 rounded-lg px-3 py-3 bg-white text-black" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" required />
        </div>

        <p className="text-xs text-slate-500">
          Your 6 digit code is on its way. This can sometimes take a few moments to arrive.
        </p>

        <p className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">
          Resend code
        </p>

        {error && (<div className="text-center text-red-600 text-sm font-medium">{error}</div>)}
        <button className="w-full bg-[#0A182E] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#0d1d36] transition" disabled={loading}>{loading ? 'Verifying...' : 'Get Started'}</button>
      </form>
    </Container>
  )
}
