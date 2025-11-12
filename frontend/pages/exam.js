import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { base } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import Timer from '../components/Timer'
import { useRouter } from 'next/router'
import axios from "axios";

export default function Exam() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState({});
  const [idx, setIdx] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res = await api.questionList(token);
      setData(res);
    })();
  }, [token]);

  const questions = data?.questions || [];
  const q = questions[idx];

  function setAnswer(qid, optionId) {
    setAnswers({ ...answers, [qid]: optionId });
    setStatus({ ...status, [qid]: 'answered' });
  }

  function markForReview(qid) {
    setStatus({ ...status, [qid]: 'review' });
  }

  const onFormSubmit = async () => {
    const payload = questions.map(q => ({
      question_id: q.question_id,
      selected_option_id: answers[q.question_id] ?? null
    }));

    const fd = new FormData();
    fd.append("answers", JSON.stringify(payload));

    try {
      const res = await axios.post(
        `${base}/answers/submit`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      router.push({
        pathname: "/result",
        query: {
          score: res.data.score,
          correct: res.data.correct,
          wrong: res.data.wrong,
          not_attended: res.data.not_attended,
          total: data.questions_count
        }
      });

    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  }



  if (!data) return (<div className='min-h-screen flex items-center justify-center'><div>Loading...</div></div>)

  const seconds = data.total_time ? data.total_time * 60 : (questions.length * (data.time_for_each_question || 60));

  return (
    <div className="min-h-screen bg-[#E9F3F6] text-[#0F1F39]">
      <div className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-between relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          <img src="/Logo1.png" className="w-25 h-12 object-contain" alt="logo" />
        </div>
        <button className="bg-[#0A7CA0] text-white text-sm px-5 py-2 rounded-md hover:bg-[#096a8c] ml-auto" onClick={() => router.push('/')}>Logout</button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-[1fr_400px] gap-4 p-5'>
        <div className='card bg-white p-5 shadow'>
          <div className='text-sm text-slate-500 text-right'>{String(idx + 1).padStart(2, '0')}/{questions.length}</div>
          <div className='font-medium mb-3'>{q?.question}</div>
          {q?.image && (<img src={q.image} className="rounded-md mb-3 w-full max-h-64 object-contain" />)}
          <div className='space-y-2'>
            {q?.options?.map(opt => (
              <label key={opt.id} className={`flex items-center gap-2 border rounded-lg p-3 cursor-pointer transition ${answers[q.question_id] === opt.id ? 'bg-blue-50 border-blue-500' : 'hover:bg-slate-50'}`}>
                <input type='radio' name={'q' + q.question_id} checked={answers[q.question_id] === opt.id} onChange={() => setAnswer(q.question_id, opt.id)} />
                <span>{opt.option}</span>
              </label>
            ))}
          </div>
          <div className='flex gap-3 mt-5'>
            <button className='btn !bg-purple-500 text-white hover:bg-[#112a4d]' onClick={() => markForReview(q.question_id)}>Mark for review</button>
            <button className='btn flex-1 bg-[#0A182E] text-white hover:bg-[#112a4d]' onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}>Previous</button>
            <button className='btn flex-1 bg-[#0A182E] text-white hover:bg-[#112a4d]' onClick={() => setIdx(i => Math.min(questions.length - 1, i + 1))} disabled={idx === questions.length - 1}>Next</button>
          </div>
        </div>

        <div className='card bg-white p-5 shadow'>
          <div className='flex items-center justify-between mb-5'>
            <div className='font-semibold text-slate-800'>Question No. Sheet</div>
            <div className='flex items-center gap-2 text-sm'>
              <Timer seconds={seconds} onEnd={onFormSubmit} onTick={setRemainingTime} /></div>
          </div>
          <div className='grid grid-cols-10 gap-2'>
            {questions.map((qq, i) => {
              const st = status[qq.question_id];
              const cls = st === 'answered' ? 'bg-green-500 text-white' : st === 'review' ? 'bg-purple-500 text-white' : answers[qq.question_id] == null ? 'bg-red-500 text-white' : 'bg-slate-200';
              return (
                <button key={qq.question_id} className={'rounded-md text-sm py-2 transition ' + cls} onClick={() => setIdx(i)}>{i + 1}</button>
              )
            })}
          </div>
          <div className='mt-5 flex items-center gap-3 text-xs'>
            <span className='badge bg-green-500 text-white'>Answered</span>
            <span className='badge bg-purple-500 text-white'>Marked For Review</span>
            <span className='badge bg-red-500 text-white'>Not Attended</span>
          </div>
          <button className='btn w-full mt-5 bg-[#0A182E] text-white hover:bg-[#112a4d]' onClick={() => setShowConfirm(true)}>Submit</button>
        </div>
      </div>

      {showConfirm && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl shadow-xl p-6 w-full max-w-sm text-center'>
            <h2 className='text-lg font-semibold mb-4 text-slate-800'>
              Are you sure you want to submit the test?
            </h2>
            <div className='text-sm text-slate-600 mb-5 space-y-2'>
              <div>Remaining Time: <b>  <b>{String(Math.floor(remainingTime / 60)).padStart(2, '0')}:{String(remainingTime % 60).padStart(2, '0')}</b></b></div>
              <div>Total Questions: {questions.length}</div>
              <div>Answered: {Object.keys(answers).length}</div>
              <div>
                Not Attended:{' '}
                {questions.length -
                  Object.keys(answers).length -
                  Object.values(status).filter(s => s === 'review').length}
              </div>
              <div>
                Marked for Review:{' '}
                {Object.values(status).filter(s => s === 'review').length}
              </div>
            </div>
            <div className='flex gap-3 justify-center'>
              <button
                className='btn bg-[#0A182E] text-white hover:bg-[#112a4d] px-5'
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className='btn bg-[#0A182E] text-white hover:bg-[#112a4d] px-6'
                onClick={onFormSubmit}
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
