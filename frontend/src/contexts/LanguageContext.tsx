import { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type Language = 'en' | 'zh';

const STORAGE_KEY = 'setss-lang';

const translations: Record<Language, Record<string, string>> = {
  en: {
    // === Navigation & Common ===
    home: 'Home',
    about: 'About',
    authors: 'Authors',
    speakers: 'Speakers',
    program: 'Program',
    attend: 'Attend',
    aboutSetss: 'About SETSS',
    joinCff: 'Join CFF',
    organizingCommittee: 'Organizing Committee',
    registration: 'Registration',
    gettingThere: 'Getting There',
    accommodation: 'Accommodation',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    search: 'Search...',
    backToHome: 'Back to Home',
    previousEditions: 'Previous Editions',
    previousEditionsTitle: 'Previous Editions',
    previousEditionsDesc: 'SETSS 2026 is the 8th edition of SETSS, the Spring School on Engineering Trustworthy Software Systems. Previous editions were hosted by Southwest University in Chongqing, China and the Institute of Software in Beijing, China, then relative information can be found below.',
    edition: 'Edition',
    year: 'Year',
    material: 'Material',
    historyTimeline: 'History Timeline',
    conferenceChair: 'Conference Chair',

    // === Home Page ===
    welcomeTitle: 'Welcome to SETSS 2026',
    welcomeDesc1: 'The 8th Spring School on Engineering Trustworthy Software Systems (SETSS 2026) will be held on May 11-17, 2026 at the School of Computer and Information Science (CIS), Southwest University, Chongqing, China.',
    welcomeDesc2: 'The school offers lectures on leading-edge research in methods and tools for computer system engineering, topical talks on the history and trends of computing, and a workshop. SETSS 2026 is intended for university researchers (master\'s students, PhD students, academics) and software engineering practitioners in industry.',
    welcomeDesc3: 'Participants will gain insight into state-of-the-art software engineering methods and technological advances from both leading pioneers and outstanding young scholars in the field.',
    welcomeHighlight1: 'Cutting-edge lectures on formal methods & AI',
    welcomeHighlight2: 'World-class speakers from leading universities',
    welcomeHighlight3: '7-day intensive program with workshop',
    welcomeHighlight4: 'Beautiful campus of Southwest University',
    venueInfoTitle: 'Venue Information',
    venueAddress: 'Lecture Hall 0114, Building 25\nSchool of Computer and Information Science\nSouthwest University, Chongqing, China',
    venueDate: 'May 11 - May 17, 2026',
    visitOfficialWebsite: 'Visit Official Website →',
    swuCampusAlt: 'Southwest University',
    invitedSpeakers: 'Invited Speakers',
    speakersIntro: 'We are proud to host the following distinguished speakers (in alphabetical order of last name):',
    speakersDetail: 'For detailed information, including lecture titles, abstracts, and biographies, please visit the Speakers page.',
    speakersSubtitle: 'Distinguished Lecturers',
    speakerCourse: 'Course',
    speakerBiography: 'Biography',
    speakerAbstract: 'Abstract',
    registerNow: 'Register Now',
    registrationOpen: 'Registration is open!',
    joinUs: 'Join Us',
    regDesc1: 'Join us for an inspiring week of cutting-edge research, insightful lectures, and collaborative workshops at Southwest University, Chongqing.',
    regDesc2: 'SETSS 2026 is intended for university researchers in computer science and technology, including master\'s students, Ph.D students, academics and software engineering practitioners in industry.',
    learnMore: 'Learn More',
    contactInfoTitle: 'Contact Information',
    addressLabel: 'Address',
    addressDetail: 'School of Computer and Information Science\nSouthwest University\nNo. 2 Tiansheng Road, Beibei District\nChongqing, China 400715',
    emailLabel: 'Email',
    websiteLabel: 'Website',
    organizedBy: 'Organized by',
    organizerDetail: 'Centre for Research and Innovation in Software Engineering (RISE)\nSchool of Computer and Information Science\nSouthwest University',
    programSubtitle: '7-Day Program',
    programSchedule: 'Program Schedule',
    scheduleDay1: 'Day 1',
    scheduleDay2: 'Day 2',
    scheduleDay3: 'Day 3',
    scheduleDay4: 'Day 4',
    scheduleDay5: 'Day 5',
    scheduleDay6: 'Day 6',
    scheduleDay7: 'Day 7',
    scheduleDate1: 'May 11 (Mon)',
    scheduleDate2: 'May 12 (Tue)',
    scheduleDate3: 'May 13 (Wed)',
    scheduleDate4: 'May 14 (Thu)',
    scheduleDate5: 'May 15 (Fri)',
    scheduleDate6: 'May 16 (Sat)',
    scheduleDate7: 'May 17 (Sun)',
    eventOpening: 'Opening Session',
    eventTesting: 'Testing Online Meeting',
    eventCoffeeBreak: 'Coffee Break',
    eventLunch: 'Lunch',
    eventWorkshop: 'Workshop Session',
    eventWorkshopClosing: 'Workshop Session & Closing',
    eventSocialPrefix: 'Social Activity',
    activityHotPot: 'Hot Pot Feast',
    activityCruise: 'Chongqing Liangjiang Night Cruise',
    eventOpeningDetail: 'Welcome speeches by SWU President, Dean of CIS, and SETSS Briefing by Prof. Zhiming Liu. School Photo Taking.',
    eventTestingDetail: 'Connectivity test with Prof. Moshe Y. Vardi',
    conferenceNameLine1: '2026 8th The Spring School on Engineering',
    conferenceNameLine2: 'Trustworthy Software Systems',
    conferenceDateLocation: 'May 11-17, 2026, Chongqing, China',
    heroDateTag: 'MAY 11-17, 2026 · CHONGQING, CHINA',
    heroSubtitle: 'The 8th Spring School on Engineering Trustworthy Software Systems',
    heroVenue: 'Southwest University, Chongqing, China',
    heroImageAlt: 'Southwest University',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    conferenceFullName: '2026 8th The Spring School on Engineering Trustworthy Software Systems',

    // === Courses Page ===
    coursesTitle: 'Course Details',
    coursesBadge: '9 Distinguished Lecturers',
    coursesSubtitle: 'This edition brings together nine world-leading scholars covering formal methods, automata learning, digital twins, trustworthy AI, and more.',
    coursesQuickNav: 'Quick Navigation',
    coursesTabBio: 'Biography',
    coursesTabAbstract: 'Abstract',
    coursesCourseLabel: 'Course',
    coursesSpeakerLabel: 'Speaker',
    coursesTuringLaureate: 'Turing Award Laureate',

    // === Speaker 0: Bernhard K. Aichernig ===
    speaker_0_name: 'Prof. Bernhard K. Aichernig',
    speaker_0_title: 'Professor',
    speaker_0_affiliation: 'Johannes Kepler University Linz, Austria',
    speaker_0_course: 'Automata Learning and Testing with AALpy',
    speaker_0_bio: 'Bernhard K. Aichernig is a full professor of Formal Methods at Johannes Kepler University Linz, where he leads the Institute of Formal Models and Verification. His research focuses on the foundations of software engineering for dependable and trustworthy systems, with interests in automated falsification, verification, and modelling. Current topics include automata learning, learning-based testing, and the integration of symbolic and subsymbolic AI. He is the author of more than 150 scientific publications. Until April 2025, he was affiliated with Graz University of Technology. From 2002 to 2006, he held a faculty position at the United Nations University in Macao, China. He served on the board of Formal Methods Europe from 2004 to 2016. Prof. Aichernig holds a habilitation in Practical Computer Science and Formal Methods, a doctorate, and a Diplom-Ingenieur degree, all from Graz University of Technology.',
    speaker_0_abstract: 'This course introduces the fundamentals of automata learning and its close connection to black-box testing, using the open-source tool AALpy (https://github.com/DES-Lab/AALpy). The presented learning-based testing approach combines the active inference of finite-state models with systematic model-based test-case generation. Participants will learn how AALpy can be used to infer and validate deterministic, non-deterministic, and stochastic models. After demonstrating the automated testing of Python classes, we will discuss more advanced applications, including protocol fuzzing (e.g., MQTT, Bluetooth) and the extraction of interpretable models from recurrent neural networks. In addition to active learning algorithms, we will also cover passive learning algorithms that have recently been added to AALpy.',

    // === Speaker 1: Jonathan P. Bowen ===
    speaker_1_name: 'Prof. Jonathan P. Bowen',
    speaker_1_title: 'Emeritus Professor',
    speaker_1_affiliation: 'London South Bank University, UK',
    speaker_1_course: "Tony Hoare's Scientific Life and Achievements",
    speaker_1_bio: 'Prof. Jonathan P. Bowen, MA Oxon, FBCS, FRSA, is an Emeritus Professor of Computing at London South Bank University, UK, Chair of Museophile Limited, a museum and IT consultancy company that he founded in 2002, and an Adjunct Professor at Southwest University, China. He has been a visiting scholar/professor at a variety of institutions, including the Israel Institute for Advanced Studies (Jerusalem), King\'s College London, and the Pratt Institute (New York). Previously, he has held academic and research posts at the University of Reading, Oxford University, and Imperial College London. Jonathan\'s research interests range from computer science, especially software engineering and formal methods, to the history of computing and digital culture. He contributes to Wikipedia on computing-related and cultural topics. His books include "The Turing Guide" (Oxford University Press, 2017) on Alan Turing.',
    speaker_1_abstract: 'Prof. Sir Charles Antony Richard (Tony) Hoare (1934-2026) was a giant of computer science, whose work bridged the gap between the abstract elegance of mathematical logic and the practical necessity of reliable software. Best known for the Quicksort algorithm, the development of Hoare logic, and the formalization of Communicating Sequential Processes (CSP), his career was defined by a relentless pursuit of "correctness by construction". This talk chronicles his journey from a student of the Classics at Oxford to the recipient of the ACM A.M. Turing Award, exploring a legacy that helped to transform programming from a craft into a disciplined science.',

    // === Speaker 2: Wei Dong ===
    speaker_2_name: 'Prof. Wei Dong',
    speaker_2_title: 'Professor',
    speaker_2_affiliation: 'National University of Defense Technology, China',
    speaker_2_course: 'Formal and Intelligent Synthesis for High Confidence HCPS Software',
    speaker_2_bio: 'Wei Dong is the professor in College of Computer Science and Technology, National University of Defense Technology. His research interests include program analysis and verification, program synthesis, and runtime verification. He has authored or coauthored more than 80 papers in conferences and journals, which include FM, OOPSLA, ICSE, FSE, TSE, TOSEM, etc. He has served on more than 20 program committees, and as the Program Co-Chair of several conferences and workshops. He is the vice chair of Technical Committee on Formal Methods of China Computer Federation (CCF TCFM).',
    speaker_2_abstract: 'Formal synthesis has always been an important research direction in the field of automatic software generation, yet improving synthesis efficiency remains a major challenge. In recent years, LLM-based code generation has been widely accepted, but how to generate high-quality code has drawn significant attention. For high-confidence Human-Cyber-Physical System (HCPS), its software generation must consider the correctness and safety of interactions between various entities and the external environment, and also needs to improve the quality of the generated code. This course introduces basic concepts of reactive synthesis, and our recent work on scaling up synthesis and improving efficiency, as well as LLM-based approaches for high-assurance code generation. We consider both formal and intelligent program synthesis to enhance the efficiency of automated development of HCPS software.',

    // === Speaker 3: Einar Broch Johnsen ===
    speaker_3_name: 'Prof. Einar Broch Johnsen',
    speaker_3_title: 'Professor',
    speaker_3_affiliation: 'University of Oslo, Norway',
    speaker_3_course: 'Digital Twins: Connecting Models with The Real World',
    speaker_3_bio: 'Einar Broch Johnsen is a Professor and head of the research group on Reliable Systems at the Department of Informatics, University of Oslo. His research interests include programming models, semantics and methodology; program specification and modeling; formal methods and associated theory; model-based analysis, testing, and formal logic. With digital twins, his research interests extend from model-based analysis to model-centric systems; his work on digital twins spans from self-adaptation and sensor-driven model management to programming abstractions and architectures. He is also interested in the socio-technological aspects of digital twins and digital twins of natural systems, including marine ecosystems and pandemic prevention. He is one of the main developers of ABS, a modeling language for asynchronous distributed systems, and SMOL, a formally defined programming language for digital twins.',
    speaker_3_abstract: 'Digital twins are model-centric systems able to perform online analysis. These systems have become an important backbone for modern industry. The purpose of the digital twin is typically to help a target system meet requirements in an environment that it does not fully understand or control. The digital twin mirrors its target system in real time by integrating live observations of the target system, such as sensor data, into its knowledge. This allows the twin to assess the precision of its models, to adjust the models to make them more precise, and possibly to replace models or requirements on the fly to adapt to changes in the twinned system. Digital twins can be used for different kinds of analysis: descriptive analysis aims at explaining incidents that have happened, such as safety violations, predictive analysis aims at explaining what we expect will happen in the near future, thereby enabling a feedback loop to make adjustments to the target system, while prescriptive analysis explores hypothetical "what-if" scenarios for longer-term decision making. In this lecture, we introduce central concepts of digital twins, discuss simple examples, and explore the idea of digital twins from a formal methods perspective, including how to design digital twins as self-adaptive model management systems. We discuss how digital twins can be used to enhance the trustworthiness of software systems, and measures to enhance the trustworthiness of the digital twin itself.',

    // === Speaker 4: Kim Guldstrand Larsen ===
    speaker_4_name: 'Prof. Kim Guldstrand Larsen',
    speaker_4_title: 'Professor',
    speaker_4_affiliation: 'Aalborg University, Denmark',
    speaker_4_course: 'Model Checking, Monitoring, Performance Analysis, Synthesis and Learning for Cyber-Physical Systems',
    speaker_4_bio: 'Kim Guldstrand Larsen is Professor in Computer Science at Aalborg University, Denmark. His field of research includes modeling, validation and verification, performance analysis, and synthesing of real-time, embedded, and cyber-physical systems utilizing and contributing to concurrency theory, model checking and model checking. Kim Guldstrand Larsen is co-founder and main contributor to the tool UPPAAL (www.uppaal.org). UPPAAL received the prestigious CAV Award in 2013 as the foremost tool for modelling and verification of real-time systems. Kim Guldstrand Larsen won the ERC Advanced Grant in 2015 and won a Villum Investigator grant in 2021. In 2022 he received the CONCUR Test-of-Time Award 2022. Kim Guldstrand Larsen is a member of Royal Danish Academy of Sciences and Letters, elected fellow and digital expert (vismand) in the Danish Academy of Technical Sciences and Knight of the Order of the Dannebrog (2007). Moreover he is Honorary Doctor, Uppsala University (1999), Honorary Doctor, École normale supérieure Paris-Saclay, Paris (2007), Foreign Expert of China, Distinguished Professor, Northeastern University (2018). He has published more than 500 peer-reviewed papers and received Thomson Scientific Award as the most cited Danish computer scientist 1990-2004.',
    speaker_4_abstract: 'Timed automata and priced timed automata have emerged as useful formalisms for modeling real-time and energy-aware systems as found in several embedded and cyber-physical systems. During the last 20 years the real-time model checker UPPAAL has developed a number of methods allowing for efficient verification of hard timing constraints of timed automata. Moreover a number of significant branches exists, e.g. UPPAAL CORA providing efficient support for optimization, Also the branch UPPAAL SMC, provides a highly scalable new engine supporting (parallel and distributed) statistical model checking of stochastic hybrid automata with significant applications to performance of energy-aware sensor networks as well as evaluation of lock-down measures in Denmark under COVID. More recently the new branch UPPAAL Stratego offers a neuro-symbolic approach to achieve safe and near-optimal decision tree control strategies. The tool combines a dynamic partition-refinement Q-learning algorithm with symbolic methods for synthesizing safety shields that ensures correctness by design. To make synthesis of shields tractable, UPPAAL Stratego are using various abstraction and state-space transformation techniques. We demonstrate superiority of applying the shield before learning (pre-shielding) compared to after (post-shielding). In addition trade-offs between efficiency of strategy representation and degree of optimality subject to safety constraints will be discussed, as well as successful on-going applications (water-management, heating systems, and traffic control, swarm robotics). Most recently, methods for shielding and reinforcement learning has been extended to multi-agent systems. Finally, the lecture will also cover a recent series of work on developing efficient methods for on-line monitoring the conformance of a real-time systems with respect to logical specifications (e.g. MITL). Most of the methods and techniques presented are to be found in the recently release.',

    // === Speaker 5: Joseph Sifakis ===
    speaker_5_name: 'Prof. Joseph Sifakis',
    speaker_5_title: 'Professor, Turing Award Laureate',
    speaker_5_affiliation: 'Verimag / EPFL, France/Switzerland',
    speaker_5_course: 'Bringing AI to Autonomous Systems',
    speaker_5_bio: 'Professor Joseph Sifakis is Emeritus Research Director at Verimag. He has been a full professor at Ecole Polytechnique Fédérale de Lausanne (EPFL) for the period 2011-2016. He is the founder of the Verimag laboratory in Grenoble, a leading laboratory in the area of safety critical systems that he directed for 13 years. Joseph Sifakis has made significant and internationally recognized contributions to the design of trustworthy systems in many application areas, including avionics and space systems, telecommunications, and production systems. His current research focuses on autonomous systems, in particular self-driving cars and autonomous telecommunication systems. In 2007, he received the Turing Award, recognized as the "highest distinction in computer science", for his contribution to the theory and application of model checking, the most widely used system verification technique. Joseph Sifakis is a member of the French Academy of Sciences, the French National Academy of Engineering, Academia Europea, the American Academy of Arts and Sciences, the National Academy of Engineering, the National Academy of Sciences, and the Chinese Academy of Sciences. Joseph Sifakis is a frequent speaker at international scientific, technical and public forums. He is the author of the book "Understanding and Changing the World" published in English and Chinese.',
    speaker_5_abstract: 'Autonomous systems are distributed systems composed of agents, each pursuing its own goals, but which must coordinate to satisfy the overall goals of the system. Main points covered: 1. We analyze the characteristics of autonomous systems, explaining that they underlie a multifaceted concept of intelligence that cannot be characterized by conversational behavioral tests such as the Turing test. 2. We propose a development method based on an agent reference architecture that characterizes autonomous behavior as the result of the composition of a set of independent functions. The behavior results from the orchestration of reactive behavior producing actions in response to external stimuli, and proactive behavior aimed at satisfying the agent\'s needs relating to the success of its mission. The two behaviors coordinate by sharing knowledge contained in a long-term memory. 3. We analyze how AI can contribute to the creation of AI agents and multi-agent systems, highlighting the need for its seamless integration with traditional software and discussing the current limitations of the state of the art. These limitations particularly concern the use of knowledge stored in long-term memory to semantically control and further improve the accuracy of AI components and adaptation to a constantly changing environment through goal management and planning. We conclude by emphasizing that AI is still in its infancy, and that there is a long way to go to realize the vision of autonomous systems and get as close as possible to human intelligence.',

    // === Speaker 6: Moshe Y. Vardi ===
    speaker_6_name: 'Prof. Moshe Y. Vardi',
    speaker_6_title: 'University Professor',
    speaker_6_affiliation: 'Rice University, USA',
    speaker_6_course: 'Are AI Minds Genuine Minds?',
    speaker_6_bio: 'Moshe Y. Vardi is University Professor and the George Distinguished Service Professor in Computational Engineering at Rice University. His research focuses on the interface of mathematical logic and computation -- including database theory, hardware/software design and verification, multi-agent systems, and constraint satisfaction. He is the recipient of numerous awards, including the ACM SIGACT Goedel Prize, the ACM Kanellakis Award, the ACM SIGMOD Codd Award, the Knuth Prize, the IEEE Computer Society Goode Award, and the EATCS Distinguished Achievements Award. He is the author and co-author of over 800 papers, as well as two books. He is a Guggenheim Fellow as well as fellow of several societies, and a member of several academies, including the US National Academy of Engineering, National Academy of Science, the American Academy of Arts and Science, and the Royal Society of London. He holds ten honorary titles. He is a Senior Editor of the Communications of the ACM, the premier publication in computing.',
    speaker_6_abstract: 'The question "Are AI minds genuine minds?" invites us to examine the nature of mind itself and whether artificial intelligence meets its defining criteria. A genuine mind is typically associated with consciousness, self-awareness, intentionality, and the capacity to experience mental states such as emotions. Whether AI qualifies as possessing a true mind ultimately depends on how we define the essential qualities of consciousness and intelligence. While this question has already been raised in the 19th Century, recent progress in AI requires us to re-examine it deeply.',

    // === Speaker 7: Emily Yu ===
    speaker_7_name: 'Prof. Emily Yu',
    speaker_7_title: 'Assistant Professor',
    speaker_7_affiliation: 'Leiden University, Netherlands',
    speaker_7_course: 'Trustworthy Systems through Automated Reasoning, Certificates, and Runtime Monitoring',
    speaker_7_bio: 'Emily Yu is an Assistant Professor in the Leiden Institute of Advanced Computer Science at Leiden University. Her research focuses on system verification and trustworthy AI, with a focus on advancing formal methods as first-order design principles for system correctness and security. She joined Leiden University in October 2025. Prior to that, she was a postdoctoral researcher at the Institute of Science and Technology Austria in Thomas Henzinger\'s group (2023-2025). She obtained her PhD in Computer Science in 2023 at Johannes Kepler University in Austria, supervised by Armin Biere. She got her bachelor\'s and master\'s degree at Imperial College London. Emily\'s research has been recognized with an Esprit fellowship from the Austrian Science Fund.',
    speaker_7_abstract: 'This series of lectures will explore how formal methods can be used to ensure the safety and reliability of modern complex systems, including systems that incorporate machine learning components. Automated reasoning plays a central role in the formal verification of hardware, software, and increasingly AI-based systems. As verification tools become more complex, certification techniques have been developed to provide an additional layer of trust in their results by producing independently checkable evidence of correctness. First, we will study static verification using automated reasoning such as SAT/SMT solving technologies, where certificates serve as mathematical proofs that allow verification results to be independently validated. Second, we will explore how reinforcement learning can be combined with formal methods to synthesize controllers and neural certificates for systems that are difficult to address with classical control techniques, while still providing formal guarantees with respect to temporal specifications. Third, we will study runtime monitoring and enforcement techniques, which provide runtime assurance as a complementary approach to static verification by detecting or preventing violations during system execution thereby enabling safe deployment of AI technologies in safety-critical applications.',

    // === Speaker 8: Miaomiao Zhang ===
    speaker_8_name: 'Prof. Miaomiao Zhang',
    speaker_8_title: 'Professor',
    speaker_8_affiliation: 'Tongji University, China',
    speaker_8_course: 'Learning and Verifying Timed Systems',
    speaker_8_bio: 'Miaomiao Zhang is a Professor at the School of Computer Science and Technology, Tongji University. She received her Ph.D. in Automation from Shanghai Jiao Tong University in 2001, and worked as a postdoc at the Department of Software Science, Radboud University (the Netherlands). Her research focuses on the modeling and verification of timed systems, with publications in CAV, RTSS, FSE, OOPSLA, TACAS, ACM TECS, among others.',
    speaker_8_abstract: 'Timed systems are widely deployed in industrial systems, especially in safety-critical domains. Formal verification is an important technique for ensuring the reliability of such systems, where model construction is crucial for subsequent analysis. Model learning can infer formal models from system behaviors and has been widely applied in areas such as protocol verification and embedded software analysis. In this course, we present related work on the modelling and verification of such systems.',

    // === Registration Page ===
    registrationNoticeTitle: 'Conference Notice',
    registrationTime: 'Meeting Time',
    registrationVenue: 'Meeting Venue',
    registrationMethod: 'Registration Method',
    registrationMethodOnsite: 'On-site payment',
    registrationMethodOnline: 'Online registration',
    registrationFeeCategory: 'Category',
    registrationFeeFee: 'Fee (RMB)',
    registrationFeeLectures: 'May 11 – May 15 (Mon–Fri Lectures)',
    registrationFeeWorkshop: 'May 16 – May 17 (Sat–Sun Workshop)',
    registrationFeeIncludes: 'Registration fee includes: lunch (Mon–Fri, except dinner), Wednesday hotpot banquet, and Friday two-river cruise ticket (168 RMB ticket + 50 RMB round-trip transportation).',
    bankTransferTitle: 'Bank Transfer Details',
    bankAccountName: 'Account Name',
    bankName: 'Bank',
    bankAccountNumber: 'Account Number',
    bankCode: 'Bank Code',
    bankRemittanceNote: 'Remittance Note',
    bankRemittanceNoteText: 'Please write "SETSS2026-Your Name" when transferring.',
    bankAfterPayment: 'After payment',
    bankAfterPaymentText: 'Send the transfer voucher and invoice information (title, tax ID) to liubocq@swu.edu.cn.',
    scanToRegister: 'Scan to Register',
    qrCodeAlt: 'Registration QR Code',
    scanToRegisterDesc: 'Please scan to register (or use bank transfer above)',
    otherInfoTitle: 'Other Information',
    otherInfoTravel: 'Participants are responsible for their own travel and accommodation expenses not listed above.',
    otherInfoCertificate: 'SETSS 2026 can provide a training certificate of 32 instructional hours for those in need.',
    officialWebsiteLabel: 'Official Website',
    registrationNoticeP1: 'The 8th Spring School on Engineering Trustworthy Software Systems (SETSS 2026) hosted by Southwest University will take place from May 11 to 17, 2026, at Southwest University, Chongqing, China. The school will feature a series of lectures on cutting-edge research in software systems engineering, formal methods, AI, cyber-physical systems, and digital twins, along with a dedicated workshop. Invited speakers include Turing Award laureate Prof. Joseph Sifakis (online), Prof. Moshe Y. Vardi (online), Prof. Einar Broch Johnsen, Prof. Kim Guldstrand Larsen, Prof. Bernhard Aichernig, Dr. Emily Yu, Prof. Jonathan P. Bowen, Prof. Wei Dong, Prof. Miaomiao Zhang, and other distinguished experts.',
    registrationNoticeP2: 'The program combines five days of lectures (May 11–15) and a two‑day workshop (May 16–17). Participants will have opportunities for in‑depth discussions, networking, and social events including a hotpot banquet and a two‑river cruise.',
    registrationVenueLine1: 'Lecture Hall 0114, Building 25',
    registrationVenueLine2: 'Southwest University (Beibei Campus), Chongqing, China',
    bankAccountNameValue: 'Southwest University',
    bankNameValue: 'Industrial and Commercial Bank of China (ICBC), Chongqing Chaoyang Sub‑branch',

    // === Transportation ===
    transportationTitle: 'Transportation to Southwest University (Beibei Campus)',
    transportationSubtitle: 'How to get to the conference venue',
    fromAirport: 'From Chongqing Jiangbei International Airport',
    fromChongqingbei: 'From Chongqingbei Railway Station',
    fromChongqingxi: 'From Chongqingxi Railway Station',
    fromChongqingdong: 'From Chongqingdong Railway Station',
    method: 'Method',
    route: 'Route',
    estimatedPrice: 'Estimated Price',
    estimatedTime: 'Estimated Time',
    metro: 'Metro',
    taxi: 'Taxi',
    airportMetroRoute: 'Line 10 (T3 Terminal) → Line 6 (Southwest University Station)',
    airportTaxiRoute: 'Airport → Southwest University Beibei Campus',
    chongqingbeiMetroRoute: 'Line 3 (Hongqihegou) → Line 6 (Southwest University Station)',
    chongqingbeiTaxiRoute: 'Chongqingbei → Southwest University Beibei Campus',
    chongqingxiMetroRoute: 'Loop Line (Ranjiaba) → Line 6 (Southwest University Station)',
    chongqingxiTaxiRoute: 'Chongqingxi → Southwest University Beibei Campus',
    chongqingdongMetroRoute: 'Line 6 (Chongqingdong → Southwest University Station)',
    chongqingdongTaxiRoute: 'Chongqingdong → Southwest University Beibei Campus',

    // === Accommodation ===
    accommodationTitle: 'Recommended Hotels (Near Venue)',
    accommodationSubtitle: 'Comfortable stays within walking distance of the conference venue',
    hotelAddress: 'Address',
    hotelTel: 'Tel',
    hotelNote: 'Note',
    hotelNoteText: 'Rates are for reference only. Please confirm directly with the hotel.',
    moreOptions: 'More accommodation options can be found on travel platforms.',
    earlyBooking: 'Early booking is recommended.',
    ningdengHotel: 'Ningdeng Hotel',
    ningdengAddress: 'Near No. 127 Wenxingwan, Beibei District (approx. 100m from venue)',
    bolianhuiHotel: 'Bo Lian Hui Hotel 4.8★',
    bolianhuiAddress: 'No. 143 Tiansheng Li Street (next to Tiansheng Station, Line 6, opposite Gate 2 of SWU South Gate)',
    bluesHotel: 'Blues Boutique Hotel 4.9★',
    bluesAddress: 'No. 139-3-1 Tiansheng Li Street (above Rural Commercial Bank, 100m from Exit 1, SWU Station, Line 6)',
    boreeHotel: 'Boree Business Hotel 5.0★',
    boreeAddress: '2F, Building 8, Tiansheng Li Street (100m from Exit 1 Tiansheng Station, 200m from SWU Gate 2)',

    // === AuthModal ===
    authName: 'Name',
    authYourName: 'Your name',
    authEmail: 'Email',
    authPassword: 'Password',
    authFillRequired: 'Please fill in all required fields',
    authEnterName: 'Please enter your name',
    authNoAccount: "Don't have an account?",
    authHasAccount: 'Already have an account?',

    // === Footer ===
    footerAboutTitle: 'About SETSS 2026',
    footerAboutDesc: 'The 8th Spring School on Engineering Trustworthy Software Systems, held May 11-17, 2026 at Southwest University, Chongqing, China.',
    quickLinks: 'Quick Links',
    footerContact: 'Contact',
    footerAddress1: 'RISE, School of CIS',
    footerAddress2: 'Southwest University',
    footerAddress3: 'Chongqing, China 400715',
    allRightsReserved: 'All rights reserved.',
  },

  zh: {
    // === Navigation & Common ===
    home: '首页',
    about: '关于',
    authors: '作者',
    speakers: '讲者',
    program: '日程',
    attend: '参会',
    aboutSetss: '关于SETSS',
    joinCff: '加入CFF',
    organizingCommittee: '组委会',
    registration: '注册',
    gettingThere: '交通指南',
    accommodation: '住宿',
    login: '登录',
    register: '注册',
    logout: '退出',
    search: '搜索...',
    backToHome: '返回首页',
    previousEditions: '往届会议',
    previousEditionsTitle: '往届会议',
    previousEditionsDesc: 'SETSS 2026 是可信软件系统工程春季学校（SETSS）的第八届会议。往届会议由中国重庆西南大学和中国北京软件研究所承办，相关信息如下。',
    edition: '届次',
    year: '年份',
    material: '资料',
    historyTimeline: '历史时间线',
    conferenceChair: '会议主席',

    // === Home Page ===
    welcomeTitle: '欢迎来到 SETSS 2026',
    welcomeDesc1: '第八届可信软件系统工程春季学校（SETSS 2026）将于2026年5月11日至17日在中国重庆西南大学计算机与信息科学学院 软件学院（CIS）举行。',
    welcomeDesc2: '本次学校将提供关于计算机系统工程方法和工具前沿研究的讲座、关于计算历史和趋势的专题报告以及研讨会。SETSS 2026面向计算机科学与技术领域的大学研究人员（硕士生、博士生、学者）以及工业界的软件工程从业者。',
    welcomeDesc3: '参与者将深入了解软件工程领域最先进的方法和技术进展，包括杰出先驱和优秀青年学者的最新研究成果。',
    welcomeHighlight1: '形式化方法与人工智能前沿讲座',
    welcomeHighlight2: '来自顶尖大学的世界级讲者',
    welcomeHighlight3: '为期7天的强化课程与研讨会',
    welcomeHighlight4: '西南大学美丽校园',
    venueInfoTitle: '会场信息',
    venueAddress: '第25教学楼0114报告厅\n计算机与信息科学学院 软件学院\n中国重庆西南大学',
    venueDate: '2026年5月11日 - 5月17日',
    visitOfficialWebsite: '访问官方网站 →',
    swuCampusAlt: '西南大学',
    invitedSpeakers: '特邀讲者',
    speakersIntro: '我们很荣幸邀请到以下杰出讲者（按姓氏字母顺序排列）：',
    speakersDetail: '点击讲者卡片查看详细信息，包括讲座标题、摘要和传记。',
    speakersSubtitle: '特邀讲者',
    speakerCourse: '讲座',
    speakerBiography: '个人简介',
    speakerAbstract: '摘要',
    registerNow: '立即注册',
    registrationOpen: '注册已开放！',
    joinUs: '加入我们',
    regDesc1: '加入我们，在重庆西南大学度过充满前沿研究、精彩讲座和协作研讨会的美好一周。',
    regDesc2: 'SETSS 2026面向计算机科学与技术领域的大学研究人员，包括硕士生、博士生、学者以及工业界的软件工程从业者。',
    learnMore: '了解更多',
    contactInfoTitle: '联系信息',
    addressLabel: '地址',
    addressDetail: '计算机与信息科学学院 软件学院\n西南大学\n重庆市北碚区天生路2号\n中国 400715',
    emailLabel: '邮箱',
    websiteLabel: '网站',
    organizedBy: '主办方',
    organizerDetail: '软件工程研究与创新中心（RISE）\n计算机与信息科学学院 软件学院\n西南大学',
    programSubtitle: '7天日程',
    programSchedule: '日程安排',
    scheduleDay1: '第一天',
    scheduleDay2: '第二天',
    scheduleDay3: '第三天',
    scheduleDay4: '第四天',
    scheduleDay5: '第五天',
    scheduleDay6: '第六天',
    scheduleDay7: '第七天',
    scheduleDate1: '5月11日（周一）',
    scheduleDate2: '5月12日（周二）',
    scheduleDate3: '5月13日（周三）',
    scheduleDate4: '5月14日（周四）',
    scheduleDate5: '5月15日（周五）',
    scheduleDate6: '5月16日（周六）',
    scheduleDate7: '5月17日（周日）',
    eventOpening: '开幕式',
    eventTesting: '在线会议测试',
    eventCoffeeBreak: '茶歇',
    eventLunch: '午餐',
    eventWorkshop: '研讨会',
    eventWorkshopClosing: '研讨会与闭幕式',
    eventSocialPrefix: '社交活动',
    activityHotPot: '火锅宴',
    activityCruise: '重庆两江夜游',
    eventOpeningDetail: '西南大学校长、计算机与信息科学学院 软件学院院长致辞，刘志明教授作SETSS简介。集体合影。',
    eventTestingDetail: '与Moshe Y. Vardi教授进行在线连接测试',
    conferenceNameLine1: '2026 第八届可信软件系统工程春季学校',
    conferenceNameLine2: '',
    conferenceDateLocation: '2026年5月11-17日，中国重庆',
    heroDateTag: '2026年5月11-17日 · 中国重庆',
    heroSubtitle: '第八届可信软件系统工程春季学校',
    heroVenue: '中国重庆西南大学',
    heroImageAlt: '西南大学',
    days: '天',
    hours: '时',
    minutes: '分',
    seconds: '秒',
    conferenceFullName: '2026 第八届可信软件系统工程春季学校',

    // === Courses Page ===
    coursesTitle: '课程详情',
    coursesBadge: '9 位特邀讲者',
    coursesSubtitle: '本届春季学校邀请了九位来自世界各地的顶尖学者，涵盖形式化方法、自动机学习、数字孪生、可信 AI 等前沿领域。',
    coursesQuickNav: '快速导航',
    coursesTabBio: '讲者简介',
    coursesTabAbstract: '课程摘要',
    coursesCourseLabel: '课程主题',
    coursesSpeakerLabel: '讲者',
    coursesTuringLaureate: '图灵奖得主',

    // === Speaker 0: Bernhard K. Aichernig ===
    speaker_0_name: 'Bernhard K. Aichernig 教授',
    speaker_0_title: '教授',
    speaker_0_affiliation: '林茨约翰内斯·开普勒大学，奥地利',
    speaker_0_course: 'Automata Learning and Testing with AALpy',
    speaker_0_bio: 'Bernhard K. Aichernig 是林茨约翰内斯·开普勒大学形式化方法的全职教授，负责领导形式化模型与验证研究所。他的研究聚焦于可靠与可信系统软件工程的基础，涵盖自动化错误检测、验证与建模。当前研究方向包括自动机学习、基于学习的测试以及符号 AI 与子符号 AI 的融合。他已发表超过 150 篇科学论文。2025年4月前，他曾就职于格拉茨理工大学。2002年至2006年，他在中国澳门联合国大学担任教职。2004年至2016年，他担任欧洲形式化方法委员会理事。Aichernig 教授在格拉茨理工大学获得了实用计算机科学与形式化方法的特许任教资格、博士学位以及工学硕士学位。',
    speaker_0_abstract: '本课程介绍自动机学习的基础知识及其与黑盒测试的密切关系，使用开源工具 AALpy（https://github.com/DES-Lab/AALpy）。所呈现的基于学习的测试方法将有限状态模型的主动推断与系统的基于模型的测试用例生成相结合。参与者将学习如何使用 AALpy 来推断和验证确定性、非确定性和随机性模型。在演示 Python 类的自动化测试后，我们将讨论更高级的应用，包括协议模糊测试（例如 MQTT、蓝牙）以及从循环神经网络中提取可解释模型。除了主动学习算法外，我们还将介绍最近添加到 AALpy 中的被动学习算法。',

    // === Speaker 1: Jonathan P. Bowen ===
    speaker_1_name: 'Jonathan P. Bowen 教授',
    speaker_1_title: '荣休教授',
    speaker_1_affiliation: '伦敦南岸大学，英国',
    speaker_1_course: 'Tony Hoare 的科学人生与成就',
    speaker_1_bio: 'Jonathan P. Bowen 教授（牛津大学文学硕士、英国计算机学会会士、英国皇家艺术学会会士）是英国伦敦南岸大学计算学荣休教授，也是 Museophile Limited（他于 2002 年创立的博物馆与 IT 咨询公司）的董事长，以及中国西南大学客座教授。他曾担任多所机构的访问学者/教授，包括以色列高级研究院（耶路撒冷）、伦敦国王学院和纽约普拉特学院。此前，他曾在雷丁大学、牛津大学和帝国理工学院担任学术与研究职位。Jonathan 的研究兴趣涵盖计算机科学（尤其是软件工程与形式化方法）、计算史和数字文化。他为维基百科撰写计算相关和文化主题的内容。他的著作包括《图灵指南》（牛津大学出版社，2017），介绍 Alan Turing。',
    speaker_1_abstract: 'Charles Antony Richard（Tony）Hoare 爵士（1934–2026）是计算机科学的巨匠，他的工作架起了数学逻辑的抽象优雅与可靠软件的实践需求之间的桥梁。他以快速排序算法、Hoare 逻辑的发展和通信顺序进程（CSP）的形式化而著称，他的职业生涯以不懈追求"构造即正确"为标志。本讲座回顾了他从牛津大学古典文学学生到 ACM 图灵奖得主的历程，探索他将编程从一门手艺转变为一门严谨科学的遗产。',

    // === Speaker 2: Wei Dong ===
    speaker_2_name: '董威 教授',
    speaker_2_title: '教授',
    speaker_2_affiliation: '国防科技大学，中国',
    speaker_2_course: '高置信度 HCPS 软件的形式化与智能合成',
    speaker_2_bio: '董威是国防科技大学计算机科学与技术学院教授。他的研究方向包括程序分析与验证、程序合成以及运行时验证。他在 FM、OOPSLA、ICSE、FSE、TSE、TOSEM 等会议和期刊上发表了 80 余篇论文。他曾担任 20 多个程序委员会委员，以及多个会议和研讨会的程序联合主席。他是中国计算机学会形式化方法专业委员会副主任。',
    speaker_2_abstract: '形式化合成一直是自动软件生成领域的重要研究方向，但提高合成效率仍然是一个重大挑战。近年来，基于 LLM 的代码生成已被广泛接受，但如何生成高质量代码引起了极大关注。对于高置信度人机物融合系统（HCPS），其软件生成必须考虑各实体与外部环境之间交互的正确性和安全性，还需要提高生成代码的质量。本课程介绍反应式合成的基本概念，以及我们最近在扩大合成规模、提高效率方面的工作，以及基于 LLM 的高保障代码生成方法。我们综合考虑形式化与智能程序合成，以提升 HCPS 软件自动化开发的效率。',

    // === Speaker 3: Einar Broch Johnsen ===
    speaker_3_name: 'Einar Broch Johnsen 教授',
    speaker_3_title: '教授',
    speaker_3_affiliation: '奥斯陆大学，挪威',
    speaker_3_course: '数字孪生：将模型与现实世界连接',
    speaker_3_bio: 'Einar Broch Johnsen 是奥斯陆大学信息学系教授、可靠系统研究组组长。他的研究方向包括编程模型、语义与方法论；程序规约与建模；形式化方法及相关理论；基于模型的分析、测试和形式逻辑。在数字孪生方面，他的研究兴趣从基于模型的分析延伸到以模型为中心的系统；他在数字孪生方面的工作涵盖自适应、传感器驱动的模型管理到编程抽象和体系结构。他还对数字孪生的社会技术方面以及自然系统（包括海洋生态系统和疫情预防）的数字孪生感兴趣。他是 ABS（异步分布式系统建模语言）和 SMOL（数字孪生的形式化定义编程语言）的主要开发者之一。',
    speaker_3_abstract: '数字孪生是以模型为中心的系统，能够进行在线分析。这些系统已成为现代工业的重要支柱。数字孪生的目的通常是帮助目标系统在不完全理解或控制的环境中满足需求。数字孪生通过将目标系统的实时观测（如传感器数据）集成到其知识库中，实时镜像目标系统。这使得孪生系统能够评估其模型的精度，调整模型以提高精度，并可能即时替换模型或需求以适应孪生系统的变化。数字孪生可用于不同类型的分析：描述性分析旨在解释已发生的事件（如安全违规），预测性分析旨在解释近期预期发生的情况，从而启用反馈循环以对目标系统进行调整，而规范性分析则探索假设性的"如果-怎样"场景以支持长期决策。在本讲座中，我们将介绍数字孪生的核心概念，讨论简单示例，并从形式化方法的角度探索数字孪生的思想，包括如何将数字孪生设计为自适应模型管理系统。我们还将讨论如何利用数字孪生来增强软件系统的可信度，以及增强数字孪生自身可信度的措施。',

    // === Speaker 4: Kim Guldstrand Larsen ===
    speaker_4_name: 'Kim Guldstrand Larsen 教授',
    speaker_4_title: '教授',
    speaker_4_affiliation: '奥尔堡大学，丹麦',
    speaker_4_course: '信息物理系统的模型检验、监控、性能分析、合成与学习',
    speaker_4_bio: 'Kim Guldstrand Larsen 是丹麦奥尔堡大学计算机科学教授。他的研究领域包括实时、嵌入式和信息物理系统的建模、验证与确认、性能分析和综合，并利用和贡献于并发理论、模型检验。他是 UPPAAL 工具（www.uppaal.org）的联合创始人及主要贡献者。UPPAAL 于 2013 年获得享有盛誉的 CAV 奖，作为实时系统建模与验证的首要工具。Kim Guldstrand Larsen 于 2015 年获得 ERC 高级资助，2021 年获得 Villum 研究员资助，2022 年获得 CONCUR 时间考验奖。他是丹麦皇家科学与文学院院士、丹麦技术科学院院士及数字专家（vismand），并获勋丹麦国旗勋章骑士（2007年）。此外，他还是乌普萨拉大学荣誉博士（1999年）、巴黎萨克雷高等师范学校荣誉博士（2007年），以及中国外籍专家、东北大学特聘教授（2018年）。他发表了 500 余篇同行评审论文，并荣获汤森路透科学奖（1990–2004年间被引用最多的丹麦计算机科学家）。',
    speaker_4_abstract: '时间自动机和定价时间自动机已成为对实时和能效系统进行建模的有用形式化方法，这些系统存在于多种嵌入式和信息物理系统中。在过去 20 年中，实时模型检验器 UPPAAL 开发了多种方法，可以高效验证时间自动机的硬时间约束。此外还存在多个重要的分支，例如 UPPAAL CORA 提供高效的优化支持，UPPAAL SMC 分支提供了一个高度可扩展的新引擎，支持随机混合自动机的（并行和分布式）统计模型检验，在能效传感器网络的性能评估以及丹麦 COVID 期间封锁措施评估方面有重要应用。最近，新的 UPPAAL Stratego 分支提供了一种神经符号方法，以实现安全和近似最优的决策树控制策略。该工具将动态分区细化 Q-learning 算法与符号方法相结合，用于合成确保安全性的防护盾。为了使防护盾合成可处理，UPPAAL Stratego 使用了各种抽象和状态空间变换技术。我们展示了在学习之前应用防护盾（预防护）相对于学习之后（后防护）的优越性。此外，还将讨论策略表示效率与安全约束下最优程度之间的权衡，以及成功的持续应用（水资源管理、供暖系统、交通控制、群体机器人）。最近，防护和强化学习方法已扩展到多智能体系统。最后，讲座还将涵盖最近在开发实时系统相对于逻辑规约（如 MITL）的在线一致性监控高效方法方面的一系列工作。所介绍的大多数方法和技术可在最近的版本中找到。',

    // === Speaker 5: Joseph Sifakis ===
    speaker_5_name: 'Joseph Sifakis 教授',
    speaker_5_title: '教授，图灵奖得主',
    speaker_5_affiliation: 'Verimag / EPFL，法国/瑞士',
    speaker_5_course: '将 AI 引入自主系统',
    speaker_5_bio: 'Joseph Sifakis 教授是 Verimag 的荣誉研究主任。2011 年至 2016 年，他曾任洛桑联邦理工学院（EPFL）全职教授。他是格勒诺布尔 Verimag 实验室的创始人，该实验室是安全关键系统领域的领先实验室，他曾领导该实验室 13 年。Joseph Sifakis 在航空电子和航天系统、电信和生产系统等多个应用领域为可信系统设计做出了重要贡献，获得国际认可。他目前的研究聚焦于自主系统，特别是自动驾驶汽车和自主电信系统。2007 年，他因对模型检验理论和应用的贡献而获得图灵奖——模型检验是应用最广泛的系统验证技术，图灵奖被誉为"计算机科学最高荣誉"。Joseph Sifakis 是法国科学院院士、法国国家工程院院士、欧洲科学院院士、美国艺术与科学院院士、美国国家工程院院士、美国国家科学院院士以及中国科学院外籍院士。他经常在科学、技术和公共论坛上发言。他的著作《理解和改变世界》已出版英文和中文版。',
    speaker_5_abstract: '自主系统是由智能体组成的分布式系统，每个智能体追求自己的目标，但必须协调以满足系统的整体目标。主要内容包括：1. 我们分析自主系统的特征，解释它们基于一个多方面的智能概念，这一概念无法通过图灵测试等对话行为测试来表征。2. 我们提出一种基于智能体参考架构的开发方法，将自主行为表征为一组独立功能组合的结果。行为产生于对外部刺激产生动作的反应式行为，以及旨在满足智能体任务成功需求的主动式行为的编排。这两种行为通过共享长期记忆中的知识来协调。3. 我们分析 AI 如何有助于创建 AI 智能体和多智能体系统，强调其与传统软件无缝集成的必要性，并讨论当前技术的局限性。这些局限性尤其涉及利用长期记忆中存储的知识来语义化控制并进一步提高 AI 组件的准确性，以及通过目标管理和规划来适应不断变化的环境。我们最后强调 AI 仍处于起步阶段，实现自主系统的愿景并尽可能接近人类智能还有很长的路要走。',

    // === Speaker 6: Moshe Y. Vardi ===
    speaker_6_name: 'Moshe Y. Vardi 教授',
    speaker_6_title: '校级教授',
    speaker_6_affiliation: '莱斯大学，美国',
    speaker_6_course: 'AI 的心智是真正的心智吗？',
    speaker_6_bio: 'Moshe Y. Vardi 是莱斯大学校级教授、计算工程领域 George 杰出服务教授。他的研究聚焦于数学逻辑与计算的交叉领域——包括数据库理论、硬件/软件设计与验证、多智能体系统和约束满足。他获得了众多奖项，包括 ACM SIGACT Gödel 奖、ACM Kanellakis 奖、ACM SIGMOD Codd 奖、Knuth 奖、IEEE 计算机学会 Goode 奖以及 EATCS 杰出成就奖。他是 800 多篇论文的作者或合著者，以及两本书的作者。他是古根海姆学者以及多个学会的会士，还是包括美国国家工程院、国家科学院、美国艺术与科学院和伦敦皇家学会在内的多个科学院院士。他拥有十个荣誉称号。他是 ACM 旗舰出版物《Communications of the ACM》的高级编辑。',
    speaker_6_abstract: '"AI 的心智是真正的心智吗？"这一问题促使我们审视心智的本质，以及人工智能是否满足其定义标准。真正的心智通常与意识、自我意识、意向性以及体验情绪等心理状态的能力相关联。AI 是否具备真正的心智最终取决于我们如何定义意识和智能的基本品质。虽然这个问题在 19 世纪就已经被提出，但 AI 的最新进展要求我们对其进行深入重新审视。',

    // === Speaker 7: Emily Yu ===
    speaker_7_name: 'Emily Yu 助理教授',
    speaker_7_title: '助理教授',
    speaker_7_affiliation: '莱顿大学，荷兰',
    speaker_7_course: '通过自动推理、证书与运行时监控实现可信系统',
    speaker_7_bio: 'Emily Yu 是莱顿大学莱顿高级计算机科学研究所的助理教授。她的研究聚焦于系统验证和可信 AI，重点是推动形式化方法作为系统正确性和安全性的一阶设计原则。她于 2025 年 10 月加入莱顿大学。此前，她曾在奥地利科学技术研究所 Thomas Henzinger 课题组担任博士后研究员（2023–2025）。她于 2023 年在奥地利约翰内斯·开普勒大学获得计算机科学博士学位，导师是 Armin Biere。她在帝国理工学院获得学士和硕士学位。Emily 的研究获得了奥地利科学基金 Esprit 奖学金的认可。',
    speaker_7_abstract: '本系列讲座将探索如何利用形式化方法来确保现代复杂系统的安全性和可靠性，包括包含机器学习组件的系统。自动推理在硬件、软件以及日益增长的基于 AI 的系统的形式化验证中发挥着核心作用。随着验证工具变得越来越复杂，认证技术被开发出来，通过产生可独立检查的正确性证据，为其结果提供额外的信任层。首先，我们将研究使用 SAT/SMT 求解技术等自动推理进行静态验证，其中证书充当数学证明，允许验证结果被独立验证。其次，我们将探索如何将强化学习与形式化方法相结合，为难以用经典控制技术处理的系统综合控制器和神经证书，同时仍提供关于时序规范的形式化保证。第三，我们将研究运行时监控和执行技术，这些技术通过检测或防止系统执行期间的违规来提供运行时保证，作为静态验证的补充方法，从而支持 AI 技术在安全关键应用中的安全部署。',

    // === Speaker 8: Miaomiao Zhang ===
    speaker_8_name: '张苗苗 教授',
    speaker_8_title: '教授',
    speaker_8_affiliation: '同济大学，中国',
    speaker_8_course: '实时系统的学习与验证',
    speaker_8_bio: '张苗苗是同济大学计算机科学与技术学院教授。她于 2001 年获得上海交通大学自动化专业博士学位，后在荷兰拉德堡大学软件科学系从事博士后研究。她的研究聚焦于实时系统的建模与验证，在 CAV、RTSS、FSE、OOPSLA、TACAS、ACM TECS 等会议和期刊上发表论文。',
    speaker_8_abstract: '实时系统广泛部署于工业系统中，尤其是在安全关键领域。形式化验证是确保此类系统可靠性的重要技术，其中模型构建对后续分析至关重要。模型学习可以从系统行为中推断出形式化模型，并已在协议验证和嵌入式软件分析等领域得到广泛应用。本课程将介绍此类系统建模与验证的相关工作。',

    // === Registration Page ===
    registrationNoticeTitle: '会议通知',
    registrationTime: '会议时间',
    registrationVenue: '会议地点',
    registrationMethod: '注册方式',
    registrationMethodOnsite: '现场缴费',
    registrationMethodOnline: '在线注册',
    registrationFeeCategory: '类别',
    registrationFeeFee: '费用（人民币）',
    registrationFeeLectures: '5月11日 – 5月15日（周一至周五讲座）',
    registrationFeeWorkshop: '5月16日 – 5月17日（周六至周日研讨会）',
    registrationFeeIncludes: '注册费包含：午餐（周一至周五，不含晚餐）、周三火锅宴、周五两江游船票（168元船票 + 50元往返交通）。',
    bankTransferTitle: '银行转账信息',
    bankAccountName: '账户名称',
    bankName: '开户银行',
    bankAccountNumber: '账号',
    bankCode: '银行代码',
    bankRemittanceNote: '汇款备注',
    bankRemittanceNoteText: '转账时请备注"SETSS2026-您的姓名"。',
    bankAfterPayment: '缴费后',
    bankAfterPaymentText: '请将转账凭证和开票信息（抬头、税号）发送至 liubocq@swu.edu.cn。',
    scanToRegister: '扫码注册',
    qrCodeAlt: '注册二维码',
    scanToRegisterDesc: '请扫码注册（或使用上方银行转账）',
    otherInfoTitle: '其他信息',
    otherInfoTravel: '以上未列出的交通和住宿费用，由参会者自行承担。',
    otherInfoCertificate: 'SETSS 2026 可为有需要的参会者提供32学时培训证明。',
    officialWebsiteLabel: '官方网站',
    registrationNoticeP1: '由西南大学承办的第八届可信软件系统工程春季学校（SETSS 2026）将于2026年5月11日至17日在中国重庆西南大学举行。本次学校将提供一系列关于软件系统工程、形式化方法、人工智能、信息物理系统和数字孪生前沿研究的讲座，以及一个专门的研讨会。特邀讲者包括图灵奖得主Joseph Sifakis教授（线上）、Moshe Y. Vardi教授（线上）、Einar Broch Johnsen教授、Kim Guldstrand Larsen教授、Bernhard Aichernig教授、Emily Yu博士、Jonathan P. Bowen教授、Wei Dong教授、Miaomiao Zhang教授等杰出专家。',
    registrationNoticeP2: '课程安排包括五天讲座（5月11日至15日）和两天研讨会（5月16日至17日）。参与者将有机会进行深入讨论、交流，并参加包括火锅宴和两江游船在内的社交活动。',
    registrationVenueLine1: '第25教学楼0114报告厅',
    registrationVenueLine2: '西南大学（北碚校区），中国重庆',
    bankAccountNameValue: '西南大学',
    bankNameValue: '中国工商银行重庆朝阳支行',

    // === Transportation ===
    transportationTitle: '西南大学（北碚校区）交通指南',
    transportationSubtitle: '如何到达会议地点',
    fromAirport: '从重庆江北国际机场出发',
    fromChongqingbei: '从重庆北站出发',
    fromChongqingxi: '从重庆西站出发',
    fromChongqingdong: '从重庆东站出发',
    method: '方式',
    route: '路线',
    estimatedPrice: '预估费用',
    estimatedTime: '预估时间',
    metro: '地铁',
    taxi: '出租车',
    airportMetroRoute: '10号线（T3航站楼）→ 6号线（西南大学站）',
    airportTaxiRoute: '机场 → 西南大学北碚校区',
    chongqingbeiMetroRoute: '3号线（红旗河沟）→ 6号线（西南大学站）',
    chongqingbeiTaxiRoute: '重庆北站 → 西南大学北碚校区',
    chongqingxiMetroRoute: '环线（冉家坝）→ 6号线（西南大学站）',
    chongqingxiTaxiRoute: '重庆西站 → 西南大学北碚校区',
    chongqingdongMetroRoute: '6号线（重庆东站 → 西南大学站）',
    chongqingdongTaxiRoute: '重庆东站 → 西南大学北碚校区',

    // === Accommodation ===
    accommodationTitle: '推荐酒店（会场附近）',
    accommodationSubtitle: '会场步行范围内的舒适住宿选择',
    hotelAddress: '地址',
    hotelTel: '电话',
    hotelNote: '提示',
    hotelNoteText: '房价仅供参考，请直接向酒店确认。',
    moreOptions: '更多住宿选择可在旅游平台上查找。',
    earlyBooking: '建议提前预订。',
    ningdengHotel: '宁登酒店',
    ningdengAddress: '北碚区文星湾127号附近（距会场约100米）',
    bolianhuiHotel: '柏联汇酒店 4.8★',
    bolianhuiAddress: '天生丽街143号（地铁6号线天生站旁，西南大学南门2号门对面）',
    bluesHotel: '布鲁斯精品酒店 4.9★',
    bluesAddress: '天生丽街139-3-1号（农商行楼上，地铁6号线西南大学站1号出口100米）',
    boreeHotel: '柏瑞商务酒店 5.0★',
    boreeAddress: '天生丽街8号楼2楼（天生站1号出口100米，西南大学2号门200米）',

    // === AuthModal ===
    authName: '姓名',
    authYourName: '您的姓名',
    authEmail: '邮箱',
    authPassword: '密码',
    authFillRequired: '请填写所有必填项',
    authEnterName: '请输入您的姓名',
    authNoAccount: '还没有账号？',
    authHasAccount: '已有账号？',

    // === Footer ===
    footerAboutTitle: '关于 SETSS 2026',
    footerAboutDesc: '第八届可信软件系统工程春季学校，2026年5月11-17日于中国重庆西南大学举行。',
    quickLinks: '快速链接',
    footerContact: '联系方式',
    footerAddress1: '软件工程研究与创新中心，计算机与信息科学学院 软件学院',
    footerAddress2: '西南大学',
    footerAddress3: '中国重庆 400715',
    allRightsReserved: '版权所有。',
  },
};

// ─── Speaker data helpers ──────────────────────────────────
// 这些函数帮助 Courses 页面从 translations 中按索引获取讲者信息

export interface SpeakerData {
  id: number;
  name: string;
  title: string;
  affiliation: string;
  photo: string;
  course: string;
  bio: string;
  abstract: string;
  highlight?: string;
}

const speakerPhotos = [
  '/images/speakers/Prof. DI Dr. Bernhard Aichernig.png',
  '/images/speakers/Prof. Jonathan P. Bowen.png',
  '/images/speakers/Prof. Wei Dong.png',
  '/images/speakers/Prof. Einar Broch Johnsen.png',
  '/images/speakers/Prof. Kim Guldstrand Larsen.png',
  '/images/speakers/Prof. Joseph Sifakis.png',
  '/images/speakers/Prof. Moshe Y. Vardi.png',
  '/images/speakers/Prof. Emily Yu.png',
  '/images/speakers/Prof. Miaomiao Zhang.png',
];

const speakerHighlights: (string | undefined)[] = [
  undefined,
  undefined,
  undefined,
  undefined,
  'UPPAAL Co-founder · 500+ Publications',
  'Turing Award 2007',
  'Gödel Prize · Knuth Prize · 800+ Papers',
  undefined,
  undefined,
];

export function getSpeakerData(t: (key: string) => string, index: number): SpeakerData {
  return {
    id: index,
    name: t(`speaker_${index}_name`),
    title: t(`speaker_${index}_title`),
    affiliation: t(`speaker_${index}_affiliation`),
    photo: speakerPhotos[index],
    course: t(`speaker_${index}_course`),
    bio: t(`speaker_${index}_bio`),
    abstract: t(`speaker_${index}_abstract`),
    highlight: speakerHighlights[index],
  };
}

export function getAllSpeakers(t: (key: string) => string): SpeakerData[] {
  return Array.from({ length: 9 }, (_, i) => getSpeakerData(t, i));
}

// ─── Context ────────────────────────────────────────────────

interface LanguageContextType {
  lang: Language;
  t: (key: string, vars?: Record<string, string | number>) => string;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved === 'en' || saved === 'zh') return saved;
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('zh') ? 'zh' : 'en';
  });

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      let text = translations[lang][key] ?? key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          text = text.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), String(v));
        });
      }
      return text;
    },
    [lang]
  );

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'zh' : 'en'));
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}