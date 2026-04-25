import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Course {
  name: string;
  title: string;
  affiliation: string;
  photo: string;
  courseTitle: string;
  biography: string;
  abstract: string;
}

const coursesData: Course[] = [
  {
    name: 'Prof. Bernhard K. Aichernig',
    title: 'Professor',
    affiliation: 'Johannes Kepler University Linz, Austria',
    photo: '/images/speakers/1_Bernhard_AICHERNIG_Associate_Professor.png',
    courseTitle: 'Automata Learning and Testing with AALpy',
    biography: 'Bernhard K. Aichernig is a full professor of Formal Methods at Johannes Kepler University Linz, where he leads the Institute of Formal Models and Verification. His research focuses on the foundations of software engineering for dependable and trustworthy systems, with interests in automated falsification, verification, and modelling. Current topics include automata learning, learning-based testing, and the integration of symbolic and subsymbolic AI. He is the author of more than 150 scientific publications. Until April 2025, he was affiliated with Graz University of Technology. From 2002 to 2006, he held a faculty position at the United Nations University in Macao, China. He served on the board of Formal Methods Europe from 2004 to 2016. Prof. Aichernig holds a habilitation in Practical Computer Science and Formal Methods, a doctorate, and a Diplom-Ingenieur degree, all from Graz University of Technology.',
    abstract: 'This course introduces the fundamentals of automata learning and its close connection to black-box testing, using the open-source tool AALpy (https://github.com/DES-Lab/AALpy). The presented learning-based testing approach combines the active inference of finite-state models with systematic model-based test-case generation. Participants will learn how AALpy can be used to infer and validate deterministic, non-deterministic, and stochastic models. After demonstrating the automated testing of Python classes, we will discuss more advanced applications, including protocol fuzzing (e.g., MQTT, Bluetooth) and the extraction of interpretable models from recurrent neural networks. In addition to active learning algorithms, we will also cover passive learning algorithms that have recently been added to AALpy.',
  },
  {
    name: 'Prof. Jonathan P. Bowen',
    title: 'Emeritus Professor',
    affiliation: 'London South Bank University, UK',
    photo: '/images/speakers/3_Jonathan_Bowen_Formal_Methods_Wiki.png',
    courseTitle: "Tony Hoare's scientific life and achievements",
    biography: 'Prof. Jonathan P. Bowen, MA Oxon, FBCS, FRSA, is an Emeritus Professor of Computing at London South Bank University, UK, Chair of Museophile Limited, a museum and IT consultancy company that he founded in 2002, and an Adjunct Professor at Southwest University, China. He has been a visiting scholar/professor at a variety of institutions, including the Israel Institute for Advanced Studies (Jerusalem), King\'s College London, and the Pratt Institute (New York). Previously, he has held academic and research posts at the University of Reading, Oxford University, and Imperial College London. Jonathan\'s research interests range from computer science, especially software engineering and formal methods, to the history of computing and digital culture. He contributes to Wikipedia on computing-related and cultural topics. His books include "The Turing Guide" (Oxford University Press, 2017) on Alan Turing.',
    abstract: 'Prof. Sir Charles Antony Richard (Tony) Hoare (1934-2026) was a giant of computer science, whose work bridged the gap between the abstract elegance of mathematical logic and the practical necessity of reliable software. Best known for the Quicksort algorithm, the development of Hoare logic, and the formalization of Communicating Sequential Processes (CSP), his career was defined by a relentless pursuit of "correctness by construction". This talk chronicles his journey from a student of the Classics at Oxford to the recipient of the ACM A.M. Turing Award, exploring a legacy that helped to transform programming from a craft into a disciplined science.',
  },
  {
    name: 'Prof. Wei Dong',
    title: 'Professor',
    affiliation: 'National University of Defense Technology, China',
    photo: '/images/speakers/6_Asst_Prof_Wei_Dong_Academic_Profile.png',
    courseTitle: 'Formal and intelligent synthesis for high confidence HCPS software',
    biography: 'Wei Dong is the professor in College of Computer Science and Technology, National University of Defense Technology. His research interests include program analysis and verification, program synthesis, and runtime verification. He has authored or coauthored more than 80 papers in conferences and journals, which include FM, OOPSLA, ICSE, FSE, TSE, TOSEM, etc. He has served on more than 20 program committees, and as the Program Co-Chair of several conferences and workshops. He is the vice chair of Technical Committee on Formal Methods of China Computer Federation (CCF TCFM).',
    abstract: 'Formal synthesis has always been an important research direction in the field of automatic software generation, yet improving synthesis efficiency remains a major challenge. In recent years, LLM-based code generation has been widely accepted, but how to generate high-quality code has drawn significant attention. For high-confidence Human-Cyber-Physical System (HCPS), its software generation must consider the correctness and safety of interactions between various entities and the external environment, and also needs to improve the quality of the generated code. This course introduces basic concepts of reactive synthesis, and our recent work on scaling up synthesis and improving efficiency, as well as LLM-based approaches for high-assurance code generation. We consider both formal and intelligent program synthesis to enhance the efficiency of automated development of HCPS software.',
  },
  {
    name: 'Prof. Einar Broch Johnsen',
    title: 'Professor',
    affiliation: 'University of Oslo, Norway',
    photo: '/images/speakers/4_Einar_Broch_Johnsen.png',
    courseTitle: 'Digital Twins: Connecting Models with The Real World',
    biography: 'Einar Broch Johnsen is a Professor and head of the research group on Reliable Systems at the Department of Informatics, University of Oslo. His research interests include programming models, semantics and methodology; program specification and modeling; formal methods and associated theory; model-based analysis, testing, and formal logic. With digital twins, his research interests extend from model-based analysis to model-centric systems; his work on digital twins spans from self-adaptation and sensor-driven model management to programming abstractions and architectures. He is also interested in the socio-technological aspects of digital twins and digital twins of natural systems, including marine ecosystems and pandemic prevention. He is one of the main developers of ABS, a modeling language for asynchronous distributed systems, and SMOL, a formally defined programming language for digital twins.',
    abstract: 'Digital twins are model-centric systems able to perform online analysis. These systems have become an important backbone for modern industry. The purpose of the digital twin is typically to help a target system meet requirements in an environment that it does not fully understand or control. The digital twin mirrors its target system in real time by integrating live observations of the target system, such as sensor data, into its knowledge. This allows the twin to assess the precision of its models, to adjust the models to make them more precise, and possibly to replace models or requirements on the fly to adapt to changes in the twinned system. Digital twins can be used for different kinds of analysis: descriptive analysis aims at explaining incidents that have happened, such as safety violations, predictive analysis aims at explaining what we expect will happen in the near future, thereby enabling a feedback loop to make adjustments to the target system, while prescriptive analysis explores hypothetical "what-if" scenarios for longer-term decision making. In this lecture, we introduce central concepts of digital twins, discuss simple examples, and explore the idea of digital twins from a formal methods perspective, including how to design digital twins as self-adaptive model management systems. We discuss how digital twins can be used to enhance the trustworthiness of software systems, and measures to enhance the trustworthiness of the digital twin itself.',
  },
  {
    name: 'Prof. Kim Guldstrand Larsen',
    title: 'Professor',
    affiliation: 'Aalborg University, Denmark',
    photo: '/images/speakers/2_Kim_Guldstrand_Larsen_Aalborg_Universitets.png',
    courseTitle: 'Model Checking, Monitoring, Performance Analysis, Synthesis and Learning for Cyber-Physical Systems',
    biography: 'Kim Guldstrand Larsen is Professor in Computer Science at Aalborg University, Denmark. His field of research includes modeling, validation and verification, performance analysis, and synthesing of real-time, embedded, and cyber-physical systems utilizing and contributing to concurrency theory, model checking and model checking. Kim Guldstrand Larsen is co-founder and main contributor to the tool UPPAAL (www.uppaal.org). UPPAAL received the prestigious CAV Award in 2013 as the foremost tool for modelling and verification of real-time systems. Kim Guldstrand Larsen won the ERC Advanced Grant in 2015 and won a Villum Investigator grant in 2021. In 2022 he received the CONCUR Test-of-Time Award 2022. Kim Guldstrand Larsen is a member of Royal Danish Academy of Sciences and Letters, elected fellow and digital expert (vismand) in the Danish Academy of Technical Sciences and Knight of the Order of the Dannebrog (2007). Moreover he is Honorary Doctor, Uppsala University (1999), Honorary Doctor, École normale supérieure Paris-Saclay, Paris (2007), Foreign Expert of China, Distinguished Professor, Northeastern University (2018). He has published more than 500 peer-reviewed papers and received Thomson Scientific Award as the most cited Danish computer scientist 1990-2004.',
    abstract: 'Timed automata and priced timed automata have emerged as useful formalisms for modeling real-time and energy-aware systems as found in several embedded and cyber-physical systems. During the last 20 years the real-time model checker UPPAAL has developed a number of methods allowing for efficient verification of hard timing constraints of timed automata. Moreover a number of significant branches exists, e.g. UPPAAL CORA providing efficient support for optimization, Also the branch UPPAAL SMC, provides a highly scalable new engine supporting (parallel and distributed) statistical model checking of stochastic hybrid automata with significant applications to performance of energy-aware sensor networks as well as evaluation of lock-down measures in Denmark under COVID. More recently the new branch UPPAAL Stratego offers a neuro-symbolic approach to achieve safe and near-optimal decision tree control strategies. The tool combines a dynamic partition-refinement Q-learning algorithm with symbolic methods for synthesizing safety shields that ensures correctness by design. To make synthesis of shields tractable, UPPAAL Stratego are using various abstraction and state-space transformation techniques. We demonstrate superiority of applying the shield before learning (pre-shielding) compared to after (post-shielding). In addition trade-offs between efficiency of strategy representation and degree of optimality subject to safety constraints will be discussed, as well as successful on-going applications (water-management, heating systems, and traffic control, swarm robotics). Most recently, methods for shielding and reinforcement learning has been extended to multi-agent systems. Finally, the lecture will also cover a recent series of work on developing efficient methods for on-line monitoring the conformance of a real-time systems with respect to logical specifications (e.g. MITL). Most of the methods and techniques presented are to be found in the recently released UPPAAL 5.0',
  },
  {
    name: 'Prof. Joseph Sifakis',
    title: 'Professor, Turing Award Laureate',
    affiliation: 'Verimag / EPFL, France/Switzerland',
    photo: '/images/speakers/5_Joseph_Sifakis_A_M_Turing_Award_Laureat.png',
    courseTitle: 'Bringing AI to Autonomous Systems',
    biography: 'Professor Joseph Sifakis is Emeritus Research Director at Verimag. He has been a full professor at Ecole Polytechnique Fédérale de Lausanne (EPFL) for the period 2011-2016. He is the founder of the Verimag laboratory in Grenoble, a leading laboratory in the area of safety critical systems that he directed for 13 years. Joseph Sifakis has made significant and internationally recognized contributions to the design of trustworthy systems in many application areas, including avionics and space systems, telecommunications, and production systems. His current research focuses on autonomous systems, in particular self-driving cars and autonomous telecommunication systems. In 2007, he received the Turing Award, recognized as the "highest distinction in computer science", for his contribution to the theory and application of model checking, the most widely used system verification technique. Joseph Sifakis is a member of the French Academy of Sciences, the French National Academy of Engineering, Academia Europea, the American Academy of Arts and Sciences, the National Academy of Engineering, the National Academy of Sciences, and the Chinese Academy of Sciences. Joseph Sifakis is a frequent speaker at international scientific, technical and public forums. He is the author of the book "Understanding and Changing the World" published in English and Chinese.',
    abstract: 'Autonomous systems are distributed systems composed of agents, each pursuing its own goals, but which must coordinate to satisfy the overall goals of the system. Main points covered: 1. We analyze the characteristics of autonomous systems, explaining that they underlie a multifaceted concept of intelligence that cannot be characterized by conversational behavioral tests such as the Turing test. 2. We propose a development method based on an agent reference architecture that characterizes autonomous behavior as the result of the composition of a set of independent functions. The behavior results from the orchestration of reactive behavior producing actions in response to external stimuli, and proactive behavior aimed at satisfying the agent\'s needs relating to the success of its mission. The two behaviors coordinate by sharing knowledge contained in a long-term memory. 3. We analyze how AI can contribute to the creation of AI agents and multi-agent systems, highlighting the need for its seamless integration with traditional software and discussing the current limitations of the state of the art. These limitations particularly concern the use of knowledge stored in long-term memory to semantically control and further improve the accuracy of AI components and adaptation to a constantly changing environment through goal management and planning. We conclude by emphasizing that AI is still in its infancy, and that there is a long way to go to realize the vision of autonomous systems and get as close as possible to human intelligence.',
  },
  {
    name: 'Prof. Moshe Y. Vardi',
    title: 'University Professor',
    affiliation: 'Rice University, USA',
    photo: '/images/speakers/6_Moshe_Vardi_Named_2026_NAAI_Academy.png',
    courseTitle: 'Are AI minds genuine minds?',
    biography: 'Moshe Y. Vardi is University Professor and the George Distinguished Service Professor in Computational Engineering at Rice University. His research focuses on the interface of mathematical logic and computation -- including database theory, hardware/software design and verification, multi-agent systems, and constraint satisfaction. He is the recipient of numerous awards, including the ACM SIGACT Goedel Prize, the ACM Kanellakis Award, the ACM SIGMOD Codd Award, the Knuth Prize, the IEEE Computer Society Goode Award, and the EATCS Distinguished Achievements Award. He is the author and co-author of over 800 papers, as well as two books. He is a Guggenheim Fellow as well as fellow of several societies, and a member of several academies, including the US National Academy of Engineering, National Academy of Science, the American Academy of Arts and Science, and the Royal Society of London. He holds ten honorary titles. He is a Senior Editor of the Communications of the ACM, the premier publication in computing.',
    abstract: 'The question "Are AI minds genuine minds?" invites us to examine the nature of mind itself and whether artificial intelligence meets its defining criteria. A genuine mind is typically associated with consciousness, self-awareness, intentionality, and the capacity to experience mental states such as emotions. Whether AI qualifies as possessing a true mind ultimately depends on how we define the essential qualities of consciousness and intelligence. While this question has already been raised in the 19th Century, recent progress in AI requires us to re-examine it deeply.',
  },
  {
    name: 'Prof. Emily Yu',
    title: 'Assistant Professor',
    affiliation: 'Leiden University, Netherlands',
    photo: '/images/speakers/8_Myunggyo_Emily_Yu_Retail_Management.png',
    courseTitle: 'Trustworthy Systems through Automated Reasoning, Certificates, and Runtime Monitoring',
    biography: 'Emily Yu is an Assistant Professor in the Leiden Institute of Advanced Computer Science at Leiden University. Her research focuses on system verification and trustworthy AI, with a focus on advancing formal methods as first-order design principles for system correctness and security. She joined Leiden University in October 2025. Prior to that, she was a postdoctoral researcher at the Institute of Science and Technology Austria in Thomas Henzinger\'s group (2023-2025). She obtained her PhD in Computer Science in 2023 at Johannes Kepler University in Austria, supervised by Armin Biere. She got her bachelor\'s and master\'s degree at Imperial College London. Emily\'s research has been recognized with an Esprit fellowship from the Austrian Science Fund.',
    abstract: 'This series of lectures will explore how formal methods can be used to ensure the safety and reliability of modern complex systems, including systems that incorporate machine learning components. Automated reasoning plays a central role in the formal verification of hardware, software, and increasingly AI-based systems. As verification tools become more complex, certification techniques have been developed to provide an additional layer of trust in their results by producing independently checkable evidence of correctness. First, we will study static verification using automated reasoning such as SAT/SMT solving technologies, where certificates serve as mathematical proofs that allow verification results to be independently validated. Second, we will explore how reinforcement learning can be combined with formal methods to synthesize controllers and neural certificates for systems that are difficult to address with classical control techniques, while still providing formal guarantees with respect to temporal specifications. Third, we will study runtime monitoring and enforcement techniques, which provide runtime assurance as a complementary approach to static verification by detecting or preventing violations during system execution thereby enabling safe deployment of AI technologies in safety-critical applications.',
  },
  {
    name: 'Prof. Miaomiao Zhang',
    title: 'Professor',
    affiliation: 'Tongji University, China',
    photo: '/images/speakers/2_Miaomiao_Zhang.png',
    courseTitle: 'Learning and Verifying Timed Systems',
    biography: 'Miaomiao Zhang is a Professor at the School of Computer Science and Technology, Tongji University. She received her Ph.D. in Automation from Shanghai Jiao Tong University in 2001, and worked as a postdoc at the Department of Software Science, Radboud University (the Netherlands). Her research focuses on the modeling and verification of timed systems, with publications in CAV, RTSS, FSE, OOPSLA, TACAS, ACM TECS, among others.',
    abstract: 'Timed systems are widely deployed in industrial systems, especially in safety-critical domains. Formal verification is an important technique for ensuring the reliability of such systems, where model construction is crucial for subsequent analysis. Model learning can infer formal models from system behaviors and has been widely applied in areas such as protocol verification and embedded software analysis. In this course, we present related work on the modelling and verification of such systems.',
  },
];

