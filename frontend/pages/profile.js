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
        <h1 className="text-xl font-semibold mb-4">Add Your Details</h1>
        <form onSubmit={onFormSubmit} className="space-y-4">

          <div>
            <div className="label mb-1">Profile Image</div>

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-3 mb-2 w-32 h-32 object-cover rounded-xl border border-slate-300"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setImage(file);

                if (file) {
                  setPreview(URL.createObjectURL(file));
                }
              }}
              className="block"
            />
          </div>

          <div><div className="label mb-1">Name*</div><input className="input" value={name} onChange={e => setName(e.target.value)} required /></div>
          <div><div className="label mb-1">Email</div><input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
          <div><div className="label mb-1">Your Qualification*</div><input className="input" value={qualification} onChange={e => setQualification(e.target.value)} required /></div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button className="btn w-full bg-brand text-white" disabled={loading}>{loading ? 'Saving...' : 'Get Started'}</button>
        </form>
      </Container>
    </>
  )
}
