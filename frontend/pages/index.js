import { useState } from 'react'
import Container from '../components/Container'
import { api } from '../lib/api'
import { base } from '../lib/api'
import { useRouter } from 'next/router'
import axios from "axios";

export default function Phone() {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter();

  const onFormSubmit = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    const submitData = {
      mobile: `+91${mobile}`
    }
    axios
      .post(`${base}/auth/send-otp`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then((res) => {

        if (res.status === 200 && res.data?.success === true) {
          setStatus(res.data?.success)
          setMessage(res.data.message);

          setTimeout(() => {
            router.push({
              pathname: "/verify",
              query: { mobile: `+91${mobile}` }
            });
          }, 1000);

        } else {
          toast.error(res.data?.message || "Something went wrong");
        }

      })
      .catch((error) => {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while sending the OTP. Please try again.";

        setMessage(message);
        toast.error(message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Container>
        <h1 className="text-2xl font-semibold text-slate-900">Enter your phone number</h1>

        <p className="text-slate-600 text-sm mt-2 mb-6">
          We use your mobile number to identify your account
        </p>

        <form onSubmit={onFormSubmit} className="space-y-5">
          <label className="block text-sm font-medium text-slate-700">Phone number</label>

          <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-3 bg-white">
            <span className="text-xl">🇮🇳</span>
            <span className="text-slate-600 font-medium">+91</span>
            <input
              type="text"
              maxLength={10}
              value={mobile}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                setMobile(val);
              }}
              className="flex-1 bg-transparent outline-none text-slate-900 placeholder-slate-400"
              placeholder="1234567890"
              disabled={loading}
              required
            />
          </div>

          {message && (<div className={`text-center text-sm font-medium ${status ? "text-green-600" : "text-red-600"}`}>{message}</div>)}
          <button className="w-full py-3 rounded-lg text-sm font-semibold bg-[#0A182E] hover:bg-[#0d1d36] text-white transition" disabled={loading}>{loading ? 'Sending...' : 'Get Started'}</button>

          <p className="text-xs text-slate-500">
            By tapping Get Started, you agree to the{" "}
            <span className="text-blue-600 cursor-pointer">Terms & Conditions</span>
          </p>

        </form>
      </Container>
    </>
  )
}
