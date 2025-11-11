import { useEffect, useMemo, useState } from 'react'
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

  const onFormSubmit = async (e) => {
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


  if (!data) return <div className='min-h-screen flex items-center justify-center'><div>Loading...</div></div>

  const seconds = data.total_time ? data.total_time * 60 : (questions.length * (data.time_for_each_question || 60));

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="max-w-6xl mx-auto p-4">
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center gap-2'>
            <img src='/logo.svg' className='w-8 h-8' alt='logo' />
            <div className='font-semibold'>NexLearn</div>
          </div>
          <Timer seconds={seconds} onEnd={onFormSubmit} />
          <button className='btn' onClick={() => router.push('/')}>Logout</button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-[1fr_320px] gap-4'>
          <div className='card'>
            <div className='text-sm text-slate-500 text-right'>{String(idx + 1).padStart(2, '0')}/{questions.length}</div>
            <div className='font-medium mb-2'>{q?.question}</div>
            {q?.image && <img src={q.image} className="rounded-md mb-3" />}
            <div className='space-y-2'>
              {q?.options?.map(opt => (
                <label key={opt.id} className='flex items-center gap-2 border rounded-xl p-3 cursor-pointer'>
                  <input type='radio' name={'q' + q.question_id} checked={answers[q.question_id] === opt.id} onChange={() => setAnswer(q.question_id, opt.id)} />
                  <span>{opt.option}</span>
                </label>
              ))}
            </div>
            <div className='flex gap-3 mt-4'>
              <button className='btn bg-slate-200' onClick={() => markForReview(q.id)}>Mark for review</button>
              <button className='btn flex-1' onClick={() => setIdx(i => Math.max(0, i - 1))}>Previous</button>
              <button className='btn flex-1 bg-brand text-white' onClick={() => setIdx(i => Math.min(questions.length - 1, i + 1))}>Next</button>
            </div>
          </div>

          <div className='card'>
            <div className='font-semibold mb-2'>Question No. Sheet</div>
            <div className='grid grid-cols-10 gap-2'>
              {questions.map((qq, i) => {
                const st = status[qq.question_id];
                const cls = st === 'answered' ? 'bg-green-500 text-white' : st === 'review' ? 'bg-purple-500 text-white' : (answers[qq.question_id] == null ? 'bg-red-500 text-white' : 'bg-slate-200');
                return (
                  <button key={qq.question_id} className={'rounded-md text-sm py-2 ' + cls} onClick={() => setIdx(i)}>{i + 1}</button>
                )
              })}
            </div>
            <div className='mt-4 flex items-center gap-4 text-sm'>
              <span className='badge bg-green-500 text-white'>Answered</span>
              <span className='badge bg-purple-500 text-white'>Marked For Review</span>
              <span className='badge bg-red-500 text-white'>Not Attended</span>
            </div>
            <button className='btn w-full mt-4 bg-brand text-white' onClick={onFormSubmit}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  )
}
