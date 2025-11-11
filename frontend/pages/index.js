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
        <h1 className="text-xl font-semibold mb-4">Enter your phone number</h1>
        <form onSubmit={onFormSubmit} className="space-y-4">
          <div>
            <div className="label mb-1">Phone number</div>

            <div className="flex items-center input">
              <span className="mr-2 text-slate-600 font-medium">+91</span>
              <input
                className="flex-1 outline-none bg-transparent"
                type="text"
                maxLength={10}
                value={mobile}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setMobile(val);
                }}
                placeholder="1234567890"
                disabled={loading}
                required
              />
            </div>
          </div>

          {message && <div className={`text-center text-sm mt-2 ${status ? "text-green-600" : "text-red-600"}`}>{message}</div>}
          <button className="btn w-full bg-brand text-white" disabled={loading}>{loading ? 'Sending...' : 'Get Started'}</button>
        </form>
      </Container>
    </>
  )
}
