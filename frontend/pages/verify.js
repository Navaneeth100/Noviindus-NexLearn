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
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { save } = useAuth();

  const onFormSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    setIsSuccess(false);

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
        setIsSuccess(true);
        setMessage(res.data.message || "OTP verified successfully!");
        if (res.data.login === true) {
          setTimeout(() => {
            save(res.data.access_token, res.data.user || null);
            router.push('/instructions');
          }, 1000)
        } else {
          router.push({
            pathname: '/profile',
            query: { mobile: mobile }
          });
        }
      } else {
        setIsSuccess(false);
        setMessage(res.data.message || "OTP verification failed");
      }

    } catch (err) {
      setMessage(err?.response?.data?.message || err.message);
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

        {message && (<div className={`text-center text-sm font-medium mt-1 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>{message}</div>)}
        <button className="w-full bg-[#0A182E] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#0d1d36] transition" disabled={loading}>{loading ? 'Verifying...' : 'Get Started'}</button>
      </form>
    </Container>
  )
}
