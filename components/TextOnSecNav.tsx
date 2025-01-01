import { Iceland } from "@next/font/google";
import { useState } from "react";
import { Typewriter } from "react-typewriting-effect";

const Iceland_font = Iceland({
  subsets: ["latin"],
  weight: ["400"],
});
const TextOnSecNav = () => {
  const [textStep, setTextStep] = useState(0);
  return (
    <div className="absolute top-0 transition-all duration-1000 w-full h-full">
      <div
        className={`text-white text-xl w-full p-10 h-auto m-auto translate-y-[200px] border-red-100 ${Iceland_font.className}  text-center`}
      >
        {textStep == 0 && (
          <Typewriter
            string='"This is my portfolio..."'
            onComplete={() => {
              setTimeout(() => {
                setTextStep(1);
              }, 2000);
            }}
            delay={10}
          />
        )}
        <br />
        {textStep > 0 && textStep < 2 && (
          <Typewriter
            string='"Welcome to my digital portfolio."'
            onComplete={() => {
              setTimeout(() => {
                setTextStep(2);
              }, 2000);
            }}
            delay={10}
          />
        )}
        {textStep > 1 && textStep < 3 && (
          <Typewriter
            string="Who's behind this?"
            onComplete={() => {
              setTimeout(() => {
                setTextStep(3);
              }, 2000);
            }}
            delay={10}
          />
        )}
        {textStep > 2 && textStep < 8 && (
          <p className="text-2xl">
            <Typewriter
              string="It's me, Hasitha Sandakelum."
              onComplete={() => {
                setTimeout(() => {
                  setTextStep(4);
                }, 2000);
              }}
              delay={10}
            />
          </p>
        )}
        {textStep > 3 && textStep < 5 && (
          <Typewriter
            string="I'm a passionate developer, designer, and problem solver."
            onComplete={() => {
              setTimeout(() => {
                setTextStep(5);
              }, 2000);
            }}
            delay={20}
          />
        )}
        {textStep > 4 && textStep < 8 && (
          <Typewriter
            string="Explore my work, my journey, and my vision."
            onComplete={() => {
              setTimeout(() => {
                setTextStep(7);
              }, 2000);
            }}
            delay={10}
          />
        )}
        <br />
        {textStep > 6 && textStep < 8 && (
          <button className= {`${textStep > 6 ? 'opacity-100' : 'opacity-0'}  px-6 py-1/2 mt-5 text-white font-semibold rounded-full shadow-lg transform transition duration-300 hover:bg-blue-700 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-opacity-30 border-2 border-blue-600`}>
            Explore
          </button>
        )}
      </div>
    </div>
  );
};

export default TextOnSecNav;
