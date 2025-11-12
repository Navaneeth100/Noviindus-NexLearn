import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'

export default function Instructions() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        const res = await api.questionList(token);
        setData(res);
      } catch (err) { setError(err.message); }
    }
    load();
  }, [token]);

  if (!data) return (<div className="min-h-screen flex items-center justify-center"><div>Loading...</div></div>)

  return (
    <div className="min-h-screen bg-[#E9F3F6] text-[#0F1F39]">
      <div className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-between">
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
        <img src="/Logo1.png" className="w-25 h-12" alt="logo" />
      </div>

        <button
          className="bg-[#0A7CA0] text-white text-sm px-5 py-2 rounded-md ml-auto"
          onClick={() => router.push('/')}
        >
          Logout
        </button>
      </div>

      <div className="max-w-4xl mx-auto text-center mt-10">
        <h1 className="text-xl font-semibold mb-8">
          Ancient Indian History MCQ
        </h1>

        <div className="mx-auto bg-[#102A3E] text-white rounded-xl p-6 grid grid-cols-3 gap-4 max-w-2xl">

          <div className="flex flex-col items-center justify-center border-r border-white/40">
            <div className="text-sm opacity-80">Total MCQ’s:</div>
            <div className="text-4xl font-bold mt-2">{data.questions_count}</div>
          </div>

          <div className="flex flex-col items-center justify-center border-r border-white/40">
            <div className="text-sm opacity-80">Total marks:</div>
            <div className="text-4xl font-bold mt-2">{data.total_marks}</div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="text-sm opacity-80">Total time:</div>
            <div className="text-4xl font-bold mt-2">
              {data.total_time.toFixed(2)}
            </div>
          </div>

        </div>

        <div className="mt-10 max-w-2xl mx-auto text-left">

          <div className="font-semibold text-sm mb-3">Instructions:</div>

          <ol className="list-decimal pl-6 space-y-2 text-sm text-[#0F1F39]/80">
            <li>You have {Math.floor((data.total_time || 0) / 60)} minutes to complete the test.</li>
            <li>Test consists of {data.questions_count} multiple-choice q’s.</li>
            <li>You are allowed 2 retest attempts if you do not pass on the first try.</li>
            <li>Each incorrect answer will incur a negative mark of -1/4.</li>
            <li>Ensure you are in a quiet environment and have a stable internet connection.</li>
            <li>Keep an eye on the timer, and try to answer all questions within the given time.</li>
            <li>Do not use external resources such as dictionaries, websites, or assistance.</li>
            <li>Complete the test honestly to accurately assess your proficiency level.</li>
            <li>Check answers before submitting.</li>
            <li>Your test results will be displayed immediately after submission.</li>
          </ol>
          <div className="mt-8 flex justify-center">
            <button className="bg-[#0F1F39] text-white w-48 py-3 rounded-md text-sm font-medium"  onClick={() => router.push('/exam')}>Start Test</button>
          </div>
        </div>
      </div>
    </div>
  )
}
