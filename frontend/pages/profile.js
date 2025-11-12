import { useRouter } from 'next/router'
import { useState } from 'react'
import Container from '../components/Container'
import { api } from '../lib/api'
import { base } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { toast } from "sonner";
import axios from "axios";

export default function Profile() {
  const router = useRouter();
  const mobile = router.query.mobile || '';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [qualification, setQualification] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { save, token } = useAuth();


  const onFormSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const formData = new FormData();
      formData.append("mobile", mobile);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("qualification", qualification);
      if (image) formData.append("profile_image", image);

      const res = await axios.post(
        `${base}/auth/create-profile`,
        formData,
        {}
      );

      if (res.status === 200 && res.data?.success === true) {
        save(res.data.access_token, res.data.user);
        router.push("/instructions");
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Container>
        <h1 className="text-2xl font-semibold text-slate-900 mb-6">Add Your Details</h1>
        <form onSubmit={onFormSubmit} className="space-y-5">
          <div className="flex flex-col items-center">
            <label
              htmlFor="profile-upload"
              className="w-40 h-32 flex flex-col items-center justify-center 
               border border-dashed border-slate-300 rounded-lg
               text-slate-500 cursor-pointer hover:bg-slate-50/40 transition"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#6B7280"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>

                  <span className="text-xs mt-1 text-slate-400">
                    Add Your Profile picture
                  </span>
                </>
              )}
            </label>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setImage(file);
                if (file) setPreview(URL.createObjectURL(file));
              }}
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Name*
            </label>
            <input
              className="w-full border border-slate-300 rounded-lg px-3 py-3 outline-none text-black"
              placeholder="Enter your Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-slate-300 rounded-lg px-3 py-3 outline-none text-black"
              placeholder="Enter your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Your Qualification*
            </label>
            <input
              className="w-full border border-slate-300 rounded-lg px-3 py-3 outline-none text-black"
              placeholder="Enter your Qualification"
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              required
            />
          </div>

          {error && (<div className="text-red-600 text-sm text-center">{error}</div>)}
          <button className="w-full bg-[#0A182E] py-3 rounded-lg text-white text-sm font-semibold hover:bg-[#0d1d36] transition" disabled={loading}>{loading ? "Saving..." : "Get Started"}</button>
        </form>
      </Container>
    </>
  )
}
