import { motion, useScroll, useTransform } from "framer-motion";


const MultiLevelParallax = () => {
  const { scrollYProgress } = useScroll();

  const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 75],"easeIn");

  const bgOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  const infoOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);
  const infoY = useTransform(scrollYProgress, [0.5, 0.7], [40, 0]);

  return (
    <section className="relative h-[400vh]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-black">

        <motion.div
          style={{ opacity: bgOpacity }}
          className="absolute inset-0 z-0"
        >
          <img
            src="/image-7.png"
            alt="Gateway Plaza"
            className="w-full h-full object-cover"
          />
        </motion.div>
        <motion.h1
          style={{ scale: textScale }}
          className="absolute z-10 text-8xl font-black tracking-[0.3em] text-amber-400 select-none"
        >
          MUMBAI
        </motion.h1>


        <motion.div
          style={{ opacity: infoOpacity, y: infoY }}
          className="absolute z-20 text-center text-white px-8 max-w-2xl"
        >
          <h2 className="text-5xl font-bold mb-4">The City of Dreams</h2>
          <p className="text-lg text-white leading-relaxed">
          A CITY THAT NEVER SLEEPS 
          </p>
          <button className="mt-8 px-8 py-3 border-2 border-white text-white uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300">
            Explore
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default MultiLevelParallax;