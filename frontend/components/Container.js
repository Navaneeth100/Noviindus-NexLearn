import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });
import studyAnimation from "../public/lottie/education.json";

export default function Container({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4" style={{ backgroundImage: "url('/background.jpg')" }}>
      <div className="w-full max-w-6xl mx-auto flex justify-center">

        <div className="bg-[#0b1b33]/60 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.4)]w-full max-w-5xl grid md:grid-cols-2 overflow-hiddenborder border-white/10">
          <div className="hidden md:flex flex-col items-center justify-center bg-[#0f223f]/80 p-10">
            <div className="flex items-center gap-3 mb-6">
              <img src="/Logo.png" className="w-41 h-15" alt="logo" />
            </div>

            <div className="w-80">
              <Lottie loop play animationData={studyAnimation} style={{ width: 320, height: 320 }} />
            </div>

          </div>

          <div className="bg-white p-10 flex items-center justify-center">
            <div className="w-full max-w-md">{children}</div>
          </div>
        </div>

      </div>
    </div>
  )
}
