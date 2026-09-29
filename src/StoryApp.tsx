import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Clock, Volume2, VolumeX, Users, Flower2, PenTool, Utensils, Car } from 'lucide-react';
import RSVPForm from './RSVPForm'; // We'll extract RSVPForm
import WishesForm from './WishesForm';

function SectionBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <img
        src="/background.jpeg"
        alt="Background"
        className="w-full h-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white/60" />
    </div>
  );
}

export default function StoryApp() {
  const [invitationOpened, setInvitationOpened] = useState(false);
  const [introPlayed, setIntroPlayed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const playIntroVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.play().catch(() => undefined);
  };

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const weddingDate = new Date('2026-12-21T09:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (invitationOpened) {
      if (audioRef.current) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
      if (videoRef.current) {
        playIntroVideo();
      }
    }
  }, [invitationOpened]);



  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Read personalized guest link params
  const urlParams = new URLSearchParams(window.location.search);
  const guestPrefix = urlParams.get('prefix') || '';
  let guestName = urlParams.get('guest') || '';

  if (!guestName && window.location.pathname.length > 1) {
    const rawPath = decodeURIComponent(window.location.pathname.replace(/^\//, ''));
    if (!rawPath.startsWith('admin') && !rawPath.startsWith('confirm')) {
      guestName = rawPath;
    }
  }

  return (
    <>
      <AnimatePresence>
        {!invitationOpened && (
          <motion.div
            key="invitation-opened"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0 }}
            className="fixed inset-0 z-[200] bg-[#FAFAFA] flex flex-col items-center justify-center"
          >
            <div className="absolute inset-0 z-0 pointer-events-none">
              <img
                src="/background.jpeg"
                alt="Background"
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/80" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="z-10 flex flex-col items-center gap-8"
            >
              <h1 className="text-center px-4 leading-[1.1] drop-shadow-sm">
                <span className="serif italic text-6xl sm:text-[6.5rem] text-[#2C2C2C] font-medium">Roshani</span>
                <br />
                <span className="serif italic text-4xl sm:text-5xl text-[#D4AF37] inline-block py-2">&amp;</span>
                <br />
                <span className="serif italic text-6xl sm:text-[6.5rem] text-[#2C2C2C] font-medium">Harindu</span>
              </h1>
              <p className="text-sm uppercase tracking-[0.3em] text-[#2C2C2C] font-medium text-center">
                Wedding Invitation
              </p>

              <button
                onClick={() => setInvitationOpened(true)}
                className="mt-8 px-8 py-3 bg-[#1A1A1A] text-white rounded-full text-sm uppercase tracking-widest hover:bg-[#D4AF37] transition-colors duration-300 shadow-lg shadow-black/10"
              >
                View Invitation
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {invitationOpened && !introPlayed && (
          <motion.div
            key="intro-video"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5 } }}
            className="fixed inset-0 z-[100] h-[100dvh] w-[100vw] overflow-hidden bg-black"
          >
            <video
              ref={(el) => {
                if (el) {
                  el.defaultMuted = true;
                  el.muted = true;
                }
                videoRef.current = el;
              }}
              src="/i_want_to_add_a_pink_touch_to.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              controls={false}
              onLoadedMetadata={playIntroVideo}
              onCanPlay={playIntroVideo}
              onEnded={() => setIntroPlayed(true)}
              className="absolute inset-0 block h-full w-full object-cover pointer-events-none"
            />

            <button
              onClick={() => setIntroPlayed(true)}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/40 backdrop-blur-md text-white/90 rounded-full border border-white/20 text-sm tracking-[0.2em] uppercase transition-all hover:bg-white/20 z-10 whitespace-nowrap"
            >
              Skip Intro
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="snap-container no-scrollbar bg-paper relative text-[#1A1A1A] font-sans">



        {/* --- SCREEN 1: Invite Details --- */}
        <section className="snap-section relative z-10 overflow-hidden bg-transparent">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src="/ChatGPT%20Image%20Sep%2030,%202026,%2002_42_00%20AM.png"
              alt="Hero Background"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white/60" />
          </div>
          <div className="absolute inset-0 overflow-visible flex flex-col items-center p-6 text-center">
            <div className="w-full my-auto flex flex-col items-center justify-center py-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="w-full max-w-sm flex flex-col items-center justify-center text-[#1A1A1A]"
              >


                {guestName ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="mb-6 flex flex-col items-center"
                  >
                    <p className="text-[12px] sm:text-sm uppercase tracking-[0.2em] font-bold text-[#1A1A1A] mb-4">
                      WE CORDIALLY INVITE
                    </p>
                    <p className="script text-2xl sm:text-4xl text-[#1A1A1A] drop-shadow-sm mb-4 text-center px-4">
                      {guestPrefix ? `${guestPrefix} ${guestName}` : guestName}
                    </p>
                    <div className="h-px w-16 bg-[#1A1A1A]/50 mb-6"></div>
                    <p className="text-[12px] sm:text-sm uppercase tracking-[0.2em] font-bold text-[#1A1A1A] mb-2 sm:mb-4">
                      TO CELEBRATE OUR
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <p className="text-[12px] sm:text-sm uppercase tracking-[0.2em] font-bold text-[#1A1A1A] mb-1">
                      INVITE YOU TO CELEBRATE
                    </p>
                    <p className="text-[12px] sm:text-sm uppercase tracking-[0.2em] font-bold text-[#1A1A1A] mb-2 sm:mb-4">
                      OUR
                    </p>
                  </>
                )}

                <h1 className="script text-6xl sm:text-[7rem] text-[#1A1A1A] mb-8 sm:mb-12 drop-shadow-lg font-bold">
                  Wedding
                </h1>

                <div className="flex flex-col items-center w-full mb-8 sm:mb-10">
                  <p className="text-[18px] sm:text-[22px] uppercase tracking-widest text-[#1A1A1A] font-bold mb-2">DECEMBER</p>
                  <div className="flex items-center justify-center w-full gap-4">
                    <div className="flex-1 text-right border-y border-[#1A1A1A]/40 py-2">
                      <p className="text-[14px] sm:text-[16px] uppercase tracking-widest text-[#1A1A1A] font-bold">MONDAY</p>
                    </div>
                    <p className="serif text-[5.5rem] sm:text-[7rem] font-bold text-[#1A1A1A] leading-none px-1">21</p>
                    <div className="flex-1 text-left border-y border-[#1A1A1A]/40 py-2">
                      <p className="text-[14px] sm:text-[16px] uppercase tracking-widest text-[#1A1A1A] font-bold">AT 9:00 AM</p>
                    </div>
                  </div>
                  <p className="text-[18px] sm:text-[22px] uppercase tracking-widest text-[#1A1A1A] font-bold mt-2">2026</p>
                </div>

                <a
                  href="https://maps.app.goo.gl/GuyxyJ4o4GXQEZpf9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="space-y-2 mt-2 sm:mt-4 text-[#1A1A1A] hover:opacity-70 transition-opacity block"
                >
                  <p className="text-[16px] sm:text-[18px] uppercase tracking-widest font-bold flex items-center justify-center gap-1.5">
                    <MapPin size={14} className="text-[#1A1A1A]" />
                    RADISSON BLU RESORT
                  </p>
                  <p className="text-[14px] sm:text-[16px] uppercase tracking-[0.15em] font-bold">GALLE</p>
                  <p className="text-[12px] sm:text-[14px] uppercase tracking-[0.15em] font-bold px-4">GALLE RADISSON BLU RESORT, GALLE</p>
                </a>

                <div className="mt-8 sm:mt-10">
                  <p className="text-[12px] sm:text-sm uppercase tracking-[0.15em] font-bold text-[#1A1A1A]">EVENT TIMELINE : 9.00 A.M. - 3.30 P.M.</p>
                </div>

                <div className="mt-4 sm:mt-6 flex justify-center">
                  <svg className="w-10 h-10 text-[#1A1A1A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 12c-1.5-1-2-2-2-4v-4l6-2v6c0 2-.5 3-2 4M9 12c1.5-1 2-2 2-4v-4l-6-2v6c0 2 .5 3 2 4M13 12v8M11 12v8M9 20h6" />
                    <circle cx="15.5" cy="5.5" r="0.5" fill="currentColor" />
                    <circle cx="14" cy="7.5" r="0.5" fill="currentColor" />
                    <circle cx="8.5" cy="5.5" r="0.5" fill="currentColor" />
                    <circle cx="10" cy="7.5" r="0.5" fill="currentColor" />
                  </svg>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- SCREEN 1.5: Parents --- */}
        <section className="snap-section relative z-10 overflow-hidden">
          <SectionBackground />
          <div className="absolute inset-0 overflow-visible flex flex-col items-center p-6 text-center">
            <div className="w-full my-auto flex flex-col items-center justify-center py-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="bg-white p-10 pt-16 rounded-t-[10rem] rounded-b-[2rem] border border-[#F0E6D2] w-full max-w-sm flex flex-col items-center shadow-xl relative overflow-hidden"
              >
                {/* Subtle texture overlay on the card */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dust.png')] opacity-30 pointer-events-none mix-blend-overlay" />

                <div className="relative z-10 w-full flex flex-col items-center text-center">
                  <h2 className="cursive text-5xl sm:text-6xl text-[#D4AF37] mb-3 mt-2">Together with</h2>
                  <h3 className="serif text-[13px] uppercase tracking-[0.3em] text-[#1A1A1A] mb-10 font-bold">Our Families</h3>

                  <div className="flex flex-col items-center w-full mb-8">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 mb-3 font-bold">Bride's Parents</p>
                    <p className="serif text-xl text-[#2C2C2C] leading-relaxed text-center">Mr. &amp; Mrs. Bandara</p>
                  </div>

                  {/* Elegant Divider */}
                  <div className="flex items-center justify-center gap-3 w-3/4 mx-auto mb-8">
                    <div className="h-px bg-[#F0E6D2] flex-1"></div>
                    <div className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]"></div>
                    <div className="h-px bg-[#F0E6D2] flex-1"></div>
                  </div>

                  <div className="flex flex-col items-center w-full">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 mb-3 font-bold">Groom's Parents</p>
                    <p className="serif text-xl text-[#2C2C2C] leading-relaxed text-center">Mr. &amp; Mrs. Shanaka</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- SCREEN 1.75: Countdown --- */}
        <section className="snap-section relative z-10 overflow-hidden">
          <SectionBackground />
          <div className="absolute inset-0 overflow-visible flex flex-col items-center p-6 text-center">
            <div className="w-full my-auto flex flex-col items-center justify-center py-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="bg-white p-10 pt-16 rounded-t-[10rem] rounded-b-[2rem] border border-[#F0E6D2] w-full max-w-sm flex flex-col items-center shadow-xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dust.png')] opacity-30 pointer-events-none mix-blend-overlay" />

                <div className="relative z-10 w-full flex flex-col items-center text-center">
                  <h2 className="cursive text-5xl sm:text-6xl text-[#D4AF37] mb-3 mt-2">Forever Begins In</h2>
                  <h3 className="serif text-[13px] uppercase tracking-[0.3em] text-[#1A1A1A] mb-10 font-bold">A Grace-filled occasion</h3>

                  <div className="flex flex-row items-center justify-center gap-6 w-full mb-8">
                    <div className="flex flex-col items-center">
                      <p className="serif text-5xl text-[#2C2C2C] leading-none mb-2">{timeLeft.days}</p>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Days</p>
                    </div>
                    <div className="text-4xl text-[#D4AF37] font-light -mt-4">:</div>
                    <div className="flex flex-col items-center">
                      <p className="serif text-5xl text-[#2C2C2C] leading-none mb-2">{timeLeft.hours}</p>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Hours</p>
                    </div>
                  </div>

                  {/* Elegant Divider */}
                  <div className="flex items-center justify-center gap-3 w-3/4 mx-auto mb-8">
                    <div className="h-px bg-[#F0E6D2] flex-1"></div>
                    <div className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]"></div>
                    <div className="h-px bg-[#F0E6D2] flex-1"></div>
                  </div>

                  <div className="flex flex-row items-center justify-center gap-6 w-full">
                    <div className="flex flex-col items-center">
                      <p className="serif text-5xl text-[#2C2C2C] leading-none mb-2">{timeLeft.minutes}</p>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Mins</p>
                    </div>
                    <div className="text-4xl text-[#D4AF37] font-light -mt-4">:</div>
                    <div className="flex flex-col items-center">
                      <p className="serif text-5xl text-[#2C2C2C] leading-none mb-2">{timeLeft.seconds}</p>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Secs</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>





        {/* --- SCREEN 3: Our Story --- */}
        <section className="snap-section relative z-10 overflow-hidden">
          <SectionBackground />
          <div className="absolute inset-0 overflow-visible flex flex-col items-center p-6 text-center">
            <div className="w-full my-auto flex flex-col items-center justify-center py-6 h-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="bg-[#FFFFFF]/90 backdrop-blur-sm p-6 py-8 rounded-[2rem] border border-[#F0E6D2] w-full max-w-sm flex flex-col items-center shadow-xl relative overflow-y-auto no-scrollbar max-h-[85vh]"
              >
                <div className="flex items-center justify-center gap-3 w-1/3 mx-auto mb-4">
                  <div className="h-px bg-[#D4AF37] flex-1"></div>
                  <div className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]"></div>
                  <div className="h-px bg-[#D4AF37] flex-1"></div>
                </div>

                <h2 className="serif text-[20px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mb-1 mt-1">
                  OUR STORY
                </h2>
                <h3 className="script text-[32px] text-[#D4AF37] mb-4">
                  And so, our forever begins
                </h3>

                <p className="serif text-[14px] sm:text-[15px] leading-[1.5] text-[#1A1A1A] mb-3">
                  It was never just one moment. It was every smile, every conversation, every quiet understanding, and every little memory that brought us here.
                </p>

                <p className="serif text-[14px] sm:text-[15px] leading-[1.5] text-[#1A1A1A] mb-3">
                  Somewhere between chance and destiny, we found in each other a love that feels effortless, rare and beautifully certain.
                </p>

                <p className="serif text-[14px] sm:text-[15px] leading-[1.5] text-[#1A1A1A] mb-3">
                  A love that became friendship. A friendship that became home. And a home we now choose to build together.
                </p>

                <p className="serif text-[14px] sm:text-[15px] leading-[1.5] text-[#1A1A1A] mb-3">
                  Today, we turn the page to the most beautiful chapter of our story.
                </p>

                <p className="script text-[28px] text-[#D4AF37] leading-[1.2] mb-3 px-4">
                  Not simply a beginning, but a promise of forever.
                </p>

                <p className="serif text-[14px] sm:text-[15px] leading-[1.5] text-[#1A1A1A] mb-4">
                  With hearts filled with love, we invite you to share in the joy of the day we become one.
                </p>

                <div className="flex items-center justify-center gap-3 w-1/3 mx-auto mb-4">
                  <div className="h-px bg-[#D4AF37] flex-1"></div>
                  <div className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]"></div>
                  <div className="h-px bg-[#D4AF37] flex-1"></div>
                </div>

                <h3 className="script text-[40px] text-[#D4AF37]">
                  Roshani &amp; Harindu
                </h3>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- SCREEN 4: Gallery --- */}
        <section className="snap-section relative z-10 overflow-hidden">
          <SectionBackground />
          <div className="absolute inset-0 overflow-visible flex flex-col items-center p-6 text-center">
            <div className="w-full my-auto flex flex-col items-center justify-center py-6 h-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="w-full max-w-sm flex flex-col items-center relative overflow-hidden bg-white/40 backdrop-blur-md p-6 py-10 rounded-[2rem] border border-white/60 shadow-xl"
              >
                <div className="flex items-center justify-center gap-3 w-1/3 mx-auto mb-2">
                  <div className="h-px bg-[#D4AF37] flex-1"></div>
                  <div className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]"></div>
                  <div className="h-px bg-[#D4AF37] flex-1"></div>
                </div>

                <h2 className="serif text-[20px] uppercase tracking-[0.25em] text-[#1A1A1A] font-semibold mb-1 mt-2">
                  GALLERY
                </h2>
                <h3 className="script text-[36px] text-[#D4AF37] mb-8 leading-tight">
                  Captured Moments
                </h3>

                <div className="grid grid-cols-2 gap-3 w-full">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.1, duration: 0.8 }} 
                    className="rounded-tl-[3rem] rounded-br-[1rem] overflow-hidden shadow-md border-2 border-white aspect-[4/5]"
                  >
                     <img src="/images/DSC05680%20copy.jpg.jpeg" alt="Couple 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.2, duration: 0.8 }} 
                    className="rounded-tr-[3rem] rounded-bl-[1rem] overflow-hidden shadow-md border-2 border-white aspect-[3/4] mt-8"
                  >
                     <img src="/images/DSC05715%20copy.jpg.jpeg" alt="Couple 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.3, duration: 0.8 }} 
                    className="rounded-bl-[3rem] rounded-tr-[1rem] overflow-hidden shadow-md border-2 border-white aspect-[3/4] -mt-8"
                  >
                     <img src="/images/DSC05874%20copy.jpg.jpeg" alt="Couple 3" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.4, duration: 0.8 }} 
                    className="rounded-br-[3rem] rounded-tl-[1rem] overflow-hidden shadow-md border-2 border-white aspect-[4/5]"
                  >
                     <img src="/images/DSC05876%20copy.jpg.jpeg" alt="Couple 4" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>


        {/* --- SCREEN 5: The Details --- */}
        <section className="snap-section relative z-10 overflow-hidden">
          <SectionBackground />
          <div className="absolute inset-0 overflow-visible flex flex-col items-center p-6 text-center">
            <div className="w-full my-auto flex flex-col items-center justify-center py-10">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="w-full max-w-sm flex flex-col gap-4"
              >
                <div className="bg-[#FFFFFF] p-8 rounded-[2rem] shadow-md border border-white">
                  <h3 className="script text-2xl sm:text-4xl text-[#D4AF37] mb-1">the</h3>
                  <h2 className="serif text-4xl tracking-[0.2em] text-[#1A1A1A] font-medium uppercase mb-6">Details</h2>

                  <div className="w-full h-32 rounded-xl overflow-hidden mb-4 relative">
                    <img src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/547617139.jpg?k=ed14dcd25bdf680138937dbb0e7532324ac7c2183f13c078fd14a07bdf7e6b52&o=" className="w-full h-full object-cover" alt="Radisson Blu Resort, Galle" />
                  </div>

                  <div className="bg-[#F0E6D2] py-2 rounded-t-xl mb-1">
                    <p className="text-[12px] uppercase tracking-[0.2em] font-bold text-[#D4AF37]">Location</p>
                  </div>
                  <div className="bg-white py-4 rounded-b-xl shadow-sm border border-white mb-4 flex flex-col items-center">
                    <p className="text-[12px] uppercase font-bold text-[#1A1A1A]">Radisson Blu Resort</p>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">Galle</p>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3 px-2 text-center">Galle Radisson Blu Resort, Galle</p>
                    <a
                      href="https://maps.app.goo.gl/GuyxyJ4o4GXQEZpf9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F0E6D2] text-[#1A1A1A] rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-[#D4AF37] transition-colors"
                    >
                      <MapPin size={10} />
                      Live Location
                    </a>
                  </div>


                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- SCREEN 6: RSVP --- */}
        <section className="snap-section relative z-10 overflow-hidden">
          <SectionBackground />
          <div className="absolute inset-0 overflow-visible flex flex-col items-center p-6 text-center">
            <div className="w-full my-auto flex flex-col items-center justify-center py-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-[#F0E6D2] w-full max-w-sm min-h-[80vh] h-auto flex flex-col justify-center items-center shadow-xl"
              >
                <div className="flex items-center justify-center gap-3 w-[60%] mx-auto mb-10 mt-4 md:mt-0">
                  <div className="h-px bg-zinc-300 flex-1"></div>
                  <p className="serif text-[13px] uppercase tracking-[0.2em] font-medium text-[#2C2C2C]">PLEASE</p>
                  <div className="h-px bg-zinc-300 flex-1"></div>
                </div>

                <div className="relative mb-12 w-[85%] max-w-[260px]">
                  <img src="/floral_rsvp.png" alt="RSVP" className="w-full h-auto object-contain mix-blend-multiply" />
                </div>

                <p className="serif text-[13px] sm:text-[15px] uppercase tracking-[0.15em] font-bold text-[#2C2C2C] mb-6">
                  BY DECEMBER 5, 2026
                </p>

                <div className="w-full">
                  <RSVPForm />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- SCREEN 7: Wishes --- */}
        <section className="snap-section relative z-10 overflow-hidden">
          <SectionBackground />
          <div className="absolute inset-0 overflow-visible flex flex-col items-center p-6 text-center">
            <div className="w-full my-auto flex flex-col items-center justify-center py-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-[#F0E6D2] w-full max-w-sm h-auto flex flex-col justify-center items-center shadow-xl"
              >
                <div className="flex items-center justify-center gap-3 w-[60%] mx-auto mb-6 mt-4 md:mt-0">
                  <div className="h-px bg-zinc-300 flex-1"></div>
                  <p className="serif text-[13px] uppercase tracking-[0.2em] font-medium text-[#2C2C2C]">GUEST BOOK</p>
                  <div className="h-px bg-zinc-300 flex-1"></div>
                </div>

                <h3 className="script text-3xl sm:text-5xl text-[#D4AF37] mb-6">Leave a Wish</h3>

                <p className="serif text-[13px] sm:text-[15px] text-[#2C2C2C] mb-8 leading-relaxed">
                  We'd love to hear from you! Please leave your wishes, advice, or a simple hello for us.
                </p>

                <div className="w-full">
                  <WishesForm />
                </div>
              </motion.div>

              <div className="mt-10 mb-8 w-full text-center z-20 relative">
                <p className="text-[#1A1A1A] drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] text-[10px] font-sans tracking-widest uppercase leading-relaxed font-semibold">
                  Want a beautiful wedding website like this? <br />
                  Create yours with <a target="_blank" rel="noreferrer" className="text-[#D4AF37] hover:text-[#1A1A1A] font-bold underline decoration-[#D4AF37] underline-offset-4 transition-colors" href="https://wa.me/94707819074">invitemint</a>
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Audio and Play Button */}
      <audio
        ref={audioRef}
        src="/Edd_Sheeran_-_Perfect_(mp3.pm) (4).mp3"
        loop
      />
      <button
        onClick={togglePlay}
        className={`fixed bottom-6 right-6 z-[60] p-3 rounded-full shadow-lg transition-all ${isPlaying ? 'bg-[#D4AF37] text-white' : 'bg-white/80 backdrop-blur-sm text-[#D4AF37] border border-[#F0E6D2]'
          }`}
        aria-label="Toggle music"
      >
        {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
    </>
  );
}
