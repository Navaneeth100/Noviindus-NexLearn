import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'

export default function Instructions(){
  const { token } = useAuth();
  const [data,setData] = useState(null);
  const [error,setError]=useState('');
  const router = useRouter();

  useEffect(()=>{
    async function load(){
      try{
        const res = await api.questionList(token);
        setData(res);
      }catch(err){ setError(err.message); }
    }
    load();
  },[token]);

  if(!data) return <div className='min-h-screen flex items-center justify-center'><div>Loading...</div></div>

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" className="w-8 h-8" alt="logo"/>
            <div className="font-semibold">NexLearn</div>
          </div>
          <button className="btn" onClick={()=>router.push('/')}>Logout</button>
        </div>

        <h1 className="text-center text-xl font-semibold mb-6">Ancient Indian History MCQ</h1>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card"><div className="text-slate-500 text-sm">Total MCQs</div><div className="text-4xl font-bold">{data.questions_count}</div></div>
          <div className="card"><div className="text-slate-500 text-sm">Total marks</div><div className="text-4xl font-bold">{data.total_marks}</div></div>
          <div className="card"><div className="text-slate-500 text-sm">Total time</div><div className="text-4xl font-bold">{data.total_time}:00</div></div>
        </div>

        <div className="card">
          <div className="font-semibold mb-3">Instructions:</div>
          <ol className="list-decimal pl-6 space-y-2 text-sm text-slate-700">
            <li>You have {Math.round((data.total_time||0)/60)} minutes to complete the test.</li>
            <li>Test consists of {data.questions_count} multiple-choice qs.</li>
            <li>Each incorrect answer may incur negative marking if applicable.</li>
            <li>Ensure a stable internet connection and do not refresh during the test.</li>
            <li>Do not use external resources or assistance.</li>
            <li>Your results will be shown immediately after submission.</li>
          </ol>
          <div className="mt-6 flex justify-center">
            <button className="btn bg-brand text-white" onClick={()=>router.push('/exam')}>Start Test</button>
          </div>
        </div>
      </div>
    </div>
  )
}
