import { useRouter } from 'next/router'

export default function Result(){
  const router = useRouter();
  const {score, correct, wrong, not_attended, total} = router.query;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex items-start justify-center p-6">
      <div className='w-full max-w-2xl'>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-2'><img src='/logo.svg' className='w-8 h-8'/><div className='font-semibold'>NexLearn</div></div>
          <button className='btn bg-[#0A182E] text-white hover:bg-[#112a4d]' onClick={()=>router.push('/')}>Logout</button>
        </div>
        <div className='card'>
          <div className='text-center'>
            <div className='text-sm text-slate-500'>Marks Obtained:</div>
            <div className='text-5xl font-extrabold text-brand my-4'>{score} / {total}</div>
          </div>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'><div className='text-slate-600'>Total Questions:</div><div className='font-semibold'>{total}</div></div>
            <div className='flex items-center justify-between'><div className='text-slate-600'>Correct Answers:</div><div className='font-semibold'>{correct}</div></div>
            <div className='flex items-center justify-between'><div className='text-slate-600'>Incorrect Answers:</div><div className='font-semibold'>{wrong}</div></div>
            <div className='flex items-center justify-between'><div className='text-slate-600'>Not Attended Questions:</div><div className='font-semibold'>{not_attended}</div></div>
          </div>
          <div className='mt-6 text-center'>
            <button className='btn bg-[#0A182E] text-white hover:bg-[#112a4d]' onClick={()=>router.push('/instructions')}>Done</button>
          </div>
        </div>
      </div>
    </div>
  )
}