export default function Courses() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    window.scrollTo(0, 0);

    // 如果有 speaker 参数，滚动到对应讲者
    const speakerName = searchParams.get('speaker');
    if (speakerName) {
      setTimeout(() => {
        const el = sectionRefs.current[speakerName];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // 添加高亮效果
          el.classList.add('ring-2', 'ring-[#005C99]', 'ring-offset-4');
          setTimeout(() => {
            el.classList.remove('ring-2', 'ring-[#005C99]', 'ring-offset-4');
          }, 2000);
        }
      }, 300);
    }
  }, [searchParams]);

  useEffect(() => {
    const items = document.querySelectorAll('.course-animate');
    const tl = gsap.fromTo(items,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: '.courses-container', start: 'top 80%', toggleActions: 'play none none none' },
      }
    );
    return () => { tl.kill(); };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部返回栏 */}
      <div className="bg-[#005C99] sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/90 hover:text-white text-[13px] font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backToHome') || (lang === 'zh' ? '返回首页' : 'Back to Home')}
          </button>
          <h1 className="text-[14px] font-bold text-white tracking-wide">
            {t('coursesTitle') || (lang === 'zh' ? '课程信息' : 'Courses')}
          </h1>
        </div>
      </div>

      <main className="courses-container max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* 页面标题 */}
        <div className="text-center mb-14">
          <p className="course-animate text-[11px] font-bold tracking-[0.2em] text-[#005C99] uppercase mb-2">
            {t('speakersSubtitle') || (lang === 'zh' ? '特邀讲者' : 'Distinguished Lecturers')}
          </p>
          <h1 className="course-animate text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">
            {t('coursesTitle') || (lang === 'zh' ? '课程详情' : 'Course Details')}
          </h1>
          <div className="w-16 h-[3px] bg-[#005C99] mx-auto mt-5" />
        </div>

        {/* 讲者列表 */}
        <div className="space-y-12">
          {coursesData.map((course, idx) => (
            <div
              key={course.name}
              ref={(el) => { sectionRefs.current[course.name] = el; }}
              id={course.name.replace(/\s+/g, '-')}
              className="course-animate bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow scroll-mt-20"
            >
              {/* 头部：照片 + 基本信息 */}
              <div className="bg-slate-50 border-b border-slate-200 p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  {/* 照片 */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-40 sm:w-36 sm:h-44 rounded-lg overflow-hidden border-2 border-white shadow-md">
                      <img
                        src={course.photo}
                        alt={course.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  </div>

                  {/* 信息 */}
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1">
                      {course.name}
                    </h2>
                    <p className="text-[13px] text-[#005C99] font-medium mb-1">
                      {course.title}
                    </p>
                    <p className="text-[12px] text-slate-500 mb-4">
                      {course.affiliation}
                    </p>
                    <div className="inline-block bg-[#005C99]/10 text-[#005C99] px-4 py-2 rounded-lg">
                      <span className="text-[12px] font-bold uppercase tracking-wider">
                        {t('speakerCourse') || 'Course'}
                      </span>
                      <p className="text-[14px] font-semibold mt-0.5">
                        {course.courseTitle}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 内容：Biography + Abstract */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-6 h-[2px] bg-[#005C99]" />
                    {t('speakerBiography') || 'Biography'}
                  </h3>
                  <p className="text-[13px] sm:text-[14px] text-slate-600 leading-relaxed">
                    {course.biography}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-6 h-[2px] bg-[#005C99]" />
                    {t('speakerAbstract') || 'Abstract'}
                  </h3>
                  <p className="text-[13px] sm:text-[14px] text-slate-600 leading-relaxed">
                    {course.abstract}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-slate-50 border-t border-slate-200 py-8">
        <div className="max-w-[1400px] mx-auto px-4 text-center text-[12px] text-slate-400">
          © 2026 SETSS. All rights reserved.
        </div>
      </footer>
    </div>
  );
}