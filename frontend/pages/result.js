import { useRouter } from 'next/router'

export default function Result() {
  const router = useRouter();
  const { score, correct, wrong, not_attended, total } = router.query;

  return (
    <div className="min-h-screen bg-[#E9F3F6] text-[#0F1F39] flex flex-col">
      <div className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-between relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2"><img src="/Logo1.png" className="w-25 h-12 object-contain" alt="logo" />
        </div>

        <button
          className="bg-[#0A7CA0] text-white text-sm px-5 py-2 rounded-md hover:bg-[#096a8c] ml-auto"
          onClick={() => router.push('/')}
        >
          Logout
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-transparent">

          <div className="bg-gradient-to-b from-[#0A7CA0] to-[#0A182E] text-white rounded-t-2xl text-center py-8 shadow-md">
            <div className="text-sm mb-2 opacity-80">Marks Obtained:</div>
            <div className="text-5xl font-extrabold tracking-wide">{score} / {total}</div>
          </div>

          <div className="bg-white rounded-b-2xl shadow-lg px-8 py-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                Total Questions:
              </div>
              <div className="font-semibold">{total}</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                Correct Answers:
              </div>
              <div className="font-semibold">{correct}</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                Incorrect Answers:
              </div>
              <div className="font-semibold">{wrong}</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                Not Attended Questions:
              </div>
              <div className="font-semibold">{not_attended}</div>
            </div>

            <div className="pt-5 text-center">
              <button
                className="w-full bg-[#0A182E] text-white py-2 rounded-md hover:bg-[#112a4d] transition"
                onClick={() => router.push('/instructions')}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
